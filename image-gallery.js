//Constants
var dcd_IG_images;
var dcd_IG_SET_WIDTH;
var dcd_IG_CURRENT_INDEX = 0;
var dcd_IG_MAX_COUNTER;
var dcd_IG_IS_ANIMATING_IMAGES = false;
var dcd_IG_ControlIsShown = false;
var dcd_IG_controlAnimation;

//Function to add acceleration to animation
function dcd_IG_calcSpeed(counter){
	var s;
	//if(counte r <= MAX_COUNTER/2.0){
	//	s = -1 * (counter-MAX_COUNTER/2.0)*(counter+MAX_COUNTER/2.0) * (25.0/Math.pow(MAX_COUNTER/2.0,2));
	//}else{
	//	s = -1 * (counter-MAX_COUNTER/2.0*3)*(counter-MAX_COUNTER/2.0) * (25.0/Math.pow(MAX_COUNTER/2.0,2));
	//}
	//console.log(s);
	//var s = Math.pow((counter-MAX_COUNTER/2.0),4) * (25.0/Math.pow(MAX_COUNTER/2,4));
	var s = Math.pow((counter),6) * (20.0/Math.pow(dcd_IG_MAX_COUNTER,6));
	return s;
}

function dcd_IG_slideLeft(firstTime, counter, currentMargin){
	if(dcd_IG_IS_ANIMATING_IMAGES && firstTime){
		return;
	}
	if(dcd_IG_CURRENT_INDEX+1 == dcd_IG_images.length){
		return;
	}
	if(firstTime){
		dcd_IG_IS_ANIMATING_IMAGES = true;
		dcd_IG_images[0].style.zIndex = 0;
		dcd_IG_images[dcd_IG_CURRENT_INDEX+1].style.zIndex = 1;
		currentMargin = parseInt(window.getComputedStyle(dcd_IG_images[0],null).getPropertyValue("margin-left"));
	}
	if(counter == dcd_IG_MAX_COUNTER){
		dcd_IG_images[0].style.marginLeft = currentMargin - dcd_IG_SET_WIDTH + "px";
		dcd_IG_images[dcd_IG_CURRENT_INDEX+1].style.marginLeft = 0 + "px";
		dcd_IG_CURRENT_INDEX++;
		dcd_IG_IS_ANIMATING_IMAGES = false;
		return;
	}

	counter++;
	dcd_IG_images[0].style.marginLeft = parseInt(window.getComputedStyle(dcd_IG_images[0],null).getPropertyValue("margin-left")) - 2 + "px";
	dcd_IG_images[dcd_IG_CURRENT_INDEX+1].style.marginLeft = parseInt(window.getComputedStyle(dcd_IG_images[dcd_IG_CURRENT_INDEX+1],null).getPropertyValue("margin-left")) - 2 + "px";

	setTimeout(function(){
		dcd_IG_slideLeft(false, counter++, currentMargin);
	},dcd_IG_calcSpeed(counter));
}

function dcd_IG_slideRight(firstTime, counter, currentMargin){
	if(dcd_IG_IS_ANIMATING_IMAGES && firstTime){
		return;
	}
	if(dcd_IG_CURRENT_INDEX == 0){
		return;
	}

	if(firstTime){
		dcd_IG_IS_ANIMATING_IMAGES = true;
		dcd_IG_images[0].style.zIndex = 1;
		dcd_IG_images[dcd_IG_CURRENT_INDEX].style.zIndex = 0;
		currentMargin = parseInt(window.getComputedStyle(dcd_IG_images[0],null).getPropertyValue("margin-left"));
	}
	if(counter == dcd_IG_MAX_COUNTER){
		dcd_IG_images[0].style.marginLeft = currentMargin + dcd_IG_SET_WIDTH + "px";
		dcd_IG_images[dcd_IG_CURRENT_INDEX].style.marginLeft = 0 + "px";
		dcd_IG_CURRENT_INDEX--;
		dcd_IG_IS_ANIMATING_IMAGES = false;
		return;
	}

	counter++;
	dcd_IG_images[0].style.marginLeft = parseInt(window.getComputedStyle(dcd_IG_images[0],null).getPropertyValue("margin-left")) + 4 + "px";
	dcd_IG_images[dcd_IG_CURRENT_INDEX].style.marginLeft = parseInt(window.getComputedStyle(dcd_IG_images[dcd_IG_CURRENT_INDEX],null).getPropertyValue("margin-left")) - 2 + "px";

	setTimeout(function(){
		dcd_IG_slideRight(false, counter++, currentMargin);
	},dcd_IG_calcSpeed(counter));
}

function dcd_IG_showControls(leftBtn, rightBtn){
	if(dcd_IG_ControlIsShown){
		return;
	}
	dcd_IG_ControlIsShown = true;
	if(dcd_IG_controlAnimation){
		clearInterval(dcd_IG_controlAnimation);
	}

	var adder = 2;
	var end = 0;

	dcd_IG_controlAnimation = setInterval(function(){
		leftBtn.style.left = parseInt(window.getComputedStyle(leftBtn,null).getPropertyValue("left")) + adder + "px";
		rightBtn.style.right = parseInt(window.getComputedStyle(rightBtn,null).getPropertyValue("right")) + adder + "px";
		if(parseInt(window.getComputedStyle(leftBtn,null).getPropertyValue("left")) == end){
			clearInterval(dcd_IG_controlAnimation);
		}
	},3);
}

function dcd_IG_hideControls(leftBtn, rightBtn){
	if(!dcd_IG_ControlIsShown){
		return;
	}
	dcd_IG_ControlIsShown = false;
	if(dcd_IG_controlAnimation){
		clearInterval(dcd_IG_controlAnimation);
	}

	var adder = -2;
	var end = -parseInt(window.getComputedStyle(leftBtn,null).getPropertyValue("width"));

	dcd_IG_controlAnimation = setInterval(function(){
		leftBtn.style.left = parseInt(window.getComputedStyle(leftBtn,null).getPropertyValue("left")) + adder + "px";
		rightBtn.style.right = parseInt(window.getComputedStyle(rightBtn,null).getPropertyValue("right")) + adder + "px";
		if(parseInt(window.getComputedStyle(leftBtn,null).getPropertyValue("left")) == end){
			clearInterval(dcd_IG_controlAnimation);
		}
	},3);
}

var DCD_ImageGalleryProto = Object.create(HTMLElement.prototype, {
	createdCallback: {
		value: function(){
			var t = document.querySelector('#imageGalleryTemplate');
			var clone = document.importNode(t.content, true);
			this.createShadowRoot().appendChild(clone);

			//Set width
			var container = this.shadowRoot.getElementById("box");
			dcd_IG_SET_WIDTH = parseInt(window.getComputedStyle(container,null).getPropertyValue("width"));
			dcd_IG_MAX_COUNTER = dcd_IG_SET_WIDTH/4;

			//Set images
			dcd_IG_images = container.getElementsByTagName("img");

			//Add listener
			var leftBtn = this.shadowRoot.getElementById("leftButton");
			leftBtn.addEventListener("click", function(){dcd_IG_slideLeft(true, 0, 0);});
			var rightBtn = this.shadowRoot.getElementById("rightButton");
			rightBtn.addEventListener("click", function(){dcd_IG_slideRight(true, 0, 0);});

			container.addEventListener("mouseover", function(){dcd_IG_showControls(leftBtn, rightBtn);});
			container.addEventListener("mouseleave", function(){dcd_IG_hideControls(leftBtn, rightBtn);});
		}
	}
});

document.registerElement('image-gallery', {prototype: DCD_ImageGalleryProto});
