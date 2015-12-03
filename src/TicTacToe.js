import _ from 'lodash';

export default class TicTacToe {
	constructor(players=['X', 'O'], size=3) {
		this.size = size;
		this.players = players;
		this.reset();
	}
	reset() { // reset game state, call to play again after winning
		this.state = {
			board: _.times(this.size, row => _.times(this.size, col => undefined)), // the state of the grid
			turn: this.players[0],
			winner: undefined
		}
	}
	move(player, position) { // 'X', [1,2]
		const {size, players} = this;
		const {board, turn, winner} = this.state;

		if(!_.isUndefined(winner) || _.isNull(turn)) throw new Error('Game is already over, call .reset() to play again');
		if(!_.contains(players, player)) throw new Error(`${player} is not a player in this game`);
		if(player !== turn) throw new Error(`${player} cannot move, it is ${turn}s turn.`)
		if(_.any(position, i => (i < 0 || i >= size))) throw new Error(`${position} is not a valid board position (size ${size})`);
		if(!_.isUndefined(board[position[0]][position[1]])) throw new Error(`${position} is already occupied`);

		this.state.board[position[0]][position[1]] = player; // set player's move on board
		this.state.winner = getWinner(board, players); // check the board to see if there's a winner
		this.state.turn = this.state.winner ? null : players[(players.indexOf(turn) + 1) % players.length]; // cycle to next player
		// printState(this.state);
		return this.state;
	}
	getState() { return this.state; }
}

function getWinner(board, players) {
	const size = board.length;

	const winner = _.find(players, player => { // look for a winner by checking for 4 types of wins:
		return _.any(board, row => _.every(row, square => square === player)) || // filled entire row
			_.any(_.range(size), col => _.every(board, row => row[col] === player)) || // filled entire column
			_.every(board, (row, i) => row[i] === player) || // descending diagonal
			_.every(board, (row, i) => row[row.length - (i + 1)] === player) // ascending diagonal
	});
	return !_.isUndefined(winner) ? winner : // if there is a winner, return it
		// otherwise check to see if the board is full - if so, cat's game (null winner)
		(_.every(board, row => _.every(row, square => !_.isUndefined(square)))) ? null : undefined;
}

function printState(state) { // for debugging, print the game state nicely
	const {board, turn, winner} = state;
	board.forEach(row => console.log(row.map(p => p || '_').join(' ')));
	if(_.isUndefined(winner)) console.log(`No winner yet, ${turn}s turn`);
	else if(_.isNull(state.winner)) console.log("GAME OVER: Cat's game!");
	else console.log(`GAME OVER: ${winner} wins!`);
}
