module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/api/search.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/api/search.ts":
/*!*****************************!*\
  !*** ./pages/api/search.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @desc this function returns a frequency score
 * @param p takes scores.content
 * @param query is the search string
 */
const getFrequencyScore = (p, query) => {
  let score = 0;
  const querySplit = query.split(' '); // string into array

  /* Get key for page object, e.g. 7400_series */

  for (let key in p) {
    /* Condition that retrieves page objects properties */
    if (p.hasOwnProperty(key)) {
      /* Loop through the word list for that page */
      for (let i = 0; i < p[key].words.length; i++) {
        let word = p[key].words[i][0];
        let lc = word.toLowerCase();
        /* If there is a match add 1 to score */

        for (let j = 0; j < querySplit.length; j++) {
          if (lc == querySplit[j]) {
            score++;
          }
        }
      }
    }
  }

  return score;
};
/**
 * @desc this function returns a location score
 * @param p takes scores.location
 * @param query is the search string
 */


const getLocationScore = (p, query) => {
  let score = 0;
  const querySplit = query.split(' '); // string into array

  for (let i = 0; i < querySplit.length; i++) {
    let found = false;

    for (let key in p) {
      if (p.hasOwnProperty(key)) {
        for (let j = 0; j < p[key].words.length; j++) {
          let word = p[key].words[j][0];
          let lc = word.toLowerCase();
          let wordIndex = p[key].words[j][1];

          if (lc == querySplit[i]) {
            score += wordIndex + 1;
            found = true;
            break;
          }
        }
      }
    }

    if (!found) score += 100000;
  }

  return score;
};
/**
 * @desc this function returns a distance score
 * @param p takes a scores object
 * @param query is the search string
 */


const getWordDistanceScore = (p, query) => {
  let score = 0;
  const querySplit = query.split(' '); // string into array

  let locationScores = [];

  for (let i = 0; i < querySplit.length; i++) {
    let tmp = getLocationScore(p, querySplit[i]);
    locationScores.push(tmp > 0 ? tmp : 100000);
  }

  for (let i = 0; i < locationScores.length; i++) {
    for (let j = 1; j < locationScores.length; j++) {
      if (locationScores[i] == 100000 || locationScores[j] == 100000) {
        score += 100000;
      } else {
        score += Math.abs(locationScores[i] - locationScores[j]);
      }

      break;
    }

    break;
  }

  return score;
};
/**
 * @desc this function returns a normalization score
 * @param p takes a score array
 * @param smallIsBetter decides the normalization
 */


const normalize = (scores, smallIsBetter) => {
  if (smallIsBetter) {
    let min = Math.min(...scores);

    for (let i = 0; i < scores.length; i++) scores[i] = min / Math.max(scores[i], 0.00001);
  } else {
    let max = Math.max(...scores);
    max = Math.max(max, 0.00001);

    for (let i = 0; i < scores.length; i++) scores[i] = scores[i] / max;
  }

  return scores;
};

const search = (req, res) => {
  const query = req.body.query.toString().toLowerCase();

  const fs = __webpack_require__(/*! fs */ "fs");

  const str = fs.readFileSync('shared/json/pages.json').toString();
  let obj = JSON.parse(str);
  let result = [];
  let scores = {
    content: [],
    location: [],
    distance: []
  };

  for (let i = 0; i < obj.length; i++) {
    let p = obj[i]; // this is the page object

    /* Here comes the frequence metric function */

    scores.content[i] = getFrequencyScore(p, query);
    scores.location[i] = getLocationScore(p, query);
    scores.distance[i] = getWordDistanceScore(p, query);
  }
  /* Here comes the normalization of the scores */


  normalize(scores.content, false);
  normalize(scores.location, true);
  normalize(scores.distance, true);
  let score; // end score

  for (let i = 0; i < obj.length; i++) {
    let p = obj[i];
    score = scores.content[i] + 0.8 * scores.location[i];
    /* Get key for page object, e.g. 7400_series */

    for (let key in p) {
      /* Condition that retrieves page objects properties */
      if (p.hasOwnProperty(key)) {
        result.push({
          link: key,
          score: Math.round((score + Number.EPSILON) * 100) / 100,
          content: Math.round((scores.content[i] + Number.EPSILON) * 100) / 100,
          location: Math.round((0.8 * scores.location[i] + Number.EPSILON) * 100) / 100,
          distance: Math.round((scores.distance[i] + Number.EPSILON) * 100) / 100,
          pagerank: 0
        });
      }
    }
  }

  result.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  res.json(JSON.stringify(result.slice(0, 8), null, 2));
};

/* harmony default export */ __webpack_exports__["default"] = (search);

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vcGFnZXMvYXBpL3NlYXJjaC50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIl0sIm5hbWVzIjpbImdldEZyZXF1ZW5jeVNjb3JlIiwicCIsInF1ZXJ5Iiwic2NvcmUiLCJxdWVyeVNwbGl0Iiwic3BsaXQiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImkiLCJ3b3JkcyIsImxlbmd0aCIsIndvcmQiLCJsYyIsInRvTG93ZXJDYXNlIiwiaiIsImdldExvY2F0aW9uU2NvcmUiLCJmb3VuZCIsIndvcmRJbmRleCIsImdldFdvcmREaXN0YW5jZVNjb3JlIiwibG9jYXRpb25TY29yZXMiLCJ0bXAiLCJwdXNoIiwiTWF0aCIsImFicyIsIm5vcm1hbGl6ZSIsInNjb3JlcyIsInNtYWxsSXNCZXR0ZXIiLCJtaW4iLCJtYXgiLCJzZWFyY2giLCJyZXEiLCJyZXMiLCJib2R5IiwidG9TdHJpbmciLCJmcyIsInJlcXVpcmUiLCJzdHIiLCJyZWFkRmlsZVN5bmMiLCJvYmoiLCJKU09OIiwicGFyc2UiLCJyZXN1bHQiLCJjb250ZW50IiwibG9jYXRpb24iLCJkaXN0YW5jZSIsImxpbmsiLCJyb3VuZCIsIk51bWJlciIsIkVQU0lMT04iLCJwYWdlcmFuayIsInNvcnQiLCJhIiwiYiIsInBhcnNlRmxvYXQiLCJqc29uIiwic3RyaW5naWZ5Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7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UUFBUCxDQUFnQnBDLENBQWhCLElBQXFCdUMsTUFBTSxDQUFDQyxPQUE3QixJQUF3QyxHQUFuRCxJQUEwRCxHQVBsRDtBQVFWQyxrQkFBUSxFQUFFO0FBUkEsU0FBWjtBQVVEO0FBQ0Y7QUFDRjs7QUFFRFIsUUFBTSxDQUFDUyxJQUFQLENBQVksQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLEtBQVVDLFVBQVUsQ0FBQ0QsQ0FBQyxDQUFDakQsS0FBSCxDQUFWLEdBQXNCa0QsVUFBVSxDQUFDRixDQUFDLENBQUNoRCxLQUFILENBQXREO0FBRUE0QixLQUFHLENBQUN1QixJQUFKLENBQVNmLElBQUksQ0FBQ2dCLFNBQUwsQ0FBZWQsTUFBTSxDQUFDZSxLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQUFmLEVBQW1DLElBQW5DLEVBQXlDLENBQXpDLENBQVQ7QUFDRCxDQXBERDs7QUFzRGUzQixxRUFBZixFOzs7Ozs7Ozs7OztBQzVLQSwrQiIsImZpbGUiOiJwYWdlcy9hcGkvc2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSByZXF1aXJlKCcuLi8uLi9zc3ItbW9kdWxlLWNhY2hlLmpzJyk7XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdHZhciB0aHJldyA9IHRydWU7XG4gXHRcdHRyeSB7XG4gXHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG4gXHRcdFx0dGhyZXcgPSBmYWxzZTtcbiBcdFx0fSBmaW5hbGx5IHtcbiBcdFx0XHRpZih0aHJldykgZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHR9XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9wYWdlcy9hcGkvc2VhcmNoLnRzXCIpO1xuIiwiaW1wb3J0IHsgc3RyaWN0IH0gZnJvbSAnYXNzZXJ0J1xyXG5pbXBvcnQgeyBmb3JFYWNoIH0gZnJvbSAnbGlzdCdcclxuaW1wb3J0IHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gJ25leHQnXHJcblxyXG4vKipcclxuICogQGRlc2MgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgZnJlcXVlbmN5IHNjb3JlXHJcbiAqIEBwYXJhbSBwIHRha2VzIHNjb3Jlcy5jb250ZW50XHJcbiAqIEBwYXJhbSBxdWVyeSBpcyB0aGUgc2VhcmNoIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgZ2V0RnJlcXVlbmN5U2NvcmUgPSAocDogb2JqZWN0LCBxdWVyeTogc3RyaW5nKTogbnVtYmVyID0+IHtcclxuICBsZXQgc2NvcmU6IG51bWJlciA9IDBcclxuICBjb25zdCBxdWVyeVNwbGl0OiBBcnJheTxzdHJpbmc+ID0gcXVlcnkuc3BsaXQoJyAnKSAvLyBzdHJpbmcgaW50byBhcnJheVxyXG5cclxuICAvKiBHZXQga2V5IGZvciBwYWdlIG9iamVjdCwgZS5nLiA3NDAwX3NlcmllcyAqL1xyXG4gIGZvciAobGV0IGtleSBpbiBwKSB7XHJcbiAgICAvKiBDb25kaXRpb24gdGhhdCByZXRyaWV2ZXMgcGFnZSBvYmplY3RzIHByb3BlcnRpZXMgKi9cclxuICAgIGlmIChwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgLyogTG9vcCB0aHJvdWdoIHRoZSB3b3JkIGxpc3QgZm9yIHRoYXQgcGFnZSAqL1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBba2V5XS53b3Jkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCB3b3JkOiBzdHJpbmcgPSBwW2tleV0ud29yZHNbaV1bMF1cclxuICAgICAgICBsZXQgbGM6IHN0cmluZyA9IHdvcmQudG9Mb3dlckNhc2UoKVxyXG4gICAgICAgIC8qIElmIHRoZXJlIGlzIGEgbWF0Y2ggYWRkIDEgdG8gc2NvcmUgKi9cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHF1ZXJ5U3BsaXQubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgIGlmIChsYyA9PSBxdWVyeVNwbGl0W2pdKSB7XHJcbiAgICAgICAgICAgIHNjb3JlKytcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiBzY29yZVxyXG59XHJcblxyXG4vKipcclxuICogQGRlc2MgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgbG9jYXRpb24gc2NvcmVcclxuICogQHBhcmFtIHAgdGFrZXMgc2NvcmVzLmxvY2F0aW9uXHJcbiAqIEBwYXJhbSBxdWVyeSBpcyB0aGUgc2VhcmNoIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgZ2V0TG9jYXRpb25TY29yZSA9IChwOiBvYmplY3QsIHF1ZXJ5OiBzdHJpbmcpOiBudW1iZXIgPT4ge1xyXG4gIGxldCBzY29yZTogbnVtYmVyID0gMFxyXG4gIGNvbnN0IHF1ZXJ5U3BsaXQ6IEFycmF5PHN0cmluZz4gPSBxdWVyeS5zcGxpdCgnICcpIC8vIHN0cmluZyBpbnRvIGFycmF5XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcXVlcnlTcGxpdC5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGZvdW5kOiBib29sZWFuID0gZmFsc2VcclxuICAgIGZvciAobGV0IGtleSBpbiBwKSB7XHJcbiAgICAgIGlmIChwLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBba2V5XS53b3Jkcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgbGV0IHdvcmQ6IHN0cmluZyA9IHBba2V5XS53b3Jkc1tqXVswXVxyXG4gICAgICAgICAgbGV0IGxjOiBzdHJpbmcgPSB3b3JkLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgIGxldCB3b3JkSW5kZXg6IG51bWJlciA9IHBba2V5XS53b3Jkc1tqXVsxXVxyXG4gICAgICAgICAgaWYgKGxjID09IHF1ZXJ5U3BsaXRbaV0pIHtcclxuICAgICAgICAgICAgc2NvcmUgKz0gd29yZEluZGV4ICsgMVxyXG4gICAgICAgICAgICBmb3VuZCA9IHRydWVcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWZvdW5kKSBzY29yZSArPSAxMDAwMDBcclxuICB9XHJcblxyXG4gIHJldHVybiBzY29yZVxyXG59XHJcblxyXG4vKipcclxuICogQGRlc2MgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGEgZGlzdGFuY2Ugc2NvcmVcclxuICogQHBhcmFtIHAgdGFrZXMgYSBzY29yZXMgb2JqZWN0XHJcbiAqIEBwYXJhbSBxdWVyeSBpcyB0aGUgc2VhcmNoIHN0cmluZ1xyXG4gKi9cclxuY29uc3QgZ2V0V29yZERpc3RhbmNlU2NvcmUgPSAocDogb2JqZWN0LCBxdWVyeTogc3RyaW5nKTogYW55ID0+IHtcclxuICBsZXQgc2NvcmU6IG51bWJlciA9IDBcclxuICBjb25zdCBxdWVyeVNwbGl0OiBBcnJheTxzdHJpbmc+ID0gcXVlcnkuc3BsaXQoJyAnKSAvLyBzdHJpbmcgaW50byBhcnJheVxyXG4gIGxldCBsb2NhdGlvblNjb3JlcyA9IFtdXHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcXVlcnlTcGxpdC5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IHRtcCA9IGdldExvY2F0aW9uU2NvcmUocCwgcXVlcnlTcGxpdFtpXSlcclxuICAgIGxvY2F0aW9uU2NvcmVzLnB1c2godG1wID4gMCA/IHRtcCA6IDEwMDAwMClcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYXRpb25TY29yZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGZvciAobGV0IGogPSAxOyBqIDwgbG9jYXRpb25TY29yZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKGxvY2F0aW9uU2NvcmVzW2ldID09IDEwMDAwMCB8fCBsb2NhdGlvblNjb3Jlc1tqXSA9PSAxMDAwMDApIHtcclxuICAgICAgICBzY29yZSArPSAxMDAwMDBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzY29yZSArPSBNYXRoLmFicyhsb2NhdGlvblNjb3Jlc1tpXSAtIGxvY2F0aW9uU2NvcmVzW2pdKVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICBicmVha1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHNjb3JlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZGVzYyB0aGlzIGZ1bmN0aW9uIHJldHVybnMgYSBub3JtYWxpemF0aW9uIHNjb3JlXHJcbiAqIEBwYXJhbSBwIHRha2VzIGEgc2NvcmUgYXJyYXlcclxuICogQHBhcmFtIHNtYWxsSXNCZXR0ZXIgZGVjaWRlcyB0aGUgbm9ybWFsaXphdGlvblxyXG4gKi9cclxuY29uc3Qgbm9ybWFsaXplID0gKFxyXG4gIHNjb3JlczogQXJyYXk8bnVtYmVyPixcclxuICBzbWFsbElzQmV0dGVyOiBib29sZWFuXHJcbik6IEFycmF5PG51bWJlcj4gPT4ge1xyXG4gIGlmIChzbWFsbElzQmV0dGVyKSB7XHJcbiAgICBsZXQgbWluOiBudW1iZXIgPSBNYXRoLm1pbiguLi5zY29yZXMpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjb3Jlcy5sZW5ndGg7IGkrKylcclxuICAgICAgc2NvcmVzW2ldID0gbWluIC8gTWF0aC5tYXgoc2NvcmVzW2ldLCAwLjAwMDAxKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBsZXQgbWF4OiBudW1iZXIgPSBNYXRoLm1heCguLi5zY29yZXMpXHJcbiAgICBtYXggPSBNYXRoLm1heChtYXgsIDAuMDAwMDEpXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjb3Jlcy5sZW5ndGg7IGkrKykgc2NvcmVzW2ldID0gc2NvcmVzW2ldIC8gbWF4XHJcbiAgfVxyXG5cclxuICByZXR1cm4gc2NvcmVzXHJcbn1cclxuXHJcbmNvbnN0IHNlYXJjaCA9IChyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkgPT4ge1xyXG4gIGNvbnN0IHF1ZXJ5OiBhbnkgPSByZXEuYm9keS5xdWVyeS50b1N0cmluZygpLnRvTG93ZXJDYXNlKClcclxuXHJcbiAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXHJcbiAgY29uc3Qgc3RyOiBzdHJpbmcgPSBmcy5yZWFkRmlsZVN5bmMoJ3NoYXJlZC9qc29uL3BhZ2VzLmpzb24nKS50b1N0cmluZygpXHJcbiAgbGV0IG9iajogQXJyYXk8b2JqZWN0PiA9IEpTT04ucGFyc2Uoc3RyKVxyXG5cclxuICBsZXQgcmVzdWx0ID0gW11cclxuICBsZXQgc2NvcmVzID0geyBjb250ZW50OiBbXSwgbG9jYXRpb246IFtdLCBkaXN0YW5jZTogW10gfVxyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IHAgPSBvYmpbaV0gLy8gdGhpcyBpcyB0aGUgcGFnZSBvYmplY3RcclxuXHJcbiAgICAvKiBIZXJlIGNvbWVzIHRoZSBmcmVxdWVuY2UgbWV0cmljIGZ1bmN0aW9uICovXHJcbiAgICBzY29yZXMuY29udGVudFtpXSA9IGdldEZyZXF1ZW5jeVNjb3JlKHAsIHF1ZXJ5KVxyXG4gICAgc2NvcmVzLmxvY2F0aW9uW2ldID0gZ2V0TG9jYXRpb25TY29yZShwLCBxdWVyeSlcclxuICAgIHNjb3Jlcy5kaXN0YW5jZVtpXSA9IGdldFdvcmREaXN0YW5jZVNjb3JlKHAsIHF1ZXJ5KVxyXG4gIH1cclxuXHJcbiAgLyogSGVyZSBjb21lcyB0aGUgbm9ybWFsaXphdGlvbiBvZiB0aGUgc2NvcmVzICovXHJcbiAgbm9ybWFsaXplKHNjb3Jlcy5jb250ZW50LCBmYWxzZSlcclxuICBub3JtYWxpemUoc2NvcmVzLmxvY2F0aW9uLCB0cnVlKVxyXG4gIG5vcm1hbGl6ZShzY29yZXMuZGlzdGFuY2UsIHRydWUpXHJcblxyXG4gIGxldCBzY29yZTogbnVtYmVyIC8vIGVuZCBzY29yZVxyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IHAgPSBvYmpbaV1cclxuXHJcbiAgICBzY29yZSA9IHNjb3Jlcy5jb250ZW50W2ldICsgMC44ICogc2NvcmVzLmxvY2F0aW9uW2ldXHJcblxyXG4gICAgLyogR2V0IGtleSBmb3IgcGFnZSBvYmplY3QsIGUuZy4gNzQwMF9zZXJpZXMgKi9cclxuICAgIGZvciAobGV0IGtleSBpbiBwKSB7XHJcbiAgICAgIC8qIENvbmRpdGlvbiB0aGF0IHJldHJpZXZlcyBwYWdlIG9iamVjdHMgcHJvcGVydGllcyAqL1xyXG4gICAgICBpZiAocC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgbGluazoga2V5LFxyXG4gICAgICAgICAgc2NvcmU6IE1hdGgucm91bmQoKHNjb3JlICsgTnVtYmVyLkVQU0lMT04pICogMTAwKSAvIDEwMCxcclxuICAgICAgICAgIGNvbnRlbnQ6IE1hdGgucm91bmQoKHNjb3Jlcy5jb250ZW50W2ldICsgTnVtYmVyLkVQU0lMT04pICogMTAwKSAvIDEwMCxcclxuICAgICAgICAgIGxvY2F0aW9uOlxyXG4gICAgICAgICAgICBNYXRoLnJvdW5kKCgwLjggKiBzY29yZXMubG9jYXRpb25baV0gKyBOdW1iZXIuRVBTSUxPTikgKiAxMDApIC8gMTAwLFxyXG4gICAgICAgICAgZGlzdGFuY2U6XHJcbiAgICAgICAgICAgIE1hdGgucm91bmQoKHNjb3Jlcy5kaXN0YW5jZVtpXSArIE51bWJlci5FUFNJTE9OKSAqIDEwMCkgLyAxMDAsXHJcbiAgICAgICAgICBwYWdlcmFuazogMFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc3VsdC5zb3J0KChhLCBiKSA9PiBwYXJzZUZsb2F0KGIuc2NvcmUpIC0gcGFyc2VGbG9hdChhLnNjb3JlKSlcclxuXHJcbiAgcmVzLmpzb24oSlNPTi5zdHJpbmdpZnkocmVzdWx0LnNsaWNlKDAsIDgpLCBudWxsLCAyKSlcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2VhcmNoXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=