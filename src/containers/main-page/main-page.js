import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export default class MainPage {
  constructor(router) {
    this.router = router;
  }
}
