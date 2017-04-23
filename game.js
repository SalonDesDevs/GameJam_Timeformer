import {
    Application,
    Graphics,
    Sprite,
    loader as PixiLoader
} from 'pixi.js';

const app = new Application(600, 600, {
    backgroundColor: 0x2a2a2a
});
document.body.appendChild(app.view);

const map = {
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
        }, {
            x: 200,
            y: 450,
            w: 200,
            h: 100
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
};
let platform = new Graphics();

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

let square = new Graphics();

square.beginFill(0xbcbcbc);
square.lineStyle(1, 0xbcbcbc, 1);

square.moveTo(50, 50);
square.lineTo(100, 50);
square.lineTo(100, 100);
square.lineTo(50, 100);

square.endFill();

let player = new Sprite(square.generateCanvasTexture());

player.anchor.set(0.5);
player.x = map.start.x;
player.y = map.start.y;

app.stage.addChild(player);

let moveRight = false;
let moveLeft = false;
let jump = false;
let falling = false;
let jumping = false;

document.addEventListener('keydown', event => {
    if (event.code === 'ArrowRight') moveRight = true;
    if (event.code === 'ArrowLeft') moveLeft = true;
    if (event.code === 'ArrowUp') jump = true;
});

document.addEventListener('keyup', event => {
    if (event.code === 'ArrowRight') moveRight = false;
    if (event.code === 'ArrowLeft') moveLeft = false;
    if (event.code === 'ArrowUp') jump = false;
});

// Left = -1
// Right = 1
let lastMovement = 0;
let velocity_x = 0.5;
let velocity_y = 10;
let inertia = 0;

app.ticker.add(function(delta) {
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
    for (let i = 0, l = map.platform.length; i < l; i++) {
        let platform = map.platform[i];
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
            // Lift the player up until it is not inside the platform anymore
        }
        if (isInside(player.x + 25, player.y + 28, platform.x, platform.y, platform.w, platform.h) ||
            isInside(player.x - 25, player.y + 28, platform.x, platform.y, platform.w, platform.h)) {
            canFall = false;
        }
    }
    if(canFall) falling = true;
});

const isInside = (x1, y1, x2, y2, w, h) => (x1 > x2 && y1 > y2 && x1 < x2 + w && y1 < y2 + h);
