import React from 'react';

let humanMark = 'X';
let computerMark = 'O';

let Cell = React.createClass({displayName: 'Cell',
  cellStyle: {
    height: 100,
    width: 100,
    outline: '1px solid',
    float: 'left'
  },

  handleClick : function () {

		if (this.props.mark === 'O' || this.props.mark === 'X') {
			alert('Invalid spot: already filled');
			return;
		}

		// update board with click
		this.props.updateBoard(this.props.idx);
  },

  render: function() {

    let markerView;
    // TODO change this representation to 1,0, -1
    if (this.props.mark === 'X') {
      markerView =(
      <svg>
        <line x1="10" y1="10" x2="90" y2="90" stroke="black" strokeWidth="2"/>
        <line x1="10" y1="90" x2="90" y2="10" stroke="black" strokeWidth="2"/>
      </svg>
      )
    }
    else if (this.props.mark === 'O')
      markerView = <svg><circle cx="50" cy="50" r="40" stroke="black" strokeWidth="2" fill="none"/> </svg>;


    return (
        <div style={this.cellStyle} onClick={this.handleClick}>
          {markerView}
        </div>
    );
  }
});



let Board = React.createClass({displayName: 'Board',

	boardStyle: {
		width: 300,
		height: 300,
		margin: 'auto',
  		position: 'absolute',
  		top: 0, left: 0, bottom: 0, right: 0
	},

	getInitialState: function() {
		return {
			board: [ ' ', ' ', ' '
					,' ', ' ', ' '
					,' ', ' ', ' ']}
	},

	updateBoard : function (idx) {
		var board = this.state.board;
		board[idx] = humanMark;
		this.setState({board: board});

		let int_board = this.state.board.map(
			function(char){
				if (char === 'O')
					return 1
				else if (char === 'X')
					return 0
				else
					return -1
			}
		)
		console.log(int_board);
		// make api call to get computer move
		var http = new XMLHttpRequest();
		var url = "http://127.0.0.1:5000/api/board"

		http.open("POST", url);
		//Send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Access-Control-Allow-Origin", "*");
		var me = this;
		http.onreadystatechange = function() {//Call a function when the state changes.
		    if(http.readyState == 4 && http.status == 200) {
		        let res = JSON.parse(http.responseText);

		        // if valid move passed back then update views
		        if (res.row != -1 && res.col != -1) {
			        let board = me.state.board;
			        board[res.col + res.row*3] = computerMark;
			        me.setState({board: board});
		    	}

		    	// if winner was declared, declare it
		        if(res.winner != undefined){
		        	alert(res.winner)
		        }
		    }
		}

		http.send("board=" + JSON.stringify(int_board));
	},

	render: function() {
		let me = this;

		let createCellFunc = function(tic, idx) {
			return (
				<Cell updateBoard={me.updateBoard} idx={idx} mark={tic}/>
			);
		};
		// prepare cells
		let cells = this.state.board.map(createCellFunc);
		return (
			<div style={this.boardStyle}>{cells}</div>
		);
	}
});

export default Board;