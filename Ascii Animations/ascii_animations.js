/*This represents the functionality/interaction
behavior for the ascii.html file.
*/

"use strict";
(function() {
	let framesSet;
	let frameCurrentlyDisplayed; 
	let interval;
	let isAnimationDisplayed; 

	// these are the radio buttons/drop down
	// menu events that are associated with them.
	// these properties are assigned when the 
	// window/program is loaded
	window.onload = function() {
		$("start").onclick = delay;  
		$("stop").onclick = stopAnimation;
		$("animation").onchange = myAnimationSelection;
		$("size").onchange = changeFontSize;
		let speedTypes = 
			document.querySelectorAll("input[name='speed']");
        for (let i = 0; i < speedTypes.length; i++) {
      	speedTypes[i].onchange = getSpeed;
   		 }
	};
    
    // This function is called when the 
    // start button is clicked. Calls the 
    // getSpeed method to make the ascii
    // animation move at the selected speed.
	function delay() {
		$("start").disabled = true;
		$("stop").disabled = false;
		let speed = getSpeed();
		console.log(speed);
    	interval = setInterval(myAnimationOneFrame, speed); 
    	isAnimationDisplayed = true;
	}

	// This function is called when the stop
	// button is clicked. Restores the 
	// original full ascii animation that was 
	// selected to the text box.
	function stopAnimation() {
		$("stop").disabled = true;
		$("start").disabled = false;
		clearInterval(interval);
		isAnimationDisplayed = false; 
		$("mytextarea").value = ANIMATIONS[$("animation").value];
	}

    // This function is called when an animation is selected
    // Puts the ascii animation thats selected
    // in the text box.
	function myAnimationSelection() {
		let whichAscii = $("animation").value; 
		$("mytextarea").value = ANIMATIONS[whichAscii];
		framesSet =  ANIMATIONS[whichAscii].split("=====\n");
		frameCurrentlyDisplayed = 0;
	}

	// This function displays one frame of the ascii
	// animation.
	function myAnimationOneFrame() {
		$("mytextarea").value = framesSet[frameCurrentlyDisplayed];
		frameCurrentlyDisplayed++;
		if(frameCurrentlyDisplayed >= framesSet.length) {
			frameCurrentlyDisplayed = 0;
		}
	}
	
	// Function was created to shortcut the
	// "document.getElementById(id)"
	// property, since it's used many times
	// in this homework.
	function $(id) {
 	 return document.getElementById(id);
	}

	// function that is called when a font size is
	// chosen. changes the font size based on selection.
	function changeFontSize() { 
		let whichSize = $("size").value;
		$("mytextarea").style.fontSize = whichSize + "pt";
	}

	// function that is called when the start button is called
	// and when the speed is changed. The ascii animation
	// displays on the screen in the speed selected.
	// this function calls the myAnimationOneFrame
	// to make this possible.
	function getSpeed() {
		let speedType = 
			document.querySelector("input[name='speed']:checked").value;
		console.log(speedType);
		let speed = speedType;
		if(isAnimationDisplayed) { 
			clearInterval(interval);
			interval = 
				setInterval(myAnimationOneFrame, speed);
		}
		return speedType;
	}
})();


