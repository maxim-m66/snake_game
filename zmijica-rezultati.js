function SetTable() {
    for(let i = 0; i < 5; i++) {
        if(localStorage.getItem(i) == null) {return;}
        let row = $("<tr></tr>");
        let rank = $("<td>" + (i + 1) + "</td>").addClass("thin");
        let name = $("<td>" + localStorage.getItem(i+5) + "</td>");
        let score = $("<td>" + localStorage.getItem(i) + "</td>");
        $(row).append(rank).append(name).append(score);
        $("#leaderboard").append(row);
    }
}

$(document).ready(function() {
    $("#player").text(localStorage.getItem("currPlayer")+ ":")
    $("#score").text(localStorage.getItem("currScore"))
    SetTable();
    $("#back").click(function() {
        location = "zmijica-uputstvo.html";
    })
    $(document).keydown(function(e) {
        if(e.which == 27) {
            console.log("esc");
            location = "zmijica-uputstvo.html";
        }
    })
})