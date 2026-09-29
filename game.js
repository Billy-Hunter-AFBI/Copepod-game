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

// Strong vertical swimming, weak horizontal swimming
const verticalSpeed = 4;
const horizontalSpeed = 1.5;


// ============================================================
// DIATOMS
// ============================================================

let diatoms = [];

const diatomWidth = 20;
const diatomHeight = 10;

// General movement through the water
const diatomDriftSpeed = 0.5;

// Slow gravitational sinking
const diatomSinkSpeed = 0.18;

// Number of diatoms normally present
const targetDiatomCount = 8;


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
// CREATE DIATOM
// ============================================================

function spawnDiatom(randomX = false) {

    const newDiatom = {

        // At the beginning of the game, distribute diatoms
        // across the screen. New diatoms subsequently enter
        // from the right-hand side.
        x: randomX
            ? Math.random() * canvas.width
            : canvas.width + Math.random() * 100,

        // Diatoms originate in the upper 25% of the water
        y: Math.random() * (canvas.height * 0.25),

        width: diatomWidth,
        height: diatomHeight,

        // Slight variation in sinking rate
        sinkSpeed:
            diatomSinkSpeed *
            (0.7 + Math.random() * 0.6)

    };

    diatoms.push(newDiatom);

}


// ============================================================
// INITIALISE DIATOMS
// ============================================================

function initialiseDiatoms() {

    diatoms = [];

    for (
        let i = 0;
        i < targetDiatomCount;
        i++
    ) {

        spawnDiatom(true);

    }

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

function copepodTouchesDiatom(d) {

    return (

        copepodX < d.x + d.width &&

        copepodX + copepodWidth > d.x &&

        copepodY < d.y + d.height &&

        copepodY + copepodHeight > d.y

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
// CHECK WHETHER AN OBJECT IS IN THE CURRENT
// ============================================================

function objectInCurrent(y, height) {

    return (

        currentActive &&

        y + height > currentY &&

        y < currentY + currentHeight

    );

}


// ============================================================
// RESTART GAME
// ============================================================

function restartGame() {

    // Reset current score
    food = 0;

    // High score deliberately remains

    // Reset copepod
    copepodX = 100;
    copepodY = 250;

    // Remove fish
    fish = [];

    fishSpawnTimer = 0;

    // Recreate diatom field
    initialiseDiatoms();

    // Reset current
    currentActive = false;
    currentTimer = 0;
    currentStrength = 0;

    // Reset controls
    touchActive = false;

    // Restart
    gameOver = false;

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
                    (dx / distance) *
                    horizontalSpeed;

                copepodY +=
                    (dy / distance) *
                    verticalSpeed;

            }

        }


        // ----------------------------------------------------
        // CURRENT SYSTEM
        // ----------------------------------------------------

        currentTimer++;


        // Start a current
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


        // ----------------------------------------------------
        // CURRENT AFFECTS COPEPOD
        // ----------------------------------------------------

        if (
            objectInCurrent(
                copepodY,
                copepodHeight
            )
        ) {

            copepodX += currentStrength;

        }


        // ----------------------------------------------------
        // STOP CURRENT
        // ----------------------------------------------------

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
        // MOVE DIATOMS
        // ----------------------------------------------------

        for (
            let i = 0;
            i < diatoms.length;
            i++
        ) {

            const d = diatoms[i];


            // Background horizontal drift
            d.x -= diatomDriftSpeed;


            // Slow sinking
            d.y += d.sinkSpeed;


            // If inside the active current,
            // advect the diatom with the water
            if (
                objectInCurrent(
                    d.y,
                    d.height
                )
            ) {

                d.x += currentStrength;

            }

        }


        // ----------------------------------------------------
        // EAT DIATOMS
        // ----------------------------------------------------

        for (
            let i = diatoms.length - 1;
            i >= 0;
            i--
        ) {

            if (
                copepodTouchesDiatom(
                    diatoms[i]
                )
            ) {

                food += 1;


                if (food > highScore) {

                    highScore = food;

                }


                // Remove eaten diatom
                diatoms.splice(i, 1);

            }

        }


        // ----------------------------------------------------
        // REMOVE DIATOMS THAT LEAVE THE WORLD
        // ----------------------------------------------------

        diatoms = diatoms.filter(
            function(d) {

                return (

                    d.x > -100 &&
                    d.x < canvas.width + 150 &&
                    d.y < canvas.height + 20

                );

            }
        );


        // ----------------------------------------------------
        // REPLACE LOST / EATEN DIATOMS
        // ----------------------------------------------------

        while (
            diatoms.length <
            targetDiatomCount
        ) {

            spawnDiatom(false);

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

        ctx.fillStyle =
            "rgba(150, 220, 255, 0.12)";

        ctx.fillRect(
            0,
            currentY,
            canvas.width,
            currentHeight
        );


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
                currentY +
                currentHeight / 2
            );

        }

    }


    // --------------------------------------------------------
    // DRAW DIATOMS
    // --------------------------------------------------------

    for (
        let i = 0;
        i < diatoms.length;
        i++
    ) {

        const d = diatoms[i];


        ctx.fillStyle = "#9acd32";

        ctx.beginPath();

        ctx.ellipse(
            d.x + d.width / 2,
            d.y + d.height / 2,

            d.width / 2,
            d.height / 2,

            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    // --------------------------------------------------------
    // DRAW FISH
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
    // DRAW COPEPOD
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
    // ANTENNAE
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
    // TAIL RAMI
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
    // GAME OVER
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
// INITIALISE GAME
// ============================================================

initialiseDiatoms();

gameLoop();
