const fs = require("fs")
const pdf = require("pdf-parse")

async function text({ actual, expected }) { // Compare 2 pdf document by matching text.
    // Note: This does handle number of words between the pdf documents. 

    const actualBuffer = fs.readFileSync(actual)
    const actualFile = await pdf(actualBuffer)

    const expectedBuffer = fs.readFileSync(expected)
    const expectedFile = await pdf(expectedBuffer)

    if (actual.numpages !== expected.numpages) {
        throw new Error("Number of pages do not match!")
    }

    // Match by words
    const actualStrings = actualFile.text.split(" ")
    const expectedStrings = expectedFile.text.split(" ")

    let n = 0
    let misMatches = []

    for (let i = 0; i < actualStrings.length; i++) {
        if(actualStrings[i] !== expectedStrings[i]) {
            n++
            misMatches.push([actualStrings[i], expectedStrings[i]])
        }
    }

    const match = 1 - (n / actualFile.text.length)

    return { match: match, misMatches: misMatches }

    // // number of pages
    // console.log(data.numpages);
    // // number of rendered pages
    // console.log(data.numrender);
    // // PDF info
    // console.log(data.info);
    // // PDF metadata
    // console.log(data.metadata);
    // // PDF.js version
    // // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // // PDF text
    // console.log(data.text);
}

module.exports = text
