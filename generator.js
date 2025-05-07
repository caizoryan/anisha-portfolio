import fs from "fs"
import path from "path"

// go thru files
let dirs = fs.readdirSync("./files")

console.log("Projects: ")
dirs.forEach((name, i) => console.log(i + ": ", name))

let projects = []

dirs.forEach((name) => {
	let project = { name, images: [], videos: [], description: "" }

	let filelocation = (file) => path.join("./files/", name, file)
	let teaser = (file) => project.teaser = filelocation(file)
	let image = (file) => project.images.push(filelocation(file))
	let video = (file) => project.videos.push(filelocation(file))

	let files = fs.readdirSync(path.join("./files", name))
	files.forEach((file) => {
		if (file.toLowerCase() == "teaser.mp4") { teaser(file) }
		else {
			// video
			if (file.split(".").pop() == ".mp4") video(file)

			// image
			if (file.split(".").pop() == ".jpeg") image(file)
			if (file.split(".").pop() == ".jpg") image(file)
			if (file.split(".").pop() == ".png") image(file)
		}
	})

	projects.push(project)
})

let code = `export const data = ${JSON.stringify(projects, null, 2)}`
fs.writeFileSync("data.js", code)

