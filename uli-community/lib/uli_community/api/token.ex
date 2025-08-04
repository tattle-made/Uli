defmodule UliCommunity.Api.Token do
  @signing_salt "octosell_api"
  # token for 2 week
  @token_age_secs 14 * 86_400

  @doc """
  Create token for given data
  """
  @spec sign(map()) :: binary()
  def sign(data) do
    IO.puts("Inside SIGN")
    token = Phoenix.Token.sign(UliCommunityWeb.Endpoint, @signing_salt, data)
    IO.inspect(token, label: "Generated TOKEN IS: ")
    {:ok, token}
  end


  @doc """
  Verify given token by:
  - Verify token signature
  - Verify expiration time
  """
  @spec verify(String.t()) :: {:ok, any()} | {:error, :unauthenticated}
  def verify(token) do
    case Phoenix.Token.verify(UliCommunityWeb.Endpoint, @signing_salt, token
            #  max_age: @token_age_secs
           ) do
      {:ok, data} ->

        {:ok, data}
      _error -> {:error, :unauthenticated}
    end
  end
end
