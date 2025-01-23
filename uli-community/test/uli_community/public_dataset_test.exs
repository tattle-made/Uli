defmodule UliCommunity.PublicDatasetTest do
  use UliCommunity.DataCase

  alias UliCommunity.PublicDataset

  describe "plugin_slur_metadata" do
    alias UliCommunity.PublicDataset.PluginSlurMetadata

    import UliCommunity.PublicDatasetFixtures

    @invalid_attrs %{label: nil, language: nil, level_of_severity: nil, casual: nil, appropriated: nil, appropriation_context: nil, meaning: nil, batch: nil, categories: nil}

    test "list_plugin_slur_metadata/0 returns all plugin_slur_metadata" do
      plugin_slur_metadata = plugin_slur_metadata_fixture()
      assert PublicDataset.list_plugin_slur_metadata() == [plugin_slur_metadata]
    end

    test "get_plugin_slur_metadata!/1 returns the plugin_slur_metadata with given id" do
      plugin_slur_metadata = plugin_slur_metadata_fixture()
      assert PublicDataset.get_plugin_slur_metadata!(plugin_slur_metadata.id) == plugin_slur_metadata
    end

    test "create_plugin_slur_metadata/1 with valid data creates a plugin_slur_metadata" do
      valid_attrs = %{label: "some label", language: "some language", level_of_severity: "some level_of_severity", casual: "some casual", appropriated: true, appropriation_context: true, meaning: "some meaning", batch: 42, categories: ["option1", "option2"]}

      assert {:ok, %PluginSlurMetadata{} = plugin_slur_metadata} = PublicDataset.create_plugin_slur_metadata(valid_attrs)
      assert plugin_slur_metadata.label == "some label"
      assert plugin_slur_metadata.language == "some language"
      assert plugin_slur_metadata.level_of_severity == "some level_of_severity"
      assert plugin_slur_metadata.casual == "some casual"
      assert plugin_slur_metadata.appropriated == true
      assert plugin_slur_metadata.appropriation_context == true
      assert plugin_slur_metadata.meaning == "some meaning"
      assert plugin_slur_metadata.batch == 42
      assert plugin_slur_metadata.categories == ["option1", "option2"]
    end

    test "create_plugin_slur_metadata/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = PublicDataset.create_plugin_slur_metadata(@invalid_attrs)
    end

    test "update_plugin_slur_metadata/2 with valid data updates the plugin_slur_metadata" do
      plugin_slur_metadata = plugin_slur_metadata_fixture()
      update_attrs = %{label: "some updated label", language: "some updated language", level_of_severity: "some updated level_of_severity", casual: "some updated casual", appropriated: false, appropriation_context: false, meaning: "some updated meaning", batch: 43, categories: ["option1"]}

      assert {:ok, %PluginSlurMetadata{} = plugin_slur_metadata} = PublicDataset.update_plugin_slur_metadata(plugin_slur_metadata, update_attrs)
      assert plugin_slur_metadata.label == "some updated label"
      assert plugin_slur_metadata.language == "some updated language"
      assert plugin_slur_metadata.level_of_severity == "some updated level_of_severity"
      assert plugin_slur_metadata.casual == "some updated casual"
      assert plugin_slur_metadata.appropriated == false
      assert plugin_slur_metadata.appropriation_context == false
      assert plugin_slur_metadata.meaning == "some updated meaning"
      assert plugin_slur_metadata.batch == 43
      assert plugin_slur_metadata.categories == ["option1"]
    end

    test "update_plugin_slur_metadata/2 with invalid data returns error changeset" do
      plugin_slur_metadata = plugin_slur_metadata_fixture()
      assert {:error, %Ecto.Changeset{}} = PublicDataset.update_plugin_slur_metadata(plugin_slur_metadata, @invalid_attrs)
      assert plugin_slur_metadata == PublicDataset.get_plugin_slur_metadata!(plugin_slur_metadata.id)
    end

    test "delete_plugin_slur_metadata/1 deletes the plugin_slur_metadata" do
      plugin_slur_metadata = plugin_slur_metadata_fixture()
      assert {:ok, %PluginSlurMetadata{}} = PublicDataset.delete_plugin_slur_metadata(plugin_slur_metadata)
      assert_raise Ecto.NoResultsError, fn -> PublicDataset.get_plugin_slur_metadata!(plugin_slur_metadata.id) end
    end

    test "change_plugin_slur_metadata/1 returns a plugin_slur_metadata changeset" do
      plugin_slur_metadata = plugin_slur_metadata_fixture()
      assert %Ecto.Changeset{} = PublicDataset.change_plugin_slur_metadata(plugin_slur_metadata)
    end
  end

  describe "plugin_slurs" do
    alias UliCommunity.PublicDataset.PluginSlur

    import UliCommunity.PublicDatasetFixtures

    @invalid_attrs %{label: nil, language: nil, batch: nil}

    test "list_plugin_slurs/0 returns all plugin_slurs" do
      plugin_slur = plugin_slur_fixture()
      assert PublicDataset.list_plugin_slurs() == [plugin_slur]
    end

    test "get_plugin_slur!/1 returns the plugin_slur with given id" do
      plugin_slur = plugin_slur_fixture()
      assert PublicDataset.get_plugin_slur!(plugin_slur.id) == plugin_slur
    end

    test "create_plugin_slur/1 with valid data creates a plugin_slur" do
      valid_attrs = %{label: "some label", language: "some language", batch: 42}

      assert {:ok, %PluginSlur{} = plugin_slur} = PublicDataset.create_plugin_slur(valid_attrs)
      assert plugin_slur.label == "some label"
      assert plugin_slur.language == "some language"
      assert plugin_slur.batch == 42
    end

    test "create_plugin_slur/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = PublicDataset.create_plugin_slur(@invalid_attrs)
    end

    test "update_plugin_slur/2 with valid data updates the plugin_slur" do
      plugin_slur = plugin_slur_fixture()
      update_attrs = %{label: "some updated label", language: "some updated language", batch: 43}

      assert {:ok, %PluginSlur{} = plugin_slur} = PublicDataset.update_plugin_slur(plugin_slur, update_attrs)
      assert plugin_slur.label == "some updated label"
      assert plugin_slur.language == "some updated language"
      assert plugin_slur.batch == 43
    end

    test "update_plugin_slur/2 with invalid data returns error changeset" do
      plugin_slur = plugin_slur_fixture()
      assert {:error, %Ecto.Changeset{}} = PublicDataset.update_plugin_slur(plugin_slur, @invalid_attrs)
      assert plugin_slur == PublicDataset.get_plugin_slur!(plugin_slur.id)
    end

    test "delete_plugin_slur/1 deletes the plugin_slur" do
      plugin_slur = plugin_slur_fixture()
      assert {:ok, %PluginSlur{}} = PublicDataset.delete_plugin_slur(plugin_slur)
      assert_raise Ecto.NoResultsError, fn -> PublicDataset.get_plugin_slur!(plugin_slur.id) end
    end

    test "change_plugin_slur/1 returns a plugin_slur changeset" do
      plugin_slur = plugin_slur_fixture()
      assert %Ecto.Changeset{} = PublicDataset.change_plugin_slur(plugin_slur)
    end
  end
end
