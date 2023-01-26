const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

//background
const background = new Sprite({
  imageSrc: "./imgs/background1.jpg",
  position: {
    x: 0,
    y: 0,
  },
});
const shop = new Sprite({
  imageSrc: "./imgs/bush.png",
  position: {
    x: 100,
    y: 180,
  },
  scale: 0.6,
  framesMax: 6,
});
//

//create player and enemy
const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -40,
    y: 3,
  },
  imageSrc: "./imgs/idle.png",
  framesMax: 8,
  scale: 0.33,
  sprites: {
    idle: {
      imageSrc: "./imgs/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./imgs/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./imgs/jump.png",
      framesMax: 8,
    },
    fall: {
      imageSrc: "./imgs/fall.png",
      framesMax: 8,
    },
    attack1: {
      imageSrc: "./imgs/attack.png",
      framesMax: 5,
    },
    takeHit: {
      imageSrc: "./imgs/takeHit.png",
      framesMax: 5,
    },
    death: {
      imageSrc: "./imgs/death.png",
      framesMax: 5,
    },
  },
  attackBox: {
    offset: {
      x: 20,
      y: 0,
    },
    width: 100,
    height: 150,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./imgs/cat/idle.png",
  framesMax: 9,
  scale: 0.33,
  sprites: {
    idle: {
      imageSrc: "./imgs/cat/idle.png",
      framesMax: 9,
    },
    run: {
      imageSrc: "./imgs/cat/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./imgs/cat/jump.png",
      framesMax: 8,
    },
    fall: {
      imageSrc: "./imgs/cat/fall.png",
      framesMax: 8,
    },
    attack1: {
      imageSrc: "./imgs/cat/attack.png",
      framesMax: 5,
    },
    takeHit: {
      imageSrc: "./imgs/cat/takeHit.png",
      framesMax: 5,
    },
    death: {
      imageSrc: "./imgs/cat/death.png",
      framesMax: 5,
    },
  },
  attackBox: {
    offset: {
      x: -60,
      y: 0,
    },
    width: 100,
    height: 150,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  //用key和lastkey 来实现可以同时按住左边和右边来回移动

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }
  //enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect for collision & enemy take hit
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 2 //攻击效果出来的那一帧
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to(".enemyHealth-bg", {
      width: enemy.health + "%",
    });
  }

  //if player misses
  if (player.isAttacking && player.framesCurrent === 2) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2 //攻击效果出来的那一帧
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to(".playerHealth-bg", {
      width: player.health + "%",
    });
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }
  //end game based on health
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

//move characters
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.velocity.y === 0) player.velocity.y = -18; //use this if statement to control the jump times(only once).
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        if (enemy.velocity.y === 0) enemy.velocity.y = -18;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  //enemy keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
