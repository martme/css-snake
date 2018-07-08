
const getX = element => +element.getAttribute('data-x');
const getY = element => +element.getAttribute('data-y');
const getD = (element) => element.getAttribute('data-d');
const getT = element => +element.getAttribute('data-t');
const setX = (element, value) => element.setAttribute('data-x', value);
const setY = (element, value) => element.setAttribute('data-y', value);
const setD = (element, value) => element.setAttribute('data-d', value);
const incT = (element) => { 
  let t = getT(element); 
  element.setAttribute('data-t', ++t);
  return t;
};

let nextDirection = 'RIGHT';
let directionHistory = [];
document.querySelectorAll('button').forEach(element => {
  element.addEventListener('click', () => nextDirection = getD(element));
  element.addEventListener('touchstart', () => nextDirection = getD(element));
});
window.onkeydown = (e) => {
  const map = {  32: 'IDLE', 37: 'LEFT', 38: 'UP', 39: 'RIGHT', 40: 'DOWN' };
  nextDirection = map[e.keyCode || e.which] || nextDirection;
};

const wrapper = document.querySelector('main');
const snake = appendChildHtml('<ol></ol>', wrapper);
const apple = appendChildHtml(`<div data-x=${4} data-y=${3}></div>`, wrapper);
pushToSnake(5, 5, 0, 'RIGHT');
const head = snake.firstChild;
head.addEventListener('animationiteration', onHeadMoveCompleted);
const length = () => head.parentNode.childElementCount;

function nextPosition(element) {
  const mod = (n, m) => (n + m) % m;
  let x = getX(element);
  let y = getY(element);
  let d = getD(element);
  ({
    'UP': () => y = mod(--y, 16),
    'DOWN': () => y = mod(++y, 16),
    'LEFT': () => x = mod(--x, 16),
    'RIGHT': () => x = mod(++x, 16),
    'IDLE': () => {}
  })[d]();
  return { x, y };
}

function onMoveCompleted(e) {
  const element = e.srcElement;
  const pos = nextPosition(element);
  setX(element, pos.x);
  setY(element, pos.y);
  setD(element, directionHistory[getT(head) - incT(element)]);
}

function onHeadMoveCompleted() {
  directionHistory.unshift(nextDirection);
  directionHistory = directionHistory.slice(0, length()+1);
  setD(head, directionHistory[0]);

  if (collide(head, apple)) {
    const tail = snake.lastChild;
    let x = getX(tail);
    let y = getY(tail);
    if (getT(head) - getT(tail) === length()) {
      x = nextPosition(tail).x;
      y = nextPosition(tail).y;
    }
    pushToSnake(x, y, getT(head)-length(), 'IDLE');
    moveApple();
    wrapper.setAttribute('data-pts', +wrapper.getAttribute('data-pts') + 1);
  }
}

function collide(element, other) {
  return getX(element) == getX(other) && getY(element) == getY(other);
}

function pushToSnake(x, y, t, d) {
  const element = appendChildHtml(`
    <li data-x='${x}' data-y='${y}' data-t='${t}' data-d='${d}'></li>
  `, snake);
  element.addEventListener('animationiteration', onMoveCompleted);
}

function moveApple() {
  setX(apple, parseInt(Math.random()*16));
  setY(apple, parseInt(Math.random()*16));
}

function appendChildHtml(htmlString, parent) {
  let element = htmlToElement(htmlString);
  parent.appendChild(element);
  return element;
}

function htmlToElement(htmlString) {
  let template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}
