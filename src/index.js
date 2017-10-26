import getElement from 'dom-get-element';
import isElement from 'dom-is-element';
import rawObject from 'raw-object';

const insertAdjacentElement = (()=>{
    let div = document.createElement('div');
    if(div.insertAdjacentElement){
        div = null;
        return (d, p, v)=>d.insertAdjacentElement(p, v);
    }
    div = null;

    const ops = rawObject({
        beforebegin(d, v){
             d.parentNode.insertBefore(v, d);
        },
        afterbegin(d, v){
            d.insertBefore(v, d.firstChild);
        },
        beforeend(d, v){
            d.appendChild(v);
        },
        afterend(d, v){
            d.parentNode.insertBefore(v, d.nextSibling);
        }
    });

    return (d, p, v)=>{
        if(!ops[p]){
            throw new Error(p + ' is not a valid operation for insertAdjacent');
        }
        ops[p](d, v);
    };

})();

export function insert(dest, position, value){
    if(isElement(value)){
        return insertAdjacentElement(dest, position, value);
    }
    dest.insertAdjacentHTML(position, value + '');
}

export function insertInFragment(dest, position, values){
    let div = document.createElement('div'), c;
    div.appendChild(dest);
    values.forEach(value=>{
        insert(div, position, value);
        while(c = div.firstChild){
            dest.appendChild(c);
        }
    });
}

export function insertAll(dest, position, values){
    if(dest.nodeType === Node.DOCUMENT_FRAGMENT_NODE){
        return insertInFragment(dest, position, values);
    }
    dest = getElement(dest);
    values.forEach(value=>{
        insert(dest, position, value);
    });
}

export function insertAdjacent(dest, position, ...values){
    return insertAll(dest, position, values);
}
