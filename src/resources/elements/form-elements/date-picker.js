import { bindable, bindingMode, inject } from 'aurelia-framework';

import 'jquery';
import 'bootstrap';
import 'bootstrap-datepicker';

@inject(Element)
export class DatePicker {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) guid = '';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) title = '';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) format = 'dd/mm/yyyy';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) start;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) errorMessage = '';

  constructor(element) {
    this.element = element;
  }

  attached() {
    let defaults = {
      format: this.format,
      clearBtn: true,
      title: this.title,
      autoclose: true,
      forceParse: false,
      showOnFocus: false,
      keyboardNavigation: false,
      startView: this.start
        ? this.start
        : 'day'
    };

    let _this = this;
    this.button = this.element.querySelector('.btn');
    this.input = this.element.querySelector('input');

    this.datepicker = $(this.input)
      .datepicker(defaults)
      .on('change', e => {
        _this.value = e.target.value;
      })
      .on('click', e => {
        this.show();
      })
      .on('changeDate', e => {
        this.hide();
      })
      .data('datepicker');
  }

  show() {
    this.datepicker.show();
  }

  hide() {
    this.datepicker.hide();
  }

  detached() {
    $(this.input).datepicker('destroy').off();
  }
}
