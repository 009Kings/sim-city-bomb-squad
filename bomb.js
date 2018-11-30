var time, interval;
var wireImages = document.querySelectorAll("#box img");

document.addEventListener("DOMContentLoaded", function() {
    //add event listener to the start/reset button
    document.getElementById("reset").addEventListener("click", start);
});


function start () {
    // Set up the wires
    addWireListeners();

    // Change the message content
    document.querySelector(".message").textContent = "Hurry! Save the City!";

    // Change button text
    this.textContent = "Reset Game";

    // Start siren
    document.getElementById("siren").play();

    // Set inital time
    time = 30;
    document.getElementById("timer").textContent = time;
    document.getElementById("timer").style.color = "chartreuse";

    //clear any previously starteed interval
    clearInterval(interval);

    // Start timer !!CHANGE BACK TO 1000
    interval = setInterval(tick, 1000);

    // reset the background
    document.querySelector("body").className = "unexploded";

    document.getElementById("success").pause();

}

function tick () {
    console.log("tick");
    time -=1;
    document.getElementById("timer").textContent = time;
    if (time === 5) {
        document.getElementById("timer").style.color = "red";
    } else if (time === 10) {
        document.getElementById("timer").style.color = "orange";
    }
    if (time <= 0) {
        // Call fail function
        loseTheGame();
    }
}
function stopGame (message) {
    clearInterval(interval);
    document.getElementById("siren").pause();
    document.querySelector(".message").textContent = message;
}



function loseTheGame () {
    stopGame("You failed the city");
    // Show explode background (the array class is just to show how you'd get sth with more than one tag ie li);
    document.querySelector("body").className = "exploded";
    document.querySelector(".message").style.color = "#941b1b";

    // Run explosion sound
    document.getElementById("explode").play();

    // Ghosts can't hold scissors === false || too discouraged to continue cutting
    removeWireListeners();
}

function winTheGame () {
    stopGame("You saved us!");
    // Play Cheering
    var success = document.getElementById("success");
    success.currentTime = 0;
    document.getElementById("cheer").play();
    
    document.getElementById("cheer").addEventListener("ended", function () {
        success.play();
    })
    // setTimeout(function () {
    //     document.getElementById("success").play();
    // }, 1800);
    // Stop timer
}

function addWireListeners () {
    for (i = 0; i < wireImages.length; i++) {
        wireImages[i].src = './img/uncut-' + wireImages[i].id + "-wire.png";
        wireImages[i].setAttribute("data-cut", (Math.random() > 0.5).toString());
        console.log(wireImages[i]);
        wireImages[i].addEventListener("click", cutWire);
    }

    // Check and make sure at least one wire is true and one wire is false
    var numTrue = checkTrueWires();
    if (numTrue <= 0 || numTrue >=5) {
        start();
    }
}

function removeWireListeners () {
    for (i = 0; i < wireImages.length; i++) {
        wireImages[i].removeEventListener("click", cutWire);
    }
}

function cutWire () {
    console.log("cut", this.id);
    // Changing the image to the cut image
    this.src = "./img/cut-" + this.id + "-wire.png";
    // Makes it so I can't click it anymore
    this.removeEventListener("click", cutWire);
    // Check if I was supposed to cut this wire
    if (this.getAttribute("data-cut") === "true") {
        //Yes, I was supposed to cut this, yay
        document.getElementById("buzz").play();
        // set data-cut attribute to false
        this.setAttribute("data-cut", "false");
        // Check if I won
        if (checkTrueWires() <= 0) {
            //I won!
            winTheGame();
        }
    } else {
        // Nope
        loseTheGame();
    }
}

function checkTrueWires () {
    var trueCounter = 0;
    for (let i = 0; i < wireImages.length; i++) {
        if(wireImages[i].getAttribute("data-cut") === "true") {
            trueCounter++;
        }
    }
    return trueCounter;
}