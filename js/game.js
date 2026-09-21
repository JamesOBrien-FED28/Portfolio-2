let jumpPressed = false;
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const keys = {};
const GRAVITY = 0.3;
const FLOOR = canvas.height - 100; // player height
const platforms = [
    { x: 100, y: 600, width: 300, height: 20 },
    { x: 500, y: 450, width: 250, height: 20 },
    { x: 200, y: 300, width: 200, height: 20 },
    { x: 0, y: 780, width: 1280, height: 20 }
];

let bullets = [];

let player = { x: 50, y: FLOOR, vx: 0, vy: 0, width: 40, height: 80, canFire: true, facing: "right" };


document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});


function update() {
    // Movement
    if (keys["ArrowLeft"]) {
        player.vx = -6;
        player.facing = "left";   // NEW
    }
    else if (keys["ArrowRight"]) {
        player.vx = 6;
        player.facing = "right";  // NEW
    }
    else {
        player.vx = 0;
    }


    // Gravity
    player.vy += GRAVITY;

    // Apply horizontal movement
    player.x += player.vx;

    // Apply vertical movement
    player.y += player.vy;

    // Prevent player from leaving the screen
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    // Update bullets
    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;

        if (b.x > canvas.width || b.x < 0) {
            bullets.splice(i, 1);
        }
    }


    // PLATFORM COLLISION
    let onPlatform = false;

    platforms.forEach(p => {
        const playerBottom = player.y + player.height;
        const platformTop = p.y;

        const playerRight = player.x + player.width;
        const playerLeft = player.x;

        const platformRight = p.x + p.width;
        const platformLeft = p.x;

        const falling = player.vy > 0;

        const withinHorizontal =
            playerRight > platformLeft &&
            playerLeft < platformRight;

        const crossingPlatform =
            playerBottom >= platformTop &&
            playerBottom <= platformTop + player.vy;

        if (falling && withinHorizontal && crossingPlatform) {
            player.y = platformTop - player.height;
            player.vy = 0;
            onPlatform = true;
        }
    });

    // FLOOR COLLISION
    if (player.y > FLOOR) {
        player.y = FLOOR;
        player.vy = 0;
        onPlatform = true;
    }

    // Jump
    if (keys["ArrowUp"]) {
        if (!jumpPressed && onPlatform) {
            player.vy = -12;
        }
        jumpPressed = true;
    } else {
        jumpPressed = false;
    }


    // Fire Bullet
    if (keys[" "]) {
        fireBullet();
    }
}

function fireBullet() {
    if (!player.canFire) return;

    player.canFire = false;
    setTimeout(() => player.canFire = true, 150);

    const speed = player.facing === "right" ? 10 : -10;

    const bullet = {
        x: player.facing === "right"
            ? player.x + player.width   // spawn on right side
            : player.x - 10,            // spawn on left side
        y: player.y + player.height / 2,
        vx: speed,
        width: 10,
        height: 4
    };

    bullets.push(bullet);
}


function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = "blue";
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Draw bullets
    ctx.fillStyle = "yellow";
    bullets.forEach(b => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

}

loop();
