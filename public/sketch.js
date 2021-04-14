/*
Deploy to heroku
 */
var socket;
var bcColor="#000000";

var currentMillis;

var allScores="";

var settings={
    start:0,
    tap: 0,
    randomfarbeHex:"#FFFFFF",
    pickedfarbeName:"schwarz",
    socketid:0,
    id:0,
    timer:0,
    range:0,
    dauer:0
};

function setup() {
    createCanvas(windowWidth, windowHeight);
    socket=io.connect("http://192.168.1.107.:3000/"); //anmeldung
    //socket=io.connect("/");
    //socket=io.connect("http://10.147.112.253:3000/");
    //socket.on('mouse', newDrawing);
    socket.on('randomPick', data);
    socket.on('randomBg', randomBg);
    socket.on('startTimer', startTimer);
    socket.on('scores', showScores);

    background(255);
}

function data(data){
    settings = data;
    bcColor=data.randomfarbeHex;

    //console.log(settings);
}

function randomBg(color){
    bcColor=color;
    settings.randomfarbeHex = color;

    console.log(color);
}

function draw() {
    if(settings.start == 0 ){
        socket.emit('canIStart', settings);
    }

    background(bcColor);
    textSize(48);

    text("You chase: " + settings.pickedfarbeName, 50, 200);

    if(settings.start == 1 ){

        if(settings.tap == 0){
            currentMillis = Date.now() - settings.timer;
        }
        //console.log(currentMillis);
        text("Timer"+ msToTime(currentMillis) + "s", 50,50);
        settings.dauer = currentMillis;
    }

    if(allScores!="" ){
        textSize(24);
        text(allScores , 50,400);
    }
}
function startTimer(data){

    settings.start = data.start;
    settings.timer = Date.now();
}
function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function touchStarted(){
    if(settings.start == 1) {
        //console.log ("probe");
       settings.tap = 1; 

    }

// sendefunktion
    socket. emit('fertig', settings);

}

function showScores(scores){
    let msg="The scores are: \n";
    for(let n=0;n<scores.length;n++){
        msg+= "Chasing " +scores[n].chase +" Rank "+(n+1)+ " Time "+msToTime(scores[n].zeit)+"s \n";

    }

    allScores = msg;
}