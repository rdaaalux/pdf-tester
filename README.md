# pdf-tester
Test PDF documents by comparing them visually and textually to a known correct PDF document.

# Usage
## Pixel by pixel comparison
Outputs an array with fraction of matching pixels per page.
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
Outputs a fraction of matching words (order matters!) and an array with the mismatched strings [[act, exp], [act, exp]]. 
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
//       'example_1', 
//       'example_2' 
//     ],
//     [
//       'example_3',
//       'example_4'
//     ]
//   ]
// }
```