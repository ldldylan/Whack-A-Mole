// const cursor = document.querySelector('.cursor')

// const canvas = document.getElementById("canvas");
// console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
// const ctx = canvas.getContext('2d');

// var bgImg = new Image();
// bgImg.src = "../img/background.png";
// bgImg.onload = function() {
//   ctx.drawImage(bgImg, 110, 200);
// }

// var img = new Image();
// img.src = "../img/sprite8.png";
// img.onload = function(){
//     ctx.drawImage(img, 140, 200);
// };

// const background = new Image();
// background.src = '../img/background.bmp';
// background.onload = function(){
//     ctx.drawImage(background,0,0, canvas.width, canvas.height);   
// }


window.onload = function() {
    // 1. Initializing game elements
    const box = document.querySelector('.box');
    const score = document.querySelector('.score');
    const timebox = document.querySelector('.time');
    const pauseButton = document.querySelector('.pause');
    const startButton = document.querySelector('.start');
    const restartButton = document.querySelector('.restart');
    const gameoverBox = document.querySelector(".gameover");
    let current_score = 0;

    let timer = null;
    let timeboxWidth = timebox.offsetWidth
    console.log(timeboxWidth)
    // ture => game has started; false => game is paused
    let gameState = true;

    // seven positions for mole to show up [{}{}{}{}{}{}{}]
    let sevenMolesPos = [
      {top: "11%", left: "5.5%"},
      {top: "8%", left: "24.5%"},
      {top: "11%", left: "44.5%"},
      {top: "25.5%", left: "26.5%"},
      {top: "27%", left: "50%"},
      {top: "40%", left: "8.5%"},
      {top: "41%", left: "42.5%"}
    ];

    // seven positions for shovel to show up

    // previous hole index
    let prevIndex = -1;
    // timer for generating moles
    let moleTimer = null;
    // mole shows up animation timer
    let upTimer = null;
    // mole goes down 
    let downTimer = null;
   

    // 2. Start game after clicking the start button
    startButton.onclick = function(){
        // hide start button after clicked
        this.style.display = 'None';
        // show pause button
        pauseButton.style.display = 'block';
        // start timer
        timeReduce();
        // display mole
        showMole();
    }
    // 3. Start game timer
    function timeReduce(){
        timer = setInterval(function (){
            timeboxWidth--;
            timebox.style.width = timeboxWidth + "px";
            if (timeboxWidth <= 0){
                clearInterval(timer);
                // gamer over
                gameover();
            }
        }, 50)
    }

    // 4. game over
    function gameover() {
        restartButton.style.display="block";
        gameoverBox.style.display="block";
        
        //stop generaing any mole
        clearInterval(moleTimer)
        alert("Game over!")
    }
    // 5. pause game
    pauseButton.onclick = function(){
        if(gameState) {
            // pause game timer
            clearInterval(timer);
            // pause generating mole
            clearInterval(moleTimer);
            // pause button => continue button
            this.style.backgroundImage="url(../img/restart.png)"
            gameState = false;
          }
          else{
            // start timer
            timeReduce();
            showMole();
            // start button => pause button
            this.style.backgroundImage="url(../img/pause.png)"
            gamestate = true;
        }
    }
    // 6. generate mole
    function addMole() {
      // create imge
      let mole = document.createElement("img");
      // i. which random hole
      // generate a random index 0-7
      mole.holeIndex = Math.floor(Math.random()*7);
      // ensure no repetitive hole position
      while(mole.holeIndex === prevIndex){
        mole.holeIndex = Math.floor(Math.random()*7);
      }
      prevIndex = mole.holeIndex;
      // 7. holes locations
      console.log(sevenMolesPos[mole.holeIndex])
      // assign hole pos to mole
      mole.style.top = sevenMolesPos[mole.holeIndex].top
      mole.style.left = sevenMolesPos[mole.holeIndex].left
      // add mole image
      // mole.src="../img/m1.png"

      // ii. mole or snake
      mole.who = ''
      let randomNumber = Math.floor(Math.random()*10)
      if (randomNumber === 0) {
        mole.who = 's';
      }
      // else if (randomNumber === 1){
      //   mole.who = 'f';
      // }
      else mole.who = 'm';

      box.appendChild(mole);
      // showing up
      let upIndex = 0;
      upTimer = setInterval(function(){
        if (mole.who === 'm' || mole.who === 'f'){
          mole.src = "../img/" + mole.who + upIndex+".png";
          upIndex++;
          if (mole.who==='m' && upIndex > 1){
            setTimeout(function(){}, 80)
            mole.mineIndex = Math.floor(Math.random()*7);
            mole.src = "../img/m1" + mole.mineIndex + ".png";
            clearInterval(upTimer);
          }
          else if(mole.who==='f' && upIndex > 1){
            setTimeout(function(){}, 80)
            mole.src = "../img/f2.png";
            clearInterval(upTimer);
          }
        }
      }, 80)

      // Going down
      let downIndex = 1 
      if (mole.who==='m'){
        whack(mole);
        setTimeout(function(){}, 80);
        // let moel stays for 1 sec
        mole.out = setTimeout(function(){
          downTimer = setInterval(function(){
            mole.src = "../img/m" + downIndex + ".png";
            downIndex --;
            if (downIndex < 0){
              clearInterval(downTimer);
              clearInterval(mole.out);
              // delete mole element from box
              box.removeChild(mole);
            }
          }, 80)
        }, 1000)
      }
      else if (mole.who==='f'){
        downIndex = 2;
        mole.out = setTimeout(function(){
          downTimer = setInterval(function(){
            mole.src = "../img/" + mole.who + downIndex + ".png";
            downIndex --;
            if (downIndex < 0){
              clearInterval(downTimer);
              clearInterval(mole.out);
              // delete mole element from box
              box.removeChild(mole);
            }
          }, 80)
        }, 1000)
        whack(mole);
      }
    }

    // gennerate many moles
    function showMole() {
      moleTimer = setInterval(function(){
        addMole()
      }, 1000)
    }
    // 8. whack a mole
    function whack(mole) {
      mole.onclick = function() {
        // close downTimer before whacking
        // clearInterval(mole.out)
        // clearInterval(downTimer)

        whackAnimation(mole);
        if (mole.who === 'm'){
          
          switch(mole.mineIndex) {
            case 0:
              current_score += 5
              break;
            
          }
          current_score += 10;
        }
        else if(mole.who === 'f'){
          current_score -= 10;
        }
        score.innerHTML = current_score;
      } 
    }
    // whack timer
    let whackTimer = null;
    let hitTimer = null;

    async function whackAnimation(mole){
      let whack = document.createElement("img")
      whack.style.top = sevenMolesPos[mole.holeIndex].top
      whack.style.left = sevenMolesPos[mole.holeIndex].left
      box.appendChild(whack)

      // mole.whack = setTimeout(function() {
        mole.src = "../img/m1" + mole.mineIndex + ".png";
        let whackIndex = 0; 
        whackTimer = setInterval(function(){
          console.log("whackIndex:" + whackIndex)
            whack.src = "../img/w" + whackIndex + ".png";
            whackIndex++;
            if (whackIndex >= 2) {
              clearInterval(whackTimer);
              // box.removeChild(whack);
            }
          }, 250)
          hitAnimation(whack)
          let hitIndex = 0;
          
          // }, 2000)
        }
        
    async function hitAnimation(whack) {
      hitTimer = setInterval(function() {
        console.log("hitIndex: " + hitIndex)
        whack.src = "../img/h" + hitIndex + ".png";
        hitIndex++;
        // console.log("hitIndex2: " + hitIndex)
        if (hitIndex >= 2){
          clearInterval(hitTimer);
          box.removeChild(whack);
          clearInterval(mole.out);
          clearInterval(downTimer);
          box.removeChild(mole);
        // clearInterval(mole.whack);
      }
    }, 200)
    }
}




