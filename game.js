document.addEventListener('DOMContentLoaded', function() {
  const gameContainer = document.getElementById('game-container');
  const turkey = document.getElementById('turkey');
  const scoreDisplay = document.getElementById('score');
  let score = 0;

  gameContainer.addEventListener('mousemove', moveTurkey);
  gameContainer.addEventListener('click', shootLaser);

  function moveTurkey(e) {
    let gameContainerRect = gameContainer.getBoundingClientRect();
    let turkeyWidth = turkey.offsetWidth;
    let gameContainerLeftEdge = gameContainerRect.left;
    let newLeft = e.clientX - gameContainerLeftEdge - turkeyWidth / 2;
    newLeft = Math.max(0, Math.min(newLeft, gameContainerRect.width - turkeyWidth));
    turkey.style.left = newLeft + 'px';
  }

  function shootLaser() {
    let laser = document.createElement('div');
    laser.classList.add('laser');
    laser.style.left = parseInt(turkey.style.left) + turkey.offsetWidth / 2 + 'px';
    laser.style.bottom = turkey.offsetHeight + 'px';
    gameContainer.appendChild(laser);

    let laserInterval = setInterval(() => {
      let laserBottom = parseInt(laser.style.bottom);
      laser.style.bottom = laserBottom + 4 + 'px';

      if (laserBottom > window.innerHeight) {
        laser.remove();
        clearInterval(laserInterval);
      }

      // Check for collision with any oven
      document.querySelectorAll('.oven').forEach(oven => {
        if (isCollision(laser, oven)) {
          updateScore();
          oven.remove();
          laser.remove();
          clearInterval(laserInterval);
        }
      });
    }, 10);
  }

  function createOven() {
    let oven = document.createElement('div');
    oven.classList.add('oven');
    oven.style.right = '0px';
    oven.style.top = Math.random() * (gameContainer.offsetHeight - 64) + 'px';
    gameContainer.appendChild(oven);

    let ovenInterval = setInterval(() => {
      oven.style.right = parseInt(oven.style.right) + 1 + 'px';

      if (parseInt(oven.style.right) > gameContainer.offsetWidth) {
        oven.remove();
        clearInterval(ovenInterval);
      }
    }, 20);
  }

  function isCollision(laser, oven) {
    let laserRect = laser.getBoundingClientRect();
    let ovenRect = oven.getBoundingClientRect();
    return !(laserRect.bottom < ovenRect.top ||
             laserRect.top > ovenRect.bottom ||
             laserRect.right < ovenRect.left ||
             laserRect.left > ovenRect.right);
  }

  function updateScore() {
    score += 1;
    scoreDisplay.textContent = 'Ovens Shot: ' + score;
  }

  setInterval(createOven, 3000); // Change as needed for difficulty
});
