const platforms = document.querySelectorAll('.platform');
const protagonist = document.getElementById('protagonist');
let isJumping = false;
window.addEventListener('load', () => {
  const protag = document.getElementById('protagonist');
  const img = new Image();
  img.src = 'assets/idle.png';
  const left1 = document.querySelector('.platform.left1');
  const containerRect = document.querySelector('.game-container').getBoundingClientRect();
  const rect = left1.getBoundingClientRect();
  protag.style.left = (rect.left - containerRect.left + (rect.width - protag.offsetWidth) / 2) + 'px';
  protag.style.bottom = (containerRect.bottom - rect.top + 5) + 'px';
  img.onerror = () => {
    document.querySelectorAll('.platform').forEach(p => {
      p.style.backgroundColor = '#555';
      p.style.backgroundImage = 'none';
    });
    protag.style.backgroundColor = '#ff5722';
    protag.style.backgroundImage = 'none';
    protag.style.borderRadius = '50%';
    document.querySelector('.game-container').style.backgroundColor = '#e0e0e0';
    document.querySelector('.game-container').style.backgroundImage = 'none';
  };
});
function animateToTarget(startX, startY, targetX, targetY, duration) {
  const startTime = performance.now();
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentX = startX + (targetX - startX) * progress;
    const currentY = startY + (targetY - startY) * progress;
    protagonist.style.left = currentX + 'px';
    protagonist.style.top = currentY + 'px';
    if (progress < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
platforms.forEach(platform => {
  platform.addEventListener('click', (event) => {
    if (isJumping) return;
    const rect = event.target.getBoundingClientRect();
    const containerRect = document.querySelector('.game-container').getBoundingClientRect();
    const currentLeft = protagonist.offsetLeft;
    const currentBottom = parseFloat(getComputedStyle(protagonist).bottom);
    const newLeft = rect.left - containerRect.left + (rect.width / 2) - (protagonist.offsetWidth / 2);
    const newBottom = containerRect.bottom - rect.top + 5;
    isJumping = true;
    protagonist.classList.add('jumping');
    if (newLeft < currentLeft) {
      protagonist.classList.add('flip');
    } else {
      protagonist.classList.remove('flip');
    }
    const distance = Math.abs(newLeft - currentLeft);
    const jumpHeight = Math.min(120, 60 + distance * 0.2);
    const jumpDuration = 800;
    const startTime = performance.now();
    function animateJump(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / jumpDuration, 1);
      const verticalOffset = 4 * jumpHeight * progress * (1 - progress);
      const horizontalPos = currentLeft + (newLeft - currentLeft) * progress;
      const bottomPos = currentBottom + (newBottom - currentBottom) * progress;
      protagonist.style.left = horizontalPos + 'px';
      protagonist.style.bottom = (bottomPos + verticalOffset) + 'px';
      if (progress < 1) {
        requestAnimationFrame(animateJump);
      } else {
        protagonist.style.bottom = newBottom + 'px';
        protagonist.classList.remove('jumping');
        isJumping = false;
        if (event.target.classList.contains('right4')) {
          setTimeout(() => {
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              const signup = document.querySelector('.flip-card__back');
              const signupRect = signup.getBoundingClientRect();
              const currentRect = protagonist.getBoundingClientRect();
              document.body.appendChild(protagonist);
              protagonist.style.position = 'fixed';
              protagonist.style.left = currentRect.left + 'px';
              protagonist.style.top = currentRect.top + 'px';
              const targetX = signupRect.left + (signupRect.width - protagonist.offsetWidth) / 2;
              const targetY = signupRect.top - 100;
              animateToTarget(currentRect.left, currentRect.top, targetX, targetY, 800);
            }, 1000);
          }, 2000);
        }
      }
    }
    requestAnimationFrame(animateJump);
  });
});