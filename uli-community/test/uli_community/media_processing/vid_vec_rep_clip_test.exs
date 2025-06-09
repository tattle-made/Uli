defmodule UliCommunity.MediaProcessing.VidVecRepClipTest do
  use ExUnit.Case
  alias UliCommunity.MediaProcessing.VidVecRepClip

  @test_video_url "https://github.com/tattle-made/feluda_datasets/raw/main/feluda-sample-media/sample-cat-video.mp4"
  @expected_embedding_size 512

  describe "get_embedding/1" do
    test "successfully gets embedding for a valid video URL" do
      assert {:ok, embedding} = VidVecRepClip.get_embedding(@test_video_url)
      assert length(embedding) == @expected_embedding_size
      assert Enum.all?(embedding, &is_float/1)
    end
  end
end
