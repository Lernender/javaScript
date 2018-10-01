// Spielfeld
var field = document.getElementById("playing-field");
var fieldWidth = 0;
var fieldHeight = 0;
var startKey = 'Space';
var gamestatus = false;
var result = document.getElementById("scoring");

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
var p1top = 0;
var p1left = 0;
var p1hohe = 0;
var p1Direktion = false;
var p1keyUp = 'w';
var p1keyDown = 's';
var p1Points = 0;

// Spieler 2
var p2 = document.getElementById('p2');
var p2top = 0;
var p2left = 0;
var p2hohe = 0;
var p2Direktion = false;
// das ist die Tastatur für nach oben
var p2keyUp = 'ArrowUp';
var p2keyDown = 'ArrowDown';
var p2Points = 0;

// Spiel
setSize();
// falls die Grösse geändert wird, müssen die Grössen automatisch angepasst werden.
window.addEventListener('resize', setSize);
// Event Key welcher die Funktion setKey aufruft
document.addEventListener('keydown', setKey);
document.addEventListener('keyup', resetKey);


// Beim drücken von der Leertaste wird die Funktion aufgerufen
function setKey(event) {
  if (event.code === startKey) {
    startGame();
  }

  switch (event.key) {
    case p1keyUp:
      p1Direktion = 'up';
      break;
    case p1keyDown:
      p1Direktion = 'down';
      break;
    case p2keyUp:
      p2Direktion = 'up';
      break;
    // Die Variablen werden hier genommen.
    case p2keyDown:
      p2Direktion = 'down';
      break;
  }
}

function startGame() {
  ballLeftSpeed = ballSpeed;
  ballTopSpeed = 1;

  if (!gamestatus) {
    gamestatus = true;
    window.requestAnimationFrame(animation);
  } else {
    gamestatus = false;
  }
}

function resetKey(event) {
  if (event.key === p1keyUp || event.key === p1keyDown) {
    p1Direktion = false;
  }

  if (event.key === p2keyUp || event.key === p2keyDown) {
    p2Direktion = false;
  }
}

// Die Variablen sind sind oben noch leer, sie werden aber mit dieser Funktion "gefüllt
function setSize() {
  fieldWidth = field.offsetWidth;
  fieldHeight = field.offsetHeight;

  p2top = p2.offsetTop;
  p2left = p2.offsetLeft;
  p2hohe = p2.offsetHeight;

  p1top = p1.offsetTop;
  p1left = p1.offsetLeft + p1.offsetWidth;
  p1hohe = p1.offsetHeight;

  ballDiameter = ball.offsetWidth;
  ballLeft = ball.offsetLeft;
  ballTop = ball.offsetTop;
}

function animation() {
  setPlayer();
  setBall();
  // Hier wird die position links vom Ball gesetzt.
  ball.style.left = ballLeft + 'px';
  // Hier wird die position oben vom Ball gesetzt.
  ball.style.top = ballTop + 'px';

  p1.style.top = p1top + 'px';
  p2.style.top = p2top + 'px';

  // console.log(event);
  // Die Funktion ruft sich selber noch einmal auf, Ablauf wiederholt
  if (gamestatus) {
    window.requestAnimationFrame(animation);
  }
}

function setPlayer() {
  if (p1Direktion === 'up') {
    p1top -= playerSpeed;
  } else if (p1Direktion === 'down') {
    p1top += playerSpeed;
  }

  if (p2Direktion === 'up') {
    p2top -= playerSpeed;
  } else if (p2Direktion === 'down') {
    p2top += playerSpeed;
  }
}

function getP1BallConnectPosition() {
  var p1BallTopCenter = ballTop - ((p1hohe / 2) + p1top);
  return (ballTopSpeedMax / (p1hohe / 2)) * p1BallTopCenter;
}

function getP2BallConnectPosition() {
  var p2BallTopCenter = ballTop - ((p2hohe / 2) + p2top);
  return (ballTopSpeedMax / (p2hohe / 2)) * p2BallTopCenter;
}

function setBall() {
  ballLeft = ball.offsetLeft;
  ballTop = ball.offsetTop;

  // Berührt den Ball (p1 + Breite von P1) von links
  if (p1left > ballLeft) {
    // Ist der Ball innerhalb von oben im bereich von P1 der oberen Kante
    if ((ballTop + (ballDiameter / 2)) > p1top) {
      // Ist der Ball von oben om bereich von P1 der unteren Kante
      if ((ballTop + (ballDiameter / 2)) < (p1top + p1hohe)) {
        // Ball Richtung umkehren (Links / Rechts)
        ballLeftSpeed = ballLeftSpeed * -1;
        ballTopSpeed += getP1BallConnectPosition();
      }
    }
  }

  // Berührt den Ball p2 von links
  if (p2left < (ballLeft + ballDiameter)) {
    // Ist der Ball innerhalb von oben im bereich von P2 der oberen Kante
    if ((ballTop + (ballDiameter / 2)) > p2top) {
      // Ist der Ball von oben om bereich von P2 der unteren Kante
      if ((ballTop + (ballDiameter / 2)) < (p2top + p2hohe)) {
        // Ball umkehren, links - rechts
        ballLeftSpeed = ballLeftSpeed * -1;
        ballTopSpeed += getP2BallConnectPosition();
      }
    }
  }

  // Der Ball prallt an der linken Wand auf
  if (ballLeft < 0) {
    ballLeftSpeed = ballLeftSpeed * -1;
    // Speiler 2 bekommt einen Punkt
    p2Points += 1;
    resuteSetText();
  }

  // Der Ball prallt an der rechten Wand auf
  if ((ballLeft + ballDiameter) > fieldWidth) {
    ballLeftSpeed = ballLeftSpeed * -1;
    // Spieler 1 bekommt einen Punkt
    p1Points += 1;
    resuteSetText();
  }

// Der Ball prallt oben und unten ab
  if ((ballTop + ballDiameter) > fieldHeight || ballTop < 0) {
    ballTopSpeed = ballTopSpeed * -1;
  }
  ballLeft += ballLeftSpeed;
  ballTop += ballTopSpeed;
}

function resuteSetText() {
 result.innerText = p1Points + ' : ' + p2Points;
}
