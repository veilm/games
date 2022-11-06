function getId(id: string) {
	return document.getElementById(id)
}

const b1 = getId("b1-1") as HTMLInputElement
b1.onclick = () => {
	getId("s1").style.display = "none"
	getId("s2").style.display = "block"
}

const b2 = getId("b2-1") as HTMLInputElement
b2.onclick = () => {
	getId("s3").style.display = "block"
	b2.disabled = true
}

const b3 = getId("b3-1") as HTMLInputElement
b3.onclick = () => {
	getId("s3-1").style.display = "block"
	b3.disabled = true
	b4.disabled = true
	b5.disabled = true
	getId("s3-4").style.display = "block"
}
const b4 = getId("b3-2") as HTMLInputElement
b4.onclick = () => {
	getId("s3-2").style.display = "block"
	b3.disabled = true
	b4.disabled = true
	b5.disabled = true
	getId("s3-4").style.display = "block"
}
const b5 = getId("b3-3") as HTMLInputElement
b5.onclick = () => {
	getId("s3-3").style.display = "block"
	b3.disabled = true
	b4.disabled = true
	b5.disabled = true
	getId("s3-4").style.display = "block"
}
