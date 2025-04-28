const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let interval = 1;
let ballRadius = 30;
let ballPosX = (window.innerWidth - ballRadius) / 2, ballPosY = window.innerHeight - 75;
let ballDirX = 2;
let ballDirY = -2;
let paddleWidth = 120;
let paddleHeight = 35;
let paddlePosX = (window.innerWidth - paddleWidth) / 2, paddlePosY = window.innerHeight - 45;
let leftPressed = false;
let rightPressed = false;
let paddleMovingSpeed = 4;
let bricksColumn = 7;
let bricksRow = 4;
let brickWidth = 100;
let brickHeight = 40;
let brickOffsetTop = 80;
let brickPadding = 15;
let brickOffsetLeft = (window.innerWidth - (bricksColumn * brickWidth + (bricksColumn * brickPadding))) / 2;

// BRICKS
const bricks = [];

for (let c = 0; c < bricksColumn; c++) {
    bricks[c] = [];
    for (let r = 0; r < bricksRow; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 2};
    };
};

// HANDLING THE POINTS

function handlingThePoints() {
    let points = 0;
    for (let c = 0; c < bricksColumn; c++) {
        for (let r = 0; r < bricksRow; r++) {
            if (bricks[c][r].status === 0) {
                points += 10;
            };
        };
    };

    ctx.beginPath();
    ctx.font = '1rem serif';
    ctx.fillText(`POINTS: ${points}`, 20, 30);
    ctx.fillStyle = 'red';
    ctx.closePath();

    const winningPoints = bricksColumn * bricksRow + Number('0');
    if (points === winningPoints) {
        clearInterval(interval);
        alert('Congratulations, You won the game!!!');
        document.location.reload();
    };
};

// COLLISION DETECTION

function collisionDetection() {
    for (let c = 0; c < bricksColumn; c++) {
        for (let r = 0; r < bricksRow; r++) {
            const brick = bricks[c][r];

            if (brick.status > 0) {
                if (ballPosX > brick.x - ballRadius && ballPosX < brick.x + brickWidth && ballPosY > brick.y -ballRadius && ballPosY < brick.y + brickHeight) {
                    ballDirY = -ballDirY;
                    brick.status--;
                };
            };
        };
    };  
};

// DRAWING THE BRICKS

function drawingTheBricks() {
    for (let c = 0; c < bricksColumn; c++) {
        for (let r = 0; r < bricksRow; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            if (bricks[c][r].status === 2) {
                ctx.beginPath();
                ctx.drawImage(brickImage, brickX, brickY,brickWidth, brickHeight);
                ctx.closePath();
            } else if (bricks[c][r].status === 1) {
                ctx.beginPath();
                ctx.drawImage(brickBrokenImage, brickX, brickY,brickWidth, brickHeight);
                ctx.closePath();
            };
        };
    };
};

// DRAWING THE BALL

function drawingTheBall() {
    ctx.beginPath();
    ctx.drawImage(ballImage, ballPosX, ballPosY, ballRadius, ballRadius);
    ctx.closePath();
};

// DRAWING THE PADDLE

function drawingThePaddle() {
    ctx.beginPath();
    ctx.drawImage(paddleImage, paddlePosX, paddlePosY, paddleWidth, paddleHeight);
    ctx.closePath();
};

// CLEAR THE CANVAS

function clearTheCanvas() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
};

// DRAW

function draw() {
    clearTheCanvas();
    drawingThePaddle();
    drawingTheBall();
    drawingTheBricks();
    collisionDetection();
    handlingThePoints();

    // MOVING THE BALL
    ballPosX += ballDirX;
    ballPosY += ballDirY;

    // WALLS COLLISION
    if (ballPosY < 0) {
        ballDirY = -ballDirY;
    } else if (ballPosY > window.innerHeight) {
        clearInterval(interval);
        alert('Opps, you lost. Try again!');
        document.location.reload();
    };
    if (ballPosX < 0 || ballPosX > canvas.width - ballRadius) {
        ballDirX = -ballDirX;
    };

    // PADDLE COLLISION
    if (ballPosY > paddlePosY - ballRadius && ballPosX > paddlePosX && ballPosX < paddlePosX + paddleWidth) {
        ballDirY = -ballDirY;
    };

    // HANDLING THE KEYS
    if (leftPressed) {
        if (paddlePosX > 5) {
            paddlePosX -= paddleMovingSpeed;
        };
    } else if (rightPressed) {
        if (paddlePosX < window.innerWidth - paddleWidth - 7) {
            paddlePosX += paddleMovingSpeed;
        };
    };
};

interval = setInterval(draw, 5);

// HANDLING THE KEYS

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        leftPressed = true;
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        rightPressed = true;
    };
};

function handleKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'Left') {
        leftPressed = false;
    } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        rightPressed = false;
    };
};

// SETTING THE WIDTH AND THE HEIGHT OF THE CANVAS

function settingTheWidthAndTheHeightOfTheCanvas() {
    canvas.setAttribute('width', (window.innerWidth - 4) + 'px');
    canvas.setAttribute('height', (window.innerHeight - 4) + 'px');
};

settingTheWidthAndTheHeightOfTheCanvas();