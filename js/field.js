class Field {

    constructor(height, width) {
        this.height = height
        this.width = width
        this.field = new Array(height * width)

        for (let i = 0; i < width * height; i++) {
            this.field[i] = Cell.EMPTY
        }
        new MazeGenerator().generate(this, 0, 0, 0, 0)
    }

    getCell(x, y) {
        return this.field[y * this.width + x]
    }

    setCell(x, y, value) {
        this.field[y * this.width + x] = value
    }

    isInBound(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height
    }
}

class Player {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class EscapeGame {

    constructor(height, width) {
        this.field = new Field(height, width)
        this.player = new Player(1, 1)
        this.fogOfWarField = new FogOfWarField(this.field)
        this.onChanged = function () { }
    }

    render(millis) {

    }

    movePlayer(direction) {
        if (this.tryMovePlayer(direction)) {
            this.onChanged.call()
        }
    }

    getField() {
        return this.field
    }

    tryMovePlayer(direction) {
        var pos = getNextPosition(this.player.x, this.player.y, direction)
        if (!this.field.isInBound(pos.x, pos.y)) {
            return false
        }
        if (this.field.getCell(pos.x, pos.y) == Cell.EMPTY) {
            this.player.x = pos.x
            this.player.y = pos.y
            this.fogOfWarField.setPlayerPosition(pos.x, pos.y)
            this.fogOfWarField.setPlayerMovementDirection(direction)
            return true
        }
        return false
    }
}

class MazeGenerator {

    generate(field, fromX, fromY, toX, toY) {
        for (let i = 0; i < field.width; i++) {
            field.setCell(i, 0, Cell.WALL)
            field.setCell(i, field.height - 1, Cell.WALL)
        }
        for (let i = 0; i < field.height; i++) {
            field.setCell(0, i, Cell.WALL)
            field.setCell(field.width - 1, i, Cell.WALL)
        }
        for (let i = 0; i < field.width; i = i + 2) {
            for (let j = 0; j < field.height; j = j + 2) {
                field.setCell(i, j, Cell.WALL)
            }
        }
    }
}

class FogOfWarField {

    constructor(field) {
        this.field = field
        this.playerX = 0
        this.playerY = 0
        this.playerDirection = MovementDirection.RIGHT
    }

    setPlayerPosition(x, y) {
        this.playerX = x
        this.playerY = y
    }

    setPlayerMovementDirection(direction) {
        this.playerDirection = direction
    }

    isCellVisible(x, y) {
        let roundVisibility = distanceBetween(this.playerX, this.playerY, x, y) <= 2.0
        let directVisibilityDistance = 5
        let diffY = getNextPosition(this.playerX, this.playerY, this.playerDirection).y - this.playerY
        if (x == this.playerX
            && diffY != 0
            && (y - this.playerY) / diffY > 0
            && Math.abs(y - this.playerY) <= directVisibilityDistance) {

            let dist = getDirectVisibilityDistance(this.field, this.playerX, this.playerY, this.playerDirection, directVisibilityDistance)
            return dist >= Math.abs(y - this.playerY)
        }
        let diffX = getNextPosition(this.playerX, this.playerY, this.playerDirection).x - this.playerX
        if (y == this.playerY 
            && diffX != 0
            && (x - this.playerX) / diffX > 0
            && Math.abs(x - this.playerX) <= directVisibilityDistance) {
            
            let dist = getDirectVisibilityDistance(this.field, this.playerX, this.playerY, this.playerDirection, directVisibilityDistance)
            return dist >= Math.abs(x - this.playerX)
        }
        return roundVisibility
    }
}

function getDirectVisibilityDistance(field, x, y, direction, maxDistance) {
    let currentPos = { x: x, y: y }
    let distance = 0
    for (let i = 0; i <= maxDistance; i++) {
        let pos = getNextPosition(currentPos.x, currentPos.y, direction)
        if (field.getCell(pos.x, pos.y) != Cell.WALL) {
            distance++
            currentPos = pos
        } else {
            return distance
        }
    }
    return distance
}

function getNextPosition(x, y, direction) {
    switch (direction) {
        case MovementDirection.UP:
            return { x: x, y: y + 1 }
        case MovementDirection.LEFT:
            return { x: x - 1, y: y }
        case MovementDirection.DOWN:
            return { x: x, y: y - 1 }
        case MovementDirection.RIGHT:
            return { x: x + 1, y: y }
    }
}

function distanceBetween(x, y, x1, y1) {
    return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1))
}

var MovementDirection = {
    UP: 0,
    LEFT: 1,
    DOWN: 2,
    RIGHT: 3
}

var Cell = {
    EMPTY: 0,
    WALL: 1,
    PLAYER: 2
}
