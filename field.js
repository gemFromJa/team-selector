const MAX = 11;
const formation = [1, 4, 4, 2];
class FieldPlayers {
	team1 = null;
	team2 = null;
	players = null;

	constructor(team1, team2) {
		this.team1 = team1;
		this.team2 = team2;
		console.log(team1, team2);
	}

	createFields() {
		let teams = {};
		teams.team1 = this.layoutTeam(this.team1);
		teams.team2 = this.layoutTeam(this.team2);

		return teams;
	}

	layoutTeam(team) {
		if (team && Array.isArray(team) && team.length) {
			let _team = [...team];
			let newLayout = [];
			// iteratively layout team

			// add the keeper
			let row = this.createFieldRow();
			row.style.height = `${team.length > 1 ? "25%" : "100%"}`; // ensure player centered in row when only one
			let cn = this.createRowContainer();
			let pl = this.createPlayerNode(_team.splice(0, 1)[0].name, 1);
			pl.style.width = "100%";
			cn.appendChild(pl);
			row.appendChild(cn);
			newLayout.push(row);

			let len = Math.min(10, _team.length),
				container = this.createRowContainer();

			// set height to the height of
			let row_height = Math.floor((100 - 25) / Math.max(1, Math.ceil(len / 4)));
			for (let i = 0; i < len; i++) {
				if (i > 0 && i % 4 === 0) {
					// this is the fourth, time to start over
					container.childNodes.forEach(
						(node) => (node.style.width = `${100 / container.childNodes.length}%`)
					);
					console.log("agree");
					let row = this.createFieldRow();
					row.style.height = `${row_height}%`;
					row.appendChild(container);
					newLayout.push(row);
					container = this.createRowContainer();
				}

				container.appendChild(this.createPlayerNode(_team.splice(0, 1)[0]?.name, i + 3));
			}

			if (container.children.length > 0) {
				let row = this.createFieldRow();
				console.log("object");
				row.style.height = `${row_height}%`;
				console.log(row.style.height);
				container.childNodes.forEach((node) => (node.style.width = `${100 / container.childNodes.length}%`));
				row.appendChild(container);
				newLayout.push(row);
			}

			return { team: newLayout, bench: _team };
		}

		return false;
	}

	createFieldRow() {
		const fieldRow = document.createElement("div");
		fieldRow.setAttribute("class", "field_row");

		return fieldRow;
	}

	createRowContainer() {
		const rowContainer = document.createElement("div");
		rowContainer.setAttribute("class", "child_container");

		return rowContainer;
	}

	// capitalize and use first initial
	formatName(name) {
		if (name)
			return name.replace(/(\w+)\s+(\w+)/g, (match, g1, g2) =>
				g1 && g2 ? `${g1.charAt(0).toUpperCase()}. ${g2.charAt(0).toUpperCase() + g2.slice(1)}` : match
			);
		return name;
	}

	createPlayerNode(player_name, player_number) {
		const player = document.createElement("div");
		player.setAttribute("class", "fl_player");
		const circle = document.createElement("div");
		circle.setAttribute("class", "circle");
		const number = document.createElement("div");
		number.setAttribute("class", "number");
		number.innerHTML = player_number;
		const name = document.createElement("div");
		name.setAttribute("class", "name");
		name.innerHTML = this.formatName(player_name);

		circle.appendChild(number);
		player.appendChild(circle);
		player.appendChild(name);

		return player;
	}
}
