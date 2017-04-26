import { customAttribute, inject } from 'aurelia-framework';

@customAttribute('key-return')
@inject(Element)
export class KeyReturn {
  enterPressed = () => {};

  constructor(element) {
    this.element = element;

    this.enterPressed = e => {
      let key = e.which || e.keyCode;
      if (key === 13) {
        this.value();
      }
    };
  }

  attached() {
    this.element.addEventListener('keypress', this.enterPressed);
  }

  detached() {
    this.element.removeEventListener('keypress', this.enterPressed);
  }
}
