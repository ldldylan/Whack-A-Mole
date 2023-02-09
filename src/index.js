const { has } = require("immutable");
const { async } = require("regenerator-runtime");

let bestScore = 0;

// sound effect 
let hasSound = false;

window.onload = function() {
    // 1. Initializing game elements
    const splash = document.querySelector('splash')
    const box = document.querySelector('.box');
    const showScore = document.querySelector('.score');
    const showBestScore = document.querySelector('.best_score');
    const showMaxCombo = document.querySelector('.max_combo');
    const showCombo = document.querySelector('.combo');
    const timebox = document.querySelector('.time');
    const HPbox = document.querySelector('.HP')

    // Mine
    const showIron = document.querySelector(".iron")
    const showCopper = document.querySelector(".copper")
    const showRuby = document.querySelector(".ruby")
    const showBlackGem = document.querySelector(".black_gem")
    const showSapphire = document.querySelector(".sapphire")
    const showDiamond = document.querySelector(".diamond")
    const showTreasure = document.querySelector(".treasure")

    const startButton = document.querySelector('.start');
    const pauseButton = document.querySelector('.pause');
    const resumeButton = document.querySelector('.resume');
    const restartButton = document.querySelector('.restart');
    const gameoverBox = document.querySelector('.gameover');

    const unmuteSoundButton = document.querySelector(".unmute-sound")
    const unmuteMusicButton = document.querySelector(".unmute-music")
    const muteSoundButton = document.querySelector(".mute-sound")
    const muteMusicButton = document.querySelector(".mute-music")


    let timer = null;
    let timeboxWidth = timebox.offsetWidth;
    let HPboxWidth = HPbox.offsetWidth;

    let currentScore = 0;
    let maxCombo = 0;
    let combo = 0;
    showBestScore.innerHTML = bestScore;

    let iron = 0;
    let copper = 0;
    let ruby = 0;
    let blackGem = 0;
    let sapphire = 0;
    let diamond = 0;
    let treasure = 0;

    // ture => game has started; false => game is paused
    // let gameState = true;

    // seven positions for moles to show up [{}{}{}{}{}{}{}]
    let sevenMolesPos = [
      {top: "11%", left: "5.5%"},
      {top: "8%", left: "24.5%"},
      {top: "11%", left: "44.5%"},
      {top: "25.5%", left: "26.5%"},
      {top: "27%", left: "50%"},
      {top: "40%", left: "8.5%"},
      {top: "41%", left: "42.5%"}
    ];

    // seven positions for snakes to show up
    let sevenSnakePos = [
      {top: "6%", left: "5.5%"},
      {top: "2.4%", left: "24.5%"},
      {top: "6%", left: "44.5%"},
      {top: "20.5%", left: "26.5%"},
      {top: "21.5%", left: "50.5%"},
      {top: "34.2%", left: "8.5%"},
      {top: "36%", left: "42.5%"}
    ];


    // previous hole index
    let prevIndex = -1;
    // timer for generating moles
    let moleTimer = null;
    // mole shows up animation timer
    let upTimer = null;
    // mole goes down 
    let downTimer = null;
    
    // 1b. mute/unmute sound effect and music
    unmuteSoundButton.onclick = function(){
      unmuteSoundButton.style.display = 'None';
      muteSoundButton.style.display = 'block';
      hasSound = true;
    }

    muteSoundButton.onclick = function() {
      muteSoundButton.style.display = 'None';
      unmuteSoundButton.style.display = 'block';
      hasSound = false;
    }

    const BGM = new Audio("audio/BGM.mp3");
    BGM.loop = true;
    
    unmuteMusicButton.onclick = function(){
      unmuteMusicButton.style.display = 'None';
      muteMusicButton.style.display = 'block';
      BGM.play();
    }

    muteMusicButton.onclick = function() {
      muteMusicButton.style.display = 'None';
      unmuteMusicButton.style.display = 'block';
      // BGM.volume = 0;
      BGM.pause();
    }

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
            HPbox.style.width = HPboxWidth + "px";
            if (currentScore >= bestScore) {
              bestScore = currentScore;
              showBestScore.innerHTML = bestScore;
            }
            if (timeboxWidth <= 0 || HPboxWidth <= 0){
                if (HPboxWidth <= 0) {
                  HPbox.style.width = 0 + 'px';
                  if (hasSound) {
                    const defeatSound = new Audio("audio/defeat.mp3")
                    defeatSound.play();
                  }
                }
                clearInterval(timer);
                clearInterval(moleTimer);
                clearInterval(downTimer);
                // gamer over
                gameover();
            }
        }, 300)
    }

    // 4. game over
    function gameover() {
        restartButton.style.display = "block";
        pauseButton.style.display = 'none';
        gameoverBox.style.display = "block";
        
        // while (box.firstChild){
          // console.log(box.array)
          // console.log(box.lastChild.nodeName)
          // box.removeChild(box.firstChild);
        // }
        // console.log(box.hasChildNodes("IMG"))
        
        if (currentScore > bestScore) {
          bestScore = currentScore;
          showBestScore.innerHTML = bestScore;
        }
        if (currentScore > 5000 || combo > 30) {
          if (hasSound) {
            const victorySound = new Audio("audio/victory.mp3");
            victorySound.play();
          }
        }
        // stop generaing any mole
        clearInterval(moleTimer);
        // stop hiding 
        // clearInterval(mole.out);
        clearInterval(downTimer);
        // clean all child node in box

        // for (let i = box.children.length - 1; i > 0 ;i--) {
        //   if (box.children[i].nodeName === 'IMG'){
        //     // console.log(".......................")
        //     // console.log(box.children)
        //     // console.log('11111111111111111')
        //     box.removeChild(box.children[i]);
        //     // console.log(box.childNodes[i])
        //     // console.log(box.children)
        //   }
        // }
        
        // alert("Game over!")
        restart()
    }
    // 5. pause game
    pauseButton.onclick = function(){
      // pause game timer
      clearInterval(timer);
      // pause generating mole
      clearInterval(moleTimer);
      // hide pause button
      pauseButton.style.display = 'none';
      // show resume button
      resumeButton.style.display = 'block';
    }

    // 5.b resume game 
    resumeButton.onclick = function() {
      // hide resume button
      resumeButton.style.display = 'none';
      // hide pause button
      pauseButton.style.display = 'block';
      // resume timer
      timeReduce(); 
      // resume mole genertor
      showMole();
    }

    // }
    // 6. generate mole
    async function addMole() {
      // create imge
      let mole = document.createElement("img");
      // i. mole or snake
      mole.who = ''
      let randomNumber = Math.floor(Math.random()*10)
      if (randomNumber === 0) {
        mole.who = 's';
      }
      else if (randomNumber === 9){
        mole.who = 'f';
      }
      else mole.who = 'm';

      // ii. which hole
      // generate a random index 0-7
      mole.holeIndex = Math.floor(Math.random()*7);
      // ensure no repetitive hole position
      while(mole.holeIndex === prevIndex){
        mole.holeIndex = Math.floor(Math.random()*7);
      }
      prevIndex = mole.holeIndex;
      // 7. holes locations
      // assign hole pos to mole
      if (mole.who === 'm' || mole.who === 'f') {
        mole.style.top = sevenMolesPos[mole.holeIndex].top
        mole.style.left = sevenMolesPos[mole.holeIndex].left
      }
      // assign hole pos to snake
      else if (mole.who === 's') {
        mole.style.top = sevenSnakePos[mole.holeIndex].top
        mole.style.left = sevenSnakePos[mole.holeIndex].left
      }
      // add mole image
      // mole.src="img/m1.png"
      
      // console.log(`${mole.who} is at hole ${mole.holeIndex}`)
      
      box.appendChild(mole);
      // console.log(box.children)

      // showing up
      let upIndex = 0;
      upTimer = setInterval(function(){
        if (mole.who === 'm' || mole.who === 'f'){
          mole.src = "img/" + mole.who + upIndex + ".png";
          upIndex++;
          if (mole.who==='m' && upIndex > 1){
            setTimeout(function(){}, 80)
            mole.mineIndex = Math.floor(Math.random()*7);
            mole.src = "img/m1" + mole.mineIndex + ".png";
            clearInterval(upTimer);
          }
          else if(mole.who==='f' && upIndex > 1){
            setTimeout(function(){}, 80)
            mole.src = "img/f2.png";
            clearInterval(upTimer);
          }
        }
        else {
          mole.src = "img/s" + upIndex + ".png";
          upIndex++;
          if (upIndex > 2) {
            clearInterval(upTimer);
          }
        }
      }, 100)

      // Going down
      let downIndex = 1 
      if (mole.who === 'm'){
        await whack(mole);
        // let moel stays for 1 sec
        mole.out = setTimeout(function(){
          downTimer = setInterval(function(){
            mole.src = "img/m" + downIndex + ".png";
            downIndex --;
            if (downIndex < 0){
              clearInterval(downTimer);
              clearInterval(mole.out);
              // delete mole element from box
              if (box.hasChildNodes(mole)){
                box.removeChild(mole);
              }
              combo = 0;
              showCombo.innerHTML = combo; 
            }
          }, 80)
        }, 1000)
      }
      else if (mole.who === 'f'){
        downIndex = 2;
        await whack(mole);
        mole.out = setTimeout(function(){
          downTimer = setInterval(function(){
            mole.src = "img/f" + downIndex + ".png";
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
      else if (mole.who === 's'){
        downIndex = 1;
        await whack(mole);
        mole.out = setTimeout(function(){
          downTimer = setInterval(function(){
            mole.src = "img/s4.png";
            downIndex --;
            // snake bite sound
            const snakeSound= new Audio("audio/snake-attack.mp3");
            snakeSound.play();
            if (downIndex < 0){
              HPboxWidth -= 68;
              HPbox.style.width = HPboxWidth + 'px';
              clearInterval(downTimer);
              clearInterval(mole.out);
              // delete mole element from box
              box.removeChild(mole);
              combo = 0;
              showCombo.innerHTML = combo; 
            }
          }, 200)
        }, 1000)
      }
    }

    // gennerate many moles
    async function showMole() {
      moleTimer = setInterval(async function(){
        await addMole()
      }, 1000)
    }
    // 8. whack a mole
    async function whack(mole) {
      mole.onclick = async function() {
        // close downTimer before whacking
        clearInterval(mole.out)
        clearInterval(downTimer)
        
        await whackAnimation(mole);
        if (mole.who === 'm'){
          
          combo += 1;
          switch(mole.mineIndex) {
            case 0:
              iron += 1;
              showIron.innerHTML = iron;
              currentScore += 5 * (1 + Math.floor(combo/3));
              break;
            case 1:
              copper += 1;
              showCopper.innerHTML = copper;
              currentScore += 10 * (1 + Math.floor(combo/3));
              break;
            case 2:
              ruby += 1;
              showRuby.innerHTML = ruby;
              currentScore += 15 * (1 + Math.floor(combo/3));
              break;
            case 3:
              blackGem += 1;
              showBlackGem.innerHTML = blackGem;
              currentScore += 20 * (1 + Math.floor(combo/3));
              break;
            case 4:
              sapphire += 1;
              showSapphire.innerHTML = sapphire;
              currentScore += 25 * (1 + Math.floor(combo/3));
              break;
            case 5:
              diamond += 1;
              showDiamond.innerHTML = diamond;
              currentScore += 30 * (1 + Math.floor(combo/3));
              break;
            case 6:
              treasure += 1;
              showTreasure.innerHTML = treasure;
              currentScore += 40 * (1 + Math.floor(combo/3));
              break;
          }
        }
        else if(mole.who === 'f'){
          currentScore -= 10 * (1 + Math.floor(combo/3));
          combo = 0;
        }
        else if(mole.who === 's'){
          combo += 1;
          currentScore += 5 * (1 + Math.floor(combo/3));
        }
        showCombo.innerHTML = combo;
        showScore.innerHTML = currentScore;
        if (combo >= maxCombo){
          maxCombo = combo;
          showMaxCombo.innerHTML = maxCombo;
        }
      } 
    }

    async function whackAnimation(mole){
      let hit = document.createElement("img")
      hit.style.top = sevenMolesPos[mole.holeIndex].top
      hit.style.left = sevenMolesPos[mole.holeIndex].left
      box.appendChild(hit)
      
      let hitIndex = 0; 
      hitTimer = setInterval(function(){
      hit.src = "img/w" + hitIndex + ".png";
      hitIndex++;
        // play whack sound effect 
        if (hasSound && hitIndex === 2 && (mole.who === 'm' || mole.who === 's')) {
          const hitSound = new Audio("audio/whack.mp3");
          hitSound.play();
        }
        else if (hasSound && hitIndex === 2 && mole.who === 'f') {
          const hitSound = new Audio("audio/wrong-whack.mp3");
          hitSound.play();
        }

        if (hitIndex > 5) {
          clearInterval(hitTimer);
          // clearInterval(mole.out);
          // clearInterval(downTimer);
          box.removeChild(hit);
          if (mole.who === 'm'){
            mole.hurt = setTimeout(function() {
            mole.src = "img/m2.png";
            let hurtIndex = 0
            hurtTimer = setInterval(function(){
              mole.src = "img/m1" + mole.mineIndex + hurtIndex + ".png"
              hurtIndex++;
              if (hurtIndex > 4) {
                clearInterval(hurtTimer);
                clearInterval(mole.hurt);
                box.removeChild(mole);
              }
              }, 100)
            }, 50)
          }
          else if (mole.who === 'f'){
            let hurtIndex = 0
            hurtTimer = setInterval(function(){
              mole.src = "img/f3.png";
              hurtIndex++;
              if (hurtIndex > 1){
                clearInterval(hurtTimer);
                box.removeChild(mole);
              }
            }, 100)
          }
          else if (mole.who === 's') {
            let hurtIndex = 0
            hurtTimer = setInterval(function(){
              mole.src = "img/s3.png";
              hurtIndex++;
              if (hurtIndex > 1){
                clearInterval(hurtTimer);
                box.removeChild(mole);
              }
            }, 100)
          }
        }
      }, 80)
    }
    // restart a new game
    function restart() {
      restartButton.onclick = function() {
        // hide restart button 
        this.style.display = 'none';
        pauseButton.style.display = 'block';
        gameoverBox.style.display = 'none';
        // refill timer and HP bars
        timeboxWidth = 202;
        timebox.style.width = timeboxWidth + 'px';
        HPboxWidth = 202;
        HPbox.style.width = timeboxWidth + 'px';
        
        currentScore = 0;
        maxCombo = 0;
        combo = 0;
        iron = 0;
        copper = 0;
        ruby = 0;
        blackGem = 0;
        sapphire = 0;
        diamond = 0;
        treasure = 0;

        showScore.innerHTML = currentScore;
        showMaxCombo.innerHTML = maxCombo;
        showCombo.innerHTML = combo;
        showIron.innerHTML = iron;
        showCopper.innerHTML = copper;
        showRuby.innerHTML = ruby;
        showBlackGem.innerHTML = blackGem;
        showSapphire.innerHTML = sapphire;
        showDiamond.innerHTML = diamond;
        showTreasure.innerHTML = treasure;
        timeReduce();
        showMole();
      }

    }
}




