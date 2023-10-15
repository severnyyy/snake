if (localStorage.getItem('score')) {
    const bestResult = document.querySelector('.scoreboard__best')
    bestResult.textContent = `Best: ${localStorage.getItem('score')}`;
}

const tailStyle = 'background-color: #0e8f10; border-radius: 10px;'
const snakeHead = 'background-color: #085409; border-radius: 10px;'
const foodStyle = 'background-color: red; border-radius: 10px;'
let id
class Cell {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    collide(food, score) {
        if (this.x === food.x && this.y === food.y) {
            this.bump(food, score)
            if (this.speed > 200) { this.speed = this.speed - this.speed * 0.05 }
            console.log(this.speed)
            food.bump(this, score)
        }
    }
}

class Field {
    constructor(x, y) {
        this.numX = x
        this.numY = y
        this.fieldNode = document.querySelector('.field')
        this.draw()
    }

    draw() {
        let str = ''
        for (let i = 1; i <= this.numX; i = i + 1) {
            for (let j = 1; j <= this.numY; j = j + 1) {
                str = str + `<div class="field__cell" data-coord="[${i}, ${j}]"></div>`
            }
        }
        this.fieldNode.innerHTML = str
    }
}

class Score {
    constructor(score) {
        this.score = score
}

    resetToZero() {
        this.score = 0
        this.draw()
    }

    draw() {
        this.scoreNode = document.querySelector(`.scoreboard__now`)
        this.scoreNode.innerHTML = `Now: ${this.score}`
    }

    increase() {
        this.score = this.score + 1
        this.draw()
        if (localStorage.getItem('score')) {
            if (localStorage.getItem('score') < this.score) {
                localStorage.setItem('score', this.score)
            }
        } else {
            localStorage.setItem('score', this.score)
        }
    }
}

class Snake extends Cell {

    constructor(x, y, food, score) {
        super(x, y)
        this.speed = 500
        this.isMoving = false
        this.coorSnake = [
            { x: this.x + 1, y: this.y },
            { x: this.x, y: this.y }
        ]
        this.foodX = food.x
        this.foodY = food.y
        this.draw()
    }

    draw() {
        this.tailNode = document.querySelector(`[data-coord="[${this.coorSnake[0].x}, ${this.coorSnake[0].y}]"]`)
        this.tailNode.style = tailStyle
        this.snakeHeadNode = document.querySelector(`[data-coord="[${this.coorSnake[this.coorSnake.length - 1].x}, ${this.coorSnake[this.coorSnake.length - 1].y}]"]`)
        this.snakeHeadNode.style = snakeHead
        const foodNode = document.querySelector(`[data-coord="[${this.foodX}, ${this.foodY}]"]`)
        foodNode.style = foodStyle
    }

    update(foodX, foodY) {
        if (foodX && foodY) {
            this.foodX = foodX
            this.foodY = foodY
        }
        const allCell = document.querySelectorAll('.field__cell');
        allCell.forEach((item) => {
            item.style = 'background-color: #151715;'
            for (let i = 0; i < this.coorSnake.length; i = i + 1) {
                const tailNode = document.querySelector(`[data-coord="[${this.coorSnake[i].x}, ${this.coorSnake[i].y}]"]`)
                tailNode.style = tailStyle
            }
            this.draw()
        })
    }

    bump(cell, score) {
        this.coorSnake.unshift({ x: cell.x, y: cell.y })
        score.increase()
    }

    death() {
        const allCell = document.querySelectorAll('.field__cell');
        this.x = null
        this.y = null
        const bestResult = document.querySelector('.scoreboard__best');
        const btnRestart = document.querySelector('.btn-restart');
        bestResult.textContent = `Best: ${localStorage.getItem('score')}`;
        btnRestart.style = 'display: block;'
        this.tailNode = null
    }

    collideTail(food) {
        if (this.x !== food.x && this.y !== food.y) {
            for (let i = 0; i < this.coorSnake.length - 1; i = i + 1) {
                if (this.x === this.coorSnake[i].x && this.y === this.coorSnake[i].y && this.x !== food.x && this.y !== food.y) {
                    this.death()
                    clearInterval(id)
                }
            }
        }
    }

    move(code, food, score) {

            if (!this.isMoving) {
                id = setInterval(() => {
                    if (code === 'ArrowUp') {
                        if (this.x === 1) { this.x = 11 }
                        this.coorSnake.push({ x: this.x = this.x - 1, y: this.y })
                        this.coorSnake.shift()
                    } else if (code === 'ArrowLeft') {
                        if (this.y === 1) { this.y = 11 }
                        this.coorSnake.push({ x: this.x, y: this.y = this.y - 1})
                        this.coorSnake.shift()
                    } else if (code === 'ArrowRight') {
                        if (this.y === 10) { this.y = 0 }
                        this.coorSnake.push({ x: this.x, y: this.y = this.y + 1})
                        this.coorSnake.shift()
                    } else if (code === 'ArrowDown') {
                        if (this.x === 10) { this.x = 0 }
                        this.coorSnake.push({ x: this.x = this.x + 1, y: this.y})
                        this.coorSnake.shift()
                    }
                    if (this.x !== null && this.y !== null) {
                        this.collideTail(food)
                        this.update()
                        this.collide(food, score)
                    }
                }, this.speed);
            }

            setTimeout(function() {
                clearInterval(id);
            }, 50000);
    }
}

class Food extends Cell {

    constructor(x, y) {
        super(x, y)
        this.foodNode = document.querySelector(`[data-coord="[${this.x}, ${this.y}]"]`)
        this.foodNode.style = foodStyle
    }

    bump(snake) {
        this.foodNode.style = snakeHead
        this.x = random (1, 10)
        this.y = random (1, 10)
        const matchСhecking = () => {
            snake.coorSnake.forEach((item) => {
                if (this.x === item.x && this.y === item.y) {
                    this.x = random (1, 10)
                    this.y = random (1, 10)
                    matchСhecking()
                } else {
                    return
                }
            })
        }
        matchСhecking()
        this.foodNode.style = foodStyle
        snake.update(this.x, this.y)
    }
}

class Game {
    constructor() {
        this.startCoorX = 5;
        this.startCoorY = 5;
    }

    play() {
        const field = new Field(10, 10);
        const score = new Score(0);
        const food = new Food(random(1, 10), matchСhecking(random(1, 10)));
        const snake = new Snake(this.startCoorX, this.startCoorY, food, score);
        let direction = '';

        snake.move('ArrowUp', food, score);

        document.addEventListener('keydown', (event) => {
            this.isMoving = false
            
            if (!this.isMoving) {
                let dir = event.code;

                if(dir !== direction){
                    clearInterval(id);
                    if (event.code === 'ArrowDown' && direction === 'ArrowUp') {
                        dir = direction;
                    }
                    if (event.code === 'ArrowUp' && direction === 'ArrowDown') {
                        dir = direction;
                    }
                    if (event.code === 'ArrowRight' && direction === 'ArrowLeft') {
                        dir = direction;
                    }
                    if (event.code === 'ArrowLeft' && direction === 'ArrowRight') {
                        dir = direction;
                    }
                    snake.move(dir, food, score);
                    this.isMoving = true;
                    direction = dir;
                }
            }
        });
    }
}

function random (min, max) {
    let result = Math.floor(Math.random() * (max - min + 1) + min)
    return result
}

const matchСhecking = (number) => {
    if (number === 5) {
        number = random (1, 10)
        return matchСhecking(number)
    } else {
        return number
    }
}

const triggerBeginGame = document.querySelector('.begin');
const allCell = document.querySelectorAll('.field__cell');
const inscription = document.querySelector('.begin');
let reload = null

triggerBeginGame.addEventListener('click', () => {
    if (reload) {
        location.reload()
    }
    inscription.style = 'display: none'
    allCell.forEach(function(item) {
        item.style = 'background-color: #151715;'
    })
    const playing = new Game()
    playing.play()
    reload = true
})

const btnRestart = document.querySelector('.btn-restart');
btnRestart.addEventListener('click', () => {
    location.reload()
    allCell.forEach(function(item) {
        item.style = 'background-color: #151715;'
    })
    const playing = new Game()
    playing.play()
    btnRestart.style = 'display: none;'
})