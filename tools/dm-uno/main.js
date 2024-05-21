const numColours = 9;
let selectedIdx = -1;

const highlightSpinner = i => {
	for (let j = 0; j < numColours; j++) {
		const border = j == i ? "0.5em solid white" : "none";
		document.getElementById(`colour-${j}`).style.border = border;
	}
}

setInterval(() => {
	selectedIdx = (selectedIdx + 1) % numColours;
	highlightSpinner(selectedIdx);
}, 150);
