// courtesy of https://www.sitepoint.com/accessible-drag-drop/
// adapted and converted to ES6
import { inject, bindable } from 'aurelia-framework';

@inject(Element)
export class DragDropSelect {
  @bindable options = [];

  constructor(element) {
    this.element = element;
  }

  attached() {
    // called before render
    this.initializeDragDropAreas();
    this.attachMutationListeners();
  }

  attachMutationListeners() {
    console.warn('not implemented yet');
  }

  initializeDragDropAreas() {
    if (!document.querySelectorAll || !('draggable' in document.createElement('span')) || window.opera) {
      return;
    }

    //get the collection of draggable targets and add their draggable attribute
    const targets = [].slice.call(this.element.querySelectorAll('[data-draggable="target"]'));
    targets.forEach(e => e.setAttribute('aria-dropeffect', 'none'));

    //get the collection of draggable items and add their draggable attributes
    const items = [].slice.call(this.element.querySelectorAll('[data-draggable="item"]'));

    items.forEach(e => {
      e.setAttribute('draggable', 'true');
      e.setAttribute('aria-grabbed', 'false');
      e.setAttribute('tabindex', '0');
    });

    //dictionary for storing current selection data
    //comprising an array of the currently selected items
    //a reference to the selected items' owning container
    //and a reference to the current drop target container
    const selections = {
      items: [],
      owner: null,
      droptarget: null
    };

    //function for selecting an item
    function addSelection(item) {
      if (!selections.owner) {
        //if the owner reference is still null, set it to this item's parent
        //so that further selection is only allowed within the same container
        selections.owner = item.parentNode;
      } else if (selections.owner !== item.parentNode) {
  	    //or if that's already happened then compare it with this item's parent
        //and if they're not the same container, return to prevent selection
        return;
      }
      //set this item's grabbed state
      item.setAttribute('aria-grabbed', 'true');
      //add it to the items array
      selections.items.push(item);
    }

    //function for unselecting an item
    function removeSelection(item) {
      //reset this item's grabbed state
      item.setAttribute('aria-grabbed', 'false');

      //then find and remove this item from the existing items array
      const selectionIndex = selections.items.findIndex(selection => selection === item);
      selections.items.splice(selectionIndex, 1);
    }

    //function for resetting all selections
    function clearSelections() {
      //if we have any selected items
      if (selections.items.length) {
        //reset the owner reference
        selections.owner = null;

        //reset the grabbed state on every selected item
        selections.items.forEach(selection => selection.setAttribute('aria-grabbed', 'false'));

        //then reset the items array
        selections.items = [];
      }
    }

    //shorctut function for testing whether a selection modifier is pressed
    function hasModifier(e) {
      return (e.ctrlKey || e.metaKey || e.shiftKey);
    }

    //function for applying dropeffect to the target containers
    function addDropeffects() {
      //apply aria-dropeffect and tabindex to all targets apart from the owner
      targets
        .filter(target => target !== selections.owner && target.getAttribute('aria-dropeffect') === 'none')
        .forEach(target => {
          target.setAttribute('aria-dropeffect', 'move');
          target.setAttribute('tabindex', '0');
        });

      //remove aria-grabbed and tabindex from all items inside those containers
      items
        .filter(item => item.parentNode !== selections.owner && item.getAttribute('aria-grabbed'))
        .forEach(item => {
          item.removeAttribute('aria-grabbed');
          item.removeAttribute('tabindex');
        });
    }

    //function for removing dropeffect from the target containers
    function clearDropeffects() {
      //if we have any selected items
      if (selections.items.length) {
        targets.filter(target => target.getAttribute('aria-dropeffect') !== 'none')
          .forEach(target => {
            //reset aria-dropeffect and remove tabindex from all targets
            target.setAttribute('aria-dropeffect', 'none');
            target.removeAttribute('tabindex');
          });

          //restore aria-grabbed and tabindex to all selectable items
          //without changing the grabbed value of any existing selected items
        items.filter(item => !item.getAttribute('aria-grabbed')).forEach(item => {
          item.setAttribute('aria-grabbed', 'false');
          item.setAttribute('tabindex', '0');
        });
        items.filter(item => item.getAttribute('aria-grabbed') === 'true').forEach(item => {
          item.setAttribute('tabindex', '0');
        });
      }
    }

    //shortcut function for identifying an event element's target container
    function getContainer(element) {
      do {
        if (element.nodeType === 1 && element.getAttribute('aria-dropeffect')) {
          return element;
        }
        element = element.parentNode;
      } while (element);

      return null;
    }

    // events

    //mousedown event to implement single selection
    this.element.addEventListener('mousedown', (e) => {
      //if the element is a draggable item
      if (e.target.getAttribute('draggable')) {
        //clear dropeffect from the target containers
        clearDropeffects();

        //if the multiple selection modifier is not pressed
        //and the item's grabbed state is currently false
        if (!hasModifier(e) && e.target.getAttribute('aria-grabbed') === 'false') {
          //clear all existing selections
          clearSelections();

          //then add this new selection
          addSelection(e.target);
        }
      } else if (!hasModifier(e)) {
        //else [if the element is anything else]
        //and the selection modifier is not pressed
        //clear dropeffect from the target containers
        clearDropeffects();

        //clear all existing selections
        clearSelections();
      } else {
        //else [if the element is anything else and the modifier is pressed]
        //clear dropeffect from the target containers
        clearDropeffects();
      }
    }, false);

    //mouseup event to implement multiple selection
    this.element.addEventListener('mouseup', (e) => {
      //if the element is a draggable item
      //and the multiple selection modifier is pressed
      if (e.target.getAttribute('draggable') && hasModifier(e)) {
        //if the item's grabbed state is currently true
        if (e.target.getAttribute('aria-grabbed') === 'true') {
          //unselect this item
          removeSelection(e.target);

          //if that was the only selected item
          //then reset the owner container reference
          if (!selections.items.length) {
            selections.owner = null;
          }
        } else {
          //else [if the item's grabbed state is false]
          //add this additional selection
          addSelection(e.target);
        }
      }
    }, false);

    //dragstart event to initiate mouse dragging
    this.element.addEventListener('dragstart', (e) => {
      //if the element's parent is not the owner, then block this event
      if (selections.owner !== e.target.parentNode) {
        e.preventDefault();
        return;
      }

      //[else] if the multiple selection modifier is pressed
      //and the item's grabbed state is currently false
      if (hasModifier(e) && e.target.getAttribute('aria-grabbed') === 'false') {
        //add this additional selection
        addSelection(e.target);
      }

      //we don't need the transfer data, but we have to define something
      //otherwise the drop action won't work at all in firefox
      //most browsers support the proper mime-type syntax, eg. "text/plain"
      //but we have to use this incorrect syntax for the benefit of IE10+
      e.dataTransfer.setData('text', '');

      //apply dropeffect to the target containers
      addDropeffects();
    }, false);

    //related variable is needed to maintain a reference to the
    //dragleave's relatedTarget, since it doesn't have e.relatedTarget
    let related = null;

    //dragenter event to set that variable
    this.element.addEventListener('dragenter', (e) => {
      related = e.target;
    }, false);

    //dragleave event to maintain target highlighting using that variable
    this.element.addEventListener('dragleave', (e) => {
      //get a drop target reference from the relatedTarget
      let droptarget = getContainer(related);

      //if the target is the owner then it's not a valid drop target
      if (droptarget === selections.owner) {
        droptarget = null;
      }

      //if the drop target is different from the last stored reference
      //(or we have one of those references but not the other one)
      if (droptarget !== selections.droptarget) {
        //if we have a saved reference, clear its existing dragover class
        if (selections.droptarget) {
          selections.droptarget.className =
              selections.droptarget.className.replace(/ dragover/g, '');
        }

        //apply the dragover class to the new drop target reference
        if (droptarget) {
          droptarget.className += ' dragover';
        }

        //then save that reference for next time
        selections.droptarget = droptarget;
      }
    }, false);

    //dragover event to allow the drag by preventing its default
    this.element.addEventListener('dragover', (e) => {
      //if we have any selected items, allow them to be dragged
      if (selections.items.length) {
        e.preventDefault();
      }
    }, false);

    //dragend event to implement items being validly dropped into targets,
    //or invalidly dropped elsewhere, and to clean-up the interface either way
    this.element.addEventListener('dragend', (e) => {
      //if we have a valid drop target reference
      //(which implies that we have some selected items)
      if (selections.droptarget) {
        //append the selected items to the end of the target container
        selections.items.forEach(item => selections.droptarget.appendChild(item));

        //prevent default to allow the action
        e.preventDefault();
      }

      //if we have any selected items
      if (selections.items.length) {
        //clear dropeffect from the target containers
        clearDropeffects();

        //if we have a valid drop target reference
        if (selections.droptarget) {
          //reset the selections array
          clearSelections();

          //reset the target's dragover class
          selections.droptarget.className =
              selections.droptarget.className.replace(/ dragover/g, '');

          //reset the target reference
          selections.droptarget = null;
        }
      }
    }, false);
  }
}
