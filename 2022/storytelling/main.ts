function getId(id: string) {
	return document.getElementById(id)
}

const b1 = getId("b1") as HTMLInputElement
b1.onclick = () => {
	getId("s1").style.display = "none"
	getId("s2").style.display = "block"
}
