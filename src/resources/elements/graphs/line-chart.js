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
    const sampleData1 = { label: 'Positivity',  color: 'green', data: [
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1), y: 20},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2), y: 30},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3), y: 50},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 4), y: 10},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5), y: 30}
    ]};
    const sampleData2 = { label: 'Negativity', color: 'red', data: [
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1), y: 40},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2), y: 30},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3), y: 50},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 4), y: 20},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5), y: 40}
    ]};
    const sampleData3 = { label: 'Neutrality', color: 'yellow', data: [
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1), y: 40},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2), y: 40},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3), y: 0},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 4), y: 70},
      {x: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 5), y: 30}
    ]};
    const sampleConfig = {
      title: 'Test',
      color: 'red',
      xConfig: {
        type: 'time',
        label: 'Time'
      },
      yConfig: {
        label: '%'
      }
    };
    const chartConfig = this.mapDataConfigToChartConfig([sampleData1, sampleData2, sampleData3], sampleConfig);
    this.canvas = this.element.querySelector('.chart-canvas');
    this.chart = new Chart(this.canvas, chartConfig);
  }

  mapDataConfigToChartConfig(dataItems, { title, color, xConfig, yConfig }) {
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
