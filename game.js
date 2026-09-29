// ============================================================
// SETUP
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const restartButton = document.getElementById("restartButton");


// ============================================================
// COPEPOD
// ============================================================

let copepodX = 100;
let copepodY = 250;

const copepodWidth = 20;
const copepodHeight = 10;

// Copepods have much greater control over vertical movement
// than horizontal movement.
const verticalSpeed = 4;
const horizontalSpeed = 1.5;


// ============================================================
// DIATOM
// ============================================================

let diatomX = 700;
let diatomY = 200;

const diatomWidth = 20;
const diatomHeight = 10;

const diatomSpeed = 1.25;


// ============================================================
// FISH
// ============================================================

let fish = [];

let fishSpawnTimer = 0;

const fishSpawnInterval = 180;


// ============================================================
// CURRENTS
// ============================================================

let currentActive = false;

let currentY = 0;
const currentHeight = 100;

let currentStrength = 0;

let currentTimer = 0;

// Approximately 10 seconds between current events
const currentInterval = 600;

// Current lasts approximately 5 seconds
const currentDuration = 300;


// ============================================================
// GAME STATE
// ============================================================

let food = 0;
let highScore = 0;

let gameOver = false;


// ============================================================
// KEYBOARD CONTROLS
// ============================================================

const keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.key] = true;

});

document.addEventListener("keyup", function(event) {

    keys[event.key] = false;

});


// ============================================================
// TOUCH CONTROLS
// ============================================================

let touchActive = false;

let touchX = 0;
let touchY = 0;


function getTouchPosition(event) {

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const touch = event.touches[0];

    touchX = (touch.clientX - rect.left) * scaleX;
    touchY = (touch.clientY - rect.top) * scaleY;

}


canvas.addEventListener("touchstart", function(event) {

    event.preventDefault();

    touchActive = true;

    getTouchPosition(event);

});


canvas.addEventListener("touchmove", function(event) {

    event.preventDefault();

    getTouchPosition(event);

});


canvas.addEventListener("touchend", function(event) {

    event.preventDefault();

    touchActive = false;

});


// ============================================================
// RESET DIATOM
// ============================================================

function resetDiatom() {

    diatomX = canvas.width + 20;

    diatomY =
        Math.random() *
        (canvas.height - diatomHeight);

}


// ============================================================
// CREATE FISH
// ============================================================

function spawnFish() {

    const newFish = {

        x: canvas.width + 50,

        y:
            Math.random() *
            (canvas.height - 50),

        width: 60,
        height: 30,

        speed:
            2 + Math.random() * 2

    };

    fish.push(newFish);

}


// ============================================================
// DIATOM COLLISION
// ============================================================

function copepodTouchesDiatom() {

    return (

        copepodX < diatomX + diatomWidth &&

        copepodX + copepodWidth > diatomX &&

        copepodY < diatomY + diatomHeight &&

        copepodY + copepodHeight > diatomY

    );

}


// ============================================================
// FISH COLLISION
// ============================================================

function copepodTouchesFish(f) {

    return (

        copepodX < f.x + f.width &&

        copepodX + copepodWidth > f.x &&

        copepodY < f.y + f.height &&

        copepodY + copepodHeight > f.y

    );

}


// ============================================================
// RESTART GAME
// ============================================================

function restartGame() {

    // Reset current score
    food = 0;

    // High score deliberately NOT reset

    // Reset copepod
    copepodX = 100;
    copepodY = 250;

    // Remove fish
    fish = [];

    // Reset fish spawning
    fishSpawnTimer = 0;

    // Reset diatom
    resetDiatom();

    // Reset current
    currentActive = false;
    currentTimer = 0;
    currentStrength = 0;

    // Reset touch
    touchActive = false;

    // Restart game
    gameOver = false;

    // Hide restart button
    restartButton.style.display = "none";

}


restartButton.addEventListener(
    "click",
    restartGame
);


// ============================================================
// GAME LOOP
// ============================================================

function gameLoop() {


    // ========================================================
    // UPDATE GAME
    // ========================================================

    if (!gameOver) {


        // ----------------------------------------------------
        // KEYBOARD MOVEMENT
        // ----------------------------------------------------

        if (keys["ArrowUp"]) {

            copepodY -= verticalSpeed;

        }

        if (keys["ArrowDown"]) {

            copepodY += verticalSpeed;

        }

        if (keys["ArrowLeft"]) {

            copepodX -= horizontalSpeed;

        }

        if (keys["ArrowRight"]) {

            copepodX += horizontalSpeed;

        }


        // ----------------------------------------------------
        // TOUCH MOVEMENT
        // ----------------------------------------------------

        if (touchActive) {

            const copepodCentreX =
                copepodX + copepodWidth / 2;

            const copepodCentreY =
                copepodY + copepodHeight / 2;


            const dx =
                touchX - copepodCentreX;

            const dy =
                touchY - copepodCentreY;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distance > 5) {

                copepodX +=
                    (dx / distance) * horizontalSpeed;

                copepodY +=
                    (dy / distance) * verticalSpeed;

            }

        }


        // ----------------------------------------------------
        // CURRENT SYSTEM
        // ----------------------------------------------------

        currentTimer++;


        // Start a new current
        if (
            !currentActive &&
            currentTimer >= currentInterval
        ) {

            currentActive = true;

            currentTimer = 0;


            // Random depth
            currentY =
                Math.random() *
                (canvas.height - currentHeight);


            // Random direction
            if (Math.random() < 0.5) {

                currentStrength = -2;

            } else {

                currentStrength = 2;

            }

        }


        // Push copepod if it is inside the current
        if (
            currentActive &&

            copepodY + copepodHeight > currentY &&

            copepodY < currentY + currentHeight
        ) {

            copepodX += currentStrength;

        }


        // Stop current after its duration
        if (
            currentActive &&
            currentTimer >= currentDuration
        ) {

            currentActive = false;

            currentTimer = 0;

            currentStrength = 0;

        }


        // ----------------------------------------------------
        // KEEP COPEPOD ON SCREEN
        // ----------------------------------------------------

        if (copepodX < 0) {

            copepodX = 0;

        }


        if (
            copepodX >
            canvas.width - copepodWidth
        ) {

            copepodX =
                canvas.width - copepodWidth;

        }


        if (copepodY < 0) {

            copepodY = 0;

        }


        if (
            copepodY >
            canvas.height - copepodHeight
        ) {

            copepodY =
                canvas.height - copepodHeight;

        }


        // ----------------------------------------------------
        // MOVE DIATOM
        // ----------------------------------------------------

        diatomX -= diatomSpeed;


        if (
            diatomX <
            -diatomWidth
        ) {

            resetDiatom();

        }


        // ----------------------------------------------------
        // EAT DIATOM
        // ----------------------------------------------------

        if (copepodTouchesDiatom()) {

            food += 1;


            // Update high score
            if (food > highScore) {

                highScore = food;

            }


            resetDiatom();

        }


        // ----------------------------------------------------
        // SPAWN FISH
        // ----------------------------------------------------

        fishSpawnTimer++;


        if (
            fishSpawnTimer >=
            fishSpawnInterval
        ) {

            spawnFish();

            fishSpawnTimer = 0;

        }


        // ----------------------------------------------------
        // MOVE FISH
        // ----------------------------------------------------

        for (
            let i = 0;
            i < fish.length;
            i++
        ) {

            fish[i].x -=
                fish[i].speed;

        }


        // ----------------------------------------------------
        // FISH COLLISION
        // ----------------------------------------------------

        for (
            let i = 0;
            i < fish.length;
            i++
        ) {

            if (
                copepodTouchesFish(
                    fish[i]
                )
            ) {

                gameOver = true;

                touchActive = false;

                restartButton.style.display =
                    "block";

            }

        }


        // ----------------------------------------------------
        // REMOVE OLD FISH
        // ----------------------------------------------------

        fish = fish.filter(
            function(f) {

                return (
                    f.x >
                    -f.width
                );

            }
        );

    }


    // ========================================================
    // DRAW GAME
    // ========================================================


    // --------------------------------------------------------
    // OCEAN
    // --------------------------------------------------------

    ctx.fillStyle = "#0f5082";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // --------------------------------------------------------
    // DRAW CURRENT
    // --------------------------------------------------------

    if (currentActive) {

        // Slightly lighter band of water
        ctx.fillStyle =
            "rgba(150, 220, 255, 0.12)";

        ctx.fillRect(
            0,
            currentY,
            canvas.width,
            currentHeight
        );


        // Current arrows
        ctx.fillStyle =
            "rgba(255, 255, 255, 0.4)";

        ctx.font =
            "20px monospace";


        const arrow =
            currentStrength > 0
                ? ">>>"
                : "<<<";


        for (
            let x = 40;
            x < canvas.width;
            x += 100
        ) {

            ctx.fillText(
                arrow,
                x,
                currentY + currentHeight / 2
            );

        }

    }


    // --------------------------------------------------------
    // DIATOM
    // --------------------------------------------------------

    ctx.fillStyle = "#9acd32";

    ctx.beginPath();

    ctx.ellipse(
        diatomX + diatomWidth / 2,
        diatomY + diatomHeight / 2,

        diatomWidth / 2,
        diatomHeight / 2,

        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // --------------------------------------------------------
    // FISH
    // --------------------------------------------------------

    for (
        let i = 0;
        i < fish.length;
        i++
    ) {

        const f = fish[i];


        // Body
        ctx.fillStyle = "#b7c9d3";

        ctx.fillRect(
            f.x,
            f.y + 5,
            45,
            20
        );


        // Nose
        ctx.fillRect(
            f.x - 5,
            f.y + 10,
            5,
            10
        );


        // Tail
        ctx.fillStyle = "#8fa7b3";

        ctx.fillRect(
            f.x + 45,
            f.y,
            10,
            30
        );

        ctx.fillRect(
            f.x + 55,
            f.y + 5,
            5,
            20
        );


        // Eye
        ctx.fillStyle = "black";

        ctx.fillRect(
            f.x + 5,
            f.y + 9,
            4,
            4
        );

    }


    // --------------------------------------------------------
    // COPEPOD BODY
    // --------------------------------------------------------

    ctx.fillStyle = "#f0b450";


    // Main body
    ctx.fillRect(
        copepodX + 4,
        copepodY,
        16,
        10
    );


    // Tapered rear
    ctx.fillRect(
        copepodX,
        copepodY + 2,
        6,
        6
    );


    // Tail
    ctx.fillRect(
        copepodX - 5,
        copepodY + 3,
        5,
        2
    );


    // --------------------------------------------------------
    // COPEPOD ANTENNAE
    // --------------------------------------------------------

    ctx.strokeStyle = "#f0b450";

    ctx.lineWidth = 2;


    // Upper antenna
    ctx.beginPath();

    ctx.moveTo(
        copepodX + 18,
        copepodY + 2
    );

    ctx.lineTo(
        copepodX + 30,
        copepodY - 6
    );

    ctx.lineTo(
        copepodX + 42,
        copepodY - 10
    );

    ctx.stroke();


    // Lower antenna
    ctx.beginPath();

    ctx.moveTo(
        copepodX + 18,
        copepodY + 8
    );

    ctx.lineTo(
        copepodX + 30,
        copepodY + 16
    );

    ctx.lineTo(
        copepodX + 42,
        copepodY + 20
    );

    ctx.stroke();


    // --------------------------------------------------------
    // COPEPOD TAIL RAMI
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.moveTo(
        copepodX - 4,
        copepodY + 4
    );

    ctx.lineTo(
        copepodX - 10,
        copepodY
    );

    ctx.moveTo(
        copepodX - 4,
        copepodY + 6
    );

    ctx.lineTo(
        copepodX - 10,
        copepodY + 10
    );

    ctx.stroke();


    // --------------------------------------------------------
    // SCORE
    // --------------------------------------------------------

    ctx.fillStyle = "white";

    ctx.font =
        "24px monospace";


    ctx.fillText(
        "FOOD: " + food,
        20,
        35
    );


    ctx.fillText(
        "HIGH: " + highScore,
        20,
        65
    );


    // --------------------------------------------------------
    // GAME OVER SCREEN
    // --------------------------------------------------------

    if (gameOver) {

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.6)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "white";

        ctx.font =
            "40px monospace";

        ctx.textAlign =
            "center";


        ctx.fillText(
            "YOU WERE EATEN",
            canvas.width / 2,
            canvas.height / 2
        );


        ctx.font =
            "20px monospace";


        ctx.fillText(
            "Food collected: " + food,
            canvas.width / 2,
            canvas.height / 2 + 40
        );


        ctx.fillText(
            "High score: " + highScore,
            canvas.width / 2,
            canvas.height / 2 + 70
        );


        ctx.textAlign =
            "left";

    }


    // --------------------------------------------------------
    // NEXT FRAME
    // --------------------------------------------------------

    requestAnimationFrame(
        gameLoop
    );

}


// ============================================================
// START GAME
// ============================================================

gameLoop();
