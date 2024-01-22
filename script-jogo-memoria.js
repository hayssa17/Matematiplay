function voltarIndex() {
  // Adicione aqui a lógica para iniciar o jogo da memória
  window.location.href = 'index.html';
}

const totalCards = 30;
const maxNumber = 20;
let shuffledNumbers = [];
let firstClickTime = 0;
let gameStarted = false;
let timerInterval;

// Function to shuffle the numbers
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Function to initialize the game
function initializeGame() {
  const numerosUnicos = new Set();
  while (numerosUnicos.size < totalCards / 2) {
    const numeroSorteado = Math.floor(Math.random() * (maxNumber + 1));
    numerosUnicos.add(numeroSorteado);
  }

  const todosOsNumeros = [...numerosUnicos, ...numerosUnicos];
  shuffledNumbers = shuffle(todosOsNumeros);

  const memoryGame = document.querySelector('.memory-game');

  shuffledNumbers.forEach((numero, index) => {
    const carta = document.createElement('div');
    carta.classList.add('card');
    carta.dataset.value = numero;
    carta.style.backgroundImage = 'url("imagem/fundo_carta.png")';
    carta.addEventListener('click', flipCard);
    memoryGame.appendChild(carta);
  });
}

// Function to handle card flipping
function flipCard() {
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  this.classList.add('flipped');
  this.style.backgroundImage = 'none';
  this.textContent = this.dataset.value;

  // Reproduzir áudio
  playAudio(this.dataset.value);

  // Add your logic for checking matches here

  // Example: Check if two cards are flipped
  const flippedCards = document.querySelectorAll('.flipped');
  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 500);
  }

  if (flippedCards.length === totalCards) {
    stopTimer();
  }
}

function playAudio(number) {
  const audio = document.getElementById('audio');
  audio.src = `audio/${number}.mp3`;  // Substitua pelo caminho real do seu áudio
  audio.play();
}


// Function to check if the flipped cards match
let cartasFechadas = 30;
function checkMatch() {
  const flippedCards = document.querySelectorAll('.flipped');

  if (flippedCards[0].textContent === flippedCards[1].textContent) {
    // Cards match
    flippedCards.forEach(card => {
      card.removeEventListener('click', flipCard);
      card.classList.remove('flipped');
      cartasFechadas -= 1;
    });
  } else {
    // Cards don't match
    flippedCards.forEach(card => {
      card.classList.remove('flipped');
      card.style.backgroundImage = 'url("imagem/fundo_carta.png")';
      card.textContent = '';
    });
  }

  // Check if all cards are flipped
  console.log("teste: ", cartasFechadas);
  if (cartasFechadas === 0) {
    stopTimer();
  }
}

// Function to start the timer
function startTimer() {
  firstClickTime = performance.now();
  timerInterval = setInterval(updateTimer, 1000);
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
  const endTime = performance.now();
  const elapsedTime = (endTime - firstClickTime) / 1000; // Tempo em segundos
  
  // Mostrar o popup
  showPopup(elapsedTime.toFixed(2));
  
  //alert(`Você concluiu o jogo em ${elapsedTime.toFixed(2)} segundos!`);
}


// Função para mostrar o popup
function showPopup(time) {
  const popup = document.getElementById('popup');
  const popupTime = document.getElementById('popup-time');

  popupTime.textContent = time;
  popup.classList.add('popup-show');

  // Adiciona um event listener para o botão "Fechar"
  document.getElementById('closeButton').addEventListener('click', function() {
    popup.classList.remove('popup-show');
    // Atualiza a página após fechar o popup
    location.reload();
  });
}


// Function to update the timer
function updateTimer() {
  const currentTime = performance.now();
  const elapsedTime = (currentTime - firstClickTime) / 1000; // Tempo em segundos
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = Math.floor(elapsedTime % 60);
  const formattedTime = `${minutes} minutos e ${seconds} segundos`;

  document.getElementById('timer').textContent = formattedTime;
}

// Call the initializeGame function to start the game
initializeGame();

