const fs = require('fs')
const dirs = fs.readdirSync('shared/data/Words/')

let arr = [] // arr for end result
let wordList = []

for (let i = 0; i < dirs.length; i++) {
  let page = fs.readdirSync(`shared/data/Words/${dirs[i]}/`)
  for (let j = 0; j < page.length; j++) {
    /* String */
    const str = fs
      .readFileSync(`shared/data/Words/${dirs[i]}/${page[j]}`)
      .toString()
      .toLowerCase()

    const result = str.split(' ')

    for (let j = 0; j < result.length; j++) {
      let id = wordList.length
      wordList.push([result[j], id])
    }

    /* Create new page object */
    arr.push({
      [page[j]]: {
        words: wordList
      }
    })

    wordList = []
  }
}

fs.writeFile('shared/json/pages.json', JSON.stringify(arr), (err, result) => {
  if (err) console.log(err)
})
