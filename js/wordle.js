"use strict";

const words = ["never", "gonna", "give", "you", "up"];

const wordle = document.querySelector(".wordle");
const numRows = 8;
const numBoxes = 5;

let activeWordRow = 0;
let activeWordBox = 0;

let guessedWords = [];

// for each word, create a wordle container, with 8 word rows and 5 word boxes in each row
// id each word row with word index and each word box with word index and box index
words.forEach((word, wordIndex) => {
  const wordleContainer = document.createElement("div");
  wordleContainer.classList.add("wordle-container");

  wordleContainer.setAttribute("id", `${wordIndex}`);

  for (let i = 0; i < numRows; i++) {
    const wordRow = document.createElement("div");
    wordRow.classList.add("word-row");

    wordRow.setAttribute("id", `${wordIndex}-${i}`);

    for (let j = 0; j < numBoxes; j++) {
      const wordBox = document.createElement("div");
      wordBox.classList.add("word-box");

      wordBox.setAttribute("id", `${wordIndex}-${i}-${j}`);
      wordRow.appendChild(wordBox);
    }

    wordleContainer.appendChild(wordRow);
  }

  wordle.appendChild(wordleContainer);
});

// Listen to keydown event
// if key pressed is a letter, add it to the word box
// if key pressed is backspace, remove last letter from word box
// if key pressed is enter, check if word is correct
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "Backspace") {
    removeLetter();
  } else if (key === "Enter") {
    checkWord();
  } else if (key.length === 1) {
    addLetter(key);
  }
});

function addLetter(letter) {
  if (activeWordRow < numRows && activeWordBox < numBoxes) {
    // for each word container, get the word box with id matching activeWordRow and activeWordBox
    // add the letter to the word box
    const wordBoxes = document.querySelectorAll(".wordle-container");
    wordBoxes.forEach((wordBox, idx) => {
      const box = document.getElementById(
        `${idx}-${activeWordRow}-${activeWordBox}`
      );
      // if box is uneditable, do not add letter
      if (box.classList.contains("uneditable")) {
        return;
      }
      box.textContent = letter;
    });
    activeWordBox++;
  }
}

function removeLetter() {
  if (activeWordBox === numBoxes) {
    activeWordBox--;
  }
  if (
    activeWordRow < numRows &&
    activeWordBox < numBoxes &&
    activeWordBox >= 0
  ) {
    // for each word container, get the word box with id matching activeWordRow and activeWordBox
    // remove the letter from the word box
    const wordBoxes = document.querySelectorAll(".wordle-container");
    wordBoxes.forEach((wordBox, idx) => {
      const box = document.getElementById(
        `${idx}-${activeWordRow}-${activeWordBox}`
      );
      console.log(`${idx}-${activeWordRow}-${activeWordBox}`);
      // if box is uneditable, do not remove letter
      if (box.classList.contains("uneditable")) {
        return;
      }
      box.textContent = null;
    });
    activeWordBox--;
    if (activeWordBox < 0) {
      activeWordBox = 0;
    }
  }
}

function checkWord() {
  // if activeWord box is not equal to numBoxes, do not check word
  if (activeWordBox !== numBoxes) {
    alert("Please fill in all boxes");
    return;
  }

  if (activeWordRow < numRows && activeWordBox <= numBoxes) {
    // for each word container, get the word box with id matching activeWordRow and activeWordBox
    // get the word from the word box
    // check if the word is correct
    // if correct, add a class to the word box
    // if incorrect, remove the class from the word box
    const wordBoxes = document.querySelectorAll(".wordle-container");
    wordBoxes.forEach((wordBox, idx) => {
      // get active row
      const row = document.getElementById(`${idx}-${activeWordRow}`);
      // check first word.length boxes
      for (let i = 0; i < words[idx].length; i++) {
        const box = document.getElementById(`${idx}-${activeWordRow}-${i}`);
        if (box.textContent === words[idx][i]) {
          box.classList.add("correct");
          // remove exists class if it exists
          box.classList.remove("exists");
        } else {
          box.classList.remove("correct");
          // check if box textContent matches any letter in the word
          // check if box.textContent is in words[idx]
          if (words[idx].includes(box.textContent)) {
            box.classList.add("exists");
          } else {
            box.classList.remove("exists");
            box.classList.add("incorrect");
          }
        }
      }
      // check if word is correct
      let correct = true;
      for (let i = 0; i < words[idx].length; i++) {
        const box = document.getElementById(`${idx}-${activeWordRow}-${i}`);
        if (box.textContent !== words[idx][i]) {
          correct = false;
        }
      }
      if (correct) {
        guessedWords.push(idx);

        // make all boxes in all rows in current word uneditable
        // get all rows that have id starting with idx
        const containers = document.getElementById(`${idx}`);
        const rows = containers.querySelectorAll(".word-row");
        rows.forEach((row) => {
          const boxes = row.querySelectorAll(".word-box");
          boxes.forEach((box) => {
            box.classList.add("uneditable");
          });
        });
      }
    });

    // check if all words are guessed
    if (guessedWords.length === words.length) {
      // show modal
      const modal = document.querySelector(".modal");
      modal.style.display = "flex";
    }

    activeWordRow++;
    activeWordBox = 0;
  }
}
