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
            title="Reset"
            className="button"
            onClick={props.resetBoard}
        >Reset</button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.rows = props.rows;
        this.columns = props.columns;
        this.board = props.board;
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

        let status = 'Next player: ' + (this.props.playerIsBlack ? 'X' : 'O');

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

        this.board_rows = 12;
        this.board_columns = 12;

        this.createBoard = this.createBoard.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.clickCell = this.clickCell.bind(this);

        this.board = this.createBoard(this.board_rows, this.board_columns);
        this.playerIsBlack = true;

        this.state = {
            board: this.board,
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
        // this.forceUpdate();
        this.setState({
            board: this.board,
            playerIsBlack: this.playerIsBlack,
        });
    }

    clickCell(x, y) {
        const board = [...this.board];
        board[x][y] = this.state.playerIsBlack ? 'X' : 'O';
        this.setState({
            board: board,
            playerIsBlack: !this.state.playerIsBlack
        });
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        rows={this.board_rows}
                        columns={this.board_columns}
                        board={this.state.board}
                        playerIsBlack={this.state.playerIsBlack}
                        clickCell={this.clickCell}
                    />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
                <div className="game-panel">
                    <ResetGameButton
                        rows={this.board_rows}
                        columns={this.board_columns}
                        resetBoard={this.resetBoard}
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
