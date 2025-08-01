defmodule UliCommunityWeb.Components.TokenModal do
  use Phoenix.Component

  @doc """
  A custom modal component that remains open until explicitly closed.

  ## Slots
  - `:title` - Slot for the modal title.
  - `:body` - Slot for the modal body content.
  - `:footer` - Slot for footer actions like buttons.

  ## Examples

      <.modal show={@show_modal} id="example-modal" phx-click="close-modal">
        <:title>Modal Title</:title>
        <:body>
          This is the modal content.
        </:body>
        <:footer>
          <button phx-click="close-modal" class="btn btn-primary">Close</button>
        </:footer>
      </.modal>
  """
  def token_modal(assigns) do
    ~H"""
    <div
      id={@id}
      class={"fixed inset-0 z-50 flex items-center justify-center xl:max-w-[60%] mx-auto  " <> if @show, do: "block", else: "hidden"}
    >
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50"></div>
      <!-- Modal Content -->
      <div class="relative bg-white w-3/4 rounded shadow-lg">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">
            <%= render_slot(@title) %>
          </h2>
          <button type="button" phx-click="close-modal" class="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <!-- Modal Body -->
        <div class="p-4 break-words ">
          <%= render_slot(@body) %>
        </div>
        <!-- Modal Footer -->
        <div class="p-4 border-t">
          <%= render_slot(@footer) %>
        </div>
      </div>
    </div>
    """
  end
end
