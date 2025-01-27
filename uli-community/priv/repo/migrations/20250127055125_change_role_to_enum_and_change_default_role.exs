defmodule UliCommunity.Repo.Migrations.ChangeRoleToEnumAndChangeDefaultRole do
  use Ecto.Migration

  def change do

    execute("""
    CREATE TYPE role_type AS ENUM ('user', 'admin');
    """)
    execute("""
    ALTER TABLE users
    ALTER COLUMN role DROP DEFAULT,
    ALTER COLUMN role TYPE role_type USING role::role_type,
    ALTER COLUMN role SET DEFAULT 'user';
    """)
  end
end
