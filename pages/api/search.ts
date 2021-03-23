import { strict } from 'assert'
import { forEach } from 'list'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * @desc this function returns a frequency score
 * @param p takes scores.content
 * @param query is the search string
 */
const getFrequencyScore = (p: object, query: string): number => {
  let score: number = 0
  const querySplit: Array<string> = query.split(' ') // string into array

  /* Get key for page object, e.g. 7400_series */
  for (let key in p) {
    /* Condition that retrieves page objects properties */
    if (p.hasOwnProperty(key)) {
      /* Loop through the word list for that page */
      for (let i = 0; i < p[key].words.length; i++) {
        let word: string = p[key].words[i][0]
        let lc: string = word.toLowerCase()
        /* If there is a match add 1 to score */
        for (let j = 0; j < querySplit.length; j++) {
          if (lc == querySplit[j]) {
            score++
          }
        }
      }
    }
  }

  return score
}

/**
 * @desc this function returns a location score
 * @param p takes scores.location
 * @param query is the search string
 */
const getLocationScore = (p: object, query: string): number => {
  let score: number = 0
  const querySplit: Array<string> = query.split(' ') // string into array

  for (let i = 0; i < querySplit.length; i++) {
    let found: boolean = false
    for (let key in p) {
      if (p.hasOwnProperty(key)) {
        for (let j = 0; j < p[key].words.length; j++) {
          let word: string = p[key].words[j][0]
          let lc: string = word.toLowerCase()
          let wordIndex: number = p[key].words[j][1]
          if (lc == querySplit[i]) {
            score += wordIndex + 1
            found = true
            break
          }
        }
      }
    }

    if (!found) score += 100000
  }

  return score
}

/**
 * @desc this function returns a distance score
 * @param p takes a scores object
 * @param query is the search string
 */
const getWordDistanceScore = (p: object, query: string): any => {
  let score: number = 0
  const querySplit: Array<string> = query.split(' ') // string into array
  let locationScores = []

  for (let i = 0; i < querySplit.length; i++) {
    let tmp = getLocationScore(p, querySplit[i])
    locationScores.push(tmp > 0 ? tmp : 100000)
  }

  for (let i = 0; i < locationScores.length; i++) {
    for (let j = 1; j < locationScores.length; j++) {
      if (locationScores[i] == 100000 || locationScores[j] == 100000) {
        score += 100000
      } else {
        score += Math.abs(locationScores[i] - locationScores[j])
      }
      break
    }
    break
  }

  return score
}

/**
 * @desc this function returns a normalization score
 * @param p takes a score array
 * @param smallIsBetter decides the normalization
 */
const normalize = (
  scores: Array<number>,
  smallIsBetter: boolean
): Array<number> => {
  if (smallIsBetter) {
    let min: number = Math.min(...scores)
    for (let i = 0; i < scores.length; i++)
      scores[i] = min / Math.max(scores[i], 0.00001)
  } else {
    let max: number = Math.max(...scores)
    max = Math.max(max, 0.00001)
    for (let i = 0; i < scores.length; i++) scores[i] = scores[i] / max
  }

  return scores
}

const search = (req: NextApiRequest, res: NextApiResponse) => {
  const query: any = req.body.query.toString().toLowerCase()

  const fs = require('fs')
  const str: string = fs.readFileSync('shared/json/pages.json').toString()
  let obj: Array<object> = JSON.parse(str)

  let result = []
  let scores = { content: [], location: [], distance: [] }

  for (let i = 0; i < obj.length; i++) {
    let p = obj[i] // this is the page object

    /* Here comes the frequence metric function */
    scores.content[i] = getFrequencyScore(p, query)
    scores.location[i] = getLocationScore(p, query)
    scores.distance[i] = getWordDistanceScore(p, query)
  }

  /* Here comes the normalization of the scores */
  normalize(scores.content, false)
  normalize(scores.location, true)
  normalize(scores.distance, true)

  let score: number // end score

  for (let i = 0; i < obj.length; i++) {
    let p = obj[i]

    score = scores.content[i] + 0.8 * scores.location[i]

    /* Get key for page object, e.g. 7400_series */
    for (let key in p) {
      /* Condition that retrieves page objects properties */
      if (p.hasOwnProperty(key)) {
        result.push({
          link: key,
          score: Math.round((score + Number.EPSILON) * 100) / 100,
          content: Math.round((scores.content[i] + Number.EPSILON) * 100) / 100,
          location:
            Math.round((0.8 * scores.location[i] + Number.EPSILON) * 100) / 100,
          distance:
            Math.round((scores.distance[i] + Number.EPSILON) * 100) / 100,
          pagerank: 0
        })
      }
    }
  }

  result.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))

  res.json(JSON.stringify(result.slice(0, 8), null, 2))
}

export default search
