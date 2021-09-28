/*
    LittleJS Missile Command Game

*/



'use strict';

glOverlay = !isChrome; // fix slow rendering when not chrome
const lowGraphicsSettings = glOverlay = !isChrome; // fix slow rendering when not chrome

let particleEmiter, overlayCanvas, overlayContext, tileLayer, tileBackgroundLayer;
let level = 1, levelSize, levelColor, levelGroundColor, warmup;
let towers = [], fallingRocks = [];
let score;

const tileType_empty   = 0;
const tileType_solid   = 1;

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // create overlay canvas for hud
    document.body.appendChild(overlayCanvas = document.createElement('canvas'));
    overlayCanvas.style = mainCanvas.style.cssText;
    overlayContext = overlayCanvas.getContext('2d');

    levelSize = vec2(40, 100);
    levelColor = randColor(new Color(.2,.2,.2), new Color(.8,.8,.8));
    levelGroundColor = levelColor.mutate().add(new Color(.4,.4,.4)).clamp();

    initSky();
    
    // create tile collision and visible tile layer
    initTileCollision(vec2(50,25));
    tileLayer = new TileLayer(vec2(), tileCollisionSize);
    const pos = vec2();
    // for (pos.y = tileCollisionSize.y; pos.y--;)
    for (pos.y = 4; pos.y--;)
    for (pos.x = tileCollisionSize.x; pos.x--;)
    {
        if (pos.y == 0 || randSeeded() > .8)
        {
            setTileCollisionData(pos, 1);

            const tileIndex = 1;
            const direction = 4; //randInt(4)
            const mirror = 0; //randInt(2);
            const color = randColor();
            const data = new TileLayerData(tileIndex, direction, mirror, color);
            tileLayer.setData(pos, data);
        }
    }
    tileLayer.redraw();

    // move camera to center of collision
    cameraPos = tileCollisionSize.scale(.5);
    cameraScale = 32;

    // enable gravity
    gravity = -.01;

}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{

    const TOWER_NUMBER = 5;
        // spawn ball
        if (towers.length < TOWER_NUMBER) {
            towers.push(new Tower(vec2(levelSize.x / (TOWER_NUMBER+2) + towers.length*levelSize.x/(TOWER_NUMBER+1)+4, 5), vec2(0, 0)));
            zzfx(...[,0,500,,.04,.3,1,2,,,570,.02,.02,,,,.04]);
        }


    // spawn falling Rocks
    const pos = vec2(tileCollisionSize.x / 2, tileCollisionSize.y / 2 );

    if (fallingRocks.length == 0) {
        level++;

        while (fallingRocks.length < level*3) {
            pos.x = tileCollisionSize.x/2 +  tileCollisionSize.x/4* rand(-1, 1);
            pos.y += rand(-1, 3);
            fallingRocks.push(new Rock(pos));
        }        
    
    }


            // move particles to mouse location if on screen
    if (mousePosScreen.x || mousePosScreen.y){


        towers.forEach(tower => {
            let a = Math.atan2(mousePos.x-tower.pos.x, mousePos.y-tower.pos.y);
            tower.angle = clamp(a,Math.PI*1/3,-Math.PI*1/3);
        });


    }

    fallingRocks = fallingRocks.filter(o => !o.destroyed);

    
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    drawSky();
    drawStars();
    
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // clear overlay canvas
    overlayCanvas.width = mainCanvas.width;
    overlayCanvas.height = mainCanvas.height;
    overlayCanvas.style.width = mainCanvas.style.width;
    overlayCanvas.style.height = mainCanvas.style.height;

    // draw to overlay canvas for hud rendering
    const drawOverlayText = (text, x, y, size=70, shadow=9) =>
    {
        overlayContext.textAlign = 'center';
        overlayContext.textBaseline = 'top';
        overlayContext.font = size + 'px arial'
        overlayContext.fillStyle = '#fff';
        overlayContext.shadowColor = '#000';
        overlayContext.shadowBlur = shadow;
        overlayContext.fillText(text, x, y);
    }
    drawOverlayText('Missile Command', overlayCanvas.width/2, 40);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'tiles.png');