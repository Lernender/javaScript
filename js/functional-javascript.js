// Spielfeld
var field = document.getElementById('playing-field');
var fieldWidth = 0;
var fieldHeight = 0;
var startKey = 'Space';
var gameStatus = false;
var score = document.getElementById('score');

// Ball
var ball = document.getElementById('ball');
var ballDiameter = 0;
var ballLeft = 0;
var ballTop = 0;
var ballSpeed = 8;
var ballLeftSpeed = 0;
var ballTopSpeed = 0;
var ballTopSpeedMax = 7;
var playerSpeed = 7;

// Spieler 1
var p1 = document.getElementById('p1');
var p1Top = 0;
var p1Left = 0;
var p1Height = 0;
var p1Direction = false;
var p1KeyUp = 'w';
var p1KeyDown = 's';
var p1Points = 0;

// Spieler 2
var p2 = document.getElementById('p2');
var p2Top = 0;
var p2Left = 0;
var p2Height = 0;
var p2Direction = false;
// Das sind die Pfeiltasten auf der Tastatur
var p2KeyUp = 'ArrowUp';
var p2KeyDown = 'ArrowDown';
var p2Points = 0;

// Spiel
setSize();
// Falls die Grösse geändert wird, müssen die Grössen automatisch angepasst werden
window.addEventListener('resize', setSize);
// Event Key, welcher die Funktion setKey aufruft
document.addEventListener('keydown', setKey);
document.addEventListener('keyup', resetKey);


// Beim Drücken der Leertaste wird die Funktion aufgerufen
function setKey(event) {
  if (event.code === startKey) {
    startGame();
  }

  switch (event.key) {
    case p1KeyUp:
      p1Direction = 'up';
      break;
    case p1KeyDown:
      p1Direction = 'down';
      break;
    case p2KeyUp:
      p2Direction = 'up';
      break;
    case p2KeyDown:
      p2Direction = 'down';
      break;
  }
}

function startGame() {
  ballLeftSpeed = ballSpeed;
  ballTopSpeed = 1;

  if (!gameStatus) {
    gameStatus = true;
    window.requestAnimationFrame(animation);
  } else {
    gameStatus = false;
  }
}

function resetKey(event) {
  if (event.key === p1KeyUp || event.key === p1KeyDown) {
    p1Direction = false;
  }

  if (event.key === p2KeyUp || event.key === p2KeyDown) {
    p2Direction = false;
  }
}

// Die Variablen sind oben noch leer, sie werden aber mit dieser Funktion gefüllt
function setSize() {
  fieldWidth = field.offsetWidth;
  fieldHeight = field.offsetHeight;

  ballDiameter = ball.offsetWidth;
  ballLeft = ball.offsetLeft;
  ballTop = ball.offsetTop;

  p1Top = p1.offsetTop;
  p1Left = p1.offsetLeft + p1.offsetWidth;
  p1Height = p1.offsetHeight;

  p2Top = p2.offsetTop;
  p2Left = p2.offsetLeft;
  p2Height = p2.offsetHeight;
}

function animation() {
  setPlayer();
  setBall();

  // Hier wird die position links vom Ball gesetzt
  ball.style.left = ballLeft + 'px';
  // Hier wird die position oben vom Ball gesetzt
  ball.style.top = ballTop + 'px';

  p1.style.top = p1Top + 'px';
  p2.style.top = p2Top + 'px';

  // Die Funktion ruft sich selber noch einmal auf, Ablauf wiederholt
  if (gameStatus) {
    window.requestAnimationFrame(animation);
  }
}

function setPlayer() {
  if (p1Direction === 'up') {
    p1Top -= playerSpeed;
  } else if (p1Direction === 'down') {
    p1Top += playerSpeed;
  }

  if (p2Direction === 'up') {
    p2Top -= playerSpeed;
  } else if (p2Direction === 'down') {
    p2Top += playerSpeed;
  }
}

function getP1BallConnectPosition() {
  var p1BallTopCenter = ballTop - ((p1Height / 2) + p1Top);

  return (ballTopSpeedMax / (p1Height / 2)) * p1BallTopCenter;
}

function getP2BallConnectPosition() {
  var p2BallTopCenter = ballTop - ((p2Height / 2) + p2Top);

  return (ballTopSpeedMax / (p2Height / 2)) * p2BallTopCenter;
}

function setBall() {
  ballLeft = ball.offsetLeft;
  ballTop = ball.offsetTop;

  // Berührt den Ball (p1 + Breite von P1) von links
  if (p1Left > ballLeft) {
    // Ist der Ball innerhalb von oben im bereich von P1 der oberen Kante
    if ((ballTop + (ballDiameter / 2)) > p1Top) {
      // Ist der Ball von oben om bereich von P1 der unteren Kante
      if ((ballTop + (ballDiameter / 2)) < (p1Top + p1Height)) {
        // Ball Richtung umkehren (Links / Rechts)
        ballLeftSpeed = ballLeftSpeed * -1;
        ballTopSpeed += getP1BallConnectPosition();
      }
    }
  }

  // Berührt den Ball p2 von links
  if (p2Left < (ballLeft + ballDiameter)) {
    // Ist der Ball innerhalb von oben im bereich von P2 der oberen Kante
    if ((ballTop + (ballDiameter / 2)) > p2Top) {
      // Ist der Ball von oben om bereich von P2 der unteren Kante
      if ((ballTop + (ballDiameter / 2)) < (p2Top + p2Height)) {
        // Ball umkehren, links - rechts
        ballLeftSpeed = ballLeftSpeed * -1;
        ballTopSpeed += getP2BallConnectPosition();
      }
    }
  }

  // Der Ball prallt an der linken Wand auf
  if (ballLeft < 0) {
    ballLeftSpeed = ballLeftSpeed * -1;
    // Spieler 2 bekommt einen Punkt
    p2Points += 1;
    resetScore();
  }

  // Der Ball prallt an der rechten Wand auf
  if ((ballLeft + ballDiameter) > fieldWidth) {
    ballLeftSpeed = ballLeftSpeed * -1;
    // Spieler 1 bekommt einen Punkt
    p1Points += 1;
    resetScore();
  }

// Der Ball prallt oben und unten ab
  if ((ballTop + ballDiameter) > fieldHeight || ballTop < 0) {
    ballTopSpeed = ballTopSpeed * -1;
  }

  ballLeft += ballLeftSpeed;
  ballTop += ballTopSpeed;
}

function resetScore() {
  score.innerText = p1Points + ' : ' + p2Points;
}
