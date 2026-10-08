defmodule UliCommunityWeb.Labs.B2P1.Components do
  @moduledoc "Shared UI pieces for the Labs B2_P1 Comments Classifier prototype."
  use Phoenix.Component
  use Phoenix.VerifiedRoutes, endpoint: UliCommunityWeb.Endpoint, router: UliCommunityWeb.Router

  import UliCommunityWeb.CoreComponents, only: [icon: 1, modal: 1, button: 1]
  alias Phoenix.LiveView.JS
  alias UliCommunity.Labs.B2P1

  @categories [
    {"abusive", "Abusive"},
    {"neutral_spam", "Neutral / Spam"},
    {"worth_engaging", "Worth engaging"}
  ]

  def categories, do: @categories

  def category_label(key),
    do: List.keyfind(@categories, key, 0, {key, "Not categorized"}) |> elem(1)

  # Settings come from the DB as atoms (:with_replies) and from forms as strings.
  def scraper_label(scraper) when scraper in [:with_replies, "with_replies"],
    do: "Comments + replies"

  def scraper_label(_), do: "Comments only"

  # Sort only exists for the comments-only scraper; it's nil for the replies one.
  def config_summary(c) do
    sort = %{"recent" => "most recent", "popular" => "most popular"}[c.sort && to_string(c.sort)]

    Enum.join(
      Enum.reject(["#{c.comment_limit} comments", scraper_label(c.scraper), sort], &is_nil/1),
      " · "
    )
  end

  def in_progress?(run), do: B2P1.in_progress?(run)

  def display_name(channel), do: channel.name || "@#{channel.handle}"

  @doc """
  Adds what the pages show for a post: `runs` numbered #1..#n (oldest first), the
  `latest_run`, and category `counts` (string keys) once the latest run is done.
  """
  def with_run_info(post) do
    total = length(post.runs)

    runs =
      post.runs |> Enum.with_index() |> Enum.map(fn {r, i} -> Map.put(r, :number, total - i) end)

    latest = List.first(runs)

    counts =
      if latest && latest.status == :done,
        do: string_counts(B2P1.category_counts(latest.id))

    Map.merge(post, %{runs: runs, latest_run: latest, counts: counts})
  end

  @doc "Category counts with string keys (nil = not categorized), for the pills and tiles."
  def string_counts(counts) do
    Enum.reduce(counts, %{"abusive" => 0, "neutral_spam" => 0, "worth_engaging" => 0}, fn
      {nil, n}, acc -> Map.put(acc, nil, n)
      {category, n}, acc -> Map.put(acc, to_string(category), n)
    end)
  end

  def format_dt(nil), do: "—"
  def format_dt(%DateTime{} = dt), do: Calendar.strftime(dt, "%d %b %Y, %H:%M")

  def format_dt(iso) when is_binary(iso) do
    case DateTime.from_iso8601(iso) do
      {:ok, dt, _} -> format_dt(dt)
      _ -> iso
    end
  end

  attr :crumbs, :list, required: true

  def breadcrumbs(assigns) do
    ~H"""
    <nav class="mb-4 flex items-center gap-2 text-sm text-zinc-500">
      <.link
        navigate={~p"/labs"}
        class="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 hover:bg-amber-200"
      >
        Labs · B2_P1 prototype
      </.link>
      <%= for {label, path} <- @crumbs do %>
        <.icon name="hero-chevron-right-mini" class="h-4 w-4" />
        <%= if path do %>
          <.link navigate={path} class="hover:text-zinc-800 hover:underline">{label}</.link>
        <% else %>
          <span class="font-medium text-zinc-800">{label}</span>
        <% end %>
      <% end %>
    </nav>
    """
  end

  attr :run, :map, default: nil

  def status_badge(%{run: nil} = assigns) do
    ~H"""
    <span class="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
      Not run yet
    </span>
    """
  end

  def status_badge(assigns) do
    {label, class} =
      case assigns.run.status do
        :queued -> {"Queued", "bg-zinc-100 text-zinc-700"}
        :fetching -> {"Fetching comments", "bg-blue-100 text-blue-800"}
        :categorizing -> {"Categorizing", "bg-violet-100 text-violet-800"}
        :done -> {"Done", "bg-emerald-100 text-emerald-800"}
        :failed -> {"Failed", "bg-red-100 text-red-800"}
      end

    assigns = assign(assigns, label: label, class: class)

    ~H"""
    <span
      class={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        @class
      ]}
      title={@run.error}
    >
      <.icon :if={in_progress?(@run)} name="hero-arrow-path" class="h-3.5 w-3.5 animate-spin" />
      <.icon :if={@run.status == :failed} name="hero-exclamation-triangle-mini" class="h-3.5 w-3.5" />
      {@label}
    </span>
    """
  end

  attr :category, :string, default: nil

  def category_badge(assigns) do
    class =
      case assigns.category do
        "abusive" -> "bg-red-50 text-red-700 ring-red-200"
        "neutral_spam" -> "bg-zinc-50 text-zinc-600 ring-zinc-200"
        "worth_engaging" -> "bg-emerald-50 text-emerald-700 ring-emerald-200"
        _ -> "bg-white text-zinc-400 ring-zinc-200"
      end

    assigns = assign(assigns, class: class)

    ~H"""
    <span class={[
      "inline-flex whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
      @class
    ]}>
      {category_label(@category)}
    </span>
    """
  end

  @doc "Shows a caption and context; either (or both) can be empty."
  attr :caption, :string, default: nil
  attr :context, :string, default: nil
  attr :class, :string, default: nil

  def post_details(assigns) do
    ~H"""
    <dl class={["grid gap-1 text-sm", @class]}>
      <div :for={{label, value} <- [{"Caption", @caption}, {"Context", @context}]} class="flex gap-2">
        <dt class="w-16 flex-none text-xs font-semibold uppercase text-zinc-400">{label}</dt>
        <dd
          :if={(value || "") != ""}
          class="min-w-0 whitespace-pre-line break-words text-zinc-700 line-clamp-3"
        >
          {value}
        </dd>
        <dd :if={(value || "") == ""} class="italic text-zinc-400">none</dd>
      </div>
    </dl>
    """
  end

  @doc "Compact abusive / neutral / engaging counts for table rows."
  attr :counts, :map, default: nil

  def count_pills(%{counts: nil} = assigns) do
    ~H"""
    <span class="text-xs text-zinc-400">—</span>
    """
  end

  def count_pills(assigns) do
    ~H"""
    <div class="flex gap-1.5 text-xs font-medium">
      <span class="rounded bg-red-50 px-1.5 py-0.5 text-red-700" title="Abusive">
        {@counts["abusive"]}
      </span>
      <span class="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-600" title="Neutral / Spam">
        {@counts["neutral_spam"]}
      </span>
      <span class="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700" title="Worth engaging">
        {@counts["worth_engaging"]}
      </span>
    </div>
    """
  end

  @doc """
  Comment limit / scraper / sort fields, shared by the add-posts and refetch forms.
  Sort only applies to the comments-only scraper, so it's hidden (CSS only) while
  "Comments + replies" is selected.
  """
  attr :config, :map, required: true
  # Field-name prefix, e.g. "config" or "posts[0][config]" for per-post settings.
  attr :name, :string, default: "config"

  def config_fields(assigns) do
    ~H"""
    <div class="group grid grid-cols-1 gap-4 sm:grid-cols-3">
      <label class="block text-sm">
        <span class="font-semibold text-zinc-800">Comment limit</span>
        <input
          type="number"
          name={"#{@name}[comment_limit]"}
          min="1"
          max="1000"
          value={@config.comment_limit}
          class="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-400 focus:ring-0"
        />
      </label>
      <label class="block text-sm">
        <span class="font-semibold text-zinc-800">Scraper</span>
        <select
          name={"#{@name}[scraper]"}
          class="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-400 focus:ring-0"
        >
          <option value="basic" selected={to_string(@config.scraper) == "basic"}>
            Comments only (cheaper)
          </option>
          <option
            value="with_replies"
            data-replies
            selected={to_string(@config.scraper) == "with_replies"}
          >
            Comments + replies
          </option>
        </select>
      </label>
      <label class="block text-sm group-has-[option[data-replies]:checked]:hidden">
        <span class="font-semibold text-zinc-800">Sort</span>
        <select
          name={"#{@name}[sort]"}
          class="mt-1 block w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-400 focus:ring-0"
        >
          <option value="recent" selected={to_string(@config.sort) != "popular"}>Most recent</option>
          <option value="popular" selected={to_string(@config.sort) == "popular"}>
            Most popular
          </option>
        </select>
      </label>
    </div>
    """
  end

  @doc "Refetch dialog, prefilled with the post's current config. Sends `refetch` and `close_modal`."
  attr :post, :map, required: true

  def refetch_modal(assigns) do
    ~H"""
    <.modal id="refetch-modal" show on_cancel={JS.push("close_modal")}>
      <h2 class="text-lg font-semibold text-zinc-900">Refetch comments</h2>
      <p class="mt-1 break-all text-sm text-zinc-500">{@post.url}</p>
      <form phx-submit="refetch" class="mt-6 space-y-6">
        <input type="hidden" name="post_id" value={@post.id} />
        <.config_fields config={@post.config} />
        <p class="text-xs text-zinc-500">
          These settings will be saved for this post and used as its default next time.
          You can change them anytime.
        </p>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            phx-click={JS.exec("data-cancel", to: "#refetch-modal")}
            class="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
          >
            Cancel
          </button>
          <.button type="submit">Start run</.button>
        </div>
      </form>
    </.modal>
    """
  end
end
