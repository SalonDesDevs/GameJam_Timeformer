import {
    Application,
    Graphics,
    TextStyle,
    Text,
    Sprite,
    loader as PixiLoader
} from 'pixi.js';

const app = new Application(600, 600, {
    backgroundColor: 0x2a2a2a
});
document.body.appendChild(app.view);

let currentMap = 0;

const maps = [{
    platform: [
        // Left wall
        {
            x: -51,
            y: -1,
            h: 600,
            w: 50
        },
        // Right wall
        {
            x: 601,
            y: -1,
            h: 600,
            w: 50
        },
        {
            x: 0,
            y: 550,
            w: 600,
            h: 100
        },
        {
            x: 250,
            y: 250,
            w: 100,
            h: 300
        }
    ],
    start: {
        x: 50,
        y: 24
    },
    end: {
        x: 575,
        y: 525
    }
}, {
    platform: [
        // Left wall
        {
            x: -51,
            y: -1,
            h: 600,
            w: 50
        },
        // Right wall
        {
            x: 601,
            y: -1,
            h: 600,
            w: 50
        },
        {
            x: 0,
            y: 600,
            w: 600,
            h: 100
        }
    ],
    start: {
        x: 50,
        y: 24
    },
    end: {
        x: 575,
        y: 25
    }
}, {
    platform: [
        // Left wall
        {
            x: -51,
            y: -1,
            h: 600,
            w: 50
        },
        // Right wall
        {
            x: 601,
            y: -1,
            h: 600,
            w: 50
        },
        {
            x: 0,
            y: 600,
            w: 600,
            h: 100
        },
        {
            x: 0,
            y: 250,
            h: 50,
            w: 500
        }
    ],
    start: {
        x: 50,
        y: 24
    },
    end: {
        x: 25,
        y: 350
    }
}, {
    platform: [
        // Left wall
        {
            x: -51,
            y: -1,
            h: 600,
            w: 50
        },
        // Right wall
        {
            x: 601,
            y: -1,
            h: 600,
            w: 50
        },
        {
            x: 0,
            y: 600,
            w: 600,
            h: 100
        },
        {
            x: 0,
            y: 550,
            h: 50,
            w: 450
        },
        {
            x: 0,
            y: 500,
            h: 50,
            w: 400
        },
        {
            x: 0,
            y: 450,
            h: 50,
            w: 350
        },
        {
            x: 0,
            y: 400,
            h: 50,
            w: 300
        },
        {
            x: 0,
            y: 350,
            h: 50,
            w: 250
        },
        {
            x: 0,
            y: 300,
            h: 50,
            w: 200
        },
        {
            x: 0,
            y: 250,
            h: 50,
            w: 150
        },
        {
            x: 0,
            y: 200,
            h: 50,
            w: 100
        },
        {
            x: 0,
            y: 150,
            h: 50,
            w: 50
        },
    ],
    start: {
        x: 575,
        y: 25
    },
    end: {
        x: 25,
        y: 25
    }
}];


let square = new Graphics();

square.beginFill(0xbcbcbc);
square.lineStyle(1, 0xbcbcbc, 1);

square.moveTo(50, 50);
square.lineTo(100, 50);
square.lineTo(100, 100);
square.lineTo(50, 100);

let darkerSquare = new Graphics();

darkerSquare.beginFill(0x7b7b7b);
darkerSquare.lineStyle(1, 0x7b7b7b, 1);

darkerSquare.moveTo(50, 50);
darkerSquare.lineTo(100, 50);
darkerSquare.lineTo(100, 100);
darkerSquare.lineTo(50, 100);
darkerSquare.endFill();
let platform;
let player;

function setup(map) {

    app.stage.removeChildren();
    player = new Sprite(square.generateCanvasTexture());

    player.anchor.set(0.5);
    player.x = map.start.x;
    player.y = map.start.y;

    app.stage.addChild(player);

    platform = new Graphics();

    // Draw every platform
    map.platform.forEach(el => {
        platform.beginFill(0x1c1c1c);
        platform.lineStyle(1, 0x1c1c1c, 1);
        platform.moveTo(el.x, el.y);
        platform.lineTo(el.x, el.y + el.h);
        platform.lineTo(el.x + el.w, el.y + el.h);
        platform.lineTo(el.x + el.w, el.y);
        platform.endFill();
    });

    app.stage.addChild(platform);
    let end = new Graphics();

    end.beginFill(0x7b7b7b);
    end.lineStyle(1, 0x7b7b7b, 1);
    end.moveTo(map.end.x - 10, map.end.y - 10);
    end.lineTo(map.end.x + 10, map.end.y - 10);
    end.lineTo(map.end.x + 10, map.end.y + 10);
    end.lineTo(map.end.x - 10, map.end.y + 10);
    end.endFill();

    app.stage.addChild(end);

    moveRight = false;
    moveLeft = false;
    jump = false;
    falling = false;
    jumping = false;
    lastMovement = 0;
    velocity_x = 0.5;
    velocity_y = 10;
    inertia = 0;

    currentPlayer = [];
    previousPlayers = [];
    previousPlayersSprites = [];
    frameCounter = 0;
    hasWon = false;
    winSprite = undefined;
    maxFrameCount = 0;
}

setup(maps[currentMap]);

let moveRight = false;
let moveLeft = false;
let jump = false;
let falling = false;
let jumping = false;
// Left = -1
// Right = 1
let lastMovement = 0;
let velocity_x = 0.5;
let velocity_y = 10;
let inertia = 0;

let currentPlayer = [];
let previousPlayers = [];
let previousPlayersSprites = [];
let frameCounter = 0;
let hasWon = false;
let hasEnded = false;
let winSprite = undefined;
let maxFrameCount = 0;

document.addEventListener('keydown', event => {
    if (event.code === 'ArrowRight') {
        moveRight = true;
    }
    if (event.code === 'ArrowLeft') {
        moveLeft = true;
    }
    if (event.code === 'ArrowUp') {
        jump = true;
    }
    if (event.code === 'Space') respawn();
});

document.addEventListener('keyup', event => {
    if (event.code === 'ArrowRight') {
        moveRight = false;
    }
    if (event.code === 'ArrowLeft') {
        moveLeft = false;
    }
    if (event.code === 'ArrowUp') {
        jump = false;
    }
});


app.ticker.add(function(delta) {
    if (hasWon && !hasEnded) {
        winSprite.scale.x = winSprite.scale.y = Math.min(Math.max(0.05, winSprite.scale.x * 1.10), 1);
        if (winSprite.scale.x === 1) {
            currentMap++;
            if (maps[currentMap] === undefined) {
                theEnd();
                return;
            }
            setup(maps[currentMap]);
        }
        return;
    }
    if (hasEnded) return;
    let oldCoordinates = {
        x: player.x,
        y: player.y
    };
    if (moveRight) {
        player.x += 5 * velocity_x;
        velocity_x = Math.min(4, velocity_x + 0.1);
        inertia = velocity_x * 5;
        lastMovement = 1
    } else if (moveLeft) {
        player.x -= 5 * velocity_x;
        velocity_x = Math.min(4, velocity_x + 0.1);
        inertia = -velocity_x * 5;
        lastMovement = -1
    } else {
        velocity_x = 1;
        player.x += inertia;
        inertia = Math.sign(inertia) * Math.max(0, Math.abs(inertia) * 0.9);
    }

    if (jump && !jumping && !falling) {
        jumping = true;
    } else if (jumping) {
        player.y -= 3 * velocity_y;
        velocity_y *= 0.6;
        if (velocity_y < 0.2) {
            falling = true;
            jumping = false;
        }
    } else if (falling) {
        player.y += 3 * velocity_y;
        velocity_y = Math.min(10, velocity_y * 1.30);
    }
    let canFall = true;
    for (let i = 0, l = maps[currentMap].platform.length; i < l; i++) {
        let platform = maps[currentMap].platform[i];
        if (isInside(player.x + 26, player.y + 25, platform.x, platform.y, platform.w, platform.h) ||
            isInside(player.x + 26, player.y - 25, platform.x, platform.y, platform.w, platform.h) ||
            isInside(player.x - 26, player.y + 25, platform.x, platform.y, platform.w, platform.h) ||
            isInside(player.x - 26, player.y - 25, platform.x, platform.y, platform.w, platform.h)) {
            player.x = oldCoordinates.x;
            velocity_x = 1 / 5;
        }
        if (isInside(player.x + 25, player.y + 25, platform.x, platform.y, platform.w, platform.h) ||
            isInside(player.x - 25, player.y + 25, platform.x, platform.y, platform.w, platform.h)) {
            falling = false;
            canFall = false;
            velocity_y = 10;
            player.y -= player.y + 25 - platform.y + 1;
        }
        if (isInside(player.x + 25, player.y + 28, platform.x, platform.y, platform.w, platform.h) ||
            isInside(player.x - 25, player.y + 28, platform.x, platform.y, platform.w, platform.h)) {
            canFall = false;
        }
    }
    for (let i = 0, l = previousPlayersSprites.length; i < l; i++) {
        let previous = previousPlayers[i][frameCounter];
        if (previous === undefined) {
            previous = previousPlayers[i].slice(-1)[0];
        }
        if (isInside(player.x + 25, player.y + 25, previous.x - 25, previous.y - 25, 50, 50) ||
            isInside(player.x + 25, player.y - 25, previous.x - 25, previous.y - 25, 50, 50) ||
            isInside(player.x - 25, player.y + 25, previous.x - 25, previous.y - 25, 50, 50) ||
            isInside(player.x - 25, player.y - 25, previous.x - 25, previous.y - 25, 50, 50)) {
            player.x = oldCoordinates.x;
            velocity_x = 1 / 5;
        }
        if (isInside(player.x + 25, player.y + 25, previous.x - 25, previous.y - 25, 50, 50) ||
            isInside(player.x - 25, player.y + 25, previous.x - 25, previous.y - 25, 50, 50)) {
            falling = false;
            canFall = false;
            velocity_y = 10;
            player.y -= player.y + 50 - previous.y + 1;
        }
        if (isInside(player.x + 25, player.y + 28, previous.x, previous.y, previous.w, previous.h) ||
            isInside(player.x - 25, player.y + 28, previous.x, previous.y, previous.w, previous.h)) {
            canFall = false;
        }
    }
    if (canFall) falling = true;
    if (isInside(player.x, player.y, maps[currentMap].end.x - 10, maps[currentMap].end.y - 10, 20, 20)) {
        console.log('YOU WON WOWOWOWOW')
        hasWon = true;
        addCircle();
    }
    currentPlayer.push({
        x: player.x,
        y: player.y
    });
    for (let i = 0, l = previousPlayersSprites.length; i < l; i++) {
        let sprite = previousPlayersSprites[i];
        if (frameCounter > previousPlayers[i].length - 1) continue;
        sprite.x = previousPlayers[i][frameCounter].x;
        sprite.y = previousPlayers[i][frameCounter].y;
    }
    frameCounter++;
});

const isInside = (x1, y1, x2, y2, w, h) => (x1 >= x2 && y1 >= y2 && x1 <= x2 + w && y1 <= y2 + h);

const respawn = _ => {
    maxFrameCount = Math.max(maxFrameCount, frameCounter);
    frameCounter = 0;
    previousPlayers.push(currentPlayer.slice());
    let newSprite = new Sprite(darkerSquare.generateCanvasTexture())
    newSprite.anchor.set(0.5);
    newSprite.x = maps[currentMap].start.x;
    newSprite.y = maps[currentMap].start.y;
    previousPlayersSprites.push(newSprite);
    app.stage.addChild(newSprite);
    currentPlayer = [];
    velocity_x = 0.5;
    inertia = 0;
    player.x = maps[currentMap].start.x;
    player.y = maps[currentMap].start.y;
}

const addCircle = _ => {
    let winCircle = new Graphics();
    winCircle.lineStyle(1, 0xdadada, 0.5);
    winCircle.beginFill(0xdadada, 1);
    winCircle.drawCircle(maps[currentMap].end.x, maps[currentMap].end.y, 850);
    winCircle.endFill();
    winSprite = new Sprite(winCircle.generateCanvasTexture());
    winSprite.anchor.set(0.5);
    winSprite.x = maps[currentMap].end.x;
    winSprite.y = maps[currentMap].end.y;
    winSprite.scale.x = winSprite.scale.y = 0;
    app.stage.addChild(winSprite);
}

const theEnd = _ => {
    hasEnded = true;
    var richText = new Text('Timeformer', new TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 36,
        fontWeight: 'bold',
        fill: ['#1c1c1c', '#1c1c1c'],
    }));
    richText.x = 30;
    richText.y = 180;
    var authors = new Text('DeltaEvo & FliiFe', new TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 26,
        fontWeight: 'bold',
        fill: ['#1c1c1c', '#1c1c1c'],
    }));
    authors.x = 30;
    authors.y = 240;
    var jam = new Text('SDD Jam, 22-23/04/2017', new TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 20,
        fontWeight: 'bold',
        fill: ['#1c1c1c', '#1c1c1c'],
    }));
    jam.x = 30;
    jam.y = 290;

    app.stage.addChild(richText);
    app.stage.addChild(authors);
    app.stage.addChild(jam);
}
