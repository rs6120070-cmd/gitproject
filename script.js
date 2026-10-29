/* =========================================
   CRICTRACK - JAVASCRIPT
========================================= */


/* =========================================
   MATCH DATA
========================================= */

let match = {

    runs: 0,
    wickets: 0,

    legalBalls: 0,

    currentOver: [],

    totalBalls: [],

    batsmen: [
        {
            name: "Rudraksh Sharma",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false
        },

        {
            name: "Daksh Sharma",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false
        }
    ],

    currentBatsman: 0,
    nonStriker: 1,

    bowler: {
        name: "Divansh Sharma",
        balls: 0,
        runs: 0,
        wickets: 0
    },

    team1: "India XI",
    team2: "Australia XI"
};


/* =========================================
   HTML ELEMENTS
========================================= */

const scoreElement =
    document.querySelector(".main-score h1");

const oversElement =
    document.querySelector(".main-score p");

const runRateElement =
    document.querySelector(".blue strong");

const oversStatElement =
    document.querySelector(".green strong");

const targetElement =
    document.querySelector(".orange strong");

const requiredRateElement =
    document.querySelector(".purple strong");

const currentOverElement =
    document.querySelector(".balls");

const thisOverElement =
    document.querySelector(".over-heading span");

const batsmanRows =
    document.querySelectorAll(".card table tbody tr");

const bowlerRow =
    document.querySelector(".bowler").parentElement;
    


/* =========================================
   SCORE BUTTONS
========================================= */

const runButtons =
    document.querySelectorAll(".run");

runButtons.forEach(button => {

    button.addEventListener("click", () => {

        const runs =
            Number(button.textContent);

        addRuns(runs);

    });

});


/* =========================================
   WICKET BUTTON
========================================= */

document
    .querySelector(".wicket")
    .addEventListener("click", () => {

        addWicket();

    });


/* =========================================
   EXTRA BUTTONS
========================================= */

document
    .querySelector(".wide")
    .addEventListener("click", () => {

        addExtra("Wide");

    });


document
    .querySelector(".no-ball")
    .addEventListener("click", () => {

        addExtra("No Ball");

    });


document
    .querySelector(".bye")
    .addEventListener("click", () => {

        addExtra("Bye");

    });


document
    .querySelector(".leg-bye")
    .addEventListener("click", () => {

        addExtra("Leg Bye");

    });


/* =========================================
   ADD NORMAL RUNS
========================================= */

function addRuns(runs) {

    match.runs += runs;

    const batsman =
        match.batsmen[match.currentBatsman];

    batsman.runs += runs;

    batsman.balls += 1;

    if (runs === 4) {
        batsman.fours++;
    }

    if (runs === 6) {
        batsman.sixes++;
    }


    /* Bowler */

    match.bowler.runs += runs;

    match.bowler.balls++;

    match.legalBalls++;


    /* Ball information */

    addBall(runs.toString());


    /* Strike change */

    if (runs % 2 === 1) {

        changeStrike();

    }


    /* Check over */

    checkOver();


    updateUI();

}


/* =========================================
   ADD WICKET
========================================= */

function addWicket() {

    if (match.wickets >= 10) {

        alert("All out!");

        return;

    }


    const batsman =
        match.batsmen[match.currentBatsman];


    batsman.out = true;

    batsman.balls += 1;


    match.wickets++;

    match.bowler.wickets++;

    match.bowler.balls++;

    match.legalBalls++;


    addBall("W");


    /*
       Ask for new batsman
    */

    if (match.wickets < 10) {

        const newName =
            prompt("Enter new batsman name:");

        if (newName && newName.trim() !== "") {

            match.batsmen[match.currentBatsman] = {

                name: newName.trim(),

                runs: 0,

                balls: 0,

                fours: 0,

                sixes: 0,

                out: false

            };

        }

    }


    checkOver();

    updateUI();

}


/* =========================================
   EXTRAS
========================================= */

function addExtra(type) {

    let extraRuns = 1;


    /* WIDE */

    if (type === "Wide") {

        match.runs += extraRuns;

        match.bowler.runs += extraRuns;

        addBall("Wd");

    }


    /* NO BALL */

    else if (type === "No Ball") {

        match.runs += extraRuns;

        match.bowler.runs += extraRuns;

        addBall("Nb");

    }


    /* BYE */

    else if (type === "Bye") {

        match.runs += extraRuns;

        match.legalBalls++;

        match.bowler.balls++;

        addBall("B");

        checkOver();

    }


    /* LEG BYE */

    else if (type === "Leg Bye") {

        match.runs += extraRuns;

        match.legalBalls++;

        match.bowler.balls++;

        addBall("Lb");

        checkOver();

    }


    updateUI();

}


/* =========================================
   ADD BALL
========================================= */

function addBall(value) {

    match.currentOver.push(value);

    match.totalBalls.unshift(value);


    /*
       Keep only last 6 balls
       in current over
    */

    if (match.currentOver.length > 6) {

        match.currentOver.shift();

    }


    /*
       Keep recent balls limited
    */

    if (match.totalBalls.length > 30) {

        match.totalBalls.pop();

    }

}


/* =========================================
   CHECK OVER
========================================= */

function checkOver() {

    if (match.legalBalls % 6 === 0) {

        /*
           End of over
        */

        match.currentOver = [];

        changeStrike();

    }

}


/* =========================================
   CHANGE STRIKE
========================================= */

function changeStrike() {

    const temp =
        match.currentBatsman;

    match.currentBatsman =
        match.nonStriker;

    match.nonStriker =
        temp;

}


/* =========================================
   CALCULATE OVERS
========================================= */

function getOvers() {

    const overs =
        Math.floor(match.legalBalls / 6);

    const balls =
        match.legalBalls % 6;

    return `${overs}.${balls}`;

}


/* =========================================
   RUN RATE
========================================= */

function getRunRate() {

    if (match.legalBalls === 0) {

        return "0.00";

    }


    const overs =
        match.legalBalls / 6;


    return (match.runs / overs).toFixed(2);

}


/* =========================================
   STRIKE RATE
========================================= */

function getStrikeRate(batsman) {

    if (batsman.balls === 0) {

        return "0.00";

    }


    return (
        batsman.runs /
        batsman.balls *
        100
    ).toFixed(2);

}


/* =========================================
   ECONOMY
========================================= */

function getEconomy() {

    if (match.bowler.balls === 0) {

        return "0.00";

    }


    const overs =
        match.bowler.balls / 6;


    return (
        match.bowler.runs /
        overs
    ).toFixed(2);

}


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {


    /* SCORE */

    scoreElement.textContent =
        `${match.runs}/${match.wickets}`;


    /* OVERS */

    oversElement.textContent =
        `${getOvers()} Overs`;


    oversStatElement.textContent =
        getOvers();


    /* RUN RATE */

    runRateElement.textContent =
        getRunRate();


    /* CURRENT OVER */

    updateCurrentOver();


    /* BATSMEN */

    updateBatsmen();


    /* BOWLER */

    updateBowler();


    /* SCORECARD */

    updateScorecard();


    /* RECENT BALLS */

    updateRecentBalls();

}


/* =========================================
   UPDATE CURRENT OVER
========================================= */

function updateCurrentOver() {

    currentOverElement.innerHTML = "";


    for (let i = 0; i < 6; i++) {

        const ball =
            document.createElement("span");


        if (match.currentOver[i]) {

            ball.textContent =
                match.currentOver[i];

            ball.classList.add(
                getBallClass(
                    match.currentOver[i]
                )
            );

        }

        else {

            ball.textContent = "–";

        }


        currentOverElement.appendChild(ball);

    }


    const runsThisOver =
        match.currentOver.reduce(
            (total, ball) => {

                if (
                    ball === "Wd" ||
                    ball === "Nb"
                ) {

                    return total + 1;

                }

                if (
                    ball === "W" ||
                    ball === "B" ||
                    ball === "Lb"
                ) {

                    return total;

                }


                return total +
                    Number(ball);

            },

            0
        );


    thisOverElement.textContent =
        `This Over: ${runsThisOver} Runs`;

}


/* =========================================
   BALL COLOR CLASS
========================================= */

function getBallClass(ball) {

    if (ball === "W") {
        return "ball-wicket";
    }

    if (ball === "4") {
        return "ball-four";
    }

    if (ball === "6") {
        return "ball-six";
    }

    if (ball === "Wd") {
        return "ball-wide";
    }

    if (ball === "Nb") {
        return "ball-noball";
    }

    return "ball-normal";

}


/* =========================================
   UPDATE BATSMEN
========================================= */

function updateBatsmen() {

    const rows =
        document.querySelectorAll(
            ".card:nth-child(2) tbody tr"
        );


    match.batsmen.forEach(
        (batsman, index) => {

            if (!rows[index]) return;


            const cells =
                rows[index].querySelectorAll("td");


            cells[0].textContent =
                `${index === match.currentBatsman ? "🏏 " : ""}${batsman.name}${batsman.out ? " (out)" : ""}`;


            cells[1].textContent =
                batsman.runs;


            cells[2].textContent =
                batsman.balls;


            cells[3].textContent =
                batsman.fours;


            cells[4].textContent =
                batsman.sixes;


            cells[5].textContent =
                getStrikeRate(batsman);

        }
    );

}


/* =========================================
   UPDATE BOWLER
========================================= */

function updateBowler() {

    const cells =
        bowlerRow.querySelectorAll("td");


    cells[0].textContent =
        `🎯 ${match.bowler.name}`;


    cells[1].textContent =
        `${Math.floor(match.bowler.balls / 6)}.${match.bowler.balls % 6}`;


    cells[2].textContent =
        match.bowler.runs;


    cells[3].textContent =
        match.bowler.wickets;


    cells[4].textContent =
        getEconomy();

}


/* =========================================
   UPDATE SCORECARD
========================================= */

function updateScorecard() {

    const team =
        document.querySelector(
            ".scorecard-team strong"
        );


    const score =
        document.querySelector(
            ".scorecard-team span"
        );


    const overs =
        document.querySelector(
            ".scorecard-team small"
        );


    team.textContent =
        match.team1;


    score.textContent =
        `${match.runs}/${match.wickets}`;


    overs.textContent =
        `(${getOvers()} Overs)`;


    const total =
        document.querySelector(".total strong");


    total.textContent =
        `${match.runs}/${match.wickets} (${getOvers()} Overs)`;

}


/* =========================================
   RECENT BALLS
========================================= */

function updateRecentBalls() {

    const recent =
        document.querySelector(
            ".no-balls"
        );


    if (match.totalBalls.length === 0) {

        recent.innerHTML = `
            <div class="cricket-ball">🏏</div>

            <h3>No balls bowled yet</h3>

            <p>
                Start the match by adding runs or extras
            </p>
        `;

        return;

    }


    recent.innerHTML = `

        <div class="recent-ball-list">

            ${match.totalBalls
                .slice(0, 12)
                .map(ball => {

                    return `
                        <span class="recent-ball">
                            ${ball}
                        </span>
                    `;

                })
                .join("")}

        </div>

    `;

}


/* =========================================
   NEW MATCH
========================================= */

document
    .querySelector(".new-match")
    .addEventListener("click", () => {

        const confirmNew =
            confirm(
                "Start a new match?"
            );


        if (!confirmNew) return;


        resetMatch();

    });


/* =========================================
   RESET MATCH
========================================= */

document
    .querySelector(".reset-match")
    .addEventListener("click", () => {

        const confirmReset =
            confirm(
                "Are you sure you want to reset the match?"
            );


        if (!confirmReset) return;


        resetMatch();

    });


function resetMatch() {

    match.runs = 0;

    match.wickets = 0;

    match.legalBalls = 0;

    match.currentOver = [];

    match.totalBalls = [];


    match.batsmen = [

        {
            name: "Rudraksh Sharma",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false
        },

        {
            name: "Daksh Sharma",
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false
        }

    ];


    match.currentBatsman = 0;

    match.nonStriker = 1;


    match.bowler = {

        name: "Divansh Sharma",

        balls: 0,

        runs: 0,

        wickets: 0

    };


    updateUI();

}


/* =========================================
   INITIAL UPDATE
========================================= */

updateUI();