import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            title={props.title}
            className="square"
            onClick={props.onClick}
        >{props.value}</button>
    );
}

function ResetGameButton(props) {
    return (
        <button
            title="Reset Game"
            className="button"
            onClick={props.resetBoard}
        >Reset</button>
    );
}

function SkipTurnButton(props) {
    return (
        <button
            title="Skip Turn"
            className="button"
            onClick={props.skipTurn}
        >Skip Turn</button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.rows = props.rows;
        this.columns = props.columns;
        this.board = props.board;
        this.players = props.players;
        this.playerIsBlack = props.playerIsBlack;
    }

    renderCell(x, y) {
        return (
            <Square
                key={'row-' + x + '-col-' + y}
                title={
                    'Coordinates: [' + x + ',' + y + ']\n' +
                    'Readable coords: [' + (x + 1) + ',' + (y + 1) + ']'
                }
                value={
                    this.props.board[x][y]
                }
                onClick={() => {
                    this.props.clickCell(x, y);
                }}
            />
        );
    }

    renderRow(rowId, cols) {
        let row = [];
        let columns = [];
        for (const colId of cols) {
            columns.push(this.renderCell(rowId, colId));
        }
        row.push(<div className="board-row" key="row-{rowId}">{columns}</div>);

        return row;
    }

    render() {
        const rowCount = this.rows;
        const colCount = this.columns;

        let status = 'Next up: Player ' + (this.props.playerIsBlack ? this.players.one : this.players.two);

        const colIds = Array.from(Array(colCount), (d, i) => i);
        let rows = [];
        for (let rowId = 0; rowId < rowCount; rowId++) {
            rows.push(this.renderRow(rowId, colIds));
        }

        return (
            <div>
                <div className="status">{status}</div>
                {rows}
            </div>
        );
    }
}

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
        this.playerIsBlack = true;
        this.players = {
            one: 'X',
            two: 'O',
        };

        this.state = {
            board: this.board,
            players: this.players,
            playerIsBlack: this.playerIsBlack
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
        this.playerIsBlack = true;
        this.setState({
            board: this.board,
            playerIsBlack: this.playerIsBlack,
        });
    }

    skipTurn() {
        this.playerIsBlack = !this.state.playerIsBlack;
        this.setState({
            playerIsBlack: this.playerIsBlack,
        });
    }

    clickCell(x, y) {
        const board = [...this.board];
        board[x][y] = this.state.playerIsBlack ? this.players.one : this.players.two;
        this.setState({
            board: board,
            playerIsBlack: !this.state.playerIsBlack
        });
    }

    checkForWin(board, player, rules, direction = 'horizontal') {
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

        let isXWinner = this.checkForWin(this.board, player, rules, 'horizontal');
        let isYWinner = this.checkForWin(this.board, player, rules, 'vertical');

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
                        playerIsBlack={this.state.playerIsBlack}
                        clickCell={this.clickCell}
                    />
                </div>
                <div className="game-info">
                    Game Status:
                    <ul>
                        <li>Player {this.players.one}: {
                            this.hasWin(this.players.one) ? 'WIN' : '-'
                        }</li>
                        <li>Player {this.players.two}: {
                            this.hasWin(this.players.two) ? 'WIN' : '-'
                        }</li>
                    </ul>
                </div>
                <div className="game-panel">
                    <ResetGameButton
                        rows={this.board_rows}
                        columns={this.board_columns}
                        resetBoard={this.resetBoard}
                    />
                    <SkipTurnButton
                        board={this.state.board}
                        playerIsBlack={this.state.playerIsBlack}
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
