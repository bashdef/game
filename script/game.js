//Переменные
let heroImg = window.document.querySelector('#hero-img')
let heroBlock = window.document.querySelector('#hero-block')
let canvas = window.document.querySelector('#canvas')
let fsBtn = window.document.querySelector('#fsBtn')
let jumpBlock = window.document.querySelector('#jump-block')
let hitBlock = window.document.querySelector('#hit-block')
let info = window.document.querySelector('#info')

let rightPosition = 0
let heroBlockPosition = 0
let timer = null
let x = 0
let direction = 'right'
let halfWidth = window.screen.width / 2
let hit = false
let jump = false
let tileArray = []
let objectsArrray = []
let enemiesArray = []
let maxLives = 6
let lives = 6
let heartsArray = []
let isRightSideBlocked = false
let isLeftSideBlocked = false
let wasHeroHit = false

let heroX = Math.floor((Number.parseInt(heroBlock.style.left)+32)/32)
let heroY = Math.floor(Number.parseInt(heroBlock.style.bottom)/32)

hitBlock.style.top = `${window.screen.height/2 - 128/2}px`
jumpBlock.style.top = `${window.screen.height/2 - 128/2}px`

//Функции
const moveWorldLeft = () => {
    objectsArrray.map((elem, index) => {
        elem.style.left = `${Number.parseInt(elem.style.left) - 32}px`
    })
    tileArray.map(elem => {
        elem[0] = elem[0] - 1
    })
    enemiesArray.map(elem => elem.moveLeft())
}
const moveWorldRight = () => {
    objectsArrray.map((elem, index) => {
        elem.style.left = `${Number.parseInt(elem.style.left) + 32}px`
    })
    tileArray.map(elem => {
        elem[0] = elem[0] + 1
    })
    enemiesArray.map(elem => elem.moveRight())
}
const updateHeroXY = () => {
    heroX = Math.floor((Number.parseInt(heroBlock.style.left)+32)/32)
    heroY = Math.floor(Number.parseInt(heroBlock.style.bottom)/32)

    info.innerText = `heroX = ${heroX}, heroY = ${heroY}`
}

const checkFalling = () => {
    let isFalling = true
    for(let i = 0; i < tileArray.length; i++){
        if((tileArray[i][0] === heroX) && ((tileArray[i][1] + 1) === heroY)){
            isFalling = false
        }
    }
    if(isFalling){
        info.innerText = info.innerText + ', Falling'
    } else {
        info.innerText = info.innerText + ', Not Falling'
    }
}

const moveRightHandler = () => {
    if(!isRightSideBlocked){
        heroImg.style.width = '896px'
        heroImg.src = 'img/Run.png'
        heroImg.style.transform = 'scale(1,1)'
        rightPosition = rightPosition + 1
        heroBlockPosition = heroBlockPosition + 1
        if(rightPosition > 6) {
            rightPosition = 0
        }
        heroImg.style.left = `-${rightPosition*128}px`
        heroBlock.style.left = `${heroBlockPosition*20}px`
    
        updateHeroXY()
        checkFalling()
        wasHeroHit = false
        moveWorldLeft()
    }
}

const moveLeftHandler = () => {
    if(!isLeftSideBlocked){
        heroImg.style.width = '896px'
        heroImg.src = 'img/Run.png'
        heroImg.style.transform = 'scale(-1,1)'
        rightPosition = rightPosition + 1
        heroBlockPosition = heroBlockPosition - 1
        if(rightPosition > 6) {
            rightPosition = 0
        }
        heroImg.style.left = `-${rightPosition*128}px`
        heroBlock.style.left = `${heroBlockPosition*20}px`
    
        updateHeroXY()
        checkFalling()
        wasHeroHit = false
        moveWorldRight()
    }
}

const standHandler = () => {
    heroImg.style.width = '512px'
    heroImg.src = 'img/Idle.png'
    switch (direction) {
        case 'right': {
            rightPosition = rightPosition + 1
            if(rightPosition > 3) {
                rightPosition = 1
            }
            break
        }
        case 'left': {
            rightPosition = rightPosition + 1
            if(rightPosition > 2) {
                rightPosition = 0
            }
            break
        }
        default: break
    }
    
    heroImg.style.left = `-${rightPosition*128}px`
}

const hitHandler = () => {
    heroImg.style.width = '640px'
    heroImg.src = 'img/Attack1.png'
    switch (direction) {
        case 'right': {
            rightPosition = rightPosition + 1
            if(rightPosition > 4) {
                rightPosition = 0
                hit = false
                wasHeroHit = true
            }
            break
        }
        case 'left': {
            rightPosition = rightPosition + 1
            if(rightPosition > 3) {
                rightPosition = 0
                hit = false
                wasHeroHit = true
            }
            break
        }
        default: break
    }
    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 128}px`;
}

const jumpHandler = () => {
    heroImg.style.width = '768px'
    heroImg.src = 'img/Jump.png'
    switch (direction) {
        case 'right': {
            rightPosition = rightPosition + 1
            if(rightPosition > 5) {
                rightPosition = 0
                jump = false
            }
            break
        }
        case 'left': {
            rightPosition = rightPosition + 1
            if(rightPosition > 4) {
                rightPosition = 0
                jump = false
            }
            break
        }
        default: break
    }

    rightPosition = rightPosition + 1;
    heroImg.style.left = `-${rightPosition * 128}px`;
}

const lifeCycle = () => {
    timer = setInterval(() => {
        if(hit){
            hitHandler()
        } else if (jump){
            jumpHandler()
        } else {
            standHandler()
        }
    }, 90)
}

let onTouchStart = (event) => {
    clearInterval(timer)
    x = (event.type === "mousedown") ? event.screenX : event.touches[0].screenX
    timer = setInterval(() => {
        if(x > halfWidth) {
            direction = 'right'
            moveRightHandler()
        } else {
            direction = 'left'
            moveLeftHandler()
        }
    }, 90)
}

let onTouchEnd = (event) => {
    clearInterval(timer)
    lifeCycle()
}

const createTile = (x, y = 1) => {
    let tile = window.document.createElement('img')
    tile.src = 'img/1 Tiles/Tile_02.png'
    tile.style.position = 'absolute'
    tile.style.left = `${x*32}px`
    tile.style.bottom = `${y*32}px`
    canvas.appendChild(tile)
    objectsArrray.push(tile)
    tileArray.push([x, y])
}
const createTile2 = (x, y = 0) => {
    let tile2 = window.document.createElement('img')
    tile2.src = 'img/1 Tiles/Tile_04.png'
    tile2.style.position = 'absolute'
    tile2.style.left = `${x*32}px`
    tile2.style.bottom = `${y*32}px`
    canvas.appendChild(tile2)
    objectsArrray.push(tile2)
}
const createTilesPlatform = (startX, startY, length) => {
    for (let i = 0; i < length; i++){
        createTile(startX + i, startY)
    }
}

const addTiles = (i) => {
    createTile(i)
    createTile2(i)
}

//Обработчики
window.onmousedown = onTouchStart
window.ontouchstart = onTouchStart

window.onmouseup = onTouchEnd
window.ontouchend = onTouchEnd

jumpBlock.onclick = () => {
    jump = true
}

hitBlock.onclick = () => {
    hit = true
}


fsBtn.onclick = () => {
    if(window.document.fullscreen){
        fsBtn.src = 'img/Fullscreen.png'
        window.document.exitFullscreen()
    } else {
        fsBtn.src = 'img/Close.png'
        canvas.requestFullscreen()
    }
}

heroImg.onclick = (event) => {
    event.preventDefault()
}

class Enemy {
    ATTACK = 'attack'
    DEATH = 'death'
    HURT = 'hurt'
    IDLE = 'idle'
    WALK = 'walk'

    state
    animateWasChanged
    lives

    startX
    posX
    posY
    img
    block
    blockSize
    spritePos
    spriteMaxPos
    timer
    sourcePath
    dir
    stop

    constructor(x, y){
        this.posX = x
        this.startX = this.posX
        this.posY = y
        this.blockSize = 96
        this.spritePos = 0
        this.spriteMaxPos = 3
        this.sourcePath = 'img/1/'
        this.dir = 1
        this.stop = false

        this.state = this.IDLE
        this.animateWasChanged = false
        this.lives = 30

        this.createImg()

        this.changeAnimate(this.WALK)
        enemiesArray.push(this)
        this.lifeCycle()
    }
    createImg(){
        this.block = window.document.createElement('div')
        this.block.style.position = 'absolute'
        this.block.style.left = `${this.posX*32}px`
        this.block.style.bottom = `${this.posY*32}px`
        this.block.style.width = `${this.blockSize}px`
        this.block.style.height = `${this.blockSize}px`
        this.block.style.overflow = 'hidden'

        this.img = window.document.createElement('img')
        this.img.src = this.sourcePath + 'Idle.png'
        this.img.style.position = 'absolute'
        this.img.style.left = `0px`
        this.img.style.bottom = `0px`
        this.img.style.width = `${this.blockSize*4}px`
        this.img.style.height = `${this.blockSize}px`
        this.block.appendChild(this.img)
        canvas.appendChild(this.block)
    }
    lifeCycle(){
        this.timer = setInterval(() =>{
            if(this.animateWasChanged){
                this.animateWasChanged = false
                switch(this.state){
                    case this.ATTACK: {
                        this.img.style.width = `${this.blockSize*6}px`
                        this.setAttack()
                        break
                    }
                    case this.DEATH: {
                        this.img.style.width = `${this.blockSize*6}px`
                        this.setDeath()
                        break
                    }
                    case this.HURT: {
                        this.img.style.width = `${this.blockSize*2}px`
                        this.setHurt()
                        break
                    }
                    case this.IDLE: {
                        this.img.style.width = `${this.blockSize*4}px`
                        this.setIdle()
                        break
                    }
                    case this.WALK: {
                        this.img.style.width = `${this.blockSize*6}px`
                        this.setWalk()
                        break
                    }
                    default: break
                }
            }
            this.spritePos++
            this.checkCollide()
            if(!this.stop){
                this.move()
            } else {
                if(this.state != this.DEATH){
                    if(this.state != this.HURT){
                        this.changeAnimate(this.ATTACK)
                    }
                }
            }
            this.animate()
        }, 90)
    }
    animate(){
        if(this.spritePos > this.spriteMaxPos){
            this.spritePos = 0
            if(this.state === this.ATTACK){
                lives--
                updateHearts()
            }
            if(this.state === this.HURT){
                this.changeAnimate(this.ATTACK)
                if(this.dir > 0) this.spritePos = 1
            }
            if(this.state === this.DEATH){
                clearInterval(this.timer)
                isRightSideBlocked = false
                isLeftSideBlocked = false
                if(this.dir > 0) this.spritePos = 5
            }
        }
        this.img.style.left = `-${this.spritePos * this.blockSize}px`
    }
    setAttack(){
        this.img.src = this.sourcePath + 'Attack.png'
        this.spriteMaxPos = 5
    }
    setDeath(){
        this.img.src = this.sourcePath + 'Death.png'
        this.spriteMaxPos = 5
    }
    setHurt(){
        this.img.src = this.sourcePath + 'Hurt.png'
        this.spriteMaxPos = 1
    }
    setIdle(){
        this.img.src = this.sourcePath + 'Idle.png'
        this.spriteMaxPos = 3
    }
    setWalk(){
        this.img.src = this.sourcePath + 'Walk.png'
        this.spriteMaxPos = 5
    }
    changeAnimate(stateStr){
        this.state = stateStr
        this.animateWasChanged = true
    }
    move(){
        if(this.posX > (this.startX + 10)){
            this.dir *= -1
            this.img.style.transform = "scale(-1,1)"
        } else if(this.posX < (this.startX)){
            this.dir = Math.abs(this.dir)
            this.img.style.transform = "scale(1,1)"
        }
        this.posX += this.dir
        this.block.style.left = `${this.posX*32}px`
    }
    checkHurt(){
        if(wasHeroHit){
            if(this.lives <= 10){
                wasHeroHit = false
                this.changeAnimate(this.DEATH)
            } else {
                wasHeroHit = false
                this.changeAnimate(this.HURT)
                this.showHurt()
                this.lives -= 10
            }
        }
    }
    checkCollide(){
        if(heroY == this.posY){
            if(heroX == this.posX){
                this.checkHurt()
                isRightSideBlocked = true
                this.stop = true
            } else if (heroX == (this.posX + 3)){
                this.checkHurt()
                isLeftSideBlocked = true
                this.stop = true
            } else {
                isRightSideBlocked = false
                isLeftSideBlocked = false
                this.stop = false
                this.changeAnimate(this.WALK)
            }
        } else {
            isRightSideBlocked = false
            isLeftSideBlocked = false
            this.stop = false
            this.changeAnimate(this.WALK)
        }
    }
    showHurt(){
        let pos = 0
        let text = window.document.createElement('p')
        text.innerText = '-10'
        text.style.position = 'absolute'
        console.log(this.block.style.left, this.block.style.bottom)
        text.style.left = `${(this.dir < 0) ? Number.parseInt(this.block.style.left) + 50 : Number.parseInt(this.block.style.left) + 10 }px`
        text.style.bottom = `${Number.parseInt(this.block.style.bottom) + 70}px`
        text.style.fontFamily = "'Bungee Spice', cursive"
        let hurtTimer = setInterval(() => {
            text.style.bottom = `${Number.parseInt(text.style.bottom) + 16}px`
            if(pos > 2){
                clearInterval(hurtTimer)
                text.style.display = 'none'
            }
            pos++
        }, 60)
        canvas.appendChild(text)
    }
    moveRight(){
        this.startX += 1
        this.posX += 1
    }
    moveLeft(){
        this.startX -= 1
        this.posX -= 1
    }
}

class Heart {
    img
    x
    constructor(x, src){
        this.x = x
        this.img = window.document.createElement('img')
        this.img.src = src
        this.img.style.position = 'absolute'
        this.img.style.left = `${this.x*50}px`
        this.img.style.bottom = `${((window.screen.height/50) - 2) * 50}px`
        this.img.style.width = 50
        this.img.style.height = 50

        canvas.appendChild(this.img)
    }
}

class EmptyHeart extends Heart {
    constructor(x){
        super(x, 'img/EmptyHeart.png')
    }
}

class FullHeart extends Heart {
    constructor(x){
        super(x, 'img/FullHeart.png')
    }
}

const addHearts = () => {
    for(let i = 0; i < maxLives; i++){
        let heartEmpty = new EmptyHeart(i)
        let heartFull = new FullHeart(i)
        heartsArray.push(heartFull)
    }
}

const updateHearts = () => {
    if(lives < 1){
        lives = 1
    }
    for(let i = 0; i < lives; i++){
        heartsArray[i].img.style.display = 'block'
    }
    for(let i = lives; i < maxLives; i++){
        heartsArray[i].img.style.display = 'none'
    }
}

const start = () => {
    lifeCycle()
    for (let i = 0; i < 60; i++){
        // if((i > 12) && (i < 17)){
        //     continue
        // }
        addTiles(i)
    }
    let enemy = new Enemy(10, 2)

    addHearts()
    updateHearts()
}

start()