import { render, sig, mem, eff_on, each } from "./solid/monke.js"
import { hdom } from "./solid/hdom/index.js"

let data = [{
	name: "Maya",
	video: "./files/Thesis - Maya/trailer.mp4"
},
{
	name: "Boiling Point",
	video: "./files/The Boiling Point/5.mp4"
}
]
let cur = sig("")

function Root() {
	return hdom([
		["video.main", { src: mem(() => data.find(pro => pro.name == cur())?.video), autoplay: true, loop: true }],
		[".container",
			...data.map(project)
		],

		["button.about", "about"],
		//[".title", cur],
	])
}

function project(proj, i) {
	let width = 1 / data.length * 100
	let show = mem(() => cur() == proj.name)
	let showcss = mem(() => show() ? "opacity : 1;" : "opacity : 0;")
	let click = new Audio("./click.mp3")

	return hdom(
		[".project", {
			style: "width: " + width + "%;",
			onmouseenter: () => {
				click.play()
				document.querySelector("video.main")?.play()
				cur(proj.name)
			}
		},
			//[".note", { style: showcss }, proj.name]
		])
}

render(Root, document.body)

