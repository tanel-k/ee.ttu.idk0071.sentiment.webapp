import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
export default class StatisticsDialog {
  constructor(controller) {
    this.controller = controller;
  }

  activate({ graphData, title, message }) {
    this.graphData = graphData;
    this.message = message;
    this.title = title;
  }

  close() {
    this.controller.cancel();
  }
}
