document.addEventListener('DOMContentLoaded' , () => {
    const score = document.querySelector('.score')
    const bird = document.querySelector('.bird')
    const birdWings = bird.querySelector('img')
    const gameDisplay = document.querySelector('.game-container')
    const ground = document.querySelector('.ground')
    console.log("%cPodvádět se nemá!", "color: #b51982; font-size: xx-large")

    let birdLeft = 220
    let birdBottom = 100
    let gravity = 3
    let isGameOver = false
    let gap = 430
    let points = 0
    let gameTimerId = undefined


    function startGame() {
        document.body.focus()
        birdBottom -= gravity
        bird.style.bottom = birdBottom + 'px'
        bird.style.left = birdLeft + 'px'
    }

    document.addEventListener('keyup', controlStart)
    function controlStart(e) {
        if (e.keyCode === 32) {
            begin()
            document.removeEventListener('keyup', controlStart)
        }
    }

    function controlEnd(e) {
        if (e.keyCode === 32 && e.altKey) {
            restart()
            document.removeEventListener('keyup', controlEnd)
        }
    }

    document.querySelector('.restart-btn').addEventListener('click', restart);

    function control(e) {
        if (e.keyCode === 32) {
            jump()
        }
    }
    

    function jump() {
        if (birdBottom < 500) {
            birdBottom += 50
            birdWings.classList.add('wing-flap')
            setTimeout(() => {
                birdWings.classList.remove('wing-flap')
            }, 166)
        }
        bird.style.bottom = birdBottom + 'px'
    }

    function generateObstacle() {
        let obstacleLeft = 500
        let randomHeight = Math.random() * 60
        let obstacleBottom = randomHeight
        const obstacle = document.createElement('div')
        const topObstacle = document.createElement('div')
        if (!isGameOver) {
            obstacle.classList.add('obstacle')
            topObstacle.classList.add('topObstacle')
        }
        gameDisplay.appendChild(obstacle)
        gameDisplay.appendChild(topObstacle)
        obstacle.style.left = obstacleLeft + 'px'
        topObstacle.style.left = obstacleLeft + 'px'
        obstacle.style.bottom = obstacleBottom + 'px'
        topObstacle.style.bottom = obstacleBottom + gap + 'px'

        function moveObstacle() {
            if (isGameOver) {
                clearInterval(timerId)
                return
            }
            obstacleLeft -=2
            obstacle.style.left = obstacleLeft + 'px'
            topObstacle.style.left = obstacleLeft + 'px'

            if (obstacleLeft === -60) {
                clearInterval(timerId)
                gameDisplay.removeChild(obstacle)
                gameDisplay.removeChild(topObstacle)
            }

            if (obstacleLeft === 160) {
                points += 1
                score.innerHTML = points
            }

            if (
                obstacleLeft > 200 && obstacleLeft < 280 && birdLeft === 220 &&
                (birdBottom < obstacleBottom + 153 || birdBottom > obstacleBottom + gap -200)||
                birdBottom <= 0 
                ) {
                clearInterval(timerId)
                gameOver()
            }
        }

        let timerId = setInterval(moveObstacle, 20) 
        
        if (!isGameOver) {
            setTimeout(generateObstacle, 3000)
        }

    }

    function begin () {
      document.body.classList.remove('game--start')
      document.addEventListener('keyup', control)
      ground.classList.add('ground-moving')
      ground.classList.remove('ground')
      gameTimerId = setInterval(startGame, 20)
      generateObstacle()
    }

    function gameOver() {
        isGameOver = true
        clearInterval(gameTimerId)
        console.log('game over')
        document.removeEventListener('keyup', control)
        ground.classList.add('ground')
        ground.classList.remove('ground-moving')
        end()
    }

    function end () {
      const finalScore = document.querySelector('.game-over-score')
      const finalPoints = points
      finalScore.innerHTML = finalPoints
      setInterval(() => {
        const finalScore = document.querySelector('.game-over-score')
        finalScore.innerHTML = finalPoints
      }, 200)
      document.body.classList.add('game--end')
      document.addEventListener('keyup', controlEnd)
    }

    function restart() {
        window.location.reload()
    }
})
   