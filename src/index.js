import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {checkForRegularWin, checkForDiagonalWin} from './Rules';
import {Board, ResetGameButton, SkipTurnButton, UndoTurnButton, LogBoardButton} from './Board'

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.settings = {
            boardRows: 7,
            boardColumns: 7,
            cellsRequiredToWin: 3,
            exactMatchRequired: true,
            allowChangeSquare: true,
            winningMoves: {},
            winningClass: 'winning',
            selectedClass: 'selected',
            players: {
                one: 'X',
                two: 'O',
            }
        };

        this.createBoard = this.createBoard.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.skipTurn = this.skipTurn.bind(this);
        this.undoLastMove = this.undoLastMove.bind(this);
        this.clickCell = this.clickCell.bind(this);
        this.logBoard = this.logBoard.bind(this);

        this.board = this.createBoard(this.settings.boardRows, this.settings.boardColumns);
        this.isPlayerOne = true;
        this.lastClicked = [-1, -1];
        this.state = {
            board: this.board,
            players: this.settings.players,
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
        this.board = this.createBoard(this.settings.boardColumns, this.settings.boardRows);
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
        let isPlayerOne;

        if (this.settings.allowChangeSquare && existingPiece) {
            // We are flipping an existing piece over.
            if (existingPiece === this.settings.players.one) {
                placePiece(x, y, this.settings.players.two);
            } else {
                placePiece(x, y, null);
            }
            isPlayerOne = existingPiece === this.settings.players.two;
        } else if (!existingPiece) {
            // We are placing into a blank square.
            placePiece(x, y, this.state.isPlayerOne ? this.settings.players.one : this.settings.players.two);
            isPlayerOne = !this.state.isPlayerOne;
        }

        this.setState({
            board: board,
            isPlayerOne: isPlayerOne,
            lastClicked: [x, y],
        });
    }

    hasWin(player) {
        const isXWinner = checkForRegularWin(this.board, player, this.settings, 'horizontal');
        const isYWinner = checkForRegularWin(this.board, player, this.settings, 'vertical');
        const isLDWinner = checkForDiagonalWin(this.board, player, this.settings, 'ltr');
        const isRDWinner = checkForDiagonalWin(this.board, player, this.settings, 'rtl');
        const playerWins = isXWinner || isYWinner || isLDWinner || isRDWinner;

        if (!playerWins) {
            // Ultimately should this happen in each of the checks?
            // We might want to have this object populate for each win type.
            this.settings.winningMoves[player] = [];
        }

        return playerWins;
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        board={this.state.board}
                        settings={this.settings}
                        isPlayerOne={this.state.isPlayerOne}
                        lastClicked={this.state.lastClicked}
                        clickCell={this.clickCell}
                    />
                </div>
                <div className="game-info">
                    Game Status:
                    <ul>
                        <li>Player {this.settings.players.one}: {this.hasWin(this.settings.players.one) ? 'WIN ' + JSON.stringify(this.settings.winningMoves[this.settings.players.one]) : '-'}</li>
                        <li>Player {this.settings.players.two}: {this.hasWin(this.settings.players.two) ? 'WIN ' + JSON.stringify(this.settings.winningMoves[this.settings.players.two]) : '-'}</li>
                        <li>Needed to win: {this.settings.cellsRequiredToWin}</li>
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
                        disabled={"disabled"}
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
