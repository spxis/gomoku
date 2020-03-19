import React from "react";

export function checkForRegularWin(board, player, rules, direction = 'horizontal') {
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

