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
// FAECAL PELLETS
// ============================================================

let pellets = [];

const pelletWidth = 8;
const pelletHeight = 14;

// Pellets sink considerably faster than diatoms
const pelletSinkSpeed = 1.2;

// Bonus food value
const pelletFoodValue = 3;

// Chance per frame that each fish produces a pellet
// 0.002 = approximately 0.2% chance per frame
const pelletProductionChance = 0.002;

// ============================================================
// BASKING SHARK
// ============================================================

let baskingShark = null;

let sharkTimer = 0;

// First shark appears after roughly 30–60 seconds
let nextSharkTime =
    1800 + Math.random() * 1800;

// Warning lasts about 3 seconds
const sharkWarningDuration = 180;

let sharkWarning = false;
let sharkWarningTimer = 0;



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

let food = 5;

let survivalTime = 0;
let bestSurvivalTime = 0;

// Used to calculate real elapsed time
let lastFrameTime = null;

let gameOver = false;

// ============================================================
// LOCAL LEADERBOARD
// ============================================================

const LEADERBOARD_KEY = "copepodLeaderboard";
const LEADERBOARD_SIZE = 5;

// Load saved scores from this browser
let leaderboard = JSON.parse(
    localStorage.getItem(LEADERBOARD_KEY) || "[]"
);

function saveLocalScore(score) {

    leaderboard.push(score);

    // Sort from longest survival time to shortest
    leaderboard.sort((a, b) => b - a);

    // Keep only the top five
    leaderboard = leaderboard.slice(0, LEADERBOARD_SIZE);

    // Save back to the browser
    localStorage.setItem(
        LEADERBOARD_KEY,
        JSON.stringify(leaderboard)
    );
}


// ============================================================
// GAME OVER
// ============================================================

function endGame() {

    // Prevent the same run being recorded more than once
    if (gameOver) return;

    gameOver = true;

    // Save this run to the local leaderboard
    saveLocalScore(survivalTime);

    // Preserve existing best-time behaviour
    if (survivalTime > bestSurvivalTime) {
        bestSurvivalTime = survivalTime;
    }

    // Stop active touch input
    touchActive = false;

    // Show restart button
    restartButton.style.display = "block";
}

// ============================================================
// METABOLISM
// ============================================================

// Normal continuous energy expenditure
const normalMetabolicCost = 0.003;

// Additional energetic cost while swimming
const swimmingMetabolicCost = 0.0015;


// ============================================================
// MARINE HEATWAVE
// ============================================================

let heatwaveActive = false;
let heatwaveTimer = 0;

// First heatwave occurs after roughly 30–70 seconds
let nextHeatwaveTime =
    1800 + Math.random() * 2400;

// Heatwave lasts approximately 10 seconds
const heatwaveDuration = 600;

// Heatwave affects upper 35% of water column
const heatwaveDepth =
    canvas.height * 0.35;

// Additional metabolic cost while inside warm water
const heatwaveMetabolicCost = 0.03;


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
// CREATE FAECAL PELLET
// ============================================================

function spawnPellet(f) {

    const newPellet = {

        // Pellet emerges behind the fish
        x: f.x + f.width,

        y: f.y + f.height / 2,

        width: pelletWidth,
        height: pelletHeight,

        sinkSpeed:
            pelletSinkSpeed *
            (0.8 + Math.random() * 0.4)

    };

    pellets.push(newPellet);

}

// ============================================================
// CREATE BASKING SHARK
// ============================================================

function spawnBaskingShark() {

    const sharkHeight = 120;

    baskingShark = {

        x: canvas.width + 180,

        y:
            Math.random() *
            (canvas.height - sharkHeight),

        width: 220,
        height: sharkHeight,

        speed: 1.4

    };

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
// FAECAL PELLET COLLISION
// ============================================================

function copepodTouchesPellet(p) {

    return (

        copepodX < p.x + p.width &&

        copepodX + copepodWidth > p.x &&

        copepodY < p.y + p.height &&

        copepodY + copepodHeight > p.y

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
// BASKING SHARK COLLISION
// ============================================================

function copepodTouchesShark(s) {

    if (!s) {
        return false;
    }

    return (

        copepodX < s.x + s.width &&

        copepodX + copepodWidth > s.x &&

        copepodY < s.y + s.height &&

        copepodY + copepodHeight > s.y

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

    // Reset energy reserve
    food = 5;

    // High score deliberately remains

    // Reset copepod
    copepodX = 100;
    copepodY = 250;

    // Remove fish
    fish = [];

    fishSpawnTimer = 0;

    // Recreate diatom field
    initialiseDiatoms();

    // Remove Pellets
    pellets = [];

    // Reset Basking Shark
    baskingShark = null;

    // Reset Survival Time
    survivalTime = 0;
    lastFrameTime = null;

sharkTimer = 0;

sharkWarning = false;
sharkWarningTimer = 0;

nextSharkTime =
    1800 + Math.random() * 1800;

    // Reset marine heatwave
    heatwaveActive = false;
    heatwaveTimer = 0;

    nextHeatwaveTime = 
        1800 + Math.random() * 2400;


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

function gameLoop(timestamp) {

// ----------------------------------------------------
// FRAME TIMING
// ----------------------------------------------------
 
if (lastFrameTime === null) {
    lastFrameTime = timestamp;
}
 
const deltaTime = (timestamp - lastFrameTime) / 1000;
 
lastFrameTime = timestamp;


    // ========================================================
    // UPDATE GAME
    // ========================================================

    if (!gameOver) {

        // Is the copepod actively swimming?
        let isSwimming = false;


        // ----------------------------------------------------
        // KEYBOARD MOVEMENT
        // ----------------------------------------------------

        if (keys["ArrowUp"]) {

            copepodY -= verticalSpeed;
            isSwimming = true;

        }

        if (keys["ArrowDown"]) {

            copepodY += verticalSpeed;
            isSwimming = true;

        }

        if (keys["ArrowLeft"]) {

            copepodX -= horizontalSpeed;
            isSwimming = true;

        }

        if (keys["ArrowRight"]) {

            copepodX += horizontalSpeed;
            isSwimming = true;

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

                isSwimming = true;

            }

        }

// ----------------------------------------------------
// SURVIVAL TIMER
// ----------------------------------------------------

        survivalTime += deltaTime;
 
if (survivalTime > bestSurvivalTime) {
    bestSurvivalTime = survivalTime;
}

// ----------------------------------------------------
// MARINE HEATWAVE SYSTEM
// ----------------------------------------------------

if (!heatwaveActive) {

    heatwaveTimer++;

    // Start heatwave
    if (heatwaveTimer >= nextHeatwaveTime) {

        heatwaveActive = true;
        heatwaveTimer = 0;

    }

} else {

    heatwaveTimer++;

    // End heatwave
    if (heatwaveTimer >= heatwaveDuration) {

        heatwaveActive = false;
        heatwaveTimer = 0;

        // Next heatwave in roughly 30–70 seconds
        nextHeatwaveTime =
            1800 + Math.random() * 2400;

    }

}


// ----------------------------------------------------
// METABOLIC COST
// ----------------------------------------------------

// Normal metabolism
food -= normalMetabolicCost;

// Additional metabolic cost of swimming
if (isSwimming) {

    food -= swimmingMetabolicCost;

}

// Extra metabolic cost if the copepod is inside
// the warm surface layer during a heatwave
if (
    heatwaveActive &&
    copepodY < heatwaveDepth
) {

    food -= heatwaveMetabolicCost;

}


// Starvation
if (food <= 0) {

    food = 0;

    endGame();

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
// MOVE FAECAL PELLETS
// ----------------------------------------------------

for (
    let i = 0;
    i < pellets.length;
    i++
) {

    const p = pellets[i];


    // Pellets sink rapidly
    p.y += p.sinkSpeed;


    // Small background drift
    p.x -= diatomDriftSpeed;


    // Currents transport pellets laterally
    if (
        objectInCurrent(
            p.y,
            p.height
        )
    ) {

        p.x += currentStrength;

    }

}


// ----------------------------------------------------
// EAT FAECAL PELLETS
// ----------------------------------------------------

for (
    let i = pellets.length - 1;
    i >= 0;
    i--
) {

    if (
        copepodTouchesPellet(
            pellets[i]
        )
    ) {

        food += pelletFoodValue;


        pellets.splice(i, 1);

    }

}


// ----------------------------------------------------
// REMOVE OLD FAECAL PELLETS
// ----------------------------------------------------

pellets = pellets.filter(
    function(p) {

        return (

            p.y <
            canvas.height + 20 &&

            p.x > -50 &&

            p.x <
            canvas.width + 50

        );

    }
);

        // ----------------------------------------------------
// BASKING SHARK EVENT
// ----------------------------------------------------

if (!baskingShark && !sharkWarning) {

    sharkTimer++;

}


// Start warning
if (
    !baskingShark &&
    !sharkWarning &&
    sharkTimer >= nextSharkTime
) {

    sharkWarning = true;

    sharkWarningTimer = 0;

}


// Count down warning
if (sharkWarning) {

    sharkWarningTimer++;


    if (
        sharkWarningTimer >=
        sharkWarningDuration
    ) {

        sharkWarning = false;

        spawnBaskingShark();

    }

}


// Move shark
if (baskingShark) {

    baskingShark.x -=
        baskingShark.speed;


    // Check collision
    if (
        copepodTouchesShark(
            baskingShark
        )
    ) {

        gameOver = true;

        touchActive = false;

        restartButton.style.display =
            "block";

    }


    // Shark has left screen
    if (
        baskingShark.x <
        -baskingShark.width - 50
    ) {

        baskingShark = null;

        sharkTimer = 0;


        // Next event in roughly 30–60 seconds
        nextSharkTime =
            1800 +
            Math.random() * 1800;

    }

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

    const f = fish[i];

    // Move fish
    f.x -= f.speed;


    // Occasionally produce a faecal pellet
    if (
        Math.random() <
        pelletProductionChance
    ) {

        spawnPellet(f);

    }

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
// DRAW MARINE HEATWAVE
// --------------------------------------------------------

if (heatwaveActive) {

    // Warm surface layer
    ctx.fillStyle =
        "rgba(255, 90, 120, 0.28)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        heatwaveDepth
    );


    // Label
    ctx.fillStyle = "white";

    ctx.font = "bold 18px monospace";

    ctx.textAlign = "right";

    ctx.fillText(
        "MARINE HEATWAVE",
        canvas.width - 20,
        30
    );

    ctx.textAlign = "left";

}



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
// BASKING SHARK WARNING
// --------------------------------------------------------

if (sharkWarning) {

    ctx.fillStyle = "#ffcc66";

    ctx.font = "bold 26px monospace";

    ctx.textAlign = "center";


    ctx.fillText(
        "⚠ BASKING SHARK APPROACHING ⚠",
        canvas.width / 2,
        100
    );


    ctx.textAlign = "left";

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
// DRAW FAECAL PELLETS
// --------------------------------------------------------

for (
    let i = 0;
    i < pellets.length;
    i++
) {

    const p = pellets[i];


    // Pellet body
    ctx.fillStyle = "#8b5a2b";

    ctx.fillRect(
        p.x,
        p.y,
        p.width,
        p.height
    );


    // Small lighter centre to make it visible
    ctx.fillStyle = "#c18b52";

    ctx.fillRect(
        p.x + 2,
        p.y + 3,
        p.width - 4,
        p.height - 6
    );

}

    // --------------------------------------------------------
// DRAW BASKING SHARK
// --------------------------------------------------------

if (baskingShark) {

    const s = baskingShark;


    // Main body
    ctx.fillStyle = "#657b83";

    ctx.fillRect(
        s.x + 40,
        s.y + 30,
        150,
        60
    );


    // Head
    ctx.fillStyle = "#708890";

    ctx.fillRect(
        s.x,
        s.y + 35,
        50,
        50
    );


    // Huge open mouth
    ctx.fillStyle = "#17252b";

    ctx.fillRect(
        s.x - 5,
        s.y + 45,
        25,
        30
    );


    // Tail base
    ctx.fillStyle = "#657b83";

    ctx.fillRect(
        s.x + 190,
        s.y + 45,
        30,
        30
    );


    // Upper tail
    ctx.fillRect(
        s.x + 215,
        s.y + 10,
        15,
        50
    );


    // Lower tail
    ctx.fillRect(
        s.x + 215,
        s.y + 70,
        15,
        45
    );


    // Dorsal fin
    ctx.beginPath();

    ctx.moveTo(
        s.x + 120,
        s.y + 30
    );

    ctx.lineTo(
        s.x + 145,
        s.y
    );

    ctx.lineTo(
        s.x + 155,
        s.y + 30
    );

    ctx.fill();


    // Eye
    ctx.fillStyle = "black";

    ctx.fillRect(
        s.x + 25,
        s.y + 40,
        5,
        5
    );

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
// STATUS DISPLAY
// --------------------------------------------------------

ctx.fillStyle = "white";

ctx.font = "24px monospace";


// Energy - whole numbers only
ctx.fillText(
    "ENERGY: " + Math.floor(food),
    20,
    35
);


// Current survival time
ctx.fillText(
    "TIME: " + Math.floor(survivalTime) + "s",
    20,
    65
);


// Best survival time
ctx.fillText(
    "BEST: " + Math.floor(bestSurvivalTime) + "s",
    20,
    95
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
            "YOU ARE DEAD",
            canvas.width / 2,
            canvas.height / 2
        );


        ctx.font =
            "20px monospace";


        ctx.fillText(
    "Energy remaining: " + Math.floor(food),
    canvas.width / 2,
    canvas.height / 2 + 40
);


ctx.fillText(
    "Survived: " + Math.floor(survivalTime) + " seconds",
    canvas.width / 2,
    canvas.height / 2 + 70
);


ctx.fillText(
    "Best: " + Math.floor(bestSurvivalTime) + " seconds",
    canvas.width / 2,
    canvas.height / 2 + 100
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
 
requestAnimationFrame(gameLoop);
