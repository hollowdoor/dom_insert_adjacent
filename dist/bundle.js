'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var getElement = _interopDefault(require('dom-get-element'));
var isElement = _interopDefault(require('dom-is-element'));
var rawObject = _interopDefault(require('raw-object'));

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
    var values = [], len = arguments.length - 2;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];

    return insertAll(dest, position, values);
}

exports.insert = insert;
exports.insertInFragment = insertInFragment;
exports.insertAll = insertAll;
exports.insertAdjacent = insertAdjacent;
//# sourceMappingURL=bundle.js.map
