defmodule UliCommunityWeb.CrowdsourceSlurFormLive do
  use UliCommunityWeb, :live_view
  require Logger

  alias UliCommunity.UserContribution.CrowdsourcedSlur
  alias UliCommunity.UserContribution
  alias UliCommunity.Repo
  alias UliCommunity.Languages

  @impl true
  def mount(params, _session, socket) do
    user = socket.assigns.current_user

    if user do
      case params do
        %{"id" => id} ->
          # Edit mode
          slur = Repo.get(CrowdsourcedSlur, id)

          if slur && slur.contributor_user_id == user.id do
            {:ok,
             socket
             |> assign(:page_title, "Edit Slur")
             |> assign(:slur, slur)
             |> assign(:mode, :edit)
             |> assign(:language_options, Languages.select_options())
             |> assign_my_contributions(user)
             |> assign_form(slur)}
          else
            {:ok, redirect(socket, to: "/crowdsource-contributions")}
          end

        _ ->
          # Create mode
          {:ok,
           socket
           |> assign(:page_title, "Add Slur")
           |> assign(:slur, nil)
           |> assign(:mode, :create)
           |> assign(:language_options, Languages.select_options())
           |> assign_my_contributions(user)
           |> assign_form(%CrowdsourcedSlur{})}
      end
    else
      {:ok, redirect(socket, to: "/users/log_in")}
    end
  end

  @impl true
  def handle_event("save", %{"crowdsourced_slur" => slur_params}, socket) do
    user = socket.assigns.current_user
    mode = socket.assigns.mode

    slur_params =
      slur_params
      |> Map.put("contributor_user_id", user.id)
      |> Map.put_new("source", "crowdsourcing_exercise")

    case mode do
      :create -> create_slur(slur_params, socket)
      :edit -> update_slur(socket.assigns.slur, slur_params, socket)
    end
  end

  @impl true
  def handle_event("delete", _params, socket) do
    slur = socket.assigns.slur

    case UserContribution.delete_crowdsourced_slur(slur) do
      {:ok, _} ->
        {:noreply,
         socket
         |> put_flash(:info, "Slur deleted successfully")
         |> redirect(to: "/crowdsource-contributions")}

      {:error, _} ->
        {:noreply, put_flash(socket, :error, "Failed to delete slur")}
    end
  end

  defp create_slur(slur_params, socket) do
    case UserContribution.create_crowdsourced_slur(slur_params) do
      {:ok, _slur} ->
        {:noreply,
         socket
         |> put_flash(:info, "Slur created successfully")
         |> redirect(to: "/crowdsource-contributions")}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to save slur")
         |> assign_form(changeset)}
    end
  end

  defp update_slur(slur, slur_params, socket) do
    case UserContribution.update_crowdsourced_slur(slur, slur_params) do
      {:ok, _slur} ->
        {:noreply,
         socket
         |> put_flash(:info, "Slur updated successfully")
         |> redirect(to: "/crowdsource-contributions")}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply,
         socket
         |> put_flash(:error, "Failed to save slur")
         |> assign_form(changeset)}
    end
  end

  defp assign_my_contributions(socket, user) do
    {:ok, slurs} = UserContribution.get_crowdsourced_slur_by_user(user.id)
    assign(socket, :my_contributions, slurs)
  end

  defp assign_form(socket, %CrowdsourcedSlur{} = slur) do
    changeset = UserContribution.change_crowdsourced_slur(slur)
    assign(socket, form: to_form(changeset))
  end

  defp assign_form(socket, changeset) do
    assign(socket, form: to_form(changeset))
  end

  # Translate changeset form field errors into simple strings to be displayed in the form.
  def field_errors(%Phoenix.HTML.FormField{} = field) do
    Enum.map(field.errors, &translate_error/1)
  end
end
