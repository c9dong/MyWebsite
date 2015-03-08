var letters = [" ","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

function disappearText(element, mainCounter, disappearCounter, reappearCounter, letter, destinationLetter, shouldTerminate, initialMargin, timeout){
	if(disappearCounter == 0){
		element.innerHTML = letter;
		element.style.marginTop = '0px';
		reappearText(element, mainCounter,reappearCounter, destinationLetter,shouldTerminate, initialMargin, timeout);
	}else{
		//element.style.opacity = element.style.opacity - (1.0/initialMargin);
		element.style.marginTop = parseInt(element.style.marginTop)+1+'px';
		setTimeout(function(){disappearText(element, mainCounter,disappearCounter-1, reappearCounter+1, letter, destinationLetter, shouldTerminate, initialMargin, timeout);},1);
	}
}

function reappearText(element, mainCounter,reappearCounter, destinationLetter,shouldTerminate, initialMargin, timeout){
	if(reappearCounter == 0){
		changeText(element, mainCounter-1, destinationLetter, shouldTerminate);
	}else{
		//element.style.opacity = (initialMargin+1-reappearCounter)/initialMargin;
		element.style.marginTop = parseInt(element.style.marginTop)+1+'px';
		setTimeout(function(){reappearText(element, mainCounter,reappearCounter-1, destinationLetter, shouldTerminate, initialMargin, timeout);},timeout);
	}
}

function changeText(element, mainCounter, destinationLetter, shouldTerminate){
	if(shouldTerminate){ 
		return;
	}
	var index = Math.floor(Math.random()*letters.length);
	var letter = letters[index];
	var initialMargin = parseInt(window.getComputedStyle(element,null).getPropertyValue("margin-top"));
	if(letter == destinationLetter){
		shouldTerminate = true;
	}
	var timeout = 1;
	if(shouldTerminate){
		timeout = 25;
	}
	disappearText(element, mainCounter,initialMargin, 0, letter, destinationLetter, shouldTerminate, initialMargin, timeout);
}

var SpinningNameProto = Object.create(HTMLElement.prototype, {
	createdCallback:{
		value: function(){
			var t = document.querySelector('#spinningNameTemplate');
			var clone = document.importNode(t.content, true);
			this.createShadowRoot().appendChild(clone);

			this.addEventListener("click", function(){
				var destination = ["D","E","V","E","L","O","P","E","R"," "];
				//var mainName = document.getElementById("mainName");
				var childrenEle = this.shadowRoot.getElementById("box").getElementsByTagName('p');
				for(var i = 0; i < childrenEle.length; i++){
					setTimeout(changeText, Math.floor(Math.random()*1600), childrenEle[i], Math.floor(Math.random()*100)+10, destination[i], false);
				}
			});
		}
	}
});

document.registerElement('spinning-name', {prototype: SpinningNameProto});
