import React from "react";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.rows = props.rows;
        this.columns = props.columns;
        this.board = props.board;
        this.players = props.players;
        this.isPlayerOne = props.isPlayerOne;
        this.lastClicked = [-1, -1];
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
        row.push(<BoardRow
            key={"row-" + rowId}
            rowId={rowId}
            columns={columns}
        />);

        return row;
    }

    render() {
        const rowCount = this.rows;
        const colCount = this.columns;

        let status = 'Next up: Player ' + (this.props.isPlayerOne ? this.players.one : this.players.two);

        const colIds = Array.from(Array(colCount), (d, i) => i);
        let rows = [];
        for (let rowId = 0; rowId < rowCount; rowId++) {
            rows.push(this.renderRow(rowId, colIds));
        }

        return (
            <div className="board">
                <div className="status">{status}</div>
                {rows}
            </div>
        );
    }
}

function BoardRow(props) {
    return (
        <div
            className="board-row"
        >{props.columns}</div>
    );
}

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

export {Board, ResetGameButton, SkipTurnButton};
