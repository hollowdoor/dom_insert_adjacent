import isElement from 'dom-is-element';
import rawObject from 'raw-object';

const insertAdjacentElement = (()=>{
    let div = document.createElement('div');
    if(d.insertAdjacentElement){
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

export default function insertAdjacent(dest, position, ...values){

    values.forEach(value=>{
        if(isElement(value)){
            return insertAdjacentElement(dest, position, value);
        }
        dest.insertAdjacentHTML(position, value + '');
    });
}
