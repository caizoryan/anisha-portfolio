import { render, sig, mem, eff_on, each } from "./solid/monke.js"
import { hdom } from "./solid/hdom/index.js"

let data = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"]
let cur = sig("")

function Root() {
	return hdom([
		[".title", cur],
		[".container",
			...data.map(project)
		]
	])
}

function project(name, i) {
	let width = 1 / data.length * 100
	let show = mem(() => cur() == name)
	let showcss = mem(() => show() ? "opacity : 1;" : "opacity : 0;")
	let click = new Audio("./click.mp3")

	return hdom(
		[".project", {
			style: "width: " + width + "%;",
			onmouseenter: () => {
				click.play()
				cur(name)
			}
		}, [".note", { style: showcss }, name]
		])
}

render(Root, document.body)

