/*
    LittleJS Engine Configuration
*/

///////////////////////////////////////////////////////////////////////////////
// display settings

const maxWidth = 1920, maxHeight = 1200; // up to 1080p and 16:10
let defaultFont = 'arial'; // font used for text rendering
let fixedWidth = 0, fixedHeight = 0; // use native resolution
//const fixedWidth = 1280, fixedHeight = 720;  // 720p
//const fixedWidth = 1920, fixedHeight = 1080; // 1080p
//const fixedWidth = 128,  fixedHeight = 128;  // PICO-8
//const fixedWidth = 240,  fixedHeight = 136;  // TIC-80

///////////////////////////////////////////////////////////////////////////////
// tile sheet settings

const defaultTileSize = vec2(16); // default size of tiles in pixels
const tileBleedShrinkFix = .3;    // prevent tile bleeding from neighbors
let pixelated = 1;              // use crisp pixels for pixel art

///////////////////////////////////////////////////////////////////////////////
// webgl config

const glEnable = 1; // can run without gl (texured coloring will be disabled)
let glOverlay = 0;  // fix slow rendering in some browsers by not compositing the WebGL canvas

///////////////////////////////////////////////////////////////////////////////
// object config

const defaultObjectSize = vec2(.99);
const defaultObjectMass = 1;
const defaultObjectDamping = .99;
const defaultObjectAngleDamping = .99;
const defaultObjectElasticity = 10; //0.9;
const defaultObjectFriction = .8;
const maxObjectSpeed = 1;

///////////////////////////////////////////////////////////////////////////////
// input config

const gamepadsEnable = 1;
const touchInputEnable = 1;
const copyGamepadDirectionToStick = 1;
const copyWASDToDpad = 1;

///////////////////////////////////////////////////////////////////////////////
// audio config

const soundEnable = 1;        // all audio can be disabled
let audioVolume = .3;         // volume for sound, music and speech
const defaultSoundRange = 15; // distance where taper starts
const soundTaperPecent = .5;  // extra range added for sound taper