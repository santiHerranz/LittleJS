/*
    LittleJS Super Cobra Game

    Arcade Longplay [237] Super Cobra
    https://www.youtube.com/watch?v=Y6FK9jNBURY

    */



'use strict';

glOverlay = !isChrome; // fix slow rendering when not chrome

let particleEmiter, overlayCanvas, overlayContext, tileLayer, tileBackgroundLayer;
let levelSize, levelColor, levelGroundColor, warmup;
let ship;

const tileType_empty   = 0;
const tileType_solid   = 1;

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // create overlay canvas for hud
    document.body.appendChild(overlayCanvas = document.createElement('canvas'));
    overlayCanvas.style = mainCanvas.style.cssText;
    overlayContext = overlayCanvas.getContext('2d');

    levelSize = vec2(40, 40);
    levelColor = randColor(new Color(.2,.2,.2), new Color(.8,.8,.8));
    levelGroundColor = levelColor.mutate().add(new Color(.4,.4,.4)).clamp();

    initSky();
    
    // create tile collision and visible tile layer
    initTileCollision(vec2(35,20));
    tileLayer = new TileLayer(vec2(), tileCollisionSize);
    const pos = vec2();
    // for (pos.y = tileCollisionSize.y; pos.y--;)
    for (pos.y = 2; pos.y--;)
    for (pos.x = tileCollisionSize.x; pos.x--;)
    {
        if (true || randSeeded() > .8)
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

        // spawn ball
        if (!ship) {
            ship = new Cobra(vec2(levelSize.x / 2, levelSize.y / 2), vec2(0, 0));
            zzfx(...[,0,500,,.04,.3,1,2,,,570,.02,.02,,,,.04]);
        }

    
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{

}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{

    
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
    drawOverlayText('Super Cobra', overlayCanvas.width/2, 40);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'tiles.png');