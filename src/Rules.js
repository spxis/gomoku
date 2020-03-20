import React from "react";

export function checkForRegularWin(board, player, settings, direction = 'horizontal') {
    let isWinner = false;
    let counter = 0;

    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            const cell = direction === 'horizontal' ? board[x][y] : board[y][x];
            if (settings.exactMatchRequired) {
                if (cell === player && counter <= settings.cellsRequiredToWin) {
                    counter++;
                } else if (counter > settings.cellsRequiredToWin) {
                    isWinner = false;
                    break;
                } else if (counter === settings.cellsRequiredToWin) {
                    // console.log('Winner:', player, direction);
                    isWinner = true;
                    break;
                } else {
                    isWinner = false;
                    counter = 0;
                }
            } else {
                if (cell === player && counter < settings.cellsRequiredToWin) {
                    counter++;
                } else if (counter === settings.cellsRequiredToWin) {
                    isWinner = true;
                    // console.log('Winner:', player, direction);
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

export function checkForDiagonalWin(board, player, settings, direction = 'ltr') {
    let isWinner = false;
    const leftToRight = direction === 'ltr';
    const xStart = 0;
    const yStart = leftToRight ? 0 : board[0].length - 1;
    const xEnd = board.length - (settings.cellsRequiredToWin);
    const yEnd = leftToRight ? board[0].length - (settings.cellsRequiredToWin) : settings.cellsRequiredToWin - 1;
    let winningMoves = [];
    // console.log(`checking '${player}', direction: ${direction}, [${xStart},${yStart}]->[${xEnd},${yEnd}]`);

    for (let x = xStart; x <= xEnd; x++) {
        let counter = 0;
        for (let y = yStart; leftToRight ? y <= yEnd : y >= 0; leftToRight ? y++ : y--) {
            for (let check = 0; check < settings.cellsRequiredToWin; check++) {
                const xPosition = x + check;
                const yPosition = leftToRight ? y + check : y - check;
                // console.log(' - positions :', xPosition, yPosition);
                const cell = board[xPosition][yPosition];

                if (cell === player && counter < settings.cellsRequiredToWin) {
                    // console.log('found one', player, xPosition, yPosition, 'counter', counter);
                    winningMoves.push([xPosition, yPosition]);
                    counter++;
                } else {
                    counter = 0;
                    winningMoves = [];
                }
            }
            if (counter === settings.cellsRequiredToWin) {
                isWinner = true;
                // console.log('Winner A:', player, direction);
                settings.winningMoves[player] = winningMoves;
                break;
            }
        }
        if (isWinner) {
            // console.log('Winner B:', player, direction);
            settings.winningMoves[player] = winningMoves;
            break;
        }
    }

    return isWinner;
}
