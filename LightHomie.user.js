// ==UserScript==
// @name         LightHomie
// @version      0.4
// @description  Turn off the lights... better
// @author       SergeiBrown
// @match        http*://www.youtube.com/watch*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/********
 *
 * TODO:
 * / None
 *
 ********/

/********
 *
 * This script allows to gray out the page while playing a video to increase focus.
 *
 * SUMMARY:
 *
 *   I. Global variables
 *  II. Global functions
 * III. Integration in page
 *  IV. Events and trigger
 *
 ********/

/*******
 *
 *   I. Global variables
 *
 *******/

var layer = document.createElement("div");
var vid = document.getElementsByTagName("video")[0];
var moviePlayer = document.getElementById("movie_player");
var topbar = document.getElementById("yt-masthead-container");


/*******
 *
 *  II. Global functions
 *
 *******/

// for debug convenience
function clog (txt) {
    console.log("LightHomie: " + txt);
}

// layer manipulation
var layerTimeout, opacityTimeout;
var reduceZIndex = function () { layer.style.zIndex = -1; };
var setOpactToZero = function () { layer.style.opacity = 0; };

function showLayer () {
    if (!vid.paused) {
        // apply new style to layer
        layer.style.zIndex = 2;
        layer.style.opacity = 0.7;

        // apply new style to section below vid
        /*content.style = contentBasicStyle +
            "-webkit-filter: blur(.4px) grayscale(.8); " +
            "-moz-filter: blur(.4px) grayscale(.8); " +
            "filter: blur(.4px) grayscale(.8);";*/

        if (layerTimeout !== null) {
            window.clearTimeout(layerTimeout);
            layerTimeout = null;
        }
        if (opacityTimeout !== null) {
            window.clearTimeout(opacityTimeout);
            opacityTimeout = null;
        }
    }
}
function hideLayer () {
    if (vid.paused) {
        var opacityChangeTime = 1;
        if (vid.ended) { opacityChangeTime = 4000; }

        // section below vid included
        opacityTimeout = window.setTimeout(setOpactToZero, opacityChangeTime);
        layerTimeout = window.setTimeout(reduceZIndex, 2000 + opacityChangeTime);
    }
}


/*******
 *
 * III. Integration in page
 *
 *******/

topbar.style.backgroundColor = "rgba(255, 255, 255, .4)";
topbar.style.borderBottomColor = "rgba(200, 200, 200, .55)";

layer.id = "lighthomie-layer";
layer.style =
    "position: fixed; " +
    "top: 0px; left: 0px; " +
    "height: 100%; width: 100%; " +
    "background-color: black; " +
    "opacity: 0; " +
    "z-index: 2; " +
    "display: block; " +
    "transition: opacity .9s ease-in-out 0.1s;";

document.body.appendChild(layer);


/*******
 *
 *  IV. Events and trigger
 *
 *******/

// vid is played
vid.addEventListener('playing', showLayer);

// vid is paused (or ended, which is managed through hideLayer())
vid.addEventListener('pause', hideLayer);

// layer is clicked
layer.addEventListener('click', hideLayer);

// trigger
moviePlayer.focus();
clog("Started");
