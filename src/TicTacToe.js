import _ from 'lodash';

export default class TicTacToe {
    constructor(players=['X', 'O'], size=3) {
        this.size = size;
        this.players = players;
        this.reset();
    }
    reset() { // reset game state, call to play again after winning
        this.state = {
            grid: _.times(this.size, row => _.times(this.size, col => undefined)), // the state of the grid
            turn: this.players[0],
            winner: undefined,
            moveCount: 0 // optimization - keep track of # of moves made to avoid O(n^2) isFull() check
        }
    }
    move(player, position) { // eg. move('X', [1,2])
        const {size, players} = this;
        const {grid, turn, winner} = this.state;

        // ensure the game isn't over and the move is legal
        if(!_.isUndefined(winner) || _.isNull(turn)) throw new Error('Game is already over, call .reset() to play again');
        if(!_.contains(players, player)) throw new Error(`${player} is not a player in this game`);
        if(player !== turn) throw new Error(`${player} cannot move, it is ${turn}s turn.`);
        if(_.any(position, i => (i < 0 || i >= size))) throw new Error(`${position} is not a valid grid position (size ${size})`);
        if(!_.isUndefined(grid[position[0]][position[1]])) throw new Error(`${position} is already occupied`);

        // set player's move on the grid
        this.state.grid[position[0]][position[1]] = player;
        this.state.moveCount++;

        // check for a winner, set winner if so
        // if not, and if the grid is full, the game is a draw (null winner)
        // otherwise keep playing

        // naive (but perfectly acceptable) solutions - see optimization notes below
        //this.state.winner = getWinner(players, grid);
        //this.state.winner = isWinner(player, grid) ? player : (isFull(grid) ? null : undefined);

        // optimal solution
        const isGridFull = this.state.moveCount === (grid.length * grid.length);
        this.state.winner = isWinningMove(position, player, grid) ? player : (isGridFull ? null : undefined);

        // cycle to next player's turn
        this.state.turn = this.state.winner ? null : players[(players.indexOf(turn) + 1) % players.length];

        // printState(this.state);
        return this.state;
    }
    getState() {
        return this.state;
    }
}

// the naive solution is to just check to see if anyone has won the grid after every move
// checks all players and win states - O(m*(n^2))
function getWinner(players, grid) {
    // check to see if grid has a winner, by checking all possible players and win states
    const winner = _.find(players, player => isWinner(player, grid));
    return !_.isUndefined(winner) ? winner : (isFull(grid) ? null : undefined);
}

// slightly better is to only check if the player who just moved is the winner
// (ie. you can't make a move that causes your opponent to win)
// still O(n^2)
function isWinner(player, grid) {
    // check to see if given player is the winner of grid, by checking all possible win states
    return _.any(grid, row => _.every(row, square => square === player)) || // filled entire row
        _.any(_.range(grid.length), col => _.every(grid, row => row[col] === player)) || // filled entire column
        _.every(grid, (row, i) => row[i] === player) || // descending diagonal
        _.every(grid, (row, i) => row[row.length - (i + 1)] === player); // ascending diagonal
}

// best is to realize that if the player's most recent move results in a win,
// the winning line will always contain the most recent move
// so only check the row/column/diagonals that actually contain this move
// O(n)
function isWinningMove(move, player, grid) {
    // check to see if given move on grid is a winning move for player
    const [moveRow, moveCol] = move;
    return _.every(grid[moveRow], square => square === player) || // filled entire row
        _.every(grid, row => row[moveCol] === player) || // filled entire column
        // only check for diagonal win if the move falls on a diagonal
        ((moveRow === moveCol) && _.every(grid, (row, i) => row[i] === player)) || // descending diagonal
        ((moveRow === grid.length - (moveCol+1)) && _.every(grid, (row, i) => row[row.length - (i + 1)] === player)); // ascending
}

// naive solution checks to see if the board is full after every move
// but this is also O(n^2), and can be avoided by keeping track of the number of plays made
function isFull(grid) {
    // check to see if the grid is full (ie. no more moves can be made)
    return _.every(grid, row => _.every(row, square => !_.isUndefined(square)));
}

function printState(state) {
    // for debugging, print the game state nicely
    const {grid, turn, winner} = state;
    grid.forEach(row => console.log(row.map(p => p || '_').join(' ')));
    if(_.isUndefined(winner)) console.log(`No winner yet, ${turn}s turn`);
    else if(_.isNull(state.winner)) console.log("GAME OVER: Cat's game!");
    else console.log(`GAME OVER: ${winner} wins!`);
}
