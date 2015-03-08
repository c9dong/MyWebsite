//Constants
var dcd_IG_images;
var dcd_IG_SET_WIDTH;
var dcd_IG_CURRENT_INDEX = 0;
var dcd_IG_MAX_COUNTER;
var dcd_IG_IS_ANIMATING = false;

//Function to add acceleration to animation
function dcd_IG_calcSpeed(counter){
	var s;
	//if(counter <= MAX_COUNTER/2.0){
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
	if(dcd_IG_IS_ANIMATING && firstTime){
		return;
	}
	if(dcd_IG_CURRENT_INDEX+1 == dcd_IG_images.length){
		return;
	}
	if(firstTime){
		dcd_IG_IS_ANIMATING = true;
		dcd_IG_images[0].style.zIndex = 0;
		dcd_IG_images[dcd_IG_CURRENT_INDEX+1].style.zIndex = 1;
		currentMargin = parseInt(window.getComputedStyle(dcd_IG_images[0],null).getPropertyValue("margin-left"));
	}
	if(counter == dcd_IG_MAX_COUNTER){
		dcd_IG_images[0].style.marginLeft = currentMargin - dcd_IG_SET_WIDTH + "px";
		dcd_IG_images[dcd_IG_CURRENT_INDEX+1].style.marginLeft = 0 + "px";
		dcd_IG_CURRENT_INDEX++;
		dcd_IG_IS_ANIMATING = false;
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
	if(dcd_IG_IS_ANIMATING && firstTime){
		return;
	}
	if(dcd_IG_CURRENT_INDEX == 0){
		return;
	}

	if(firstTime){
		dcd_IG_IS_ANIMATING = true;
		dcd_IG_images[0].style.zIndex = 1;
		dcd_IG_images[dcd_IG_CURRENT_INDEX].style.zIndex = 0;
		currentMargin = parseInt(window.getComputedStyle(dcd_IG_images[0],null).getPropertyValue("margin-left"));
	}
	if(counter == dcd_IG_MAX_COUNTER){
		dcd_IG_images[0].style.marginLeft = currentMargin + dcd_IG_SET_WIDTH + "px";
		dcd_IG_images[dcd_IG_CURRENT_INDEX].style.marginLeft = 0 + "px";
		dcd_IG_CURRENT_INDEX--;
		dcd_IG_IS_ANIMATING = false;
		return;
	}

	counter++;
	dcd_IG_images[0].style.marginLeft = parseInt(window.getComputedStyle(dcd_IG_images[0],null).getPropertyValue("margin-left")) + 4 + "px";
	dcd_IG_images[dcd_IG_CURRENT_INDEX].style.marginLeft = parseInt(window.getComputedStyle(dcd_IG_images[dcd_IG_CURRENT_INDEX],null).getPropertyValue("margin-left")) - 2 + "px";

	setTimeout(function(){
		dcd_IG_slideRight(false, counter++, currentMargin);
	},dcd_IG_calcSpeed(counter));
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
		}
	}
});

document.registerElement('image-gallery', {prototype: DCD_ImageGalleryProto});
