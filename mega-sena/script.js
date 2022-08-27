var board = [];
var currentGame = [1, 5, 11, 13, 15, 17];
var savedGames = [];

var state = {
  board: [],
  currentGame: [],
  savedGames: [],
};

function start() {
  readLocalStorage();
  createBoard();
  newGame();
}

function readLocalStorage() {
  if (!window.localStorage) return;

  let savedGamesLocalStorage = window.localStorage.getItem('saved-games');

  if (savedGamesLocalStorage) {
    state.savedGames = JSON.parse(savedGamesLocalStorage);
  }
}

function writeLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

function createBoard() {
  state.board = [];

  for (let i = 1; i <= 60; i++) {
    state.board.push(i);
  }
}

function newGame() {
  resetGame();
  render();
}

function render() {
  renderBoard();
  renderBtn();
  renderSavedGames();
}

function renderBoard() {
  let divBoard = document.querySelector('#ms-board');
  divBoard.innerHTML = '';

  let ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');

  for (let i = 0; i < state.board.length; i++) {
    let currentNumber = state.board[i];

    let liNumber = document.createElement('li');
    liNumber.textContent = currentNumber;
    liNumber.classList.add('number');

    liNumber.addEventListener('click', handleNumberClick);

    if (numberInGame(currentNumber)) {
      liNumber.classList.add('selected-number');
    }

    ulNumbers.appendChild(liNumber);
  }

  divBoard.appendChild(ulNumbers);
}

function handleNumberClick(event) {
  let value = Number(event.currentTarget.textContent);

  if (numberInGame(value)) {
    removeNumber(value);
  } else {
    addNumber(value);
  }
  render();
}

function newGameBtn() {
  let button = document.createElement('button');
  button.textContent = 'Novo jogo';

  button.addEventListener('click', newGame);

  return button;
}

function renderBtn() {
  let divBtn = document.querySelector('#ms-buttons');
  divBtn.innerHTML = '';

  let btnNewGame = newGameBtn();
  let btnRandomGame = randomGameBtn();
  let btnSaveGame = saveGameBtn();

  divBtn.appendChild(btnNewGame);
  divBtn.appendChild(btnRandomGame);
  divBtn.appendChild(btnSaveGame);
}

function saveGameBtn() {
  let button = document.createElement('button');
  button.textContent = 'Salvar jogo';
  button.disabled = !isGameComplete();

  button.addEventListener('click', saveGame);

  return button;
}

function randomGameBtn() {
  let button = document.createElement('button');
  button.textContent = 'Jogo aleatorio';

  button.addEventListener('click', randomGame);

  return button;
}

function renderSavedGames() {
  let divSavedGames = document.querySelector('#ms-saved-games');
  divSavedGames.innerHTML = '';

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo salvo</p>';
  } else {
    let ulSavedGames = document.createElement('ul');

    for (let i = 0; i < state.savedGames.length; i++) {
      let currentGame = state.savedGames[i];

      let liGame = document.createElement('li');
      liGame.textContent = currentGame.join(', ');

      ulSavedGames.appendChild(liGame);
    }
    divSavedGames.appendChild(ulSavedGames);
  }
}

function addNumber(number) {
  if (number < 1 || number > 60) {
    console.error('Numero invalido', number);
    return;
  }

  if (state.currentGame.length >= 6) {
    console.error('O jogo esta completo');
    return;
  }

  if (numberInGame(number)) {
    console.error('Este numero ja esta no jogo.', number);
    return;
  }

  state.currentGame.push(number);
}

function removeNumber(number) {
  if (number < 1 || number > 60) {
    console.error('Numero invalido', number);
    return;
  }

  var newGame = [];

  for (let i = 0; i < state.currentGame.length; i++) {
    let currentNumber = state.currentGame[i];

    if (currentNumber === number) {
      continue;
    }
    newGame.push(currentNumber);
  }

  state.currentGame = newGame;
}

function numberInGame(number) {
  return state.currentGame.includes(number);
}

function saveGame() {
  if (!isGameComplete()) {
    console.error('O jogo nao esta completo');
    return;
  }

  state.savedGames.push(state.currentGame);
  writeLocalStorage();
  newGame();
}

function isGameComplete() {
  return state.currentGame.length === 6;
}

function resetGame() {
  state.currentGame = [];
}

function randomGame() {
  resetGame();

  while (!isGameComplete()) {
    let randomNumber = Math.ceil(Math.random() * 60);
    addNumber(randomNumber);
  }
  render();
}

start();
