import { inject, bindable } from 'aurelia-framework';

import Chart from 'chart.js';

import { colorMap } from './utils/chart-utils/colors';

@inject(Element)
export class PieChart {
  @bindable width = '250';
  @bindable height = '250';
  @bindable items = [];

  constructor(element) {
    this.element = element;
  }

  attached() {
    const data = this.mapDataItemsToChartData(this.items);
    const type = 'pie';

    this.canvas = this.element.querySelector('.chart-canvas');
    this.chart = new Chart(this.canvas, { type, data });
  }

  detached() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  mapDataItemsToChartData(dataItems) {
    const labels = dataItems.map(item => item.label);
    const data = dataItems.map(item => item.data);
    const backgroundColor = dataItems.map(item => colorMap[item.color].backgroundColor);
    const hoverBackgroundColor = dataItems.map(item => colorMap[item.color].hoverBackgroundColor);

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        hoverBackgroundColor
      }]
    };
  }
}
