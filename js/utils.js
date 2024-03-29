function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector(".tie").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector(".tie").innerHTML = "Tie";
    player.tie = true;
    enemy.tie = true;
    playagain();
  } else if (player.health > enemy.health) {
    document.querySelector(".tie").innerHTML = "The Dog Wins!";
    playagain();
  } else if (player.health < enemy.health) {
    document.querySelector(".tie").innerHTML = "The Cat Wins!";
    playagain();
  }
}
function playagain() {
  document.querySelector(".playAgain-container").style.display = "flex";
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
