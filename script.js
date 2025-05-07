import { render, sig, mem, eff_on, each, if_then } from "./solid/monke.js"
import { hdom } from "./solid/hdom/index.js"
import { data } from "./data.js"

let cur = sig("")
let videoref = e => video = e
let video;
let projectactive = sig(false)
let aboutactive = sig(false)

eff_on(projectactive, () => {
	if (projectactive()) pausevideo()
})

function playvideo() {
	video.play()
}

function pausevideo() {
	video.pause()
}

function link(src, name) {
	return ["a", { href: src }, ["button", name]]
}

function Root() {
	return hdom([
		["video.main", {
			src: mem(() => data.find(pro => pro.name == cur())?.teaser),
			autoplay: true,
			loop: true,
			ref: videoref,
		}],

		[".container", ...data.map(project)],

		[".button-container",
			["button", { onclick: () => aboutactive(!aboutactive()) }, "about"],
			["button", "email"],
			link("https://instagram.com/anisha.fbx", "instagram"),
			link("https://www.linkedin.com/in/anisha-vatnani-903a39228/", "linkedln"),
		],

		[".title", cur],
		about_page,
		project_page
	])
}

function about_page() {
	return hdom([".about",
		{
			style: mem(() => aboutactive()
				? "height: 40vh; translateY(0);"
				: `height: 0; translateY(-500px);`)
		},
		["button.close", { onclick: () => aboutactive(false) }, "close"],
		["h4", "About Anisha"],
		["p", "Anisha is a dumbass"]
	])
}

function project_page() {
	const project = mem(() => data.find(pro => pro.name == cur()))
	return hdom([".page",
		{
			style: mem(() => projectactive()
				? "height: 100vh; translateY(0);"
				: `height: 0; translateY(-500px);`)
		},

		["button.close", { onclick: () => projectactive(false) }, "close"],

		mem(() => {
			if (!project()) return hdom(["h1", "IMPOSSIBLE"])
			else return hdom(["h1", project().name])
		})
	])
}

function project(proj, i) {
	let width = 1 / data.length * 100
	let click = new Audio("./click.mp3")
	let show = mem(() => cur() == proj.name)
	let showcss = mem(() => show() ? "opacity: 1;" : "opacity: 0")

	return hdom(
		[".project", {
			style: "width: " + width + "%;",
			onclick: () => projectactive(true),
			onmouseenter: () => {
				click.play()
				playvideo()
				cur(proj.name)
			}
		}, [".number", { style: showcss }, i]
		])
}

render(Root, document.body)

