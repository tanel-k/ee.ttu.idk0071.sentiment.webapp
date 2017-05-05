import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController, Router)
export default class LookupSubmitted {
  lookupResult = {};

  constructor(controller, router) {
    this.controller = controller;
    this.router = router;
  }

  activate({ lookupResult, entityName, durationString }) {
    this.lookupResult = lookupResult;
    this.entityName = entityName;
    this.durationString = durationString;
  }

  openDetailPage() {
    this.router.navigate(`lookups/${this.lookupResult.lookupId}`);
  }

  close() {
    this.controller.cancel();
  }
}
