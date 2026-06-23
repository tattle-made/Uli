defmodule UliCommunity.Accounts.Scope do
  alias UliCommunity.Accounts.User

  defstruct [:user]

  def for_user(nil), do: nil
  def for_user(%User{} = user), do: %__MODULE__{user: user}
end
