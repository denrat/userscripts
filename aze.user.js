// ==UserScript==
// @name         aze
// @version      0.1
// @description  enter something useful
// @author       h0g
// @include      http://*
// @include      https://*
// @require      https://davidshimjs.github.com/qrcodejs/qrcode.min.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

/*
TODO:
- use classes rather than pure style
- use fancy animations with classes
- use fancy animations with that one js library on github
- set z-index
- rewrite code to:
      - have it work only if the keys are pressed in the good order OK
      - any other key cancels the 'true' value of qrCount* variables
*/

/*
Include jQuery for qrcodejs
*/
if (!window.jQuery) {
    var jq = document.createElement('script'); jq.type = 'text/javascript';
    // Path to jquery.js file
    jq.src = 'https://code.jquery.com/jquery-2.1.4.min.js';
    document.head.appendChild(jq);
    console.log('jQuery implemented with aze: ' + jq.src);
}

/*
Implementing in HTML/CSS
*/
var qrDiv = document.createElement('DIV'); //create a div on the page to handle the QRCode
document.body.appendChild(qrDiv);
qrDiv.id = "qrCode"; //makes it accessible the classical way in qrcodejs

qrDiv.style.display = "none"; //hidden by default

qrDiv.style.position = "fixed";
qrDiv.style.zIndex = "1000";
qrDiv.style.width = "256px";
qrDiv.style.height = "256px";
qrDiv.style.bottom = "10px";
qrDiv.style.right = "10px";
qrDiv.style.padding = "5px";
qrDiv.style.backgroundColor = "white";

/*
Global Var
*/
var loc = document.location.href.split('.')[1];
var qrcode = new QRCode("qrCode"); //initialize qrcodejs
var qrCountQ, qrCountR, qrCountC;

/*
This code may have to be called at several times
*/
function qrReset () { //reset all qrCount values
    qrCountQ = false;
    qrCountR = false;
    qrCountC = false;
}

/*
Events context
*/
document.addEventListener("keydown", function (event) {
    //check if "Q", "R" or "C" is pressed and if no text input has the focus
    if (loc == "facebook" && typeof(document.activeElement.attributes.contenteditable) != "undefined" && document.activeElement.attributes.contenteditable) {
        // facebook uses some weird div textboxes
        void(0);
    } else if ((document.activeElement.nodeName != "INPUT") && (document.activeElement.nodeName != "TEXTAREA")) {
        if ((event.keyCode == 65) || (event.keyCode == 90) || (event.keyCode == 69)) {
            var key = event.keyCode;
            if (key == 65) {
                qrCountQ = true;
            }
            if ((key == 90) && qrCountQ) {
                qrCountR = true;
            }
            if ((key == 69) && qrCountR) {
                qrCountC = true;
            }
            if (qrCountC) { //if all qrCount values are true i.e. if all keys have been pressed in less than 3sec
                /* qrcodejs code */
                qrcode.makeCode(document.location.href); //sets QRCode as page URL

                //display, pause, hide
                qrDiv.style.display = "block";
                window.setTimeout(function () {
                    qrDiv.style.display = "none";
                }, 15000);
                qrReset();
            }
        }
        else if ((qrDiv.style.display != "block")) {
            qrReset();
        }
    }
});
qrDiv.addEventListener("click", function () {
    qrDiv.style.display = "none";
});
window.setInterval(qrReset, 3000); //regularly reset not to trigger mistakenly
qrReset();