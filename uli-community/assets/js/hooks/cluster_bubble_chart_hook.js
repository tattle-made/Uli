import { drawClusterPack } from "../cluster_bubble_chart";

export const ClusterBubbleChartHook = {
  mounted() {
    drawClusterPack();
  },
  updated() {
    drawClusterPack();
  }
};
