import {bindable, bindingMode, inject} from 'aurelia-framework';

import 'jquery';
import select2 from 'select2';

@inject(Element)
export class EnhancedSelect {
	@bindable({ defaultBindingMode: bindingMode.oneWay }) guid = '';
	@bindable({ defaultBindingMode: bindingMode.oneWay }) values;
	@bindable({ defaultBindingMode: bindingMode.twoWay }) value;

	constructor(element) {
		this.element = element;
	}

	attached() {
		this.selector = $(this.element).find('select')
			.select2()
			.on('select2:select', (event) => {
				this.value = $(this.element).find('select').select2('val');
			});
	}
	
	detached() {
		this.selector.select2('destroy');
	}
}