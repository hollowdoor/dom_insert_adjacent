import { insertAdjacent } from '../';

const div1 = document.querySelector('#div1');
insertAdjacent(div1, 'beforebegin', "<p>beforebegin</p>")
insertAdjacent(div1, 'afterbegin', "<p>afterbegin</p>")
insertAdjacent(div1, 'beforeend', "<p>beforeend</p>")
insertAdjacent(div1, 'afterend', "<p>afterend</p>")

const div2 = document.querySelector('#div2');
insertAdjacent(div2, 'beforebegin', create("beforebegin"))
insertAdjacent(div2, 'afterbegin', create("afterbegin"))
insertAdjacent(div2, 'beforeend', create("beforeend"))
insertAdjacent(div2, 'afterend', create("afterend"))

function create(c){
    let p = document.createElement('p');
    p.innerHTML = c;
    return p;
}
