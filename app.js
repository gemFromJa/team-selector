let players = [];
let hasFocus = false;
let totalPlayers = 5;
const playerListDiv = document.getElementById("players");
const useSimpleEditor = document.getElementById("use-simple-editor");
const generatorButton = document.getElementById("generate-button");
const totalPlayersInput = document.getElementById("total-players");
const totalIncreaseButton = document.querySelector(".increase");
const totalDecreaseButton = document.querySelector(".decrease");

function createPlayerInput(id) {
    const setAttributes = (el, attr) => {
        for (let c = 0; c < attr.length; c++) {
            const [name, value] = attr[c];
            el.setAttribute(name, value);
        }
    };
    const div = document.createElement("div");
    const nameInput = document.createElement("input");
    const skillInput = document.createElement("input");
    const fitnessInput = document.createElement("input");
    const sizeSelector = document.createElement("select");
    const sizeOptionsBig = document.createElement("option");
    const sizeOptionsSmall = document.createElement("option");

    // setup selector
    sizeOptionsBig.innerHTML = "big";
    sizeOptionsSmall.innerHTML = "small";
    sizeSelector.appendChild(document.createElement("option"));
    sizeSelector.appendChild(sizeOptionsBig);
    sizeSelector.appendChild(sizeOptionsSmall);

    // set attribute
    div.setAttribute("class", "player");
    div.setAttribute("id", `player-${id}`);
    nameInput.setAttribute("class", "player-input player-name");
    nameInput.setAttribute("placeholder", "player name");
    nameInput.setAttribute("data-name", "name");
    skillInput.setAttribute("class", "player-input player-skill");
    skillInput.setAttribute("placeholder", "skill(/10)");
    skillInput.setAttribute("data-name", "skill");
    fitnessInput.setAttribute("class", "player-input player-fitness");
    fitnessInput.setAttribute("placeholder", "player fitness");
    fitnessInput.setAttribute("data-name", "fitness");
    sizeSelector.setAttribute("class", "player-input player-size");
    sizeSelector.setAttribute("placeholder", "player size");
    sizeSelector.setAttribute("data-name", "size");

    // add values to div
    div.appendChild(nameInput);
    div.appendChild(skillInput);
    div.appendChild(fitnessInput);
    div.appendChild(sizeSelector);

    return div;
}

function createHeader(fields) {
    const div = document.createElement("div");
    div.setAttribute("class", "player-header");

    for (let a = 0; a < fields?.length; a++) {
        const label = document.createElement("div");
        label.innerHTML = fields[a];
        console.log("Fields: ", fields[a]);
        div.appendChild(label);
    }

    return div;
}

function createSimplePlayerInput(id) {
    let textArea = document.createElement("textArea");
    textArea.setAttribute("id", "player-text-input");
    textArea.setAttribute(
        "placeholder",
        "first lastname, skill (/10), fitness (/10), size(/10)"
    );
    return textArea;
}

function removeAllChildren(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function appendMultiple(parent, node_list) {
    for (let index = 0; index < node_list.length; index++) {
        parent.appendChild(node_list[index]);
    }
}

function toggleEditorType() {
    // remove all children
    removeAllChildren(playerListDiv);
    playerListDiv.childNodes.forEach((node) => console.log(node));

    if (useSimpleEditor.checked) {
        playerListDiv.appendChild(createSimplePlayerInput(124342));
        totalPlayersInput.disabled = true;
        totalDecreaseButton.disabled = true;
        totalIncreaseButton.disabled = true;
    } else {
        totalPlayersInput.disabled = false;
        totalIncreaseButton.disabled = false;
        totalDecreaseButton.disabled = false;

        for (let a = 0; a < totalPlayers; a++) {
            playerListDiv.appendChild(createPlayerInput(a));
        }
    }
}

function setTotalPlayers() {
    totalPlayers = Number(totalPlayersInput.value) || 1;
    console.log(totalPlayers);
    toggleEditorType();
}

function increase() {
    totalPlayers = (Number(totalPlayersInput.value) || 1) + 1;
    totalPlayersInput.value = totalPlayers;
    console.log(" -- >", totalPlayers);
    toggleEditorType();
}

function decrease() {
    totalPlayers = Math.max((Number(totalPlayersInput.value) || 1) - 1, 1);
    totalPlayersInput.value = totalPlayers;
    console.log(" -- >", totalPlayers);
    console.log(" -- >", totalPlayers);
    toggleEditorType();
}

function toggleInputInstructions() {
    let instructions = document.querySelector(".pl_label .input-instructions");
    console.log("Fat the fuck chicke");
    instructions.classList.toggle("visible");
}

function createTeam() {
    let check = true; // useSimpleEditor.checked
    if (check) {
        let textArea = document.getElementById("player-text-input");
        console.log(
            `textContent: ${textArea.textContent}`,
            `Value:  '${textArea.value}'`
        );

        if (!textArea.value) return;
        // get all specific stat of a specific player
        let persons = textArea.value.trim().split("\n");
        players = persons.map((person, index) => {
            let [name, skill, fitness, size] = person
                .split(",")
                .map((val) => val.trim());

            skill = Number(skill) || 0;
            fitness = Number(fitness) || 0;
            size = Number(fitness) || 0;
            return {
                name,
                skill,
                fitness,
                size,
                skill_level: Math.min(Math.max(0, skill + fitness + size), 10), // ensure the numner is in the range 0 to 10
            };
        });
    } else {
        let arr = [];
        players = [];
        playerListDiv.childNodes.forEach((node, index) => {
            let obj = {};
            let hasVal = false;

            // get all the stats of a specific player
            node.childNodes.forEach((element) => {
                console.log(element);
                if (
                    element.nodeName === "INPUT" ||
                    element.nodeName === "SELECT"
                ) {
                    if (element.value) hasVal = true;
                    obj[element.dataset.name] = element.value;
                }
            });

            if (hasVal) {
                if (obj.skill) {
                    obj.skill = Number(obj.skill) || 0;
                }
                if (obj.size) {
                    obj.size = obj.size === "big" ? 9 : 4;
                }
                if (obj.fitness) {
                    obj.fitness = Number(obj.fitness) || 0;
                }
                players.push({
                    ...obj,
                    skill_level: obj.fitness + obj.size + obj.skill,
                });
            }
        });
    }

    const difOfLargest = (a, b) => (a > b ? a - b : b - a);

    let total_players = players.length;
    let dp = [];
    let team1 = [],
        team2 = [];
    let sum1 = 0,
        sum2 = 0;

    // create the team
    for (let i = 0; i < total_players; i++) {
        let chosenIdx = -1;
        if (dp[i] === true) continue;

        for (let j = i + 1; j < total_players; j++) {
            if (dp[j] === true) continue;

            if (chosenIdx == -1) {
                chosenIdx = j;
            } else if (
                difOfLargest(
                    players[i].skill_level,
                    players[chosenIdx].skill_level
                ) > difOfLargest(players[i].skill_level, players[j].skill_level)
            ) {
                chosenIdx = j;
            }
        }

        if (chosenIdx === -1) {
            // uneven
            if (sum1 > sum2) {
                sum2 += players[i].skill_level;
                team2.push(players[i]);
            } else {
                sum1 += players[i].skill_level;
                team1.push(players[i]);
            }
            dp[i] = true;
        } else {
            let chosen = players[chosenIdx];
            // find where has the smallest overall difference
            if (
                difOfLargest(
                    sum1 + players[i].skill_level,
                    sum2 + chosen.skill_level
                ) <
                difOfLargest(
                    sum1 + chosen.skill_level,
                    sum2 + players[i].skill_level
                )
            ) {
                team1.push(players[i]);
                sum1 += players[i].skill_level;
                team2.push(chosen);
                sum2 += chosen.skill_level;
            } else {
                team2.push(players[i]);
                sum2 += players[i].skill_level;
                team1.push(chosen);
                sum1 += chosen.skill_level;
            }
            dp[i] = true;
            dp[chosenIdx] = true;
        }
    }

    /** the names input values */
    let team1_name_input = document.querySelector(".team1_name input");
    let team2_name_input = document.querySelector(".team2_name input");

    /** the output labels */
    let team1_name_label = document.querySelector(".field_t1_half .team_name");
    team1_name_label.innerHTML = team1_name_input.value;
    let team2_name_label = document.querySelector(".field_t2_half .team_name");
    team2_name_label.innerHTML = team2_name_input.value;

    let redt = `<b>${team1_name_input.value || "team1"}</b>:`,
        bluet = `<b>${team2_name_input.value || "team2"}</b>:`;

    for (let i = 0; i < Math.round(total_players / 2); i++) {
        if (team1[i]) {
            redt = `${redt} ${team1[i].name},`;
        }
        if (team2[i]) {
            bluet = `${bluet} ${team2[i].name},`;
        }
    }

    // set the string - last comma
    document.querySelector(".team1").innerHTML = redt.slice(0, -1);
    document.querySelector(".team2").innerHTML = bluet.slice(0, -1);

    /**
     * Put teams on chart
     */
    let field = new FieldPlayers(team1, team2);
    let res = field.createFields();

    let field_h1 = document.querySelector(".field_t1_half .team1_players");
    let field_h2 = document.querySelector(".field_t2_half .team2_players");

    console.log("Found 1 & 2", field_h1, field_h2);

    removeAllChildren(field_h1);
    removeAllChildren(field_h2);

    console.log(res);

    if (res.team1?.team) appendMultiple(field_h1, res.team1.team);
    if (res.team2?.team) appendMultiple(field_h2, res.team2.team?.reverse());

    //appendMultiple(field_h1);

    const pg = document.getElementById("page-2");
    pg.scrollIntoView();
}

function Init() {
    playerListDiv.appendChild(createSimplePlayerInput(1232));
    const playerDivInput = document.getElementById("player-text-input");
    playerDivInput.addEventListener("focus", toggleInputInstructions);
    playerDivInput.addEventListener("blur", toggleInputInstructions);
    console.log(playerDivInput, "Chicken Burr");
    // playerListDiv.appendChild(createPlayerInput(1232));
    // useSimpleEditor.checked = true;
    // useSimpleEditor.addEventListener("change", () => {
    //     totalPlayersInput.value = totalPlayers;
    //     toggleEditorType();
    // });
    // console.log(" ------- ", totalIncreaseButton);
    generatorButton.addEventListener("click", createTeam);
    // totalIncreaseButton.addEventListener("click", increase);
    // totalDecreaseButton.addEventListener("click", decrease);
    // totalPlayersInput.addEventListener("change", setTotalPlayers);
    // totalPlayersInput.disabled = true;
    // totalDecreaseButton.disabled = true;
    // totalIncreaseButton.disabled = true;
}

window.onload = Init;
