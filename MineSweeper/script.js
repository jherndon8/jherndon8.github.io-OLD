var adjCount;
$(document).ready(function() {
    var colors = ["blue", "green", "red", "violet", "magenta", "cyan", "black", "grey"];
    var count = 0;
    var gameOver = false;
    var cellHeight = 16;
    var cellWidth = 16;
    var mines = 40;
    var getRandInt = function(max) {
        return Math.floor(Math.random() * max);
    }
    var getRow = function(mine) {
        return mine.parent().index();
    }
    var getCol = function(mine) {
        return mine.index();
    }
    var isMine = function(row, col) {
        return $('.row:nth-of-type('+(row)+') div:nth-child('+(col)+')')
            .hasClass('mine');
    }
    for (var row = 0; row < cellHeight; row++) {
        $('#grid').append('<div class="row"></div>');
    }
    for (var col = 0; col < cellWidth; col++) {
        $('.row').append('<div class="cell"></div>');
    }
    adjCount = function(row, col) {
        var ret = 0;
        if (row > 0) {
            if (col > 0) {
                if (isMine(row - 1, col - 1)) {
                    ret++;
                }
            }
            if (col < cellWidth) {
                if (isMine(row - 1, col + 1)) {
                    ret++;
                }
            }
            if (isMine(row - 1, col)) {
                ret++;
            }
        }
        if (row < cellHeight) {
            if (col > 0) {
                if (isMine(row + 1, col - 1)) {
                    ret++;
                }
            }
            if (col < cellWidth) {
                if (isMine(row + 1, col + 1)) {
                    ret++;
                }
            }
            if (isMine(row + 1, col)) {
                ret++;
            }
        }
        if (col > 0) {
            if (isMine(row, col - 1)) {
                ret++;
            }
        }
        if (col < cellWidth) {
            if (isMine(row, col + 1)) {
                ret++;
            }
        }
        return ret;
    }
    for (var mine = 0; mine < mines;) {
        var row = getRandInt(cellHeight);
        var col = getRandInt(cellWidth);
        var tmp = $('.row:nth-of-type('+(row+1)+') div:nth-child('+(1+col)+ ')');
        if (!(tmp.hasClass('mine'))) {
            mine++;
            tmp.addClass('mine');
            console.log(mine + ' Mine at: ' + row + ', ' + col);
        }
    }
    $('.cell').click( function(e) {
        if (!e.shiftKey) {
            if (!($(this).hasClass('clicked'))){
                var row = getRow($(this));
                var col = getCol($(this));
                cellClick(row, col);
            }
        } else {
            if (!$(this).hasClass('clicked')) {
                $(this).toggleClass('mark');
            }
        }
    });
    cellClick = function(row, col) {
        if (row < 0 || row >= cellHeight || col < 0 || col >= cellWidth) {
            return;
        }
        var thisCell = $('.row:nth-of-type('+(row+1)+') div:nth-child('+(1+col)+ ')');
        if (thisCell.hasClass('mine') && !gameOver) {
            $('body').append('<p>Game Over</p>');
            $('.mine').css('background-color', '#880000');
            gameOver = true;
        }
        else if (!(thisCell.hasClass('clicked')) && !gameOver) {
            count++;
            console.log('Clicking: ' + (row+1) + ', ' + (col+1));
            $(thisCell).toggleClass('clicked');
            $(thisCell).removeClass('mark');
            if (adjCount(row+1, col+1) == 0) {
                cellClick(row+1, col+1);
                cellClick(row+1, col-1);
                cellClick(row-1, col+1);
                cellClick(row-1, col-1);
                cellClick(row, col+1);
                cellClick(row, col-1);
                cellClick(row+1, col);
                cellClick(row-1, col);
            } else {
                thisCell.prepend(adjCount(row+1, col+1));
                thisCell.css("color", colors[adjCount(row+1, col+1)-1]);
            }
            if (!gameOver &&count == cellHeight * cellWidth - mines) {
                gameOver = true;
                $("body").append("<p>Congratulations!</p>");

            }
        }
    }
});
