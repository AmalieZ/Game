const playerImg = new Image();
playerImg.src = "https://freesvg.org/img/1443528944.png";

const platformImg = new Image();
platformImg.src = "https://freesvg.org/img/nicubunu_RPG_map_brick_border_2.png";

const coinImg = new Image();
coinImg.src = "https://freesvg.org/img/Gold-Coin.png";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let gravity = 0.5;
let score = 0;
let keys = {};
let level = 0;

let player = {
    x: 50,
    y: 300,
    w: 30,
    h: 30,
    vx: 0,
    vy: 0,
    speed: 5,
    jump: 12,
    jumps: 0
};

//levely
let levels = [
    {
        platforms: [
            {x:0,y:420,w:300,h:30},
            {x:400,y:420,w:300,h:30},
            {x:800,y:420,w:400,h:30},
            {x:1300,y:420,w:300,h:30},
            {x:1700,y:420,w:500,h:30},

            {x:200,y:350,w:120,h:20},
            {x:500,y:300,w:120,h:20},
            {x:900,y:260,w:120,h:20},
            {x:1400,y:300,w:120,h:20},
            {x:1800,y:250,w:120,h:20}
        ],

        coins: [
            {x:220,y:300,collected:false},
            {x:520,y:250,collected:false},
            {x:920,y:210,collected:false},
            {x:1420,y:250,collected:false},
            {x:1820,y:200,collected:false}
        ],

        goal: {x:2100,y:380,w:40,h:40}
    },

    {
        platforms: [
            {x:0,y:420,w:200,h:30},
            {x:300,y:420,w:200,h:30},
            {x:600,y:420,w:200,h:30},
            {x:900,y:420,w:200,h:30},
            {x:1200,y:420,w:300,h:30},
            {x:1600,y:420,w:400,h:30},

            {x:250,y:320,w:120,h:20},
            {x:450,y:260,w:120,h:20},
            {x:750,y:220,w:120,h:20},
            {x:1050,y:180,w:120,h:20},
            {x:1400,y:240,w:120,h:20}
        ],

        coins: [
            {x:260,y:280,collected:false},
            {x:460,y:220,collected:false},
            {x:760,y:180,collected:false},
            {x:1060,y:140,collected:false},
            {x:1410,y:200,collected:false}
        ],

        goal: {x:1900,y:380,w:40,h:40}
    }

];

//aktuální data levelu
let platforms = levels[level].platforms;
let coins = levels[level].coins;
let goal = levels[level].goal;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update(){

    player.vx = 0; //reset pohybu

    //pohyb doprava a doleva
    if(keys["ArrowLeft"]) player.vx = -player.speed;
    if(keys["ArrowRight"]) player.vx = player.speed;

    if(keys["Shift"]){
        player.vx *= 2;
    }

    //double jump
    if(keys["ArrowUp"] && player.jumps < 2){
        player.vy = -player.jump;
        player.jumps++;
        keys["ArrowUp"] = false; //zabrání držení
    }

    //gravitace
    player.vy += gravity;

    //posun hráče
    player.x += player.vx;
    player.y += player.vy;

    //kolice s platformou
    platforms.forEach(p=>{
        if(player.x < p.x+p.w &&
          player.x+player.w > p.x &&
          player.y < p.y+p.h &&
          player.y+player.h > p.y){
            if(player.vy > 0){
                player.y = p.y - player.h;
                player.vy = 0;
                player.jumps = 0; //reset skoků
            }
        }
    });

    //sbírání mincí
    coins.forEach(c=>{
        if(!c.collected &&
          player.x < c.x+20 &&
          player.x+player.w > c.x &&
          player.y < c.y+20 &&
          player.y+player.h > c.y){
            c.collected = true;
            score++;
        }
    });

    //cíl levelu
    if(player.x < goal.x+goal.w &&
      player.x+player.w > goal.x &&
      player.y < goal.y+goal.h &&
      player.y+player.h > goal.y){

        level++;

        //konec hry
        if(level >= levels.length){
            alert("You won");
            level = 0;
            score = 0;
        }

        //načítání dalšího levelu
        platforms = levels[level].platforms;
        coins = levels[level].coins;
        goal = levels[level].goal;

        //reset hráče
        player.x = 50;
        player.y = 300;
    }

    //pád mimo mapu
    if(player.y > canvas.height){
        player.x = 50;
        player.y = 300;
        player.vy = 0;
    }
}

function draw(){

    //kamera sleduje hráče
    let cameraX = player.x - 200;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(-cameraX,0);

    platforms.forEach(p=>{
        ctx.drawImage(platformImg, p.x, p.y, p.w, p.h);
    });

    coins.forEach(c=>{
        if(!c.collected)
            ctx.drawImage(coinImg, c.x, c.y, 20, 20);
    });

    ctx.fillStyle = "yellow";
    ctx.fillRect(goal.x, goal.y, goal.w, goal.h);

    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

    ctx.restore();

    ctx.fillStyle="black";
    ctx.font="20px Arial";
    ctx.fillText("Score: "+score,10,25);
    ctx.fillText("Level: "+(level+1),10,50);
}

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop); //opakování
}

gameLoop();
