/* A super simple smooth scroller without all the baggage. Written by Chuck Dries in 2017*/
//settings
var speed = .0005; //speed multiplier
//setup necissary stuff
var target  = null;
var targetHeight = null;
var currentHeight = null;
var startTime = null;
/* does some basic checking then calls animate() to do the heavy lifting */
function smoothScroll(targetId){
    target = document.getElementById(targetId);//grab the element
    targetHeight = target.offsetTop; //get its height
    currentHeight = window.scrollY; //grab the current scroll position
    startTime = null; //we have to reset the start time every time the animation runs
    if(currentHeight != targetHeight){
        window.requestAnimationFrame(animateScroll);//schedule the animation
    }
}
function animateScroll(timeStamp){
    if (startTime == null) startTime = timeStamp; //record the time the animation started if we're just starting
    var deltaStep = (timeStamp - startTime) * speed; //timeStamp - startTime gives us miliseconds since the animation started, we scale this down because its usually in the hundreds.
    currentHeight = window.scrollY; //record the current scroll position of the window
    var offsetScroll = targetHeight - currentHeight; //calculate how far we still need to go
    var deltaScroll = deltaStep  * offsetScroll; //decide how far to scroll this tick
    window.scroll(0, currentHeight + deltaScroll); //scroll!
    currentHeight = window.scrollY;//re-record the current height after scrolling for comparison
    if(Math.floor(currentHeight) != Math.floor(targetHeight)){ //schedule another tick if we need to
        window.requestAnimationFrame(animateScroll);
    }
}