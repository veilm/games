const numColours = 9;
let selectedIdx = -1;

const highlightSpinner = i => {
	for (let j = 0; j < numColours; j++) {
		const border = j == i ? "0.5em solid white" : "none";
		document.getElementById(`colour-${j}`).style.border = border;
	}
}

const makeSpin = () => {
	selectedIdx = (selectedIdx + 1) % numColours;
	highlightSpinner(selectedIdx);
}

let spinInterval = setInterval(makeSpin, 150);

const RNG = (min, max) =>
	Math.round(Math.random() * (max - min)) + min;

let target;
let totalCycles;
let cycles;

let lastSpin = new Date().getTime();
let spinThreshold = 10;

// I just tweaked random values in desmos until it looked about right
const getSpinTimeout = (cycles, totalCycles) => {
	const x = (totalCycles - cycles)/totalCycles;

	if (x < 0.2)
		return 5;

	return 1000 * Math.pow(x, 20 * x) + 20 * x;
}

const handleTime = () => {
	const now = new Date().getTime();

	const passed = now - lastSpin;
	if (passed < getSpinTimeout(cycles, totalCycles))
		return;

	spinThreshold++;
	makeSpin();
	lastSpin = now;
	cycles--;

	if (cycles == 0)
		clearInterval(spinInterval);
}

document.getElementById("spin").onclick = () => {
	clearInterval(spinInterval);

	totalCycles = 0;

	// To get to 0
	highlightSpinner(selectedIdx);
	totalCycles = numColours - selectedIdx;

	// Add some extra spins for visual effect
	totalCycles += numColours * 20;

	// We are at 0 still, so now we go to our target
	totalCycles += RNG(0, numColours - 1);

	cycles = totalCycles;
	spinInterval = setInterval(handleTime, 10);
}
