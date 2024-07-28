//My First Project. Might not be upto your expectations

const inputField = document.querySelector("#input-bx");
const clickBtn = document.querySelector("#check-btn");
const score = document.querySelector("#score");
const message = document.querySelector("#result");
const highScore = document.querySelector("#highScore");
let secretNum = Math.floor(Math.random() * 20) + 1;
let count = 20;
let highscore = 0;
score.textContent = count;
highScore.textContent = highscore;
clickBtn.onclick = function () {
  let guess = Number(inputField.value);
  if (isNaN(guess) || guess === '') {
    message.textContent = "Invalid Input";
    return;
  }
  else if (guess < secretNum) {
    if (secretNum - guess <= 5) {
      message.textContent = "It's a bit Higher";
    }
    else {
      message.textContent = "It's way higher";
    }
    count--;
  }
  else if (guess > secretNum) {
    if (guess - secretNum <= 5) {
      message.textContent = "It's a bit lower";
    }
    else {
      message.textContent = "It's way Lower";
    }
    count--;
  }
  else {
    message.textContent = "Correct Answer!";
    if (highscore < count) {
      highscore = count;
      highScore.textContent = highscore;
    }
    setTimeout(resetGame, 3000);
  }
  if (count <= 0) {
    message.textContent = "Game Over. The correct answer was " + secretNum;
    setTimeout(resetGame, 5000);
  }
  score.textContent = count;
};
function resetGame() {
  count = 20;
  secretNum = Math.floor(Math.random() * 20) + 1;
  inputField.textContent = '';
  score.textContent = count;
  inputField.value = '';
}
