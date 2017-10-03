(() => {

  const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    NONE: 'NONE'
  };

  function Sprite(x, y, classList, direction) {
    this.element = document.createElement("div");
    document.querySelector('#grid').appendChild(this.element);
    this.setX(x || 0);
    this.setY(y || 0);
    (classList || []).concat('sprite').forEach((c) => { 
      this.element.classList.add(c); });
    this.setDirection(direction || Direction.NONE);
    
    // css animation ended
    this.element.addEventListener('animationiteration', (e) => {
      if (e.animationName === Direction.RIGHT) this.setX(this.getX() + 1);
      else if (e.animationName === Direction.LEFT) this.setX(this.getX() - 1); 
      else if (e.animationName === Direction.UP) this.setY(this.getY() - 1);
      else if (e.animationName === Direction.DOWN) this.setY(this.getY() + 1);
      this.tick({
        direction: e.animationName,
        x: this.getX(),
        y: this.getY()
      });
    });
  }

  Sprite.prototype.getX = function () { return +this.element.getAttribute('data-x'); }
  Sprite.prototype.getY = function () { return +this.element.getAttribute('data-y'); }
  Sprite.prototype.getDirection = function () { 
    return this.element.getAttribute('data-direction'); }
  Sprite.prototype.setX = function (x) { this.element.setAttribute('data-x', x); }
  Sprite.prototype.setY = function (y) { this.element.setAttribute('data-y', y); }
  Sprite.prototype.setDirection = function (dir) { 
    return this.element.setAttribute('data-direction', dir); }
  Sprite.prototype.tick = function () {};
  
  
  let state = {
    nextDirection: Direction.NONE,
    body: [],
    directionHistory: []
  }
  
  function SnakeHead(x, y, t) {
    let self = new Sprite(x, y, ['head']);
    self.clock = 0;
    return self;
  }

  function Apple(x, y) {
    let self = new Sprite(x, y, ['apple']);
    return self;
  }

  function SnakeBody() {
    let preamble = Array.apply(null, {length: state.body.length}).map(x => Direction.NONE);
    let sprite = new Sprite(head.getX(), head.getY(), []);
    sprite.clock = head.clock - state.body.length;
    sprite.setDirection(preamble.shift());
    sprite.tick = function (e) {
      this.clock++;
      var nextDir = preamble.shift() || state.directionHistory[head.clock - this.clock];
      this.setDirection(nextDir)
    }
    state.body.push(sprite);
  }
  
  let head = new SnakeHead(4, 4, 0);
  state.body.unshift(head);
  let apple = new Apple(3, 7);

  let queued = [];

  head.tick = function (e) {
    this.clock++;
    this.setDirection(state.nextDirection);
    // eat apple
    if (this.getX() === apple.getX() && this.getY() === apple.getY()) {
      new SnakeBody();
    }
    state.directionHistory.unshift(this.getDirection());
    state.directionHistory = state.directionHistory.slice(0, state.body.length + 1);
  }
  
  
  window.onkeydown = (e) => {
    let code = e.keyCode || e.which;
    if (code === 37) state.nextDirection = Direction.LEFT;
    else if (code === 38) state.nextDirection = Direction.UP;
    else if (code === 39) state.nextDirection = Direction.RIGHT;
    else if (code === 40) state.nextDirection = Direction.DOWN;
    else if (code === 32) state.nextDirection = Direction.NONE;
    console.info('next direction', state.nextDirection);
  }
})()
