import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {checkForRegularWin} from './Rules';
import {Board, ResetGameButton, SkipTurnButton, UndoTurnButton, LogBoardButton} from './Board'

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.board_rows = 10;
        this.board_columns = 10;
        this.cellsRequiredToWin = 3;
        this.exactMatchRequired = true;
        this.allowChangeSquare = true;

        this.createBoard = this.createBoard.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.skipTurn = this.skipTurn.bind(this);
        this.undoLastMove = this.undoLastMove.bind(this);
        this.clickCell = this.clickCell.bind(this);
        this.logBoard = this.logBoard.bind(this);

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

    logBoard() {
        console.log(this.board);
    }

    undoLastMove() {
        // We have to go back in history to the previous move.
    }

    clickCell(x, y) {
        const board = [...this.board];
        const existingPiece = board[x][y];
        const placePiece = (x, y, player) => board[x][y] = player;

        if (this.allowChangeSquare && existingPiece) {
            // We are flipping an existing piece over.
            if (existingPiece === this.players.one) {
                placePiece(x, y, this.players.two);
            } else {
                placePiece(x, y, null);
            }
            this.state.isPlayerOne = existingPiece === this.players.two;
        } else if (!existingPiece) {
            // We are placing into a blank square.
            placePiece(x, y, this.state.isPlayerOne ? this.players.one : this.players.two);
            this.state.isPlayerOne = !this.state.isPlayerOne;
        }

        this.state.lastClicked = [x, y];
        this.setState({
            board: board,
            isPlayerOne: this.state.isPlayerOne,
            lastClicked: this.state.lastClicked
        });
    }

    hasWin(player) {
        const rules = {
            exactMatchRequired: this.exactMatchRequired,
            cellsRequiredToWin: this.cellsRequiredToWin
        };

        let isXWinner = checkForRegularWin(this.board, player, rules, 'horizontal');
        let isYWinner = checkForRegularWin(this.board, player, rules, 'vertical');
        // let isDWinner = checkForRegularWin(this.board, player, rules, 'diagonal');

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
                        lastClicked={this.state.lastClicked}
                        clickCell={this.clickCell}
                    />
                </div>
                <div className="game-info">
                    Game Status:
                    <ul>
                        <li>Player {this.players.one}: {this.hasWin(this.players.one) ? 'WIN' : '-'}</li>
                        <li>Player {this.players.two}: {this.hasWin(this.players.two) ? 'WIN' : '-'}</li>
                        <li>Needed to win: {this.cellsRequiredToWin}</li>
                        <li>Last clicked cell: [{this.state.lastClicked[0]},{this.state.lastClicked[1]}]</li>
                    </ul>
                </div>
                <div className="game-panel">
                    <ResetGameButton
                        resetBoard={this.resetBoard}
                    />
                    <SkipTurnButton
                        skipTurn={this.skipTurn}
                    />
                    <UndoTurnButton
                        undoLastMove={this.undoLastMove}
                    />
                    <LogBoardButton
                        logBoard={this.logBoard}
                    >Log Board</LogBoardButton>
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
