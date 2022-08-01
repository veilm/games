const jump_button = document.getElementById("jump_button") as HTMLInputElement
const audio = new Audio("jump.mp3")

jump_button.onclick = () => {
	audio.play()
}
