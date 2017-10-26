dom-insert-adjacent
=============

Install
----

`npm install --save dom-insert-adjacent`

Usage
---

### insertAdjacent(element, position, ...values)

Use `insertAdjacent()` to insert an number of values into, or around an element.

`element` can be anything that [dom-get-element](https://github.com/hollowdoor/dom_get_element) accepts.

```javascript
import { insertAdjacent } from 'dom-insert-adjacent';

const div = document.querySelector('#some-element');
//Like an append
insertAdjacent(div, 'beforeend', '<p>Hello world!</p>');
insertAdjacent(div, 'beforeend', '<p>Hello fruit!</p>', '<p>Hello cheese!</p>');
/*
<div>
    <p>Hello world!</p>
    <p>Hello fruit!</p>
    <p>Hello cheese!</p>
</div>
*/
```

### insertAll(element, position, values)

`insertAll()` works like `insertAdjacent()` except values is an array instead of variable length arguments.

Extra functions
------------

These functions are also exported by this module, but you can ignore them. The above functions use both of these next functions internally.

* insert(element, position, value)
* insertInFragment(DocumentFragment, position, value)

About
----

These insert operations work like [Element.insertAdjacentHTML()](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML), or [
Element.insertAdjacentElement()
](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement)

The main different from those standard Element methods is the variable arguments (`...values`) in `insertAdjacent(element, position, ...values)`, and the array argument (`values`) in `insertAll(element, position, values)`.
