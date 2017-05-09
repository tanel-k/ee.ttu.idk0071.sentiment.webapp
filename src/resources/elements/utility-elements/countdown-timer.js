import { inject, bindable } from 'aurelia-framework';

import { formatSeconds } from '../../../lib/time-utils';

@inject(Element)
export class CountdownTimer {
  @bindable seconds = 120;
  @bindable style = "";
  @bindable classNames = "";
  @bindable descriptorWhenWaiting = 'Time left: ';
  @bindable descriptorWhenOverdue = 'Overtime: ';
  descriptor = '';

  constructor(element) {
    this.element = element;
  }

  attached() {
    const targetDateMillis = new Date().getTime() + (this.seconds * 1000);
    const timerInterval = setInterval(() => {
      const currentMillis = new Date().getTime();
      const delta = targetDateMillis - currentMillis;
      const deltaSeconds = Math.ceil(delta / 1000);
      if (deltaSeconds >= 0) {
        this.descriptor = this.descriptorWhenWaiting;
      } else {
        this.descriptor = this.descriptorWhenOverdue;
      }

      this.displayTime = formatSeconds(Math.abs(deltaSeconds));
    }, 1000);
    this.timerInterval = timerInterval;
  }

  detached() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
