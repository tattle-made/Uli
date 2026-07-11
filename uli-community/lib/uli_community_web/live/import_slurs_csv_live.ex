defmodule UliCommunityWeb.ImportSlursCsvLive do
  use UliCommunityWeb, :live_view

  alias UliCommunity.{Accounts, UserContribution, Languages}
  alias UliCommunity.UserContribution.CrowdsourcedSlur

  NimbleCSV.define(__MODULE__.Parser, separator: ",", escape: "\"")

  @required_headers ~w(label level_of_severity categories)

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> allow_upload(:csv_file, accept: ~w(.csv), max_entries: 1, max_file_size: 10_000_000)
      |> assign(
        step: :upload,
        parse_error: nil,
        parsed_rows: [],
        validated_rows: [],
        valid_count: 0,
        invalid_count: 0,
        missing_source_count: 0,
        override_user_id: nil,
        override_language: nil,
        override_source: nil,
        users: Accounts.list_users(),
        language_options: Languages.select_options(),
        import_results: nil
      )

    {:ok, socket}
  end

  @impl true
  def handle_event("validate-upload", _params, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_event("parse-csv", _params, socket) do
    upload_errors =
      socket.assigns.uploads.csv_file.entries
      |> Enum.flat_map(fn entry ->
        upload_errors(socket.assigns.uploads.csv_file, entry)
        |> Enum.map(&format_upload_error/1)
      end)

    if upload_errors != [] do
      {:noreply, assign(socket, parse_error: hd(upload_errors), step: :upload)}
    else
      result =
        consume_uploaded_entries(socket, :csv_file, fn %{path: path}, _entry ->
          content = File.read!(path)
          {:ok, parse_csv_content(content)}
        end)

      case result do
        [{:error, message}] ->
          {:noreply, assign(socket, parse_error: message, step: :upload)}

        [{:ok, []}] ->
          {:noreply, assign(socket, parse_error: "The CSV file contains no data rows.", step: :upload)}

        [{:ok, rows}] ->
          {:noreply,
           socket
           |> assign(step: :preview, parse_error: nil, parsed_rows: rows)
           |> apply_validation(rows, nil, nil, nil)}

        [] ->
          {:noreply, assign(socket, parse_error: "Please select a CSV file first.", step: :upload)}
      end
    end
  end

  @impl true
  def handle_event("update-overrides", params, socket) do
    override_user_id = nilify_empty(params["user_id"])
    override_language = nilify_empty(params["language"])
    override_source = nilify_empty(params["source"])

    {:noreply,
     socket
     |> assign(
       override_user_id: override_user_id,
       override_language: override_language,
       override_source: override_source
     )
     |> apply_validation(socket.assigns.parsed_rows, override_user_id, override_language, override_source)}
  end

  @impl true
  def handle_event("confirm-import", _params, socket) do
    valid_rows = Enum.filter(socket.assigns.validated_rows, & &1.valid)
    attrs_list = Enum.map(valid_rows, & &1.attrs)
    {succeeded, failed} = UserContribution.import_crowdsourced_slurs(attrs_list)

    {:noreply,
     assign(socket,
       step: :done,
       import_results: %{succeeded: succeeded, failed: failed}
     )}
  end

  @impl true
  def handle_event("reset", _params, socket) do
    {:noreply,
     assign(socket,
       step: :upload,
       parse_error: nil,
       parsed_rows: [],
       validated_rows: [],
       valid_count: 0,
       invalid_count: 0,
       missing_source_count: 0,
       override_user_id: nil,
       override_language: nil,
       override_source: nil,
       import_results: nil
     )}
  end

  defp apply_validation(socket, rows, override_user_id, override_language, override_source) do
    validated_rows = validate_rows(rows, override_user_id, override_language, override_source)

    assign(socket,
      validated_rows: validated_rows,
      valid_count: Enum.count(validated_rows, & &1.valid),
      invalid_count: Enum.count(validated_rows, &(!&1.valid)),
      missing_source_count: Enum.count(rows, fn raw -> nilify_empty(Map.get(raw, "source")) == nil end)
    )
  end

  defp parse_csv_content(binary) do
    try do
      [headers | rows] = __MODULE__.Parser.parse_string(binary, skip_headers: false)
      headers = Enum.map(headers, &String.trim/1)

      missing = @required_headers -- headers

      if missing != [] do
        {:error,
         "Missing required columns: #{Enum.join(missing, ", ")}. " <>
           "Expected: #{Enum.join(@required_headers, ", ")}"}
      else
        row_maps =
          Enum.map(rows, fn row ->
            headers
            |> Enum.zip(row)
            |> Map.new(fn {k, v} -> {k, String.trim(v)} end)
          end)

        {:ok, row_maps}
      end
    rescue
      e -> {:error, "Failed to parse CSV: #{Exception.message(e)}"}
    end
  end

  defp validate_rows(rows, override_user_id, override_language, override_source) do
    Enum.map(rows, fn raw ->
      attrs = build_attrs(raw, override_user_id, override_language, override_source)
      changeset = CrowdsourcedSlur.changeset_import(%CrowdsourcedSlur{}, attrs)

      if changeset.valid? do
        %{raw: raw, attrs: attrs, valid: true, errors: []}
      else
        %{raw: raw, attrs: attrs, valid: false, errors: format_changeset_errors(changeset)}
      end
    end)
  end

  defp build_attrs(raw, override_user_id, override_language, override_source) do
    # nilify_empty ensures empty CSV strings don't cause Ecto cast/validation errors
    language = override_language || nilify_empty(Map.get(raw, "language"))
    source = override_source || nilify_empty(Map.get(raw, "source"))
    categories = raw |> Map.get("categories", "") |> parse_categories()
    appropriation_context = parse_optional_boolean(Map.get(raw, "appropriation_context"))

    %{
      label: nilify_empty(Map.get(raw, "label")),
      level_of_severity: nilify_empty(Map.get(raw, "level_of_severity")),
      casual: parse_optional_boolean(Map.get(raw, "casual")),
      appropriated: parse_optional_boolean(Map.get(raw, "appropriated")),
      appropriation_context: appropriation_context,
      categories: categories,
      source: source,
      language: language,
      meaning: nilify_empty(Map.get(raw, "meaning")),
      page_url: nilify_empty(Map.get(raw, "page_url")),
      contributor_user_id: override_user_id
    }
  end

  defp parse_categories(str) when is_binary(str) do
    str |> String.split("|") |> Enum.map(&String.trim/1) |> Enum.reject(&(&1 == ""))
  end

  defp parse_categories(_), do: []

  defp parse_boolean("true"), do: true
  defp parse_boolean("1"), do: true
  defp parse_boolean("false"), do: false
  defp parse_boolean("0"), do: false
  defp parse_boolean(val), do: val

  defp parse_optional_boolean(""), do: nil
  defp parse_optional_boolean(nil), do: nil
  defp parse_optional_boolean(val), do: parse_boolean(val)

  defp nilify_empty(""), do: nil
  defp nilify_empty(nil), do: nil
  defp nilify_empty(val), do: val

  defp format_changeset_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Regex.replace(~r/%{(\w+)}/, msg, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
    |> Enum.map(fn {field, errors} -> "#{field}: #{Enum.join(errors, ", ")}" end)
  end

  defp format_upload_error(:too_large), do: "File is too large (max 10MB)."
  defp format_upload_error(:not_accepted), do: "Only .csv files are accepted."
  defp format_upload_error(:too_many_files), do: "Please upload only one file at a time."
  defp format_upload_error(_), do: "Upload error. Please try again."

  def effective_language(raw, override_language) do
    override_language || Map.get(raw, "language") || ""
  end

  def effective_source(raw, override_source) do
    override_source || Map.get(raw, "source") || ""
  end

  def language_name(code) when is_binary(code) and code != "" do
    Languages.name(code) || code
  end

  def language_name(_), do: "—"
end
