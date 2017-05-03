import { inject, bindable } from 'aurelia-framework';

import { formatSeconds } from '../../../lib/time-utils';

@inject(Element)
export class CountdownTimer {
  @bindable seconds = 120;
  @bindable descriptorWhenWaiting = 'Time left: ';
  @bindable descriptorWhenOverdue = 'Overtime: ';
  descriptor = '';

  constructor(element) {
    this.element = element;
  }

  attached() {
    this.secondsLeft = this.seconds;
    this.secondsOver = 0;

    const timerInterval = setInterval(() => {
      if (this.secondsLeft <= 0) {
        this.secondsOver++;
        this.displayTime = formatSeconds(this.secondsOver);
        this.descriptor = this.descriptorWhenOverdue;
      } else {
        this.secondsLeft--;
        this.displayTime = formatSeconds(this.secondsLeft);
        this.descriptor = this.descriptorWhenWaiting;
      }
    }, 1000);
    this.timerInterval = timerInterval;
  }

  detached() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
