var boardEle;

var boxArr = [];

var playerEle, offset = 7, bulletOffset = 12;

var currBoxEle, enemyCurBoxEleArr = [];

var enemiesIntervals = [], enemyMoveInterval = 100;

var border_left = 3, border_top = 7, border_right = 46, border_bottom = 28;

var startBoxLeft = border_left + 1, startBoxTop = border_top + 1, endBoxLeft = border_right - 1, endBoxTop = border_bottom - 1;

var startBoxId = startBoxLeft + "_" + startBoxTop, endBoxId = endBoxLeft + "_" + endBoxTop;

var enemyEleArr = [], enemyStartingBoxIdArr = [], enemyCount = 20;

var bulletEleArr = [], bulletCurBoxEleArr = [], maxBulletCount = 10, currentBulletCount = 0, bulletBlastTimeout = 100;

var keyPressed = [];

var endScreenTimeout = 500;

function loadBoxes() {
	
	var screenWidth = screen.availWidth, screenHeight = screen.availHeight;

	var boxEle = document.querySelector("#hiddenEle > div");
	
	var boxWidth = boxEle.offsetWidth, boxHeight = boxEle.offsetHeight;
	
	boardEle = document.getElementById("board");
	
	var boardWidth = boardEle.offsetWidth, boardHeight = boardEle.offsetWidth;
	
	var boxCountWidth = boardWidth/boxWidth, boxCountHeight = boardHeight/boxHeight;
	
	var board = "";
	
	for(var i = 0; i < boxCountHeight - 3; i++) {
	
		for(var j = 0; j < boxCountWidth - 3; j++) {
		
			var clonedBoxEle = boxEle.cloneNode(true);
			
			clonedBoxEle.id = j + "_" + i;
			
			board += clonedBoxEle.outerHTML;
		}
			
		board += "<br>";
	}
	
	boardEle.innerHTML = board;
	
	boxArr = Array.from(boardEle.childNodes);
	
	setTimeout(function() {
		
		document.getElementById("legend").classList.add("fadeAway");
	}, 3000);
	
	createStartAndEndBox()
	
	createPlayer();
	
	generateEnemyPositions();
	
	createEnemies();
	
	placePlayer();
	
	placeEnemies();
	
	startGame();
}

function createStartAndEndBox() {
	
	var startBoxEle = document.getElementById(startBoxId);
	
	startBoxEle.classList.add("startBox");
	
	var endBoxEle = document.getElementById(endBoxId);
	
	endBoxEle.classList.add("endBox");
}

function createPlayer() {
	
	var playerNode = document.createElement("DIV");
	
	playerNode.id = "player";
	playerNode.classList.add("entities");
	
	boardEle.appendChild(playerNode);
	
	playerEle = document.getElementById("player");
}

function generateEnemyPositions() {
	
	function randombetween(min, max) {

		return Math.floor(Math.random() * (+max - +min)) + +min;
	}
	
	for(var i = 0; i < enemyCount; i++) {
		
		do {
			
			var x_coordinate = randombetween(border_left + 1, border_right - 1);
			var y_coordinate = randombetween(border_top + 1, border_bottom - 1);
			
			var enemyStartingBoxId = x_coordinate+"_"+y_coordinate;
		}
		while(enemyStartingBoxIdArr.includes(enemyStartingBoxId));
		
		enemyStartingBoxIdArr.push(enemyStartingBoxId);
	}
}

function createEnemies() {

	for(var i = 0; i < enemyStartingBoxIdArr.length; i++) {
		
		var enemyStartingBox = enemyStartingBoxIdArr[i];
	
		var enemyNode = document.createElement("DIV");
		
		enemyNode.id = "e_"+enemyStartingBox;
		enemyNode.classList.add("enemy");
		enemyNode.classList.add("entities");
		enemyNode.setAttribute("enemyStartingBox", enemyStartingBox);
		
		boardEle.appendChild(enemyNode);
		
		var enemyEle = document.getElementById(enemyNode.id);
		
		enemyEleArr.push(enemyEle);
	}
}

function placePlayer() {
	
	var startBoxEle = document.getElementById(startBoxId);
	
	var startBoxLeft = startBoxEle.offsetLeft, startBoxTop = startBoxEle.offsetTop;
	
	playerEle.style.left = startBoxLeft + offset;
	playerEle.style.top = startBoxTop + offset;
	
	currBoxEle = startBoxEle;
}

function placeEnemies() {
	
	for(var i = 0; i < enemyEleArr.length; i++) {
		
		var enemyEle = enemyEleArr[i];
		
		var enemyStartingBoxEle = document.getElementById(enemyEle.getAttribute("enemyStartingBox"));
		
		var enemyStartingBoxLeft = enemyStartingBoxEle.offsetLeft, enemyStartingBoxTop = enemyStartingBoxEle.offsetTop;
		
		enemyEle.style.left = enemyStartingBoxLeft + offset;
		enemyEle.style.top = enemyStartingBoxTop + offset;
		
		enemyCurBoxEleArr[i] = enemyStartingBoxEle;
	}
}

function startGame() {
	
	startPlayerGame();
	
	startEnemyGame();
}

function startPlayerGame() {
	
	document.onkeydown = function(e) {
	
		keyPressed[e.keyCode] = true;
		
		if (keyPressed[32] && keyPressed[37]) {
			
			currBoxEle = jump(currBoxEle, "left");
		}
		else if (keyPressed[32] && keyPressed[38]) {
		
			currBoxEle = jump(currBoxEle, "up");
		}
		else if (keyPressed[32] && keyPressed[39]) {
		
			currBoxEle = jump(currBoxEle, "right");
		}
		else if (keyPressed[32] && keyPressed[40]) {
			
			currBoxEle = jump(currBoxEle, "down");
		}
		else if (keyPressed[37]) {
			
			currBoxEle = move(currBoxEle, "left");
		}
		else if (keyPressed[38]) {
		
			currBoxEle = move(currBoxEle, "up");
		}
		else if (keyPressed[39]) {
		
			currBoxEle = move(currBoxEle, "right");
		}
		else if (keyPressed[40]) {
			
			currBoxEle = move(currBoxEle, "down");
		}
		
		if(keyPressed[65]) {
			
			fireBullet("left");
		}
		else if(keyPressed[87]) {
			
			fireBullet("up");
		}
		else if(keyPressed[68]) {
			
			fireBullet("right");
		}
		else if(keyPressed[83]) {
			
			fireBullet("down");
		}
		
		/*currBoxEle.classList.add("playerVisited");
		
		setTimeout(function(){
			
			currBoxEle.classList.remove("playerVisited");
		}, 5000);*/
	};
	
	document.onkeyup = function(e) {
	
		keyPressed[e.keyCode] = false;
	};
}

function fireBullet(direction) {
	
	if(currentBulletCount < maxBulletCount) {
		
		var bulletNode = document.createElement("DIV");
		
		bulletNode.id = "b_"+currBoxEle.id+"_currentBulletCount";
		bulletNode.classList.add("bullet");
		bulletNode.setAttribute("bulletStartingBoxId", currBoxEle.id);
		bulletNode.setAttribute("bulletCurrentBoxId", currBoxEle.id);
		bulletNode.setAttribute("direction", direction);
	
		boardEle.appendChild(bulletNode);
	
		var bulletEle = document.getElementById(bulletNode.id);
		
		bulletEleArr[currentBulletCount] = bulletEle;
		
		var bulletStartingBoxEle = document.getElementById(bulletEle.getAttribute("bulletStartingBoxId"));
		
		var bulletEleLeft = bulletStartingBoxEle.offsetLeft, bulletEleTop = bulletStartingBoxEle.offsetTop;
	
		bulletEle.style.left = bulletEleLeft + bulletOffset;
		bulletEle.style.top = bulletEleTop + bulletOffset;
		
		var bulletInterval = setInterval(function(){
			
			var bulletCurBoxEle = document.getElementById(bulletNode.getAttribute("bulletCurrentBoxId"));
			
			var moveDirection = bulletNode.getAttribute("direction");
			
			bulletCurBoxEle = move(bulletCurBoxEle, moveDirection, false, false, bulletNode);
			
			bulletNode.setAttribute("bulletCurrentBoxId", bulletCurBoxEle.id);
		}, 100);
		
		bulletNode.setAttribute("bulletInterval", bulletInterval);
	
		currentBulletCount++;
	}
}

function startEnemyGame() {
	
	for(var i = 0; i < enemyEleArr.length; i++) {
		
		(function(i) {
			
			var enemyInterval = setInterval(function(){
		
				var enemyEle = enemyEleArr[i];
			
				var enemyCurBoxEle = enemyCurBoxEleArr[i];
			
				var min = 0;
				var max = 5;
				var randomDirectionIndex = Math.floor(Math.random() * (+max - +min)) + +min;
				
				switch(randomDirectionIndex) {
					
					case 1:
						enemyCurBoxEle = move(enemyCurBoxEle, "up", false, enemyEle);
					break;
					case 2:
						enemyCurBoxEle = move(enemyCurBoxEle, "right", false, enemyEle);
					break;
					case 3:
						enemyCurBoxEle = move(enemyCurBoxEle, "down", false, enemyEle);
					break;
					case 4:
						enemyCurBoxEle = move(enemyCurBoxEle, "left", false, enemyEle);
					break;
				}
				
				enemyCurBoxEle.classList.add("visited");
				
				setTimeout(function(){
					
					enemyCurBoxEle.classList.remove("visited");
				}, 5000);
				
				enemyCurBoxEleArr[i] = enemyCurBoxEle;
			
			}, enemyMoveInterval);
			
			enemiesIntervals.push(enemyInterval);
			
			enemyEleArr[i]	.setAttribute("enemyInterval", enemyInterval);
			
		})(i);
	}
}

function jump(currEntityBoxEle, direction) {

	playerEle.classList.add("jump");
	
	currEntityBoxEle = move(currEntityBoxEle, direction, true);
	
	currEntityBoxEle = move(currEntityBoxEle, direction);
	
	setTimeout(function(){
		
		playerEle.classList.remove("jump");
	}, 500);
	
	return currBoxEle;
}

function move(currEntityBoxEle, direction, jump, enemyEle, bulletEle) {
	
	var animationTimeOut = 200;
	
	if(jump) {
	
		animationTimeOut = 2000;
	}
		
	var currentId = currEntityBoxEle.id;
	
	var grid_x = currentId.split("_")[0];
	var grid_y = currentId.split("_")[1];
	
	switch(direction) {
		
		case "left":
			grid_x = Number(grid_x) - 1;
			if(grid_x < border_left) {
				if(bulletEle) {
					
					blastBullet(bulletEle);
				}
				grid_x = border_left;
			}
		break;
		case "up":
			grid_y = Number(grid_y) - 1;
			if(grid_y < border_top) {
				if(bulletEle) {
					
					blastBullet(bulletEle);
				}
				grid_y = border_top;
			}
		break;
		case "right":
			grid_x = Number(grid_x) + 1;
			if(grid_x > border_right) {
				if(bulletEle) {
					
					blastBullet(bulletEle);
				}
				grid_x = border_right;
			}
		break;
		case "down":
			grid_y = Number(grid_y) + 1;
			if(grid_y > border_bottom) {
				if(bulletEle) {
					
					blastBullet(bulletEle);
				}
				grid_y = border_bottom;
			}
		break;
	}
	
	var newBoxEleId = grid_x + "_" + grid_y;
	
	if(enemyEle
		&& (newBoxEleId == startBoxId
			|| newBoxEleId == endBoxId)) {
		
		newBoxEleId = currentId;
	}
	
	var newBoxEle = document.getElementById(newBoxEleId);
	
	var newBoxLeft = newBoxEle.offsetLeft, newBoxTop = newBoxEle.offsetTop;
	
	if(enemyEle) {
		
		enemyEle.style.left = newBoxLeft + offset;
		enemyEle.style.top = newBoxTop + offset;
	}
	else if(bulletEle) {
		
		bulletEle.style.left = newBoxLeft + bulletOffset;
		bulletEle.style.top = newBoxTop + bulletOffset;
	}
	else {
		
		playerEle.style.left = newBoxLeft + offset;
		playerEle.style.top = newBoxTop + offset;
		
		currBoxEle = newBoxEle;
	}
	
	if(bulletEle) {
		
		var hitEnemyEle = isEnemyHit(bulletEle, newBoxEle);
		
		//console.log(hitEnemyEle);
		
		if(hitEnemyEle) {
			
			blastBullet(bulletEle);
			
			destroyEnemy(hitEnemyEle);
		}
	}
	
	if(isCollision()) {
		
		setTimeout(function(){
		
			collition();
			
		}, animationTimeOut);
		
		return currEntityBoxEle; 
	}
	else if(currBoxEle.id == endBoxId) {
			
		win();
		
		return currEntityBoxEle; 
	}
	else {
		
		return newBoxEle;
	}
}

function isEnemyHit(bulletEle, newBoxEle) {
	
	var enemyEle = null;
	
	if(enemyCurBoxEleArr.includes(newBoxEle)) {
		
		var enemyEleIndex = enemyCurBoxEleArr.indexOf(newBoxEle);
		
		enemyEle = enemyEleArr[enemyEleIndex];
	}
	else {
		
		return false;
	}
	
	return enemyEle;
}

function blastBullet(bulletEle) {
	
	var bulletEleIndex = bulletEleArr.indexOf(bulletEle);
	
	var bulletInterval = bulletEle.getAttribute("bulletInterval");
	
	clearInterval(bulletInterval);
	
	setTimeout(function(){
	
		delete bulletEleArr[bulletEleIndex];
		
		currentBulletCount--;
		
		if(currentBulletCount == -1) {
			
			currentBulletCount = 0;
		}
		
		boardEle.removeChild(bulletEle);
	}, bulletBlastTimeout);
}

function isCollision() {
	
	if(enemyCurBoxEleArr.includes(currBoxEle)) {
		
		return true;
	}
	
	return false;
}

function collition() {
	
	playerEle.classList.add("blast");
	
	setTimeout(function(){
		
		placePlayer();
		
		playerEle.classList.remove("blast");
	}, 1000);
}

function win() {
	
	destroyEnemies();
	
	elevatePlayer();
	
	winScreen();
}

function destroyEnemies() {
	
	for(var i = 0; i < enemiesIntervals.length; i++) {
		
		var enemyInterval = enemiesIntervals[i];
	
		clearInterval(enemyInterval);
		
		var enemyEle = enemyEleArr[i];
		
		if(enemyEle) {
		
			enemyEle.classList.add("blast");
		}
	}
}

function destroyEnemy(enemyEle) {
	
	//console.log(enemyEle);
	
	var enemyInterval = enemyEle.getAttribute("enemyInterval");

	clearInterval(enemyInterval);
	
	enemyEle.classList.add("blast");
	
	var enemyEleIndex = enemyEleArr.indexOf(enemyEle);
	
	delete enemyEleArr[enemyEleIndex];
	
	delete enemyCurBoxEleArr[enemyEleIndex];
}

function elevatePlayer() {
	
	playerEle.classList.add("celebrate");
	
	setTimeout(function(){
		
		playerEle.classList.add("shrink");
	}, 3000);
}

function highlightIt(boxEle) {
	
	//boxEle.classList.toggle("fall");
}

function winScreen() {
	
	var winScreen = document.getElementById("winScreen");
	var winContent = document.getElementById("winContent");
	var winContentMessage = document.getElementById("winContentMessage");
	var winContentRestartGame = document.getElementById("winContentRestartGame");
	
	var timeOutCounter = 1;
	
	setTimeout(function(){
		
		winScreen.classList.remove("visibility_false");
		
		setTimeout(function(){
		
			winContent.classList.remove("visibility_false");
			
			setTimeout(function(){
		
				winContentMessage.classList.remove("visibility_false");
				
				setTimeout(function(){
		
					winContentRestartGame.classList.remove("visibility_false");
					
				}, endScreenTimeout);
				
			}, endScreenTimeout);
			
		}, endScreenTimeout);
		
	}, endScreenTimeout);
}
