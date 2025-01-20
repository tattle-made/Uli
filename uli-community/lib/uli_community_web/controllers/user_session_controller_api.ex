defmodule UliCommunityWeb.SessionControllerApi do

  use UliCommunityWeb, :controller

  alias UliCommunity.Accounts
  alias UliCommunity.Api.Token


  def new(conn, %{"email" => email, "password" => password}) do
    IO.inspect(email, label: "EMAIL")
    IO.inspect(password, label: "PASSWORD")
    case Accounts.get_user_by_email_and_password(email, password) do
      nil ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Invalid email or password"})

      user ->
        IO.inspect(user, label: "USER IS: ")
        with {:ok, token} <- Token.sign(%{user_id: user.id}) do
          json(conn, %{token: token, message: "Token Generation Successful!"})
        else
          _ ->
            conn
            |> put_status(:internal_server_error)
            |> json(%{error: "Could not generate token"})
        end
    end
  end

  def say_hi(conn,_) do
    conn
    |> json(%{message: "This is to test the authentication of the api. Hi!!"})
  end
end
