var last_known_scroll = getScrollY();
var queueing = false;
var t = false; //state of skill table
var st = document.getElementById("skilltable");
var stb = document.getElementById("skilltablebutton");
var sp = document.getElementById("scrollprompt");
document.addEventListener("scroll", function () {
  last_known_scroll = getScrollY();
  if (!queueing) {
    window.requestAnimationFrame(function () { //"queue up" animation
      queueing = false;
      sc(last_known_scroll);
    });
    queueing = true;
  }
});

window.addEventListener("resize", function () {
  last_known_scroll = getScrollY();
  sc(last_known_scroll);
});

sc(last_known_scroll);

//execute scroll style modifications
function sc(ypos) {

  var windowHeight = window.innerHeight;
  //top thing
  var topDiv = document.getElementById("top");
  var mast = document.getElementById("mast");
  var hcalc = windowHeight - ypos;
  var topheight;
  if (hcalc > 130) {
    topHeight = hcalc;
  } else {
    topHeight = 130;
  }
  // var mastHeight = mast.clientHeight;
  // var halfHeight = Math.floor((topHeight / 2) - (mastHeight / 2));
  if (topHeight < 310) {
    topDiv.className = "small";
  } else {
    topDiv.className = "large";
  }
  topDiv.style.height = topHeight - 10 + "px"; //subtract 10 to account for padding-top on #top

  //background thing
  var p = ((windowHeight - ypos) / windowHeight); //calulate ratio of scroll
  var rgb = Math.floor(Math.abs(1 - p) * 255); //set the color

}

function getScrollY() {
  //internet explorer does not have a window.scrollY property, it has pageYOffset
  return typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
}