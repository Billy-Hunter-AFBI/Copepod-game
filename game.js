const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// -------------------------
// COPEPOD
// -------------------------

let copepodX = 100;
let copepodY = 250;

const copepodWidth = 20;
const copepodHeight = 10;

const speed = 4;


// -------------------------
// KEYBOARD
// -------------------------

const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});


// -------------------------
// GAME LOOP
// -------------------------

function gameLoop() {

    // ---- Player movement ----

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


    // ---- Stop copepod leaving screen ----

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


    // ---- Draw ocean ----

    ctx.fillStyle = "#0f5082";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // ---- Draw copepod ----

    ctx.fillStyle = "#f0b450";

    ctx.fillRect(
        copepodX,
        copepodY,
        copepodWidth,
        copepodHeight
    );


    // ---- Next frame ----

    requestAnimationFrame(gameLoop);
}


// Start game
gameLoop();
