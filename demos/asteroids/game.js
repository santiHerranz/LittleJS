/*
LittleJS Hello World Starter Game
 */

'use strict';

glOverlay = !isChrome; // fix slow rendering when not chrome

let particleEmiter, overlayCanvas, overlayContext;
let levelSize, ship, asteroids = [], score;

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    // create overlay canvas for hud
    document.body.appendChild(overlayCanvas = document.createElement('canvas'));
    overlayCanvas.style = mainCanvas.style.cssText;
    overlayContext = overlayCanvas.getContext('2d');

    levelSize = vec2(40, 40);

    // create tile collision and visible tile layer
    initTileCollision(vec2(40, 20));

    // move camera to center of collision
    cameraPos = tileCollisionSize.scale(.5);
    cameraScale = 32;

    // no gravity in space
    gravity = 0;

}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
    // spawn blocks
    const pos = vec2(levelSize.x / 2, levelSize.y / 2);
    while (asteroids.length < 10) {
        pos.x += rand(-10, 10);
        pos.y += rand(-10, 10);
        asteroids.push(new Asteroid(pos));
    }

    // spawn ball
    if (!ship) {
        ship = new Ship(vec2(levelSize.x / 2, levelSize.y / 2), vec2(0, 0));
        //zzfx(...[,0,500,,.04,.3,1,2,,,570,.02,.02,,,,.04]);
    }

    asteroids = asteroids.filter(o => !o.destroyed);

}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
    // draw a grey square without using webgl
    drawCanvas2D(cameraPos, tileCollisionSize.add(vec2(5)), 0, 0, (context) => {
        context.fillStyle = '#333'
            context.fillRect( - .5,  - .5, 1, 1);
    });
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
    // clear overlay canvas
    overlayCanvas.width = mainCanvas.width;
    overlayCanvas.height = mainCanvas.height;
    overlayCanvas.style.width = mainCanvas.style.width;
    overlayCanvas.style.height = mainCanvas.style.height;

    // draw to overlay canvas for hud rendering
    const drawOverlayText = (text, x, y, size = 70, shadow = 9) => {
        overlayContext.textAlign = 'center';
        overlayContext.textBaseline = 'top';
        overlayContext.font = size + 'px arial'
            overlayContext.fillStyle = '#fff';
        overlayContext.shadowColor = '#000';
        overlayContext.shadowBlur = shadow;
        overlayContext.fillText(text, x, y);
    }
    drawOverlayText('Asteroids ', overlayCanvas.width / 2, 40);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'tiles.png');
