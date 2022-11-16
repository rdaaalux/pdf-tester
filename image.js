const { fromPath } = require("pdf2pic")
const fs = require("fs-extra")
const pixelmatch = require("pixelmatch")
const { PNG } = require("pngjs")
const path = require("path")

async function visual({ actual, expected, output }) { // Compare 2 pdfs by converting to an image and comparing the images.
    // Requirements:
    // - Ghostscript 9.52 (Older versions dont work)
    // - Graphicsmagick 1.3.23 (Older versions dont work?)

    const act = pdf_to_images(actual)
    const exp = pdf_to_images(expected)
    const [actualFolder, expectedFolder] = await Promise.all([act, exp])

    const match = await compare_images({
        actual: actualFolder,
        expected: expectedFolder,
        outputFolder: output,
    })

    return {match: match } 
}

module.exports = visual

function pdf_to_images(filename) { // Convert pdf document to series of images of each page
    return new Promise(async (resolve, reject) => {
        const outputFolder = path.dirname(filename) + "/output"
        await fs.emptyDir(outputFolder) // clear output dir

        const options = {
            density: 300,
            saveFilename: "page",
            savePath: outputFolder,
            format: "png",
            width: 794,
            height: 1123,
        }

        // Bulk convert pdf to images
        fromPath(filename, options)
            .bulk(-1)
            .then(res => {
                resolve(outputFolder)
            })
            .catch(err => {
                console.log(err)
                reject("PDF could not be converted to images")
            })
    })
}

async function compare_images({ actual, expected, outputFolder }) { // Pixel compare 2 images
    await fs.emptyDir(outputFolder) // Empty output dir

    const act = await fs.readdir(actual)
    const exp = await fs.readdir(expected)
    const files = [act, exp]

    // Check length of pages
    if (act.length !== exp.length) {
        throw new Error("Number of pages do not match")
    }

    const options = {
        threshold: 0.2,
        alpha: 0.5,
    }

    // Loop through each page image
    let matches = []
    for (let i = 0; i < files[0].length; i++) {
        const actFilename = files[0][i]
        const expFilename = files[1][i]

        const img1 = PNG.sync.read(fs.readFileSync(actual + "/" + actFilename))
        const img2 = PNG.sync.read(fs.readFileSync(expected + "/" + expFilename))

        const { width, height } = img1
        const diff = new PNG({ width, height })

        const misMatchedPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, options)
        matches.push(1 - misMatchedPixels / (width * height)) // Calculate match percentage

        fs.writeFileSync(outputFolder + "/diff." + (i + 1) + ".png", PNG.sync.write(diff))
    }

    return matches
}
