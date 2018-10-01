
// Spielfeld //
var spielfeld = document.getElementById("spielfeld");
var spielfeldbreite = 0;
var spielfeldhohe = 0;
var starttaste = 'Space';
var gamestatus = false;
var resulatat  = document.getElementById("resulatat");

// Ball //
var ball = document.getElementById('ball');
var balldurchmesser = 0;
var ballLeft = 0;
var ballTop = 0;
var ballSpeed = 8;
var ballLeftSpeed = 0;
var ballTopSpeed = 0;
var ballTopSpeedMax = 7;
var playerSpeed = 7;


// Spieler 1
var p1 = document.getElementById("p1");
var p1top = 0;
var p1left = 0;
var p1hohe = 0;
var p1Direktion = false;
var p1keyUp = 'w';
var p1keyDown = 's';
var p1Punkte = 0;


// Spieler 2
var p2 = document.getElementById("p2");
var p2top = 0;
var p2left = 0;
var p2hohe = 0;
var p2Direktion = false;
var p2keyUp = 'ArrowUp'; // das ist die Tastatur für nach oben
var p2keyDown = 'ArrowDown';
var p2Punkte = 0;


// Spiel
setSize();
window.addEventListener('resize', setSize); // falls die Grösse geändert wird, müssen die Grössen automatisch angepasst werden.
document.addEventListener('keydown', setKey); // Event Key welcher die Funktion setKey aufruft
document.addEventListener('keyup', resetKey); // Event Key welcher die Funktion setKey aufruft



function setKey(event){
  if(event.code === starttaste) {
    startGame(); // wenn man die Leertaste drückt, soll die Funktion aufgerufen werden.
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
    case p2keyDown: // hier werden die Variablen genommen
      p2Direktion = 'down';
      break;
  }
}

function startGame(){

  ballLeftSpeed = ballSpeed;
  ballTopSpeed = 1;

  if(!gamestatus) {
    gamestatus = true;
    window.requestAnimationFrame(animation); // Funktion Animation... nach lesen
  } else {
    gamestatus = false;
  }
}

function resetKey(event){
  if (event.key === p1keyUp || event.key === p1keyDown) {
    p1Direktion = false;
  }

  if (event.key === p2keyUp || event.key === p2keyDown) {
    p2Direktion = false;
  }
}


function setSize() { // die Variablen sind sind oben noch leer, sie werden aber mit dieser Funktion "gefüllt"
  spielfeldbreite = spielfeld.offsetWidth;
  spielfeldhohe = spielfeld.offsetHeight;

  p2top = p2.offsetTop;
  p2left = p2.offsetLeft;
  p2hohe = p2.offsetHeight;

  p1top = p1.offsetTop;
  p1left = p1.offsetLeft + p1.offsetWidth;
  p1hohe = p1.offsetHeight;

  balldurchmesser = ball.offsetWidth;
  ballLeft = ball.offsetLeft;
  ballTop = ball.offsetTop;

  // console.log('Set Size');
}

function animation(event) {
  setPlayer();
  setBall();

  ball.style.left = ballLeft + 'px'; // Hier wird die position links vom Ball gesetzt.
  ball.style.top = ballTop + 'px'; // Hier wird die position oben vom Ball gesetzt.

  p1.style.top = p1top + 'px';
  p2.style.top = p2top + 'px';

  // console.log(event);
  if(gamestatus) {
    window.requestAnimationFrame(animation); // die Funktion ruft sich selber noch einmal auf. Das der Ablauf wiederholt wird.
  }
}

function setPlayer() {
  if (p1Direktion === "up"){
    p1top -= playerSpeed;
  } else if (p1Direktion === 'down'){
    p1top += playerSpeed;
  }

  if (p2Direktion === "up"){
    p2top -= playerSpeed;
  } else if (p2Direktion === 'down'){
    p2top += playerSpeed;
  }
}

function getP1BallConnectPosition() {
  var p1BallTopCenter = ballTop - ((p1hohe/2) + p1top);
  return (ballTopSpeedMax / (p1hohe/2)) * p1BallTopCenter;
}

function getP2BallConnectPosition() {
  var p2BallTopCenter = ballTop - ((p2hohe/2) + p2top);
  return (ballTopSpeedMax / (p2hohe/2)) * p2BallTopCenter;
}


function setBall() {
  ballLeft = ball.offsetLeft;
  ballTop = ball.offsetTop;

  if (p1left > ballLeft) { // Berührt der ball (p1 + breite von p1) von links
    if((ballTop + (balldurchmesser / 2 )) > p1top) { // Ist der Ball innerhalb von oben im bereich von P1 der oberen Kante
      if ((ballTop + (balldurchmesser / 2)) < (p1top + p1hohe)) { // Ist der Ball von oben om bereich von P1 der unteren Kante
        ballLeftSpeed = ballLeftSpeed * -1; // Ball richtung umkehren (Links / Rechts)
        ballTopSpeed += getP1BallConnectPosition();


      }
    }
  }

  if (p2left < (ballLeft + balldurchmesser)) { // Berührt der ball p2 von links
    if((ballTop + (balldurchmesser / 2 )) > p2top) { // Ist der Ball innerhalb von oben im bereich von P2 der oberen Kante
      if ((ballTop + (balldurchmesser / 2)) < (p2top + p2hohe)) { // Ist der Ball von oben om bereich von P2 der unteren Kante
        ballLeftSpeed = ballLeftSpeed * -1;  // Ball richtung umkehren (Links / Rechts)
        ballTopSpeed += getP2BallConnectPosition();
      }
    }
  }


  // der Ball prallt an der linken Wand auf
  if (ballLeft < 0){
    ballLeftSpeed  = ballLeftSpeed * -1;
    p2Punkte += 1;
    // Speiler 2 bekommt einen Punkt
    resuteSetText();
  }


  // der Ball prallt an der rechten Wand auf
  if ((ballLeft + balldurchmesser) > spielfeldbreite){
    ballLeftSpeed  = ballLeftSpeed * -1;
    p1Punkte += 1;
    // Spieler 1 bekommt einen Punkt
    resuteSetText();
  }

// Der Ball prallt oben und unten ab.
  if ((ballTop + balldurchmesser) > spielfeldhohe || ballTop < 0){
    ballTopSpeed  = ballTopSpeed * -1;
  }

  ballLeft += ballLeftSpeed;
  ballTop += ballTopSpeed;
}


function resuteSetText() {
  // p1Punkte + ":" + Punkt;
  resulatat.innerText = p1Punkte + ' : ' + p2Punkte;
}
