class Game {
  constructor(field, ball, p1, p2) {
    this.field = new Field(field);
    this.ball = new Ball(ball);
    this.player1 = new Player(p1.player, p1.score, 'w', 's');
    this.player2 = new Player(p2.player, p2.score, 'ArrowUp', 'ArrowDown');
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

  /**
   * Leertaste drücken, starten und stoppen
   * @param event
   */
  keyInputHandler(event) {
    if (event.code === this.startKey) {
      if (!this.getStatus) {
        this.start();
      } else {
        this.stop();
      }
    }

    // Spiel-Tasten für Spieler definiert
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
// Grössen ändern
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

    // Elemente bewegen
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
 // Verhalten
  behavior() {
    const ballRadius = this.ball.getTop + this.ball.getDiameter / 2;

    // Ball
    this.ball.setLeft = this.ball.getElement.offsetLeft;
    this.ball.setTop = this.ball.getElement.offsetTop;

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

    // Player 1 erhält einen Punkt
    if ((this.ball.getLeft + this.ball.getDiameter) > this.field.getWidth) {
      this.ball.reverseLeftSpeed();
      this.player1.scored();
    }

    // Player 2 erhält einen Punkt
    if (this.ball.getLeft < 0) {
      this.ball.reverseLeftSpeed();
      this.player2.scored();
    }

    // Ball oben und unten
    if ((this.ball.getTop + this.ball.getDiameter) > this.field.getHeight || this.ball.getTop < 0) {
      this.ball.reverseTopSpeed();
    }

    this.ball.increaseLeft(this.ball.getLeftSpeed);
    this.ball.increaseTop(this.ball.getTopSpeed);
  }
}
// diese Elemente haben Informationen, welche über das Dokument gebraucht werden
class HTMLElement {
  constructor(element, top = 0, left = 0, width = 0, height = 0, diameter = 0) {
    this.element = element;
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.diameter = diameter;
  }

  get getElement() {
    return this.element;
  }

  get getTop() {
    return this.top;
  }

  set setTop(value) {
    this.top = value;
  }

  get getLeft() {
    return this.left;
  }

  set setLeft(value) {
    this.left = value;
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

  get getDiameter() {
    return this.diameter;
  }

  set setDiameter(value) {
    this.diameter = value;
  }
}

class Field extends HTMLElement {
  constructor(element) {
    super(element);
  }

  dimensions() {
    this.setWidth = this.getElement.offsetWidth;
    this.setHeight = this.getElement.offsetHeight;
  }
}

class Ball extends HTMLElement {
  constructor (element) {
    super (element);

    this.leftSpeed = 8;
    this.topSpeed = 1;
    this.topMaxSpeed = 7;
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

  set setTopSpeed(value) {
    this.topSpeed = value;
  }

  set setLeftSpeed(value) {
    this.leftSpeed = value;
  }

  dimensions() {
    this.setTop = this.getElement.offsetTop;
    this.setLeft = this.getElement.offsetLeft;
    this.setDiameter = this.getElement.offsetWidth;
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
    this.getElement.style.top = `${this.getTop}px`;
    this.getElement.style.left = `${this.getLeft}px`;
  }
}

class Player extends HTMLElement {
  constructor(element, scoreElement, keyUp, keyDown) {
    super (element);

    this.scoreElement = scoreElement;
    this.keyUp = keyUp;
    this.keyDown = keyDown;
    this.speed = 7;
    this.points = 0;
    this.direction = false;
  }

  get getScoreElement() {
    return this.scoreElement;
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

  dimensions() {
    this.setTop = this.getElement.offsetTop;
    this.setLeft = this.getElement.offsetLeft + this.getElement.offsetWidth;
    this.setHeight = this.getElement.offsetHeight;
  }

  // Richtung ändern
  changeDirection() {
    if (this.getDirection === 'up') {
      this.decreaseTop = this.speed;
    } else if (this.getDirection === 'down') {
      this.increaseTop = this.speed;
    }
  }

 // Resultat wird erhöht
  increaseScore() {
    this.points += 1;
  }
// das Resultat wird auf dem Bildschirm gezeichnet
  drawScore() {
    this.getScoreElement.innerText = this.points;
  }

  scored() {
    this.increaseScore();
    this.drawScore();
  }

  move() {
    this.getElement.style.top = `${this.getTop}px`;
  }
}

/**
 * auf das HTML-Dokument zugreifen
 */
new Game(document.getElementById('field'), document.getElementById('ball'), {
  player: document.getElementById('player1'),
  score: document.getElementById('player1-score'),
}, {
  player: document.getElementById('player2'),
  score: document.getElementById('player2-score'),
});
