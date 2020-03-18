import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Board, ResetGameButton, SkipTurnButton} from './Board'

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.board_rows = 19;
        this.board_columns = 19;
        this.cellsRequiredToWin = 5;
        this.exactMatchRequired = true;

        this.createBoard = this.createBoard.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.skipTurn = this.skipTurn.bind(this);
        this.clickCell = this.clickCell.bind(this);

        this.board = this.createBoard(this.board_rows, this.board_columns);
        this.isPlayerOne = true;
        this.lastClicked = [-1, -1];
        this.players = {
            one: 'X',
            two: 'O',
        };

        this.state = {
            board: this.board,
            players: this.players,
            isPlayerOne: this.isPlayerOne,
            lastClicked: this.lastClicked,
        };
    }

    createBoard(cols, rows) {
        const array = new Array(cols);
        for (let x = 0; x < cols; x++) {
            array[x] = new Array(rows);
            for (let y = 0; y < rows; y++) {
                array[x][y] = null;
            }
        }
        return array;
    }

    resetBoard() {
        this.board = this.createBoard(this.board_columns, this.board_rows);
        this.isPlayerOne = true;
        this.setState({
            board: this.board,
            isPlayerOne: this.isPlayerOne,
            lastClicked: [-1, -1],
        });
    }

    skipTurn() {
        this.isPlayerOne = !this.state.isPlayerOne;
        this.setState({
            isPlayerOne: this.isPlayerOne,
            lastClicked: this.lastClicked,
        });
    }

    clickCell(x, y) {
        const board = [...this.board];
        const existingPiece = board[x][y];

        if (existingPiece) {
            // We are flipping an existing piece over.
            if (board[x][y] === this.players.one) {
                board[x][y] = this.players.two;
            } else {
                board[x][y] = null;
            }
            this.state.isPlayerOne = board[x][y] === this.players.two;
        } else {
            // We are placing into a blank square.
            board[x][y] = this.state.isPlayerOne ? this.players.one : this.players.two;
            this.state.isPlayerOne = !this.state.isPlayerOne;
        }
        this.state.lastClicked = [x, y];
        this.setState({
            board: board,
            isPlayerOne: this.state.isPlayerOne,
            lastClicked: this.state.lastClicked
        });
    }

    checkForRegularWin(board, player, rules, direction = 'horizontal') {
        let isWinner = false;
        let counter = 0;

        for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board[x].length; y++) {
                const cell = direction === 'horizontal' ? board[x][y] : board[y][x];
                if (rules.exactMatchRequired) {
                    if (cell === player && counter <= rules.cellsRequiredToWin) {
                        counter++;
                    } else if (counter > rules.cellsRequiredToWin) {
                        isWinner = false;
                        break;
                    } else if (counter === rules.cellsRequiredToWin) {
                        isWinner = true;
                        break;
                    } else {
                        isWinner = false;
                        counter = 0;
                    }
                } else {
                    if (cell === player && counter < rules.cellsRequiredToWin) {
                        counter++;
                    } else if (counter === rules.cellsRequiredToWin) {
                        isWinner = true;
                        break;
                    } else {
                        isWinner = false;
                        counter = 0;
                    }
                }
                if (isWinner) {
                    break;
                }
            }
            if (isWinner) {
                break;
            }
        }

        return isWinner;
    }

    hasWin(player) {
        const rules = {
            exactMatchRequired: this.exactMatchRequired,
            cellsRequiredToWin: this.cellsRequiredToWin
        };

        let isXWinner = this.checkForRegularWin(this.board, player, rules, 'horizontal');
        let isYWinner = this.checkForRegularWin(this.board, player, rules, 'vertical');
        // let isDWinner = this.checkForRegularWin(this.board, player, rules, 'diagonal');

        return isXWinner || isYWinner;
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        rows={this.board_rows}
                        columns={this.board_columns}
                        board={this.state.board}
                        players={this.state.players}
                        isPlayerOne={this.state.isPlayerOne}
                        clickCell={this.clickCell}
                    />
                </div>
                <div className="game-info">
                    Game Status:
                    <ul>
                        <li>Player {this.players.one}: {this.hasWin(this.players.one) ? 'WIN' : '-'}</li>
                        <li>Player {this.players.two}: {this.hasWin(this.players.two) ? 'WIN' : '-'}</li>
                        <li>Last clicked cell [{this.state.lastClicked[0]},{this.state.lastClicked[1]}]</li>
                    </ul>
                </div>
                <div className="game-panel">
                    <ResetGameButton
                        resetBoard={this.resetBoard}
                    />
                    <SkipTurnButton
                        skipTurn={this.skipTurn}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
