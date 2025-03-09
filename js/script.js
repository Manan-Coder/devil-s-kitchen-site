let sentOtp = null;
let sessionCode = null;
let acc_there = null;
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

//otp popup
function createOTPPopup() {

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'otp-overlay';
  
  const popup = document.createElement('div');
  popup.className = 'otp-popup';
  

  popup.innerHTML = `
    <h3>Enter OTP</h3>
    <p>Please enter the OTP sent to your email</p>
    <input id="otp-input" placeholder="Enter OTP" maxlength="4" required>
    <div id="otp-error" class="otp-error" style="color:red;"></div>
    <div class="otp-buttons">
      <button id="submit-otp">Submit</button>
      <button id="cancel-otp">Cancel</button>
    </div>
  `;
  

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  

  document.getElementById('cancel-otp').addEventListener('click', closeOTPPopup);
  

  document.getElementById('submit-otp').addEventListener('click',checkOTP);
}

//otp popup close
function closeOTPPopup() {
  const overlay = document.getElementById('otp-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function checkOTP(){
  const overlay = document.getElementById('otp-overlay');
  const otp_in = document.getElementById('otp-input').value;
  const otp_input = Number(otp_in);
  console.log(otp_input);
  console.log(sentOtp);
  if (otp_input == sentOtp)
  {
    document.getElementById('otp-error').style.color = 'green';
    document.getElementById('otp-error').innerHTML = 'Success!';
    registerUser();
    setTimeout(() => {
      const overlay = document.getElementById('otp-overlay');
      if (overlay) {
        overlay.remove();
      }
    }, 1000);
  }
  else{
    document.getElementById('otp-error').innerHTML = 'Wrong OTP :/';
  }
}

//api call to send the otp
async function getSignupOTP(){
  const email = document.getElementById('email').value
  const name = document.getElementById('name').value
  console.log(name,email)
  data = {name,email}
  try{
    const response = await fetch('http://127.0.0.1:5000/send-signup-otp',{
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result)
    sentOtp = result["otp"]
    sessionCode = result["sessionCode"]
    console.log(sentOtp)
    console.log(typeof(sentOtp))
    acc_there = result["token"]
    if (acc_there == 1){
    createOTPPopup();}
    else if(acc_there == 0){
      document.getElementById('alert-label-sgp').style.color = 'red'
      document.getElementById('alert-label-sgp').innerHTML = 'You have an account already, Login instead!'
 
      console.log("login instead")
    }
    return result
  }
catch(error){
  console.error(error)
  return null;
}
}

async function registerUser(){
  const email = document.getElementById('email').value
  const name = document.getElementById('name').value
  const password = document.getElementById('passw').value
  console.log(sessionCode)
  data = {name,email,password,sessionCode}
  try{
    const response = await fetch('http://127.0.0.1:5000/register-user',{
        method : 'POST',
        headers : {
          "Content-type" : "application/json"
        },
        body : JSON.stringify(data)
    });
    const result = await response.json();
    console.log(result);
    return result
  }
  catch(error){
    console.log(error);
    return null;

  }
}


async function login(){
  const email = document.getElementById('email-login').value
  const passw = document.getElementById('passw-login').value
  const alert_label = document.getElementById('alert-label')
  data = {email,passw}
  console.log(data)
  try{
    const response = await fetch('http://127.0.0.1:5000/login',{
      method : 'POST',
      headers:{
        "Content-type" : "application/json"
      },
      body : JSON.stringify(data)
    });
    const result = await response.json()
    console.log(result)
    const passStatus = result['pass-status']
    const acc_there = result['acc-there']
    if (passStatus == 0)
    {alert_label.style.color = 'red';
      alert_label.innerHTML =  "Wrong Password!";
    }
    else if(acc_there == 1)
    {alert_label.style.color = 'green';
      alert_label.innerHTML =  "Login Successful!";}
   
    else if (acc_there == 0)
    {alert_label.style.color = 'red';
      alert_label.innerHTML =  "Account not found. Signup!";

    } }
    catch(error){
      console.log(error)
      return null
    }
}