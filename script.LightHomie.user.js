// ==UserScript==
// @name         LightHomie
// @version      0.5
// @namespace    https://github.com/h0d
// @description  Turn Off The Lights... better
// @author       SergeiBrown
// @match        http*://www.youtube.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

/********
 *
 * This script allows to gray out the page while playing a video to increase focus.
 *
 * SUMMARY:
 *
 *    I. Manipulated Elements
 *   II. Layer Style
 *  III. Layer Manipulation
 *   IV. Topbar Style
 *    V. Topbar Manipulation
 *   VI. pushState() Management
 *  VII. Events Listeners
 * VIII. On Load
 *
 ********/

/********
 *
 * Manipulated Elements
 *
 ********/

var layer = document.createElement("div");
document.body.appendChild(layer);
var vid = document.getElementsByTagName("video")[0];
var moviePlayer = document.getElementById("movie_player");
var topbar = document.getElementById("yt-masthead-container");


/********
 *
 * Layer Style
 *
 ********/

layer.id = "lighthomie-layer";

var shownLayerOpacity = 0.7;
var shownLayerZIndex = 2;

var hiddenLayerOpacity = 0;
var hiddenLayerZIndex = -1;

layer.style =
    "position: fixed; " +
    "top: 0px; left: 0px; " +
    "height: 100%; width: 100%; " +
    "background-color: black; " +
    "opacity: " + hiddenLayerOpacity + "; " +
    "z-index: " + hiddenLayerZIndex + "; " +
    "display: block; " +
    "transition: opacity .9s ease-in-out 0.1s;";


/********
 *
 * Layer Manipulation
 *
 ********/

var layerClicked = false;
var zIndexTimeout, opacityTimeout;
var layerClickedTimeout;
function setOpacityToZero () { layer.style.opacity = hiddenLayerOpacity; }
function reduceZIndex () { layer.style.zIndex = hiddenLayerZIndex; }


function showLayer () {
    if (!layerClicked) {
        layer.style.opacity = shownLayerOpacity;
        layer.style.zIndex = shownLayerZIndex;
    }
}
function tryToShowLayer () {
    if (document.body.scrollTop === 0) {
        layerClicked = false;
        window.clearTimeout(layerClickedTimeout);
        showLayer();
    } else {
        window.clearTimeout(layerClickedTimeout);
        layerClickedTimeout = window.setTimeout(tryToShowLayer, 1000);
    }
}

function hideLayer () {
    if (layerClicked) {
        layerClickedTimeout = window.setTimeout(tryToShowLayer, 1000);
    }

    var changeTime = 0;
    if (vid.ended) changeTime = 4000;

    opacityTimeout = window.setTimeout(setOpacityToZero, changeTime);
    zIndexTimeout = window.setTimeout(reduceZIndex, 1000 + changeTime);
}


/********
 *
 * Topbar Style
 *
 ********/

var modTopbarBackgroundColor = "rgba(255, 255, 255, .4)";
var modTopbarBorderBottomColor = "rgba(232, 232, 232, .55)";

var origTopbarBackgroundColor = "rgba(255, 255, 255, 1)";
var origTopbarBorderBottomColor = "rgba(232, 232, 232, 1)";

topbar.style.transition = "all 1s ease-in-out";


/********
 *
 * Topbar Manipulation
 *
 ********/

function setTopbarOriginalState () {
    topbar.style.backgroundColor = origTopbarBackgroundColor;
    topbar.style.borderBottomColor = origTopbarBorderBottomColor;
}
function setTopbarModifiedState () {
    topbar.style.backgroundColor = modTopbarBackgroundColor;
    topbar.style.borderBottomColor = modTopbarBorderBottomColor;
}


/********
 *
 * pushState() Management
 *
 ********/

function authorizeFromUrl () {
    if (document.location.pathname == "/watch") {
        layer.style.display = "block";
        setTopbarModifiedState();
    }
    else {
        layer.style.display = "none";
        setTopbarOriginalState();
    }
}


/********
 *
 * Events Listeners
 *
 ********/

document.addEventListener(
    "popstate",
    authorizeFromUrl);

vid.addEventListener(
    'playing',
    showLayer);

vid.addEventListener(
    'pause',
    hideLayer);

layer.addEventListener(
    'click',
    function () {
        layerClicked = true;
        hideLayer();
    });

/********
 *
 * On Load
 *
 ********/

console.log("LightHomie started");

moviePlayer.focus();
authorizeFromUrl();
