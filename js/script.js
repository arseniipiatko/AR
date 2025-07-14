// Define the game states using an enum-like object
const GameState = Object.freeze({
  READY_TO_START: "READY_TO_START",
  END_OF_GAME: "END_OF_GAME",
});

//Ranks list
const ranks = [
  "Рядовой",
  "Ефрейтор",
  "Мл. Сержант",
  "Сержант",
  "Ст. Сержант",
  "Старшина",
  "Прапорщик",
  "Ст. Прапорщик",
  "Мл. Лейтенант",
  "Лейтенант",
  "Ст. Лейтенант",
  "Капитан",
  "Майор",
  "Подполковник",
  "Полковник",
  "Генерал-Майор",
  "Генерал-Лейтенант",
  "Генерал-Полковник",
  "Генерал Армии",
  "Маршал",
];
const probabilities = [
  0.0372899348814001, 0.0526802550940001, 0.0685048989834, 0.083592751537,
  0.095502986382, 0.09859094876, 0.07916513213, 0.09310887842, 0.1076328156,
  0.1228087322, 0.138708021, 0.15540029, 0.17294277, 0.1913406, 0.210412,
  0.2293412, 0.24521, 0.24814, 0.205, 0,
];

// Initialize the game state to READY_TO_START
let currentState = GameState.READY_TO_START;

// Get references to buttons, status, and playing info
const restartButton = document.getElementById("restart");
const startButton = document.getElementById("start");
const playerGrid = document.querySelector(".player-grid");
const inputSection = document.getElementById("input-section");
const userInputAge = document.getElementById("user-input-age");
const userInputRank = document.getElementById("user-input-rank");
const statusText = document.querySelector("#status p");

// Update the game status based on the current state
function updateGameStatus() {
  switch (currentState) {
    case GameState.READY_TO_START:
      restartButton.disabled = true;
      startButton.disabled = false;
      inputSection.classList.remove("hidden");
      playerGrid.classList.add("hidden");
      statusText.classList.remove("p-no-border");
      statusText.textContent = "Press Start to begin.";
      break;
    case GameState.END_OF_GAME:
      restartButton.disabled = false;
      startButton.disabled = true;
      inputSection.classList.add("hidden");
      playerGrid.classList.remove("hidden");
      statusText.classList.add("p-no-border");
      statusText.textContent = "Here are the results:";
      break;
  }
}

// Event listeners for buttons
restartButton.addEventListener("click", function () {
  currentState = GameState.READY_TO_START;
  updateGameStatus();
});

startButton.addEventListener("click", () => {
  try {
    const { age, rank } = validateInputs();
    currentState = GameState.END_OF_GAME;
    generateRanks(age, rank);
    updateGameStatus();
  } catch (err) {
    // error already shown via alert()
  }
});

// Function to display player data in the grid
function displayPlayerData(rankList, targetYear) {
  const existingItems = playerGrid.querySelectorAll(".grid-item");
  existingItems.forEach((item) => item.remove());

  for (let i = 0; i < rankList.length; i++) {
    const yearCell = document.createElement("div");
    yearCell.className = "grid-item";
    yearCell.textContent = i + 18;
    const rankCell = document.createElement("div");
    rankCell.className = "grid-item";
    rankCell.textContent = ranks[rankList[i]];

    if (i === targetYear) {
      yearCell.classList.add("selected-data");
      rankCell.classList.add("selected-data");
    }

    playerGrid.appendChild(yearCell);
    playerGrid.appendChild(rankCell);
  }
}

function generateRanks(year, rank) {
  targetYear = year - 18;
  targetRank = rank - 1;
  let rankList = [];
  while (rankList.length == 0) {
    let tempList = [0];
    let currentRank = 0;
    for (let i = 1; i <= targetYear; i++) {
      const randomValue = Math.random();
      if (randomValue < probabilities[currentRank]) {
        currentRank += 1;
      }
      tempList.push(currentRank);
    }
    if (tempList[targetYear] == targetRank) {
      rankList = tempList;
    }
  }
  while (rankList.length < 43) {
    let currentRank = rankList[rankList.length - 1];
    const randomValue = Math.random();
    if (randomValue < probabilities[currentRank]) {
      currentRank += 1;
    }
    rankList.push(currentRank);
  }
  displayPlayerData(rankList, targetYear);
}

function validateInputs() {
  const ageVal = parseInt(userInputAge.value.trim(), 10);
  if (!Number.isInteger(ageVal)) {
    const msg = "Age must be an integer.";
    alert(msg);
    throw new Error(msg);
  }
  if (ageVal < 18 || ageVal > 60) {
    const msg = "Age must be between 18 and 60.";
    alert(msg);
    throw new Error(msg);
  }

  const rankVal = parseInt(userInputRank.value.trim(), 10);
  if (!Number.isInteger(rankVal)) {
    const msg = "Rank must be an integer.";
    alert(msg);
    throw new Error(msg);
  }
  if (rankVal < 1 || rankVal > 20) {
    const msg = "Rank must be between 1 and 20.";
    alert(msg);
    throw new Error(msg);
  }

  if (rankVal > ageVal - 17) {
    const msg = "Rank cannot exceed (age - 17).";
    alert(msg);
    throw new Error(msg);
  }

  return { age: ageVal, rank: rankVal };
}

// Initial state update
updateGameStatus();
