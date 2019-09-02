var mainPlayer;
var harang = [];
var score;

function removeOverlay() {
    document.getElementById("game-over").style.display = "none";
    myGameArea.stop();
myGameArea.clear();

harang = [];

startGame();
}

if(window.innerWidth > 360) {
var playerWidth = window.innerWidth/10;
var playerHeight = window.innerHeight/20;
var playerPosX = window.innerWidth-(window.innerWidth*.5);
var playerPosY = window.innerHeight-(window.innerHeight*.1);

var harangWidth = window.innerWidth/10;
var harangHeight = window.innerHeight/20;

var screenSizeWidth = window.innerWidth;
var screenSizeHeight = window.innerHeight;
} else {
var playerWidth = screen.width/6;
var playerHeight = screen.height/30;
var playerPosX = screen.width*.43;
var playerPosY = screen.height/1.35;

var harangWidth = screen.width/6;
var harangHeight = screen.height/30;

var screenSizeWidth = screen.width;
var screenSizeHeight = screen.height;
}

function startGame() {
    mainPlayer = new component(playerWidth, playerHeight, "#fff", playerPosX, playerPosY);
    score = new component("2em", "Arial", "#fff", screenSizeWidth/50, screenSizeHeight/20, "text");
    myGameArea.start();
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.getElementById("wrapper").insertBefore(this.canvas, document.getElementById('main-menu'));
    document.getElementById("main-menu").style.display = 'none';
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 1);
    window.addEventListener('touchmove', function (e) {
      myGameArea.x = e.touches[0].screenX;
    })
    },
    stop : function() {
    clearInterval(this.interval);
            
  },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function component(width, height, color, x, y, type) {
    var blur = 15;
var width1 = width + blur * 2;
this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;   
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowColor = "violet";
        ctx.shadowBlur = blur;
    }
    }
    this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.hitSide();
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
        crash = false;
        }
        return crash;
    }
    this.hitSide = function() {
    var gilid = myGameArea.canvas.width - this.width;
    var gilidBase = 0;
    if (this.x > gilid) {
      this.x = gilid;
    } else if(this.x < gilidBase) {
        this.x = gilidBase;
    }
  }
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < harang.length; i += 1) {
        if (mainPlayer.crashWith(harang[i])) {
            myGameArea.stop();
            gameOver();
            return;
        } 
    }
    myGameArea.clear();
    /*touch controls*/
    if (myGameArea.x) {
    mainPlayer.x = myGameArea.x;
  }
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        var widthH = myGameArea.canvas.width;
        harang.push(new component(harangWidth, harangHeight, "#fff", Math.random()*widthH+1, -70)); //continue here maybe -70 should be random ?
    }
    
    for (i = 0; i < harang.length; i ++) {
        harang[i].y += myGameArea.frameNo/1000;
        harang[i].update();
    }
    
    score.text = "SCORE: " + myGameArea.frameNo;
    score.update();
    mainPlayer.newPos();    
    mainPlayer.update();
}

function moveleft() {
  mainPlayer.speedX = -8;
}

function moveright() {
  mainPlayer.speedX = 8;
}

function stopMove() {
  mainPlayer.speedX = 0;
  mainPlayer.speedY = 0;
}

document.onkeydown = checkKeyDown;
document.onkeyup = checkKeyUp;

function checkKeyDown(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37' || e.keyCode == '65') {
       moveleft();
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
       moveright();
    }
    else if (e.keyCode == '32' || e.keyCode == '13') {
    if(document.getElementById("game-over").style.display==="block") {
        document.getElementById("tryAgain").click();
    }
}

}

function checkKeyUp(e) {

e = e || window.event;

if (e.keyCode == '38') {
    // up arrow
}
else if (e.keyCode == '40') {
    // down arrow
}
else if (e.keyCode == '37' || e.keyCode == '65') {
   stopMove();
}
else if (e.keyCode == '39' || e.keyCode == '68') {
    stopMove();
}

}

function gameOver() {
    var savedScore = myGameArea.frameNo;
    document.getElementById("savedMainScore").innerHTML = savedScore;
    var highscore = localStorage.getItem("highscore");

if(highscore !== null){
    if (savedScore > highscore) {
        localStorage.setItem("highscore", savedScore);  
        document.getElementById("savedHighScore").innerHTML=savedScore; 
    } else {
        document.getElementById("savedHighScore").innerHTML=highscore;
    }
}
else{
    localStorage.setItem("highscore", savedScore);
}

document.getElementById("game-over").style.display="block";
}