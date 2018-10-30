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
    document.addEventListener('keyup', this.keyInputHandlerReset.bind(this), false);
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

  keyInputHandlerReset(event) {
    if (event.key === this.player1.getKeyUp ||
      event.key === this.player1.getKeyDown) {
      this.player1.setDirection = false;
    }

    if (event.key === this.player2.getKeyUp ||
      event.key === this.player2.getKeyDown) {
      this.player2.setDirection = false;
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
    this.behavior();

    // Move elements
    this.ball.move();
    this.player1.move();
    this.player2.move();

    if (this.getStatus) {
      window.requestAnimationFrame(this.animation.bind(this));
    }
  }

  stop() {
    this.setStatus = false;
  }

  behavior() {
    const ballRadius = this.ball.getTop + this.ball.getDiameter / 2;

    // Ball
    this.ball.setLeft = this.ball.element.offsetLeft;
    this.ball.setTop = this.ball.element.offsetTop;

    // Player 1
    if (
      this.player1.getLeft > this.ball.getLeft &&
      ballRadius > this.player1.getTop &&
      ballRadius < this.player1.getTop + this.player1.getHeight
    ) {
      this.ball.reverseLeftSpeed();
      this.ball.increaseTopSpeed(this.ball.connectPosition(this.player1));
    }

    // Player 2
    if (
      this.player2.getLeft < this.ball.getLeft + this.ball.getDiameter &&
      ballRadius > this.player2.getTop &&
      ballRadius < this.player2.getTop + this.player2.getHeight
    ) {
      this.ball.reverseLeftSpeed();
      this.ball.increaseTopSpeed(this.ball.connectPosition(this.player2));
    }

    // Player 1 scores
    if ((this.ball.getLeft + this.ball.getDiameter) > this.field.getWidth) {
      this.ball.reverseLeftSpeed();
      this.player1.scored();
    }

    // Player 2 scores
    if (this.ball.getLeft < 0) {
      this.ball.reverseLeftSpeed();
      this.player2.scored();
    }

    // Ball bounces on top or bottom
    console.log(this.field.getHeight);
    if ((this.ball.getTop + this.ball.getDiameter) > this.field.getHeight || this.ball.getTop < 0) {
      this.ball.reverseTopSpeed();
    }

    this.ball.increaseLeft(this.ball.getLeftSpeed);
    this.ball.increaseTop(this.ball.getTopSpeed);
  }
}

class Field {
  constructor(element) {
    this.element = element;
    this.width = 0;
    this.height = 0;
  }

  get getWidth() {
    return this.width;
  }

  set setWidth(value) {
    this.width = value;
  }

  get getHeight() {
    return this.height;
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
  constructor(element) {
    this.element = element;
    this.top = 0;
    this.left = 0;
    this.diameter = 0;
    this.leftSpeed = 8;
    this.topSpeed = 1;
    this.topMaxSpeed = 7;
  }

  get getTop() {
    return this.top;
  }

  get getLeft() {
    return this.left;
  }

  get getDiameter() {
    return this.diameter;
  }

  get getTopSpeed() {
    return this.topSpeed;
  }

  get getLeftSpeed() {
    return this.leftSpeed;
  }

  get getTopMaxSpeed() {
    return this.topMaxSpeed
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

  set setTopSpeed(value) {
    this.topSpeed = value;
  }

  set setLeftSpeed(value) {
    this.leftSpeed = value;
  }

  dimensions() {
    this.setTop = this.element.offsetTop;
    this.setLeft = this.element.offsetLeft;
    this.setDiameter = this.element.offsetWidth;
  }

  reverseTopSpeed() {
    this.setTopSpeed = this.getTopSpeed * -1;
  }

  reverseLeftSpeed() {
    this.setLeftSpeed = this.getLeftSpeed * -1;
  }

  increaseTopSpeed(value) {
    this.topSpeed += value;
  }

  increaseTop(value) {
    this.top += value;
  }

  increaseLeft(value) {
    this.left += value;
  }

  connectPosition(player) {
    const ballTopCenter = this.getTop - (player.getHeight / 2 + player.getTop);

    return (this.getTopMaxSpeed / (player.getHeight / 2)) * ballTopCenter;
  }

  move() {
    this.element.style.top = `${this.getTop}px`;
    this.element.style.left = `${this.getLeft}px`;

  }
}

class Player {
  constructor(element, scoreElement, keyUp, keyDown) {
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

  get getLeft() {
    return this.left;
  }

  get getTop() {
    return this.top;
  }

  get getHeight() {
    return this.height;
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

  scored() {
    this.increaseScore();
    this.drawScore();
  }

  move() {
    this.element.style.top = `${this.getTop}px`;
  }
}

class HTMLElement {

}
// TODO: Add HTMLElement class (element, top, left, width, height, diameter)
class HTMLElement {
  constructor(element, scoreElement, keyUp, keyDown) {
    this.element = element;
    this.scoreElement = scoreElement;
    this.keyUp = keyUp;
    this.keyDown = keyDown;

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
