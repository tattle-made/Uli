defmodule UliCommunity.MediaProcessing.TextVecRepVyakyarthTest do
  use ExUnit.Case
  alias UliCommunity.MediaProcessing.TextVecRepVyakyarth

  @test_text "This is a test text for vector representation"
  @expected_embedding_size 768

  describe "get_embedding/1" do
    test "successfully gets embedding for a valid text" do
      assert {:ok, embedding} = TextVecRepVyakyarth.get_embedding(@test_text)
      assert length(embedding) == @expected_embedding_size
      assert Enum.all?(embedding, &is_float/1)
    end

    test "handles empty text" do
      assert {:ok, embedding} = TextVecRepVyakyarth.get_embedding("")
      assert length(embedding) == @expected_embedding_size
      assert Enum.all?(embedding, &is_float/1)
    end
  end
end
