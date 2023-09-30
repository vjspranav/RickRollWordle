"use strict";

// shuffle words
// const words = ["NEVER", "GONNA", "GIVEN", "YOUNG", "UPPER"];
const words = ["NERVE", "GONNA", "GIVEN", `YOUNG`, "UPPER"];

// shuffle the mainWords array randomly
for (let i = words.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [words[i], words[j]] = [words[j], words[i]];
}

const wordle = document.querySelector(".wordle");
const numRows = 10;
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
    // check if letters are between a-z or A-Z
    const code = key.charCodeAt(0);
    if (
      !(code > 64 && code < 91) &&
      !(code > 96 && code < 123) &&
      !(code > 47 && code < 58)
    ) {
      return;
    }
    // make uppercase
    addLetter(key.toUpperCase());
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
  if (activeWordBox > 0) {
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
      // if box is uneditable, do not remove letter
      if (box.classList.contains("uneditable")) {
        return;
      }
      box.textContent = null;
    });
    // activeWordBox--;
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
    let currentWord = "";
    for (let i = 0; i < numBoxes; i++) {
      const box = document.getElementById(
        `${activeWordRow}-${activeWordBox - i - 1}`
      );
      currentWord += box.textContent;
    }

    // Check if word exists in english dictionary
    if (!allWords.includes(currentWord.toLowerCase())) {
      alert("Word does not exist in English dictionary");
      return;
    }

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
      // start animation
      startAnimation();
    }

    activeWordRow++;
    activeWordBox = 0;
  }

  // if all rows are filled, show modal, and say try again with a button to restart
  if (activeWordRow === numRows) {
    // show modal
    const modal = document.querySelector(".modal");
    modal.style.display = "flex";
    const modalContent = document.querySelector(".modal-content");
    // add try again button
    // replace text content with try again
    modalContent.textContent = "You Lost!";
    const tryAgainBtn = document.createElement("button");
    tryAgainBtn.textContent = "Try Again";
    tryAgainBtn.classList.add("try-again-btn");
    modalContent.appendChild(tryAgainBtn);
    // add event listener to try again button
    tryAgainBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

function startAnimation() {
  // get the modal content element
  const modalContent = document.querySelector(".modal-content");

  // create an array of the words in the correct order
  const correctWords = ["Never", "Gonna", "Give", "You", "Up!"];

  // create an array of the words in the random order
  const randomWords = ["NERVE", "GONNA", "GIVEN", "YOUNG", "UPPER"];

  // create a div for each word and add it to the modal content element
  randomWords.forEach((word, index) => {
    const wordDiv = document.createElement("div");
    wordDiv.textContent = word;
    wordDiv.classList.add("word");
    modalContent.appendChild(wordDiv);

    // wait for 500ms and then animate the word to the correct position
    // animate the word to the correct position
    setTimeout(() => {
      wordDiv.style.transform = `translate(${
        index - correctWords.indexOf(word)
      }px, 0)`;
      wordDiv.textContent = correctWords[index];
    }, (index + 1) * 700);
  });
  // wait 2 seconds and then show the button
  setTimeout(() => {
    // Wait for 2 seconds and start playing the video
    const video = document.createElement("video");
    video.src = "assets/rr.mp4";
    video.autoplay = true;
    video.loop = true;
    video.classList.add("video");
    modalContent.appendChild(video);
  }, 3000);
}
