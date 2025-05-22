defmodule UliCommunityWeb.DashboardController do
  use UliCommunityWeb, :controller

  def index(conn, _params) do
    pie_data = [
      %{label: "RED", value: 40},
      %{label: "Blue", value: 25},
      %{label: "Yellow", value: 35},
      %{label: "Pink", value: 20},
      %{label: "Green", value: 60},
      %{label: "Black", value: 70},
      %{label: "Purple", value: 90},
      %{label: "Orange", value: 120}
    ]

    render(conn, :index, pie_data: pie_data, layout: false)
  end
end
