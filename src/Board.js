import React from "react";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.board = props.board;
        this.settings = props.settings;
        this.isPlayerOne = props.isPlayerOne;
        this.lastClicked = props.lastClicked;
    }

    renderCell(x, y, cellClass) {
        const player = this.props.board[x][y];
        let winningClass = '';
        if (player && this.settings.winningMoves[player]) {
            this.settings.winningMoves[player].forEach(moves => {
                if (moves[0] === x && moves[1] === y) {
                    winningClass = this.settings.winningClass;
                }
            });
        }

        return (
            <Square
                key={'row-' + x + '-col-' + y}
                title={
                    'Coordinates: [' + x + ',' + y + ']\n' +
                    'Readable coords: [' + (x + 1) + ',' + (y + 1) + ']\n' +
                    'Classname: ' + cellClass + ' ' + winningClass
                }
                className={
                    cellClass + ' ' + winningClass
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
            const highlightCell = this.props.lastClicked[0] === rowId && this.props.lastClicked[1] === colId;
            const className = highlightCell ? this.settings.selectedClass : '';
            columns.push(this.renderCell(rowId, colId, className));
        }
        row.push(<BoardRow
            key={"row-" + rowId}
            rowId={rowId}
            columns={columns}
        />);

        return row;
    }

    render() {
        const rowCount = this.settings.boardRows;
        const colCount = this.settings.boardColumns;

        let status = 'Next up: Player ' + (this.props.isPlayerOne ? this.settings.players.one : this.settings.players.two);

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
            className={'square ' + props.className}
            onClick={props.onClick}
        >{props.value}</button>
    );
}

function ResetGameButton(props) {
    return (
        <button
            title="Reset Game"
            className="button"
            disabled={props.disabled}
            onClick={props.resetBoard}
        >Reset Game</button>
    );
}

function SkipTurnButton(props) {
    return (
        <button
            title="Skip Turn"
            className="button"
            disabled={props.disabled}
            onClick={props.skipTurn}
        >Skip Turn</button>
    );
}

function UndoTurnButton(props) {
    return (
        <button
            title="Undo"
            className="button"
            disabled={props.disabled}
            onClick={props.undoLastMove}
        >Undo Last Move</button>
    );
}

function LogBoardButton(props) {
    return (
        <button
            title="Log Board"
            className="button"
            disabled={props.disabled}
            onClick={props.logBoard}
        >Log Board</button>
    );
}

export {Board, ResetGameButton, SkipTurnButton, UndoTurnButton, LogBoardButton};
