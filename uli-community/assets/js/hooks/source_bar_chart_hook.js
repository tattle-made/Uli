import { drawSourceBarChart } from "../source_bar_chart";

export const SourceBarChartHook = {
  mounted() {
    drawSourceBarChart();
  },
  updated() {
    drawSourceBarChart();
  }
};
