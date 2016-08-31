var io = require('socket.io-client');
var s = io.connect('http://localhost:8080');

s.on('connect', function() {
  console.log("Connected to the gameserver");
});

var theirController = "";

function writeMenuEmpty() {
  s.emit('update', {status:"menu", data:[]});
}


function writePlayerStuff() {
  s.emit("update", {status:"menu",data:[{robot:4,color:2,controller:'1',online:false}]});
}

s.on('connect', function(data) {
  console.log("CONNECT");
});

function writeGameDat(x, y, jumping, killedBy, bouncedOn, direction, other) {
    s.emit("update",{status:"game","data":[{x:x ,y:y,velocityDown:0,velocityUp:0,dead:0,jumping:jumping,killedBy:killedBy,bouncedOn:bouncedOn,direction:direction}, other]});
}

var lastMilli = new Date().getTime();
var lastY = -1;
var minDiff = 100;
var maxDiff = 500;

s.on('update', function(data) {
  console.log(data);
  console.log(data.status);
  if(data.status == "menu") {
    if(data.data.length == 2) {
      theirController = data.data[1].controller;
    }
    writePlayerStuff();
  } else if(data.status == "game") {
    if(data.data === null) {
      return;
    }
    if(data.data.length != 2) {
      return;
    }
    if(data.data[1].dead == 40) {
      return;
    }
    if(lastY == -1) {
      lastY = data.data[1].y - 200;
    }
    y = lastY;
    var diff = data.data[1].y - y;
    if(Math.random() > 0.5 && diff > minDiff) {
      y += 1;
    } else if(Math.random() > 0.5 && diff < maxDiff) {
      y -= 1;
    }
    if(diff < minDiff) {
      y = data.data[1].y - minDiff;
    }
    if(diff > maxDiff) {
      y = data.data[1].y - maxDiff;
    }
    lastY = y;
    if((new Date().getTime() - lastMilli) > (1 * 1000)) {
      if(Math.random() < 0.3) {
        console.log("Lucky!");
        data.data[1].killedBy = 0;
      }
      lastMilli = new Date().getTime();
    }
    writeGameDat(data.data[1].x, y - 100, true, null, null, 1, data.data[1]);
  }
});

setInterval(function() {
}, 50);
