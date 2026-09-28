const canvas = document.getElementById("game"); 
const ctx = canvas.getContext("2d"); 

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
// CREATE A NEW DIATOM 
// ============================================================ 

function resetDiatom() { 

    // Put it just beyond the right-hand edge 
    diatomX = canvas.width + 20; 

    // Give it a random vertical position 
    diatomY = Math.random() * (canvas.height - diatomHeight); 
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
        0,
        0,
        Math.PI * 2
    ); 

    ctx.fill();


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
    // NEXT FRAME 
    // -------------------------------------------------------- 

    requestAnimationFrame(gameLoop); 
} 


// ============================================================ 
// START GAME 
// ============================================================ 

gameLoop(); 
