// courtesy of https://www.sitepoint.com/accessible-drag-drop/
// adapted and converted to ES6
import { inject, bindable, bindingMode } from 'aurelia-framework';

@inject(Element)
export class DragDropSelect {
  @bindable options = [];
  @bindable selectedTitle = '';
  @bindable availableTitle = '';
  @bindable({ defaultBindingMode: bindingMode.twoWay }) value = [];

  constructor(element) {
    this.element = element;
    this.wireEventListeners = this.wireEventListeners.bind(this);
  }

  attached() {
    this.wireEventListeners();
    this.initDOMObservers();
  }

  valueChanged() {
    // volatile fix for two-way binding
    const sourceContainer = this.getAvailableOptionsContainer();
    const targetContainer = this.getSelectedOptionsContainer();
    if (!this.value.length) {
      // detect empty input array
      this.getSelectedOptionItems().forEach(selectedItem => {
        const optionItem = targetContainer.removeChild(selectedItem);
        sourceContainer.append(optionItem);
      });
    }
  }

  initDOMObservers() {
    this.connectSelectionObserver();
  }

  getOptionItems() {
    return [].slice.call(
      this.element.querySelectorAll('[data-draggable="item"]')
    );
  }

  getContainers() {
    return [].slice.call(
      this.element.querySelectorAll('[data-draggable="target"]')
    );
  }

  getSelectedOptionItems() {
    return [].slice.call(this.element
      .querySelector('.target-container')
      .querySelectorAll('[data-draggable="item"]')
    );
  }

  getAvailableOptionsContainer() {
    return this.element.querySelector('.source-container');
  }

  getSelectedOptionsContainer() {
    return this.element.querySelector('.target-container');
  }

  connectSelectionObserver() {
    this.selectionObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(node => {
            const dataValue = node.getAttribute('data-value');
            const found = this.value.find(val => val === dataValue);
            // copy to register change
            if (!found) {
              this.value = [dataValue, ...this.value.slice(0)];
            }
          });
        }

        if (mutation.removedNodes) {
          mutation.removedNodes.forEach(node => {
            const dataValue = node.getAttribute('data-value');
            const nodeDataIndex = this.value.findIndex(val => val === dataValue);
            if (Number.isInteger(nodeDataIndex)) {
              this.value = [...this.value.slice(0, nodeDataIndex), ...this.value.slice(nodeDataIndex + 1)];
            }
          });
        }
      });
    });

    const target = this.element.querySelector('.target-container');
    const config = {
      attributes: false,
      childList: true,
      characterData: false
    };
    this.selectionObserver.observe(target, config);
  }

  wireEventListeners() {
    const currentSelection = {
      items: [],
      owner: null,
      droptarget: null
    };

    const addSelection = (item) => {
      if (!currentSelection.owner) {
        currentSelection.owner = item.parentNode;
      } else if (currentSelection.owner !== item.parentNode) {
        return;
      }

      item.setAttribute('aria-grabbed', 'true');
      currentSelection.items.push(item);
    };

    const removeSelection = (item) => {
      item.setAttribute('aria-grabbed', 'false');

      const selectionIndex = currentSelection.items.findIndex(selection => selection === item);
      currentSelection.items.splice(selectionIndex, 1);
    };

    const clearcurrentSelection = () => {
      if (currentSelection.items.length) {
        currentSelection.owner = null;
        currentSelection.items.forEach(selection => selection.setAttribute('aria-grabbed', 'false'));
        currentSelection.items = [];
      }
    };

    const hasModifier = (e) => {
      return (e.ctrlKey || e.metaKey || e.shiftKey);
    };

    const addDropeffects = () => {
      this.getContainers()
        .filter(target => target !== currentSelection.owner && target.getAttribute('aria-dropeffect') === 'none')
        .forEach(target => {
          target.setAttribute('aria-dropeffect', 'move');
          target.setAttribute('tabindex', '0');
        });

      this.getOptionItems()
        .filter(item => item.parentNode !== currentSelection.owner && item.getAttribute('aria-grabbed'))
        .forEach(item => {
          item.removeAttribute('aria-grabbed');
          item.removeAttribute('tabindex');
        });
    };

    const clearDropeffects = () => {
      if (currentSelection.items.length) {
        this.getContainers().filter(target => target.getAttribute('aria-dropeffect') !== 'none')
          .forEach(target => {
            target.setAttribute('aria-dropeffect', 'none');
            target.removeAttribute('tabindex');
          });

        this.getOptionItems().filter(item => !item.getAttribute('aria-grabbed'))
          .forEach(item => {
            item.setAttribute('aria-grabbed', 'false');
            item.setAttribute('tabindex', '0');
          });

        this.getOptionItems().filter(item => item.getAttribute('aria-grabbed') === 'true')
          .forEach(item => {
            item.setAttribute('tabindex', '0');
          });
      }
    };

    const getContainer = (element) => {
      do {
        if (element.nodeType === 1 && element.getAttribute('aria-dropeffect')) {
          return element;
        }
        element = element.parentNode;
      } while (element);

      return null;
    };

    //mousedown event to implement single selection
    this.element.addEventListener('mousedown', (e) => {
      if (e.target.getAttribute('draggable')) {
        clearDropeffects();

        if (!hasModifier(e) && e.target.getAttribute('aria-grabbed') === 'false') {
          clearcurrentSelection();
          addSelection(e.target);
        }
      } else if (!hasModifier(e)) {
        clearDropeffects();
        clearcurrentSelection();
      } else {
        clearDropeffects();
      }
    }, false);

    this.element.addEventListener('mouseup', (e) => {
      if (e.target.getAttribute('draggable') && hasModifier(e)) {
        if (e.target.getAttribute('aria-grabbed') === 'true') {
          removeSelection(e.target);
          if (!currentSelection.items.length) {
            currentSelection.owner = null;
          }
        } else {
          addSelection(e.target);
        }
      }
    }, false);

    this.element.addEventListener('dragstart', (e) => {
      if (currentSelection.owner !== e.target.parentNode) {
        e.preventDefault();
        return;
      }

      if (hasModifier(e) && e.target.getAttribute('aria-grabbed') === 'false') {
        addSelection(e.target);
      }

      //we don't need the transfer data, but we have to define something
      //otherwise the drop action won't work at all in firefox
      e.dataTransfer.setData('text', '');

      addDropeffects();
    }, false);

    //related variable is needed to maintain a reference to the
    //dragleave's relatedTarget, since it doesn't have e.relatedTarget
    let related = null;

    this.element.addEventListener('dragenter', (e) => {
      related = e.target;
    }, false);

    this.element.addEventListener('dragleave', (e) => {
      let droptarget = getContainer(related);

      if (droptarget === currentSelection.owner) {
        droptarget = null;
      }

      if (droptarget !== currentSelection.droptarget) {
        if (currentSelection.droptarget) {
          currentSelection.droptarget.className =
              currentSelection.droptarget.className.replace(/ dragover/g, '');
        }

        if (droptarget) {
          droptarget.className += ' dragover';
        }

        currentSelection.droptarget = droptarget;
      }
    }, false);

    this.element.addEventListener('dragover', (e) => {
      if (currentSelection.items.length) {
        e.preventDefault();
      }
    }, false);

    this.element.addEventListener('dragend', (e) => {
      if (currentSelection.droptarget) {
        currentSelection.items.forEach(item => currentSelection.droptarget.appendChild(item));
        e.preventDefault();
      }

      if (currentSelection.items.length) {
        clearDropeffects();
        if (currentSelection.droptarget) {
          clearcurrentSelection();
          currentSelection.droptarget.className =
              currentSelection.droptarget.className.replace(/ dragover/g, '');
          currentSelection.droptarget = null;
        }
      }
    }, false);
  }
}
