import { drawPieChart } from "../pie_chart"

export const PieChartHook = {
  mounted() {
    drawPieChart()
  },
  updated() {
    drawPieChart() 
  }
}
