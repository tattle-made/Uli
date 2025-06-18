import { drawWeeklyLineChart } from "../weekly_slur_line_chart"

export const WeeklyLineChartHook = {
  mounted() {
    drawWeeklyLineChart()
  },
  updated() {
    drawWeeklyLineChart()
  }
}
