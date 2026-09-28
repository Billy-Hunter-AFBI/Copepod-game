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

const speed = 4; 


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
const fishSpawnInterval = 180;   // frames: ~3 seconds at 60 fps

let gameOver = false;



// ============================================================ 
// SCORE 
// ============================================================ 

let food = 0; 


// ============================================================ 
// KEYBOARD 
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


// Convert screen position to canvas position 
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
// CREATE A NEW DIATOM 
// ============================================================ 

function resetDiatom() { 

    // Put it just beyond the right-hand edge 
    diatomX = canvas.width + 20; 

    // Give it a random vertical position 
    diatomY = Math.random() * (canvas.height - diatomHeight); 
} 

// ============================================================
// CREATE FISH
// ============================================================

function spawnFish() {

    const newFish = {
        x: canvas.width + 50,
        y: Math.random() * (canvas.height - 50),

        width: 60,
        height: 30,

        speed: 2 + Math.random() * 2
    };

    fish.push(newFish);
}


// ============================================================ 
// COLLISION DETECTION 
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

    // Reset score
    food = 0;

    // Reset copepod
    copepodX = 100;
    copepodY = 250;

    // Remove all fish
    fish = [];

    // Reset fish timer
    fishSpawnTimer = 0;

    // Reset diatom
    resetDiatom();

    // Game is running again
    gameOver = false;

    // Hide restart button
    restartButton.style.display = "none";
}

restartButton.addEventListener("click", restartGame);



// ============================================================ 
// GAME LOOP 
// ============================================================ 

function gameLoop() { 

    // -------------------------------------------------------- 
    // PLAYER MOVEMENT 
    // -------------------------------------------------------- 

    if (keys["ArrowUp"]) { 
        copepodY -= speed; 
    } 

    if (keys["ArrowDown"]) { 
        copepodY += speed; 
    } 

    if (keys["ArrowLeft"]) { 
        copepodX -= speed; 
    } 

    if (keys["ArrowRight"]) { 
        copepodX += speed; 
    } 

// -------------------------------------------------------- 
// TOUCH MOVEMENT 
// -------------------------------------------------------- 

if (touchActive) { 

    const copepodCentreX = copepodX + copepodWidth / 2; 
    const copepodCentreY = copepodY + copepodHeight / 2; 

    const dx = touchX - copepodCentreX; 
    const dy = touchY - copepodCentreY; 

    const distance = Math.sqrt(dx * dx + dy * dy); 

    if (distance > 5) { 

        copepodX += (dx / distance) * speed; 
        copepodY += (dy / distance) * speed; 
    } 
} 



    // -------------------------------------------------------- 
    // KEEP COPEPOD INSIDE SCREEN 
    // -------------------------------------------------------- 

    if (copepodX < 0) { 
        copepodX = 0; 
    } 

    if (copepodX > canvas.width - copepodWidth) { 
        copepodX = canvas.width - copepodWidth; 
    } 

    if (copepodY < 0) { 
        copepodY = 0; 
    } 

    if (copepodY > canvas.height - copepodHeight) { 
        copepodY = canvas.height - copepodHeight; 
    } 


    // -------------------------------------------------------- 
    // MOVE DIATOM 
    // -------------------------------------------------------- 

    diatomX -= diatomSpeed; 

    // If it drifts off the left side, make another one 
    if (diatomX < -diatomWidth) { 
        resetDiatom(); 
    } 


    // -------------------------------------------------------- 
    // EAT DIATOM 
    // -------------------------------------------------------- 

    if (copepodTouchesDiatom()) { 

        food += 1; 

        resetDiatom(); 
    } 

// --------------------------------------------------------
// FISH SPAWNING AND MOVEMENT
// --------------------------------------------------------

if (!gameOver) {

    // Count frames until next fish
    fishSpawnTimer++;

    // Spawn a fish every few seconds
    if (fishSpawnTimer >= fishSpawnInterval) {

        spawnFish();

        fishSpawnTimer = 0;
    }


    // Move all fish from right to left
    for (let i = 0; i < fish.length; i++) {

        fish[i].x -= fish[i].speed;
    }


    // Check whether a fish has eaten the copepod
    for (let i = 0; i < fish.length; i++) {

        if (copepodTouchesFish(fish[i])) {

            gameOver = true;
        }
    }


    // Remove fish once they leave the screen
    fish = fish.filter(function(f) {

        return f.x > -f.width;

    });
}


// --------------------------------------------------------
// CHECK FISH COLLISIONS
// --------------------------------------------------------

for (let i = 0; i < fish.length; i++) {

    if (copepodTouchesFish(fish[i])) {

    gameOver = true;

    restartButton.style.display = "block";
}


    // -------------------------------------------------------- 
    // DRAW OCEAN 
    // -------------------------------------------------------- 

    ctx.fillStyle = "#0f5082"; 

    ctx.fillRect( 
        0, 
        0, 
        canvas.width, 
        canvas.height 
    ); 


    // -------------------------------------------------------- 
    // DRAW DIATOM 
    // -------------------------------------------------------- 

    ctx.fillStyle = "#9acd32"; 

    ctx.fillRect( 
        diatomX + 10, 
        diatomY + 5, 
        10, 
        5,
        Math.PI * 2
    ); 

    ctx.fill();

// --------------------------------------------------------
// DRAW FISH
// --------------------------------------------------------

for (let i = 0; i < fish.length; i++) {

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

    ctx.fillRect( 
        copepodX, 
        copepodY, 
        copepodWidth, 
        copepodHeight 
    ); 


    // -------------------------------------------------------- 
    // DRAW FOOD COUNTER 
    // -------------------------------------------------------- 

    ctx.fillStyle = "white"; 
    ctx.font = "24px monospace"; 

    ctx.fillText( 
        "FOOD: " + food, 
        20, 
        35 
    ); 

// --------------------------------------------------------
// GAME OVER
// --------------------------------------------------------

if (gameOver) {

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle = "white";
    ctx.font = "40px monospace";
    ctx.textAlign = "center";

    ctx.fillText(
        "YOU WERE EATEN",
        canvas.width / 2,
        canvas.height / 2
    );


    ctx.font = "20px monospace";

    ctx.fillText(
        "Food collected: " + food,
        canvas.width / 2,
        canvas.height / 2 + 40
    );

    ctx.textAlign = "left";
}

    // -------------------------------------------------------- 
    // NEXT FRAME 
    // -------------------------------------------------------- 

    requestAnimationFrame(gameLoop); 
} 


// ============================================================ 
// START GAME 
// ============================================================ 

gameLoop(); 
