function SetTable() {
    for(let i = 0; i < gridSize; i++) {
        let row = $("<tr></tr>");
        for(let j = 0; j < gridSize; j++) {
            let cell = $("<td></td>").attr("id", gridSize*i + j).
            attr("bgcolor", (((i + j) % 2) ? "darkslategray" : "black"));
            if (i == 0) {
                $(cell).addClass("top-border");
            } else if (i == gridSize-1) {
                $(cell).addClass("bottom-border");
            }
            if (j == 0) {
                $(cell).addClass("left-border");
            } else if (j == gridSize-1) {
                $(cell).addClass("right-border");
            }
            $(row).append(cell);
        }
        $("#table").append(row);
    }
    $("#score").text("Score: 0");
    $("#best").text("Best: " + (localStorage.getItem("0") != null ? localStorage.getItem("0") : 0));
    food = $("<img>").attr("src", "zmijica-dodatno/food.png").attr("id", "food").addClass("imgfood");
    superFood = $("<img>").attr("src", "zmijica-dodatno/superFood.png").attr("id", "superFood").addClass("imgsuperfood");
    eye = $("<img>").attr("src", "zmijica-dodatno/eye.png").attr("id", "eye");
    helmet = $("<img>").attr("src", "zmijica-dodatno/helmet.png").attr("id", "helmet").addClass("imghelmet");
}

function Snake() {
    let head = Math.floor(Math.random()*gridSize*gridSize);
    snake[snake.length] = head;
    $("#" + head).addClass("snake").addClass("snakeHead").append(helmet);
}

function Food() {
    do {
        foodLocation = Math.floor(Math.random()*gridSize*gridSize);
    } while($("#" + foodLocation).hasClass("snake"))
    $("#" + foodLocation).append(food);
}

function SuperFood() {
    if(!started) {return;}
    do {
        superFoodLocation = Math.floor(Math.random()*gridSize*gridSize);
    } while($("#" + superFoodLocation).hasClass("snake") || superFoodLocation == foodLocation)
    $("#" + superFoodLocation).append(superFood);
    setTimeout(function() {
        $("#" + superFoodLocation).empty();
        superFoodLocation = -1;
    }, 4000)
}

function CheckMove(next) {
    if(snake.includes(next) && snake[snake.length-1] != next) {return false;}
    i = Math.floor(next / gridSize);
    j = next % gridSize;
    if(i < 0 || i >= gridSize || (j == 0 && currDirection == Direction.RIGHT)||
    (j == gridSize -1 && currDirection == Direction.LEFT)) {return false;}
    return true;
}

function EndGame() {
    $(document).empty();
    localStorage.setItem("currScore", result);
    let scores = [result];
    let names = [localStorage.getItem("currPlayer")];
    for(let i = 0; i < 5; i++) {
        if(localStorage.getItem(i) != null) {
            scores.push(parseInt(localStorage.getItem(i)));
            names.push(localStorage.getItem(i+5));
        }
    }
    for(let i = 0; i < scores.length - 1; i++) {
        for(let j = i; j < scores.length; j++) {
            if(scores[i] < scores[j]) {
                scores[i] = [scores[j], scores[j] = scores[i]][0];
                names[i] = [names[j], names[j] = names[i]][0];
            }
        }
    }
    for(let i = 0; i < scores.length && i < 5; i++) {
        localStorage.setItem(i, scores[i]);
        localStorage.setItem(i+5, names[i]);
    }
    location = "zmijica-rezultati.html";
}

function Slither(next) {
    let old = snake[snake.length - 1];
    $("#" + snake[0]).removeClass("snakeHead").empty()
    for(let i = snake.length - 1; i > 0; i--) {
        snake[i] = snake[i-1];
    }
    snake[0] = next;
    $("#" + next).addClass("snake").addClass("snakeHead").append(helmet);
    if (next == foodLocation) {
        snake[snake.length] = old;
        $("#score").text("Score: " + (++result));
        Food();
    } else if(next == superFoodLocation) {
        snake[snake.length] = old;
        result+= 10;
        $("#score").text("Score: " + (result));
        $("#" + superFoodLocation).empty();
    } else if(next != old){
        $("#" + old).removeClass("snake");
    }
    $("#" + next).addClass("snake").addClass("snakeHead").append(helmet);
}

function ShavePrev(i) {
    if(snake[i] == snake[i-1] + 1) {
        $("#" + snake[i]).addClass("left-free");
    } else if(snake[i] == snake[i-1] - 1) {
        $("#" + snake[i]).addClass("right-free");
    } else if(snake[i] == snake[i-1] + gridSize) {
        $("#" + snake[i]).addClass("top-free");
    } else if(snake[i] == snake[i-1] - gridSize) {
        $("#" + snake[i]).addClass("bottom-free");
    }
}

function ShaveNext(i) {
    if(snake[i] == snake[i+1] + 1) {
        $("#" + snake[i]).addClass("left-free");
    } else if(snake[i] == snake[i+1] - 1) {
        $("#" + snake[i]).addClass("right-free");
    } else if(snake[i] == snake[i+1] + gridSize) {
        $("#" + snake[i]).addClass("top-free");
    } else if(snake[i] == snake[i+1] - gridSize) {
        $("#" + snake[i]).addClass("bottom-free");
    }
}

function Shave() {
    ShaveNext(0);
    for(let i = 1; i < snake.length - 1; i++) {
        ShaveNext(i);
        ShavePrev(i);
    }
    ShavePrev(snake.length-1);
}

function Move() {
    currDirection = newDirrection;
    if(currDirection == 0) {return;}
    let next;
    if(currDirection === Direction.LEFT) {
        next = snake[0] - 1;
    } else if(currDirection === Direction.RIGHT) {
        next = snake[0] + 1;
    } else if(currDirection === Direction.UP) {
        next = snake[0] - gridSize;
    } else if(currDirection === Direction.DOWN) {
        next = snake[0] + gridSize;
    }
    if (!CheckMove(next)) {
        EndGame();
    }
    for(let i = 0; i < snake.length; i++) {
        $("#" + snake[i]).removeClass("bottom-free").
        removeClass("top-free").
        removeClass("left-free").
        removeClass("right-free");
    }
    Slither(next);
    if(snake.length != 1) {Shave();}
}


var timelapse = localStorage.getItem("timelapse");
var food;
var foodLocation;
var superFood;
var superFoodLocation;
var eye;
var helmet
var gridSize = parseInt(localStorage.getItem("gridSize"));
var snake = [];
const Direction = {
    LEFT : 37,
    UP : 38,
    RIGHT : 39,
    DOWN : 40
}
var currDirection = 0;
var value = 0;
var result = 0;
var started = false;

$(document).ready(function() {
    SetTable();
    Snake();
    Food();
    console.log(localStorage.getItem("0"));
    $(document).keydown(function(e) {
        value = e.which;
        if(e.which > 36 && e.which < 41) {
            if(Math.abs(currDirection - e.which) != 2 || snake.length == 1) {
                newDirrection = e.which;
            }
            started = true;
        }
    })
    setInterval(Move, timelapse);
    setInterval(SuperFood, 10000);
})