import { drawBarChart } from "../bar_chart";

export const BarChartHook = {
  mounted() {
    drawBarChart();
  },
  updated() {
    drawBarChart();
  }
};
