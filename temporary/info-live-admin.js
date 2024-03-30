document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("score-form");
    const liveScore = document.getElementById("live-score");
    const undoBtn = document.getElementById("undo-btn");
    let score = 0;
    let balls = 0;
    let batsmen = ["Batsman 1", "Batsman 2", "Batsman 3", "Batsman 4", "Batsman 5", "Batsman 6", "Batsman 7", "Batsman 8", "Batsman 9", "Batsman 10", "Batsman 11"];
    // let bowler = ;
    let strikerIndex = 0;
    let overs = 0;
    let wickets = 0;
    let striker = batsmen[0];
    let strikerScore = 0;
    let strikerBalls = 0;
    let striker4s = 0;
    let striker6s = 0;
    let strikeRate = 0;
    let nonStriker = batsmen[1];
    let nonstrikerScore = 0;
    let nonstrikerBalls = 0;
    let nonstriker4s = 0;
    let nonstriker6s = 0;
    let nonstrikeRate = 0;
    let currentBowler = "Bowler 1";
    let bover = 0;
    let bballs = 0;
    let bmaiden = 0;
    let bruns = 0;
    let bwickets = 0;
    let beconomy = 0;
    let prevScore, prevBalls, prevWickets, prevOvers, prevStrikerIndex, prevStriker, prevNonStriker, prevCurrentBowler;

    // Add WebSocket initialization
    const socket = new WebSocket('http://127.0.0.1:5500/DBMS%20Project/info-live-admin.html');

    // WebSocket event listeners
    socket.addEventListener('open', function () {
        console.log('WebSocket connection established.');
    });

    socket.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        if (data.type === 'update') {
            updateLiveScore(data);
        }
    });

    // Send updated data to user side
    function updateLiveScore(data) {
        // Update live score
        liveScore.innerHTML = `
        <p>Score: ${data.score}/${data.wickets} (${data.overs}.${data.balls})</p>
        <p>Striker: ${data.striker}</p>
        <p>Non-Striker: ${data.nonStriker}</p>
        <p>Bowler: ${data.currentBowler}</p>
        <p>${data.striker} ------ Runs - ${data.strikerScore} | Balls - ${data.strikerBalls} | Fours - ${data.striker4s} | Sixes - ${data.striker6s} | SR - ${data.strikeRate}</p>
        <p>${data.nonStriker} ------ Runs - ${data.nonstrikerScore} | Balls - ${data.nonstrikerBalls} | Fours - ${data.nonstriker4s} | Sixes - ${data.nonstriker6s} | SR - ${data.nonstrikeRate}</p>
    `;
    }

    // Send data to user side
    function sendDataToUser(data) {
        socket.send(JSON.stringify(data));
    }


    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const runType = document.getElementById("run-type").value;

        prevScore = score;
        prevBalls = balls;
        prevWickets = wickets;
        prevOvers = overs;
        prevStrikerIndex = strikerIndex;
        prevStriker = striker;
        prevNonStriker = nonStriker;
        prevCurrentBowler = currentBowler;

        switch (runType) {
            case "0":
                strikerBalls++;
                sr();
                balls++;
                break;
            case "1":
                score += 1;
                strikerScore += 1;
                strikerBalls++;
                sr();
                swapStrikers();
                balls++;
                bruns += 1;
                break;
            case "2":
                score += 2;
                strikerScore += 2;
                strikerBalls++;
                sr();
                balls++;
                bruns += 2;
                break;
            case "3":
                score += 3;
                strikerScore += 3;
                strikerBalls++;
                sr();
                swapStrikers();
                balls++;
                bruns += 3;
                break;
            case "4":
                score += 4;
                strikerScore += 4;
                striker4s++;
                strikerBalls++;
                sr();
                balls++;
                bruns += 4;
                break;
            case "6":
                score += 6;
                strikerScore += 6;
                striker6s++;
                strikerBalls++;
                sr();
                balls++;
                bruns += 4;
                break;
            case "wide":
                score += 1;
                bruns += 1;
                break;
            case "no-ball":
                score += 1;
                bruns += 1;
                break;
            case "out":
                strikerBalls++;
                balls++;
                strikerOut();
                isallout();
                bwickets++;
                break;
            case "out-run":
                strikerBalls++;
                balls++;
                strikerScore += 1;
                strikerOut();
                isallout();
                score += 1;
                bwickets++;
                bruns++;
                break;
        }

        if (balls === 6) {
            balls = 0;
            bballs = 0;
            bover++;
            overs++;
            er();
            swapStrikers();
            currentBowler = currentBowler === "Bowler 1" ? "Bowler 2" : "Bowler 1";
        } else {
            bballs = balls;
            er();
        }

        updateLiveScore();

        sendDataToUser({
            type: 'update',
            score: score,
            balls: balls,
            wickets: wickets,
            overs: overs,
            striker: striker,
            strikerScore: strikerScore,
            strikerBalls: strikerBalls,
            striker4s: striker4s,
            striker6s: striker6s,
            strikeRate: strikeRate,
            nonStriker: nonStriker,
            nonstrikerScore: nonstrikerScore,
            nonstrikerBalls: nonstrikerBalls,
            nonstriker4s: nonstriker4s,
            nonstriker6s: nonstriker6s,
            nonstrikeRate: nonstrikeRate,
            currentBowler: currentBowler
        });
    });

    undoBtn.addEventListener("click", function () {
        score = prevScore;
        balls = prevBalls;
        wickets = prevWickets;
        overs = prevOvers;
        strikerIndex = prevStrikerIndex;
        striker = prevStriker;
        nonStriker = prevNonStriker;
        currentBowler = prevCurrentBowler;

        updateLiveScore();
    });

    function swapStrikers() {
        const temp = striker;
        striker = nonStriker;
        nonStriker = temp;

        const tempScore = strikerScore;
        const tempBalls = strikerBalls;
        const temp4s = striker4s;
        const temp6s = striker6s;
        const tempSR = strikeRate;

        strikerScore = nonstrikerScore;
        strikerBalls = nonstrikerBalls;
        striker4s = nonstriker4s;
        striker6s = nonstriker6s;
        strikeRate = nonstrikeRate;

        nonstrikerScore = tempScore;
        nonstrikerBalls = tempBalls;
        nonstriker4s = temp4s;
        nonstriker6s = temp6s;
        nonstrikeRate = tempSR;

        updateLiveScore();
    }

    function isallout() {
        if (wickets < 10) {
            wickets++;
        }
    }

    function strikerOut() {
        strikerScore = 0;
        strikerBalls = 0;
        striker4s = 0;
        striker6s = 0;
        strikeRate = 0;
        if (strikerIndex < 10) {
            strikerIndex++;
            if (nonStriker == batsmen[strikerIndex]) {
                strikerIndex++;
            }
            striker = batsmen[strikerIndex];
        } else {
            striker = "All out";
        }
    }

    function sr() {
        strikeRate = (strikerScore / strikerBalls) * 100;
    }

    function er() {
        beconomy = bruns / ((bballs + (6 * bover)) / 6);
    }

    function updateLiveScore() {
        liveScore.innerHTML = `
            <p>Score: ${score}/${wickets} (${overs}.${balls})</p>
            <p>Striker: ${striker}</p>
            <p>Non-Striker: ${nonStriker}</p>
            <p>Bowler: ${currentBowler}</p>
            <p>${striker} ------ Runs - ${strikerScore} | Balls - ${strikerBalls} | Fours - ${striker4s} | Sixes - ${striker6s} | SR - ${strikeRate}</p>
            <p>${nonStriker} ------ Runs - ${nonstrikerScore} | Balls - ${nonstrikerBalls} | Fours - ${nonstriker4s} | Sixes - ${nonstriker6s} | SR - ${nonstrikeRate}</p>
            <p>Bowling details ---------------------</p>
            <p>${currentBowler} ---- Overs - ${bover}.${bballs} | Maidens - ${bmaiden} | Wickets - ${bwickets} | Runs - ${bruns} | Economy - ${beconomy}</p>
            `;
    }
});
