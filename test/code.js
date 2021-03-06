(function () {
'use strict';

function isElement(o){
    var type = typeof Element; //HTMLElement maybe
    return (
    type === "object" || type === 'function'
    ? o instanceof Element
    //DOM2
    : !!o
        && typeof o === "object"
        && o.nodeType === 1 //Definitely an Element
        && typeof o.nodeName==="string"
    );
}

function getElement(element, context){
    if ( context === void 0 ) { context = document; }

    if(typeof element === 'string'){
        try{
            return context.querySelector(element);
        }catch(e){ throw e; }
    }

    if(isElement(element)) { return element; }

    if(!!element && typeof element === 'object'){
        if(isElement(element.element)){
            return element.element;
        }else if(isElement(element[0])){
            return element[0];
        }
    }

    throw new TypeError(("value (" + element + ") in isElement(value)\n    is not an element, valid css selector,\n    or object with an element property, or index 0."));

}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

//Supposedly faster for v8 than just Object.create(null)
function Raw(){}
Raw.prototype = (function (){
    //Maybe some old browser has risen from it's grave
    if(typeof Object.create !== 'function'){
        var temp = new Object();
        temp.__proto__ = null;
        return temp;
    }

    return Object.create(null);
})();

function rawObject(){
    var arguments$1 = arguments;

    var objects = [], len = arguments.length;
    while ( len-- ) { objects[ len ] = arguments$1[ len ]; }

    var raw = new Raw();
    objectAssign.apply(void 0, [ raw ].concat( objects ));
    return raw;
}

var insertAdjacentElement = (function (){
    var div = document.createElement('div');
    if(div.insertAdjacentElement){
        div = null;
        return function (d, p, v){ return d.insertAdjacentElement(p, v); };
    }
    div = null;

    var ops = rawObject({
        beforebegin: function beforebegin(d, v){
             d.parentNode.insertBefore(v, d);
        },
        afterbegin: function afterbegin(d, v){
            d.insertBefore(v, d.firstChild);
        },
        beforeend: function beforeend(d, v){
            d.appendChild(v);
        },
        afterend: function afterend(d, v){
            d.parentNode.insertBefore(v, d.nextSibling);
        }
    });

    return function (d, p, v){
        if(!ops[p]){
            throw new Error(p + ' is not a valid operation for insertAdjacent');
        }
        ops[p](d, v);
    };

})();

function insert(dest, position, value){
    if(isElement(value)){
        return insertAdjacentElement(dest, position, value);
    }
    dest.insertAdjacentHTML(position, value + '');
}

function insertInFragment(dest, position, values){
    var div = document.createElement('div'), c;
    div.appendChild(dest);
    values.forEach(function (value){
        insert(div, position, value);
        while(c = div.firstChild){
            dest.appendChild(c);
        }
    });
}

function insertAll(dest, position, values){
    if(dest.nodeType === Node.DOCUMENT_FRAGMENT_NODE){
        return insertInFragment(dest, position, values);
    }
    dest = getElement(dest);
    values.forEach(function (value){
        insert(dest, position, value);
    });
}

function insertAdjacent(dest, position){
    var arguments$1 = arguments;

    var values = [], len = arguments.length - 2;
    while ( len-- > 0 ) { values[ len ] = arguments$1[ len + 2 ]; }

    return insertAll(dest, position, values);
}

var doc1 = document.createDocumentFragment();
insertAdjacent(doc1, 'afterbegin', '<p>beforebegin</p>');
console.log(doc1);

var div1 = document.querySelector('#div1');
insertAdjacent(div1, 'beforebegin', "<p>beforebegin</p>");
insertAdjacent(div1, 'afterbegin', "<p>afterbegin</p>");
insertAdjacent(div1, 'beforeend', "<p>beforeend</p>");
insertAdjacent(div1, 'afterend', "<p>afterend</p>");

var div2 = document.querySelector('#div2');
insertAdjacent(div2, 'beforebegin', create("beforebegin"));
insertAdjacent(div2, 'afterbegin', create("afterbegin"));
insertAdjacent(div2, 'beforeend', create("beforeend"));
insertAdjacent(div2, 'afterend', create("afterend"));

function create(c){
    var p = document.createElement('p');
    p.innerHTML = c;
    return p;
}

}());
//# sourceMappingURL=code.js.map
