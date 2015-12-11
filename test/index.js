import TicTacToe from '../src/TicTacToe';
import assert from 'assert';

let game;

describe('TicTacToe', function() {
	beforeEach(() => game = new TicTacToe());

  	describe('Gameplay states', () => {
  		it("lets X go first", () => {
  			assert.doesNotThrow(() => game.move('X', [0, 0]));
  		});
  		it("keeps track of which player's turn it is", () => {
			let state = game.move('X', [0, 0]);
			assert.strictEqual(state.turn, 'O');
			state = game.move('O', [1, 0]);
			assert.strictEqual(state.turn, 'X');
  		});
  		it('has undefined winner while game is being played', () => {
			let state = game.move('X', [0, 0]);
			assert.strictEqual(state.winner, undefined);
			state = game.move('O', [1, 0]);
			assert.strictEqual(state.winner, undefined);
		});
  	});

	describe('Game end states', () => {
		it('can be won by vertical line', () => {
			game.move('X', [0, 0]);
			game.move('O', [0, 1]);
			game.move('X', [0, 2]);
			game.move('O', [1, 1]);
			game.move('X', [1, 2]); 
			let state = game.move('O', [2, 1]);
			assert.equal(state.winner, 'O');
		});
		it('can be won by horizontal line', () => {
			game.move('X', [0, 0]);
			game.move('O', [2, 0]);
			game.move('X', [0, 2]);
			game.move('O', [2, 2]);
			game.move('X', [1, 2]); 
			let state = game.move('O', [2, 1]);
			assert.equal(state.winner, 'O');
		});
		it('can be won by descending diagonal line', () => {
			game.move('X', [0, 0]);
			game.move('O', [0, 1]);
			game.move('X', [1, 1]);
			game.move('O', [2, 1]);
			let state = game.move('X', [2, 2]);
			assert.equal(state.winner, 'X');
		});
		it('can be won by ascending diagonal line', () => {
			game.move('X', [2, 0]);
			game.move('O', [0, 1]);
			game.move('X', [1, 1]);
			game.move('O', [2, 1]);
			let state = game.move('X', [0, 2]);
			assert.equal(state.winner, 'X');
		});
		it('can be won even if the last move fills the board entirely', () => {
			game.move('X', [0, 0]);
			game.move('O', [0, 1]);
			game.move('X', [0, 2]);
			game.move('O', [1, 0]);
			game.move('X', [1, 1]);
			game.move('O', [1, 2]);
			game.move('X', [2, 1]);
			game.move('O', [2, 0]);
			let state = game.move('X', [2, 2]); // X still wins (diagonal, NOT cat's game)
			assert.equal(state.winner, 'X');
		});
		it("results in a null winner (draw) if board fills and no one wins", () => {
			game.move('X', [0, 0]);
			game.move('O', [0, 1]);
			game.move('X', [0, 2]);
			game.move('O', [1, 0]);
			game.move('X', [1, 1]);
			game.move('O', [2, 2]);
			game.move('X', [2, 1]);
			game.move('O', [2, 0]);
			let state = game.move('X', [1, 2]); // draw, no winner
			assert.strictEqual(state.winner, null);
		});
	});
	
	describe('Error states', () => {
		it("throws error if moving player doesn't exist", () => {
			assert.throws(() => game.move('Y', [0, 0]), Error);
		});
		it("throws error if move is outside of board area", () => {
			assert.throws(() => game.move('X', [0, 3]), Error);
			assert.throws(() => game.move('X', [-1, 0]), Error);
		});
		it("throws error if players try to move out of turn", () => {
			assert.throws(() => game.move('O', [1, 1]), Error);
			game.move('X', [0, 0]);
			assert.throws(() => game.move('X', [2, 1]), Error);
		});
		it("throws error if intended move is already an occupied square", () => {
			game.move('X', [0, 0]);
			assert.throws(() => game.move('O', [0, 0]), Error);
			game.move('O', [1, 0]);
			assert.throws(() => game.move('X', [1, 0]), Error);
		});
		it("throws error if move is attempted after the game has been won", () => {
			game.move('X', [0, 0]);
			game.move('O', [0, 1]);
			game.move('X', [1, 1]);
			game.move('O', [2, 1]);
			game.move('X', [2, 2]);
			assert.throws(() => game.move('O', [1, 0]), Error);
		});
	});
});