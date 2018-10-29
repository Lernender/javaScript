class Game {
  constructor(field, ball, p1, p2) {
    this.field = new Field(Utils.getElement(field));
    this.ball = new Ball(Utils.getElement(ball));
    this.player1 = new Player(Utils.getElement(p1.player), Utils.getElement(p1.score), 'w', 's');
    this.player2 = new Player(Utils.getElement(p2.player), Utils.getElement(p2.score), 'ArrowUp', 'ArrowDown');
    this.status = false;
    this.startKey = 'Space';

    // Event Listener
    window.addEventListener('load', this.dimensions.bind(this), false);
    window.addEventListener('resize', this.dimensions.bind(this), false);
    document.addEventListener('keydown', this.keyInputHandler.bind(this), false);
  }

  get getStatus() {
    return this.status;
  }

  set setStatus(value) {
    this.status = value;
  }

  keyInputHandler(event) {
    if (event.code === this.startKey) {
      if (!this.getStatus) {
        this.start();
      } else {
        this.stop();
      }
    }

    switch (event.key) {
      case this.player1.getKeyUp:
        this.player1.setDirection = 'up';
        break;
      case this.player1.getKeyDown:
        this.player1.setDirection = 'down';
        break;
      case this.player2.getKeyUp:
        this.player2.setDirection = 'up';
        break;
      case this.player2.getKeyDown:
        this.player2.setDirection = 'down';
        break;
    }
  }

  dimensions() {
    this.field.dimensions();
    this.ball.dimensions();
    this.player1.dimensions();
    this.player2.dimensions();
  }

  start() {
    this.setStatus = true;
    window.requestAnimationFrame(this.animation.bind(this));
  }

  animation() {
    this.player1.changeDirection();
    this.player2.changeDirection();

    if (this.getStatus) {
      window.requestAnimationFrame(this.animation.bind(this));
    }
  }

  stop() {
    this.setStatus = false;
  }
}

class Field {
  constructor (element) {
    this.element = element;
    this.width = 0;
    this.height = 0;
  }

  set setWidth(value) {
    this.width = value;
  }

  set setHeight(value) {
    this.height = value;
  }

  dimensions() {
    this.setWidth = this.element.offsetWidth;
    this.setHeight = this.element.offsetHeight;
  }
}

class Ball {
  constructor (element) {
    this.element = element;
    this.top = 0;
    this.left = 0;
    this.diameter = 0;
    this.speed = 8;
    this.leftSpeed = 8;
    this.topSpeed = 1;
    this.topSpeedMax = 7;
  }

  set setTop(value) {
    this.top = value;
  }

  set setLeft(value) {
    this.left = value;
  }

  set setDiameter(value) {
    this.diameter = value;
  }

  dimensions() {
    this.setTop = this.element.offsetTop;
    this.setLeft = this.element.offsetLeft;
    this.setDiameter = this.element.offsetWidth;
  }
}

class Player {
  constructor (element, scoreElement, keyUp, keyDown) {
    this.element = element;
    this.scoreElement = scoreElement;
    this.keyUp = keyUp;
    this.keyDown = keyDown;

    this.top = 0;
    this.left = 0;
    this.speed = 7;
    this.height = 0;
    this.points = 0;
    this.direction = false;
  }

  get getKeyUp() {
    return this.keyUp;
  }

  get getKeyDown() {
    return this.keyDown;
  }

  get getDirection() {
    return this.direction;
  }

  set setDirection(value) {
    this.direction = value;
  }

  set increaseTop(value) {
    this.top += value;
  }

  set decreaseTop(value) {
    this.top -= value;
  }

  set setTop(value) {
    this.top = value;
  }

  set setLeft(value) {
    this.left = value;
  }

  set setHeight(value) {
    this.height = value;
  }

  dimensions() {
    this.setTop = this.element.offsetTop;
    this.setLeft = this.element.offsetLeft + this.element.offsetWidth;
    this.setHeight = this.element.offsetHeight;
  }

  changeDirection() {
    if (this.getDirection === 'up') {
      this.decreaseTop = this.speed;
    } else if (this.getDirection === 'down') {
      this.increaseTop = this.speed;
    }
  }

  increaseScore() {
    this.points += 1;
  }

  drawScore() {
    this.scoreElement.innerText = this.points;
  }
}

// TODO: Add HTMLElement class (element, top, left, width, height)

class Utils {
  static isString(value) {
    return typeof value === 'string';
  }

  static isObject(obj) {
    return obj !== null && typeof obj === 'object';
  }

  static isNode(obj) {
    return obj instanceof Node || this.isObject(obj) && obj.nodeType >= 1;
  }

  static getElement(value) {
    if (this.isNode(value)) {
      return value;
    } else if (this.isString(value)) {
      return document.getElementById(value);
    }

    return null;
  }
}

new Game('field', 'ball', {
  player: 'player1',
  score: 'player1-score',
}, {
  player: 'player2',
  score: 'player2-score',
});
