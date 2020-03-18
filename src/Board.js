import React from "react";

function BoardRow(props) {
    return (
        <div
            className="board-row"
            key="row-{props.rowId}"
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

export {Square, BoardRow, ResetGameButton, SkipTurnButton};
