class Unit {

    constructor(imgPath, w, h) {
        var self = this
        this.ready = false
        this.image = new Image()
        this.image.onload = function () {
            self.ready = true
        }
        this.image.src = imgPath
        this.x = 0
        this.y = 0
        this.width = w
        this.height = h
    }

    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

var backgroundCanvas = document.getElementById("background-layer")
var backgroundCtx = backgroundCanvas.getContext("2d")
backgroundCanvas.width = 512;
backgroundCanvas.height = 512;

var gameCanvas = document.getElementById("game-layer")
gameCanvas.width = 512;
gameCanvas.height = 512;
var ctx = gameCanvas.getContext("2d")

var hero = new Unit("images/hero.png", 32, 32)


addEventListener("keydown", function (e) {
    update(e.keyCode)
}, false);

var tileSize = 32;
var game = new EscapeGame(gameCanvas.width / tileSize, gameCanvas.height / tileSize)
var field = game.getField()
field.setCell(5, 5, Cell.WALL)

game.onChanged = function () {
    renderField()
}

function renderField() {
    backgroundCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    for (var i = 0; i < field.height; ++i)
        for (var j = 0; j < field.width; ++j) {
            var y = i * tileSize;
            var x = j * tileSize;

            var cell = field.getCell(j, i)
            if (!game.fogOfWarField.isCellVisible(j, i) || cell === Cell.WALL) {
                backgroundCtx.fillRect(x, y, tileSize, tileSize);
            }
            else {
                backgroundCtx.rect(x, y, tileSize, tileSize);
            }
            backgroundCtx.stroke();
        }
}

var render = function () {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    if (hero.ready) {
        hero.x = game.player.x * tileSize;
        hero.y = game.player.y * tileSize;
        hero.render(ctx)
    }
}

var update = function (keyCode) {
    if (38 == keyCode) { // Player holding up
        game.movePlayer(MovementDirection.DOWN)
    }
    if (40== keyCode) { // Player holding down
        game.movePlayer(MovementDirection.UP)
    }
    if (37== keyCode) { // Player holding left
        game.movePlayer(MovementDirection.LEFT)
    }
    if (39 == keyCode) { // Player holding right
        game.movePlayer(MovementDirection.RIGHT)
    }
};

var main = function () {
    var now = Date.now()
    var delta = now - then

    update()
    render()
    then = now

    window.requestAnimationFrame(main)
}

var then = Date.now()

window.onload = function () {
    renderField()
    main()
}