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

    // holes position [{}{}{}{}{}{}{}]
    let sevenPos = [
      {top: "11%", left: "5.5%"},
      {top: "8%", left: "24.5%"},
      {top: "11%", left: "44.5%"},
      {top: "25.5%", left: "26.5%"},
      {top: "27%", left: "50%"},
      {top: "40%", left: "8.5%"},
      {top: "41%", left: "42.5%"}
    ];
    // last hole index
    let lastIndex = -1;
    // timer for generating moles
    let moleTimer = null;
    // mole show up animation timer
    let upTimer = null;

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

    function timeReduce(){
        timer = setInterval(function (){
            timeboxWidth--;
            timebox.style.width = timeboxWidth+"px";
            if (timeboxWidth <= 0){
                clearInterval(timer);
                // gamer over
                gameover();
            }
        }, 50)
    }

    // 4 game over
    function gameover() {
        restartButton.style.display="block";
        gameoverBox.style.display="block";
        
        //stop generaing any mole
        clearInterval(moleTimer)
        alert("Game over!")
    }
    // 5 pause game
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
    // 6 generate mole
    function addMole() {
      // create imge
      let mole = document.createElement("img");
      // i. which random hole
      // generate a random index 0-7
      let holeIndex = Math.floor(Math.random()*7);
      // ensure no repetitive hole position
      while(holeIndex === lastIndex){
        holeIndex = Math.floor(Math.random()*7);
      }
      lastIndex = holeIndex;
      // while()
      // 7 holes locations
      console.log(sevenPos[holeIndex])
      // assign hole pos to mole
      mole.style.top = sevenPos[holeIndex].top
      mole.style.left = sevenPos[holeIndex].left
      // add mole image
      // mole.src="../img/m1.png"

      // ii. mole or snake
      let who = ''
      let randomNumber = Math.floor(Math.random()*10)
      if (randomNumber === 0) {
        who = 's';
      }
      else if (randomNumber === 1){
        who = 'f';
      }
      else who = 'm';

      box.appendChild(mole);
      // showing up
      let upIndex = 0
      upTimer = setInterval(function(){
        console.log(upIndex);
        mole.src = "../img/"+who+upIndex+".png";
        upIndex++;
        if (upIndex > 1){
          // setTimeout(function(){}, 500)
          // mole.src = "../img/m1"+Math.floor(Math.random()*7)+".png";
          clearInterval(upTimer);
          upIndex = 0;
        }
      }, 1000)
    }
    // gennerate many moles
    function showMole() {
      moleTimer = setInterval(function(){
        addMole()
      }, 1000)
    }
    // showMole()
}





