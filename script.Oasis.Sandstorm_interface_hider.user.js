// ==UserScript==
// @name         Oasis.Sandstorm interface hider
// @version      0.1
// @namespace    https://github.com/h0d
// @description  Hide Oasis's interface when you don't use it
// @author       h0d
// @match        https://oasis.sandstorm.io/grain/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

/**********
 *
 * General variables
 *
 **********/
var sideLine, bars, navbar, frame;

bars = document.getElementsByClassName("topbar")[0];
navbar = document.getElementsByClassName("navbar")[0];
frame = document.getElementsByClassName("main-content")[0];

/**********
 *
 * Style and transitions
 *
 **********/
document.getElementsByClassName("navbar-shrink")[0].style.display = "none";

document.body.style.backgroundColor = "#191919";

var trDurationOut = "0.4s", trDelayOut = "1s";
var trDurationIn = "0.4s", trDelayIn = "0s";

/**********
 *
 * Side line div
 *
 **********/
sideLine = document.createElement('DIV');
sideLine.id = 'sideline';
sideLine.style.position = 'absolute';
sideLine.style.left = '0px';
sideLine.style.height = '100%';
sideLine.style.width = '1px';
sideLine.style.backgroundColor = '#383838';

document.body.appendChild(sideLine);

/*********
 *
 * Functions
 *
 *********/
function hideBars () {
    bars.style.transition = "top " + trDurationOut + " " + trDelayOut;
    navbar.style.transition = "left " + trDurationOut + " " + trDelayOut;
    frame.style.transition = "top " + trDurationOut + " " + trDelayOut + ", left " + trDurationOut + " " + trDelayOut;

    bars.style.top = "-32px";
    navbar.style.left = "-48px";

    frame.style.top = "0px";
    frame.style.left = "1px";
}
function showBars () {
    bars.style.transition = "top " + trDurationIn + " " + trDelayIn;
    navbar.style.transition = "left " + trDurationIn + " " + trDelayIn;
    frame.style.transition = "top " + trDurationIn + " " + trDelayIn + ", left " + trDurationIn + " " + trDelayIn;

    bars.style.top = "0px";
    navbar.style.left = "0px";

    frame.style.top = "32px";
    frame.style.left = "48px";
}

/*********
 *
 * Events listeners
 *
 *********/
sideLine.addEventListener('mouseover', function () {
    showBars();
});
bars.addEventListener('mouseleave', function () {
    hideBars();
});
bars.addEventListener("mouseover", function () {
    showBars();
});
