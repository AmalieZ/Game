const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d");

let player = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    grounded: false,
};

let platforms = [
    {x: 0,y: 350,width: 800,height: 50},
    {x: 200,y: 280,width: 120,height: 20},
    {x: 400,y: 220,width: 120,height: 20},
    {x: 600,y: 160,width: 120,height: 20},
];

let keys = {};

window.addEventListener("keydown", e => {
    keys[e.code] = true;
});

window.addEventListener("keyup", e => {
    keys[e.code] = false;
});

function update() {
    if(keys["ArrowLeft"]) player.x -=5;
    if(keys["ArrowRight"]) player.x +=5;
    if(keys["Space"] && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }

    player.dy += player.gravity;
    player.y += player.dy;

    player.grounded = false

    for(let p of platforms){
        if(player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y < p.y + p.height &&
            player.y + player.height > p.y) {

            if(player.dy > 0){
                player.y = p.y - player.height;
                player.dy = 0;
                player.grounded = true;
            }
        }
    }
}

function draw(){
    ctx.clearRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "green";
    for(let p of platforms){
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
}

function gameLoop()
{
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();