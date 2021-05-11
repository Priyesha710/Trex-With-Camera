var trex;
var obstacle1Img, obstacle2Img, obstacle3Img, obstacle4Img, obstacle5Img, obstacle6Img;
var cloudImg, groundImg, ground, invisibleGround;
var restartImg, gameOverImg;
var trexAnimationRunning, trexAnimationCollided;
var obstaclesGroup, cloudsGroup;
var gameState = 0, score, highScore, timesPlayed = 0, y;
var jumpSound, checkpointSound, dieSound;

function preload() {
    obstacle1Img = loadImage("images/obstacle1.png");
    obstacle2Img = loadImage("images/obstacle2.png");
    obstacle3Img = loadImage("images/obstacle3.png");
    obstacle4Img = loadImage("images/obstacle4.png");
    obstacle5Img = loadImage("images/obstacle5.png");
    obstacle6Img = loadImage("images/obstacle6.png");
    cloudImg = loadImage("images/cloud.png");
    groundImg = loadImage("images/ground2.png");
    restartImg = loadImage("images/restart.png");
    gameOverImg = loadImage("images/gameOver.png");
    trexAnimationRunning = loadAnimation("images/trex1.png", "images/trex3.png", "images/trex4.png");
    trexAnimationCollided = loadAnimation("images/trex_collided.png");
    jumpSound = loadSound("jump.mp3");
    checkpointSound = loadSound("checkPoint.mp3");
    dieSound = loadSound("die.mp3");


}
function setup() {
    createCanvas(800, 400);
    trex = createSprite(100, 345, 40, 40);
    trex.addAnimation("running", trexAnimationRunning);
    trex.addAnimation("collided", trexAnimationCollided);

    trex.velocityX = 12;

    ground = createSprite(800, 395, 1600, 10);
    ground.addImage("ground", groundImg);

    gameOver = createSprite(300, 100);
    gameOver.addImage(gameOverImg);
    restart = createSprite(300, 140);
    restart.addImage(restartImg);
    gameOver.scale = 0.5;
    restart.scale = 0.5;


    trex.setCollider("rectangle", 0, 0, 80, trex.height);
    //trex.debug = true;

    invisibleGround = createSprite(10, 400, 800, 10);
    invisibleGround.visible = false;

    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();
    score = 0;
    highScore = 0;
}
function draw() {
    background("white");
    camera.x = trex.x + 300;
    camera.y = 200;
    restart.x = camera.x;
    gameOver.x = camera.x;
    invisibleGround.x = camera.x;
    if (timesPlayed >= 1) {
        text("HI:" + highScore, camera.x + 200, 50);
        console.log("written");
    }
    text("Score: " + score, camera.x + 300, 50);

    if (gameState === 0) {
        y = 0;
        gameOver.visible = false;
        restart.visible = false;
        if (frameCount % 2 === 0) {
            score = score + 1;
        }
        trex.velocityX = trex.velocityX + 0.00005;
        if (score > 0 && score % 100 === 0) {
            checkpointSound.play();
        }
        trex.collide(invisibleGround);
        if (camera.x - ground.x > ground.width / 4) {
            ground.x = camera.x;
        }
        trex.velocityY = trex.velocityY + 2.5;
        if (keyDown("space") && trex.y > 330) {
            trex.velocityY = -28;
            jumpSound.play();
        }

        spawnObstacles();
        spawnClouds();
        if (obstaclesGroup.isTouching(trex)) {
            console.log("collided");
            dieSound.play();
            gameState = 1;
        }
    } else if (gameState === 1) {
        gameOver.visible = true;
        restart.visible = true;
        trex.changeAnimation("collided", trexAnimationCollided);
        if (timesPlayed >= 1) {
            if (score > highScore) {
                highScore = score;
            }
        }
        timesPlayed = 1;
        trex.velocityX = 0;
        trex.velocityY = 0;
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
        if (y > 20) {
            if (keyDown("space")||mousePressedOver(restart)) {
                trex.changeAnimation("running", trexAnimationRunning);
                trex.velocityX = 12;
                score = 0;
                gameState = 0;
                obstaclesGroup.destroyEach();
            }
        }
        y = y + 1;
    }
    drawSprites();
}
function spawnObstacles() {
    if (frameCount % 80 === 0) {
        var obstacle = createSprite(10, 370, 20, 20);
        obstacle.x = camera.x + 400;
        var rand = Math.round(random(1, 6));
        switch (rand) {
            case 1:
                obstacle.addImage("1", obstacle1Img);
                break;
            case 2:
                obstacle.addImage("2", obstacle2Img);
                break;
            case 3:
                obstacle.addImage("3", obstacle3Img);
                break;
            case 4:
                obstacle.addImage("4", obstacle4Img);
                break;
            case 5:
                obstacle.addImage("5", obstacle5Img);
                break;
            case 6:
                obstacle.addImage("6", obstacle6Img);
            default: break;
        }
        //assign scale and lifetime to the obstacle  
        obstacle.scale = 0.85;
        obstacle.lifetime = 800 / trex.velocityX + 4;

        //add each obstacle to the group
        obstaclesGroup.add(obstacle);
    }
}


function spawnClouds() {
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
        cloud = createSprite(camera.x + 401, 100, 40, 10);
        cloud.y = Math.round(random(10, 60));
        cloud.addImage(cloudImg);

        //assign lifetime to the variable
        cloud.lifetime = 800 / trex.velocityX;

        //adjust the depth
        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

        //adding cloud to the group
        cloudsGroup.add(cloud);
    }
}