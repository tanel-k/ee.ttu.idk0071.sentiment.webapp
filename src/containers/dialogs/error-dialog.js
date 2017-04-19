import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
export default class ErrorDialog {
  constructor(controller) {
    this.controller = controller;
  }

  activate({ message }) {
    this.message = message;
  }

  close() {
    this.controller.cancel();
  }
}
