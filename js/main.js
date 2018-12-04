var view = {
	displayMessage: function(msg){
		document.querySelector("#userTextArea").innerHTML = msg;
	},

	addUsersTextArea: function(){
		$("#userTextArea").fadeIn(2000);
	},

	clearUserTextArea: function(){
		document.querySelector("#userTextArea").innerHTML = '';
	},

	clearField: function() {
		document.querySelector("tbody").innerHTML = '';
	},

	showLog: function() {
		btnLog.innerHTML = "Hide Log";
	},

	generateField: function(size){
		var table = document.querySelector("tbody");
		var innerTXT = '';
		for (var i = 0; i < size; i++){
			innerTXT += "<tr>";
			for (var j = 0; j < size; j++){
				innerTXT += "<td id='" + i + j + "' onclick='view.drawXorO(" + i + "," + j + ")'></td>";
			}
			innerTXT += "</tr>";
		}
		table.innerHTML = innerTXT;
	},

	fillingFields: function(){
		var elem;
		for (var i = 0; i < model.size; i++){
			for (var j = 0; j < model.size; j++){
				elem = document.getElementById("" + i + j);
				if (elem.innerHTML === "")
					elem.innerHTML = " ";
			}
		}
	},

	displaySides: function(){
		this.displayMessage(((model.players.playerOne.Side[1]) ? (model.players.playerOne.Name + " is staring game.\n") : (model.players.playerTwo.Name + " is staring game. Your turn is the first.\n")) + 
			model.players.playerOne.Name + " plays with " + model.players.playerOne.Side[0] +".\n" +
			model.players.playerTwo.Name + " plays with " + model.players.playerTwo.Side[0] +".");
		},

	drawXorO: function(x, y){
		var elem = document.getElementById("" + x + y);
		if (elem.innerHTML === ''){
			if (model.players.playerOne.Side[1]) {
				view.displayMessage(model.players.playerTwo.Name + ", your turn.");
				if (model.players.playerOne.Side[0] === "X"){
					elem.innerHTML = "<img src='img/cross.png'>";
				} else elem.innerHTML = "<img src='img/circle.png'>";
				model.players.playerOne.Side[1] = false;
				model.players.playerTwo.Side[1] = true;

			} else {
				view.displayMessage(model.players.playerOne.Name + ", your turn.");
				if (model.players.playerTwo.Side[0] === "X"){
					elem.innerHTML = "<img src='img/cross.png'>";
				} else elem.innerHTML = "<img src='img/circle.png'>";
				model.players.playerTwo.Side[1] = false;
				model.players.playerOne.Side[1] = true;
			};
			model.players.hits++;
			controller.checkWinner(x, y, elem.innerHTML);
		}
	}	
}

var model = {
	size: null,

	players: {
		hits: 0,
		winner: null,

		playerOne: {
			Name: null,
			Side: ['', null]
		},

		playerTwo: {
			Name: null,
			Side: ['', null]
		}
	},

    getParameters: function(){
    	this.size = document.querySelector("#size").value;
    	this.players.playerOne.Name = document.querySelector("#firstPlayerName").value;
		this.players.playerTwo.Name = document.querySelector("#secondPlayerName").value;
    	
    	if (this.size < 3 || this.size > 10 || this.players.playerOne.Name === '' || this.players.playerTwo.Name === ''){
			controller.readyToStart = false;
		} else {
			controller.readyToStart = true;
		};
    },

    randomizeFun: function(){
    	var random = Math.round(Math.random());
		if (random === 0) {
			this.players.playerOne.Side[0] = "O";		
			this.players.playerTwo.Side[0] = "X";

		} else {
			this.players.playerTwo.Side[0] = "O";
			this.players.playerOne.Side[0] = "X";      
    	}
    	random = Math.round(Math.random());
    	if (random === 0) {
    		this.players.playerOne.Side[1] = false;
    		this.players.playerTwo.Side[1] = true;
    	} else {
    		this.players.playerTwo.Side[1] = false;
    		this.players.playerOne.Side[1] = true;
    	}
    	console.log(this.players.playerOne.Side);
    	console.log(this.players.playerTwo.Side);
	}
}

var controller = {
	readyToStart: false,

	start: function(){
		view.clearField();
		model.getParameters();
		view.addUsersTextArea();
		if (this.readyToStart) {
			view.displayMessage("Let's go, " + model.players.playerOne.Name + " & " + model.players.playerTwo.Name + "!");
			setTimeout(function(){
				model.players.hits = 0;
				model.randomizeFun();
				view.displaySides();
				view.generateField(model.size);
			}, 2000);
		} else {
			view.displayMessage("Check your input parameters, please.");
		}
	},

	checkWinner: function(x, y, innerText){
		var match = 0;
		var elem = null;
		model.players.winner = null;

		function winnerEqual(){
			(innerText.indexOf('cross') + 1)?((model.players.playerOne.Side[0] === "X")?(model.players.winner = model.players.playerOne.Name):(model.players.winner = model.players.playerTwo.Name)):(((model.players.playerOne.Side[0] === "O"))?(model.players.winner = model.players.playerOne.Name):(model.players.winner = model.players.playerTwo.Name));
			view.displayMessage(model.players.winner + " is winner.");
			view.fillingFields();
		};

		/*********************************** Horizontal Check ***********************************/
		for (var i = 0; i < model.size; i++){
			match = 0;
			for (var j = 0; j < model.size; j++){
				elem = document.getElementById("" + i + j);
				if (elem.innerHTML === innerText){
					match++;
					if (match === 3){
						winnerEqual();
						console.log("1 cycle");
						break;
					}
				} else match = 0;
			}			
		}

		/*********************************** Vertical Check ***********************************/
		for (var i = 0; i < model.size; i++){
			match = 0;
			for (var j = 0; j < model.size; j++){
				elem = document.getElementById("" + j + i);
				if (elem.innerHTML === innerText){
					match++;
					if (match === 3){
						winnerEqual();
						console.log("2 cycle");
						break;
					}
				} else match = 0;
			}			
		}

		/*********************************** Right Diagonal ***********************************/
		match = 0;
		for (var k = 0; k < model.size; k++){
			elem = document.getElementById("" + k + k);
			if (elem.innerHTML === innerText){
					match++;
					if (match === 3){
						winnerEqual();
						console.log("3 cycle");
						break;
					}
				} else match = 0;
		}
		for (var k = 0, l = 1; k < (model.size - 3); k++, l++){				/* k = iterations, l = starting cell */
			match = 0;
			for (var n = 0, m = l; n < (model.size - l); n++, m++){				/* n = rows, m = cols; dynamic diagonal сycle */
				elem = document.getElementById("" + n + m);
				if (elem.innerHTML === innerText){
					match++;
					if (match === 3){
						winnerEqual();
						console.log("4 cycle");
						console.log(m);
						break;
					}
				} else match = 0;
			}
			match = 0;
			for (var n = 0, m = l; n < (model.size - l); n++, m++){
				elem = document.getElementById("" + m + n);
				if (elem.innerHTML === innerText){
					match++;
					if (match === 3){
						winnerEqual();
						console.log("5 cycle");
						break;
					}
				} else match = 0;	
			}
		}
		/*********************************** Left Diagonal ***********************************/
		match = 0;
		for (var i = 0, j = (model.size - 1); i < model.size; i++, j--){
			elem = document.getElementById("" + i + j);
			if (elem.innerHTML === innerText){
				match++;
				if (match === 3){
					winnerEqual();
					console.log("6 cycle");
					break;
				}
			} else match = 0;
		}
		for (var k = 0, l = (model.size - 2); k < (model.size - 3); k++, l--){			/* k = iterations, l = starting cell */
			match = 0;
			for (var n = 0, m = l; n < (l + 1) ; n++, m--){								/* n = cols, m = rows; dynamic diagonal сycle */
				elem = document.getElementById("" + n + m);
				if (elem.innerHTML === innerText){
				match++;
				if (match === 3){
					winnerEqual();
					console.log("7 cycle");
					break;
				}
				} else match = 0;
			}
			match = 0;
			for (var n = (k+1), m = (model.size - 1); n < (model.size) ; n++, m--){								
				elem = document.getElementById("" + m + n);
				if (elem.innerHTML === innerText){
				match++;
				if (match === 3){
					winnerEqual();
					console.log("8 cycle");
					break;
				}
				} else match = 0;
			}																									
		}
		/*********************************** Draw ***********************************/
		var counter = 0;
		for (var i = 0; i < model.size; i++){
			for (var j = 0; j < model.size; j++){
				elem = document.getElementById("" + i + j);
				if (elem.innerHTML !== "")
					counter++;
			}
		}
		if ((counter === Math.pow(model.size,2)) && (model.players.winner === null)){
			view.displayMessage("Draw.");
		}
	}
}