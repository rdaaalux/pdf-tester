# pdf-tester
Test PDF documents by comparing them visually and textually to a known correct PDF document.

# Usage
## Pixel by pixel comparison
```
const { visual, text }  = require("pdf_tester")

visual({
    actual: "./test/actual/test_act_1.pdf",
    expected: "./test/expected/test_exp_1.pdf",
    output: "./test/result",
})
    .then(res => console.log(res))

// res = { match: [ 1, 1, 1, 0.9996702786481874, 1, 1 ] }
```

## Text content comparison
```
text({
    actual: "./test/actual/test_act_1.pdf",
    expected: "./test/expected/test_exp_1.pdf",
})
    .then(res => console.log(res))
    
// res = {
//   match: 0.9996303825540566,
//   misMatches: [
//     [
//       '220808_1143.ies03615.20.03.4020.0-90.0\nM3WS2007', 
//       '220808_1143.ies03615.2-0.03.4020.0-90.0\nM3WS2007' 
//     ],
//     [
//       '220808_1143.ies0-3615.20.0-3.4020.090.0\nM6WS2007',
//       '220808_1143.ies0-3615.2-0.0-3.4020.090.0\nM6WS2007'
//     ]
//   ]
// }
```