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
    let overTime = this.seconds < 0;
    let secondsLeft = this.seconds;
    let secondsOver;
    if (overTime) {
      secondsOver = Math.abs(this.seconds);
      this.descriptor = this.descriptorWhenOverdue;
    } else {
      secondsOver = 0;
      this.descriptor = this.descriptorWhenWaiting;
    }

    const timerInterval = setInterval(() => {
      if (overTime) {
        secondsOver++;
        this.displayTime = formatSeconds(secondsOver);
      } else {
        secondsLeft--;
        this.displayTime = formatSeconds(secondsLeft);
        if (secondsLeft < 0) {
          overTime = true;
          this.descriptor = this.descriptorWhenOverdue;
        }
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
