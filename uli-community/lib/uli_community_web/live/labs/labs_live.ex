defmodule UliCommunityWeb.LabsLive do
  @moduledoc "Index of the /labs prototypes. `/labs/b2_p1` redirects to the B2_P1 channels page."
  use UliCommunityWeb, :live_view

  @prototypes [
    %{
      key: "B2_P1",
      name: "Comments Classifier",
      description:
        "Add a creator's Instagram channel and posts, fetch their comments and let an LLM sort them into abusive, neutral/spam and worth engaging. Includes a report the admin can send to the creator.",
      path: "/labs/b2_p1/channels"
    }
  ]

  def mount(_params, _session, %{assigns: %{live_action: :b2_p1}} = socket) do
    {:ok, push_navigate(socket, to: ~p"/labs/b2_p1/channels")}
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, page_title: "Labs", prototypes: @prototypes)}
  end

  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-6xl">
      <h1 class="text-2xl font-bold text-zinc-900">Labs</h1>
      <p class="mt-1 text-sm text-zinc-500">
        Early prototypes for trying out ideas and collecting feedback.
      </p>

      <div class="mt-6 grid gap-4">
        <.link
          :for={p <- @prototypes}
          navigate={p.path}
          class="group rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-400"
        >
          <span class="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
            {p.key}
          </span>
          <h2 class="mt-3 flex items-center gap-1 font-semibold text-zinc-900 group-hover:underline">
            {p.name} <.icon name="hero-chevron-right-mini" class="h-4 w-4 text-zinc-400" />
          </h2>
          <p class="mt-1 text-sm text-zinc-500">{p.description}</p>
        </.link>
      </div>
    </div>
    """
  end
end
