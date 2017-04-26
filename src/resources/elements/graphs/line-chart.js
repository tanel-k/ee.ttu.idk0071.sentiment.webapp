import { inject, bindable } from 'aurelia-framework';

import Chart from 'chart.js';

import { colorMap } from './utils/chart-utils/colors';
import { typeMap } from './utils/chart-utils/axis-types';

@inject(Element)
export class LineChart {
  @bindable widthPct = '100';
  @bindable height = '250';
  @bindable dataSets;
  @bindable chartConfig;

  constructor(element) {
    this.element = element;
  }

  attached() {
    if (this.dataSets && this.chartConfig) {
      const chartConfig = this.mapDataConfigToChartConfig(this.dataSets, this.chartConfig);
      this.canvas = this.element.querySelector('.chart-canvas');
      this.chart = new Chart(this.canvas, chartConfig);
    }
  }

  detached() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  mapDataConfigToChartConfig(dataItems, { title, xConfig, yConfig }) {
    return {
      type: 'line',
      data: {
        datasets: this.mapDataItemsToDataSets(dataItems)
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

  mapDataItemsToDataSets(dataItems) {
    return dataItems.map(dataItem => this.mapDataItemToDataSet(dataItem));
  }

  mapDataItemToDataSet({label, color, data}) {
    return {
      label,
      data,
      fill: false,
      borderColor: colorMap[color].backgroundColor,
      backgroundColor: colorMap[color].backgroundColor
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
