import { inject, bindable } from 'aurelia-framework';

import Chart from 'chart.js';

import { colorMap } from './utils/chart-utils/colors';
import { typeMap } from './utils/chart-utils/axis-types';

@inject(Element)
export class LineChart {
  @bindable width = '250';
  @bindable height = '250';
  @bindable items = [];

  constructor(element) {
    this.element = element;
  }

  attached() {
    const date = new Date();
    const sampleData = [
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1), y: 200},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2), y: 3},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3), y: 510},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 4), y: 100},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5), y: 71}
    ];
    const sampleConfig = {
      title: 'Negativity score',
      color: 'red',
      xConfig: {
        type: 'time',
        label: 'Time'
      },
      yConfig: {
        label: 'Score'
      }
    };
    const chartConfig = this.mapDataConfigToChartConfig(sampleData, sampleConfig);
    this.canvas = this.element.querySelector('.chart-canvas');
    this.chart = new Chart(this.canvas, chartConfig);
  }

  mapDataConfigToChartConfig(dataItems, { title, color, xConfig, yConfig }) {
    return {
      type: 'line',
      data: {
        datasets: [{
          label: title,
          data: [...dataItems],
          fill: true,
          backgroundColor: colorMap[color].backgroundColor
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: title
        },
        scales: {
          xAxes: [this.mapAxisConfigToScaleConfig(xConfig)],
          yAxes: [this.mapAxisConfigToScaleConfig(yConfig)]
        }
      }
    };
  }

  mapAxisConfigToScaleConfig({ type, label }) {
    const axisConfig = {
      display: true,
      scaleLabel: {
        display: true,
        labelString: label
      }
    };

    if (type) {
      Object.assign(axisConfig, { type });
      if (typeMap[type]) {
        Object.assign(axisConfig, typeMap[type]);
      }
    }

    return axisConfig;
  }
}
