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
             return d.parentNode.insertBefore(v, d);
        },
        afterbegin(d, v){
            return d.insertBefore(v, d.firstChild);
        },
        beforeend(d, v){
            return d.appendChild(v);
        },
        afterend(d, v){
             return d.parentNode.insertBefore(v, d.nextSibling);
        }
    });

    return (d, p, v)=>ops[p](d, v);

})();

export default function insertAdjacent(dest, position, value){

    if(isElement(value)){
        return insertAdjacentElement(dest, position, value);
    }
    return dest.insertAdjacentHTML(position, value + '');
}
