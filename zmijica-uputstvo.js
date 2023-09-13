function SetTable() {
    gridSize = $("#range").val();
    for(let i = 0; i < 20; i++) {
        let row = $("<tr></tr>");
        for(let j = 0; j < 20; j++) {
            let cell = $("<td></td>").attr("id", 20*i + j).
            attr("bgcolor", (((i + j) % 2) ? "darkslategray" : "black"));
            if (i > gridSize - 1 || j > gridSize - 1) {
                $(cell).addClass("opaque");
            }
            $(row).append(cell);
        }
        $("#table").append(row);
    }
}

function ResetTable() {
    let gridSize = $("#range").val();
    let curr = 0
    for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 20; j++) {
            if (i > gridSize - 1 || j > gridSize - 1) {
                $("#" + curr).addClass("opaque");
            } else {
                $("#" + curr).removeClass("opaque");
            }
            curr++;
        }
    }
}

function Move() {
    $("#" + (start + position)).removeClass("snake");
    if(++position >= gridSize) {position = 0;}
    $("#" + (start + position)).addClass("snake");
}

var id
var gridSize

$(document).ready(function() {
    gridSize = 15;
    start = 60;
    position = 0;
    //localStorage.clear()
    if(localStorage.getItem("timelapse") == 250) {
        $("#h").prop("checked", "true");
        timelapse = 250;
    } else if(localStorage.getItem("timelapse") == 400) {
        $("#m").prop("checked", "true");
        timelapse = 400;
    } else {
        $("#e").prop("checked", "true");
        timelapse = 550;
    }
    if(localStorage.getItem("gridSize") != null) {
        gridSize = localStorage.getItem("gridSize");
        $("#range").val(gridSize);
    }
    SetTable();
    id = setInterval(Move, timelapse);
    $("#rangeShow").append($("#range").val());
    $("#range").click(function() {
        $("#rangeShow").empty();
        $("#rangeShow").append($("#range").val());
        gridSize = $("#range").val();
        ResetTable();
    })
    $(".r").click(function() {
        if($("#h").prop("checked")) {
            timelapse = 250;
        } else if($("#m").prop("checked")) {
            timelapse = 400;
        } else if($("#e").prop("checked")) {
            timelapse = 550;
        }
        clearInterval(id);
        id = setInterval(Move, timelapse);
    })
    $("#leaderboard").click(function() {
        location = "zmijica-rezultati.html";
    })
    $("#play").click(function() {
        let name = $("#name").val().trim();
        if(name == "") {return;}
        localStorage.setItem("currPlayer", name);
        localStorage.setItem("timelapse", timelapse);
        localStorage.setItem("gridSize", $("#range").val());
        location = "zmijica-igra.html";
    })
})