console.log('1111')
window.onload = function() {
    const box = document.querySelector('.box');
    const score = document.querySelector('.score');
    const timebox = document.querySelector('.time');
    const pauseButton = document.querySelector('.pause');
    const startButton = document.querySelector('.start');
    const restartButton = document.querySelector('.restart');
    const gameoverBox = document.querySelector(".gameover");
    let current_score = 0;

    const timer = null;
    const timeboxWidth = timebox.offsetWidth
    connsole.log('a')
    console.log(timebox)
    console.log(timeboxWidth)
    // ture => game has started; false => game is paused
    let gameState = true;

    startButton.onclick = function(){
        // hide start button after clicked
        this.style.display = 'None';
        // show pause button
        pauseButton.style.display = 'block';
        timeReduce();
    }

    function timeReduce(){
        timer.setInterval(function (){
            timeboxWidth--;
            timeboxWidth.style.width = timeboxWidth+"px";
            if (timeboxWidth <= 0){
                clearInterval(timer);
                // gamer over
                gameover();
            }
        }, 500)
    }


    function gameover() {
        restartButton.style.display="block";
        gameoverBox.style.display="block";
        
        alert("Game over!")
    }

    pauseButton.onclick = function(){
        if(gameState) {
            clearInterval(timer);
            // pause button => continue button
            // this.style.backgroundImage=
        }
        else{
            timeReduce();
            // start button => pause button
            // this.style.backgroundImage=
            gamestate = true;
        }
    }
    // generate mole
    function addMole() {

    }

}





