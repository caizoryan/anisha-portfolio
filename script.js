import { render, sig, mem, eff_on, each, if_then } from "./solid/monke.js"
import { hdom } from "./solid/hdom/index.js"
import { data } from "./data.js"

let bio = `Anisha Vatnani is a Junior 3D Artist set to graduate from OCAD University’s Experimental Animation program in 2025. With a background in a diverse and interdisciplinary field, she has developed a broad skill set and gained proficiency in a variety of software tools, particularly within the 3D space. Her experience navigating courses with differing workflows has fostered a fluid adaptability between Maya and Blender, making her comfortable working across various production pipelines. Anisha’s workflow also includes tools such as Mixamo, Substance Painter, and After Effects, allowing her to produce polished and dynamic visual content.`

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
		["p", bio]
	])
}

function project_page() {
	const css = mem(() => projectactive()
		? "height: 100vh;"
		: `height: 0;`)

	const def = {
		name: "Default",
		description: "",
		images: [],
		videos: [],
		teaser: ""
	}
	const project = mem(() => {
		let find = data.find(pro => pro.name == cur())
		if (find) return find
		else return undefined
	})

	const children = mem(() => {
		if (!project()) return hdom(["h1", "IMPOSSIBLE"])
		else return hdom([
			["h1", project()?.name],
			["p", project()?.description],
			[".gallery",
				...project()?.images.map(e => ["img", { src: e }]),
				...project()?.videos.map(e => ["video", { src: e, controls: true, }]),
			]
		])
	})

	return hdom(
		[".page-wrapper", { style: css },
			[".page",
				["button.close", { onclick: () => projectactive(false) }, "close"],
				children
			]])
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

