function voltarIndex() {
  // Adicione aqui a lógica para iniciar o jogo da memória
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
  // Esta função será executada quando a página for carregada
  reproduzirAudio();
});

function reproduzirAudio() {
  // Obtém o elemento de áudio
  const perguntaInicial = document.getElementById('perguntaInicial');

  // Inicia a reprodução
  perguntaInicial.play();
}

const imagens = Array.from({ length: 21 }, (_, index) => `imagem/quantifica/${index}.png`);
let rodadaAtual = 0;
let acertos = 0;
let imagem1, imagem2;
let usuarioForneceuResposta = false;
let respostaUsuario;

function iniciarJogo() {
  if (rodadaAtual === 10) {
    exibirResultadoFinal();
    return;
  }
   // Atualiza o contador de progresso
   const contador = document.getElementById('contador');
   contador.textContent = `${rodadaAtual + 1} / 10`;

  // Limpa o contêiner de imagens antes de começar uma nova rodada
  const containerImagens = document.getElementById('container-imagens');
  containerImagens.innerHTML = '';

  // Sorteia duas imagens aleatórias que não sejam iguais
  do {
    imagem1 = sortearImagem();
    imagem2 = sortearImagem();
  } while (imagem1 === imagem2);

  // Exibe as imagens ao usuário
  exibirImagens(imagem1, imagem2, containerImagens);

  // Adiciona um evento de clique para comparar as imagens
  const handleClick = function(event) {
    const escolhaUsuario = event.target.id;
    compararImagens(imagem1, imagem2, escolhaUsuario);
    document.body.removeEventListener('click', handleClick); // Remove o ouvinte após clicar
  };

  document.body.addEventListener('click', handleClick);
}

function sortearImagem() {
  const indiceSorteado = Math.floor(Math.random() * imagens.length);
  return imagens[indiceSorteado];
}

function exibirImagens(imagem1, imagem2, container) {
  // Crie elementos de imagem e adicione ao contêiner
  const img1 = document.createElement('img');
  img1.src = imagem1;
  img1.id = 'imagem1';
  container.appendChild(img1);

  const img2 = document.createElement('img');
  img2.src = imagem2;
  img2.id = 'imagem2';
  container.appendChild(img2);
}

function iniciarProximaRodada() {
  const containerImagens = document.getElementById('container-imagens');
  containerImagens.innerHTML = '';

  rodadaAtual++;

  if (rodadaAtual === 10) {
    exibirResultadoFinal();
  } else {
    setTimeout(iniciarJogo, 1000);
  }
}

function reproduzirAudioRespCerta() {
  const audioRespCerta = document.getElementById('audioRespCerta');
  audioRespCerta.play();
}


let usuarioEscolheuMais = false; // Variável para indicar se o usuário escolheu a imagem com mais objetos
let quantidadeObjetosCorreta; // Variável para armazenar a quantidade correta de objetos


function compararImagens(imagem1, imagem2, escolhaUsuario) {
  const numeroImagem1 = parseInt(imagem1.match(/\d+/)[0], 10);
  const numeroImagem2 = parseInt(imagem2.match(/\d+/)[0], 10);

  quantidadeObjetosCorreta = Math.max(numeroImagem1, numeroImagem2);

  if (numeroImagem1 > numeroImagem2 && escolhaUsuario === 'imagem1') {
    acertos++;
    aplicarEstiloCerto(escolhaUsuario);
    exibirInput();
    reproduzirAudioRespCerta();
  } else if (numeroImagem2 > numeroImagem1 && escolhaUsuario === 'imagem2') {
    acertos++;
    aplicarEstiloCerto(escolhaUsuario);
    exibirInput();
    reproduzirAudioRespCerta();
  } else {
    aplicarEstiloErrado(escolhaUsuario);
    setTimeout(function() {
      limparEstilos();
      iniciarProximaRodada();
    }, 1500);
  }
}



function limparEstilos() {
  const imagens = document.querySelectorAll('img');
  imagens.forEach((imagem) => {
    imagem.classList.remove('imagem-errada', 'imagem-certa');
  });
}

function exibirPopupSucesso() {
  Swal.fire({
    icon: 'success',
    title: 'ACERTOU! &#129395;&#128077;',
    showConfirmButton: false,
    timer: 2000,
    customClass: {
      popup: 'success' // Adicionando uma classe personalizada para o estilo
    }
  });
}

function exibirPopupErro() {
  Swal.fire({
    icon: 'error',
    title: 'ERROU! 	&#128553; &#128078;',
    showConfirmButton: false,
    timer: 2000,
    customClass: {
      popup: 'error' // Adicionando uma classe personalizada para o estilo
    }
  });
}


function exibirInput() {
  const containerResultado = document.getElementById('resultado');

  // Adicione um contêiner flexível para organizar o input e o botão horizontalmente
  const inputContainer = document.createElement('div');
  inputContainer.id = 'input-container';
  inputContainer.style.display = 'flex';
  inputContainer.style.justifyContent = 'space-between'; // Espaçamento entre os elementos

  const inputAdivinhar = document.createElement('input');
  inputAdivinhar.type = 'number';
  inputAdivinhar.placeholder = 'Quantos objetos?';
  inputAdivinhar.style.marginRight = '10px'; // Adicione a margem aqui

  const botaoEnviar = document.createElement('button');
  botaoEnviar.textContent = 'ENVIAR';
  botaoEnviar.onclick = function() {
    const respostaUsuario = inputAdivinhar.value;
    containerResultado.removeChild(inputContainer);

    if (parseInt(respostaUsuario) === quantidadeObjetosCorreta) {
      acertos++;
      exibirPopupSucesso();
    } else {
      exibirPopupErro();
    }

    setTimeout(function() {
      iniciarProximaRodada();
    }, 2000);
  };

  inputContainer.appendChild(inputAdivinhar);
  inputContainer.appendChild(botaoEnviar);

  containerResultado.appendChild(inputContainer);
  
  // Dá foco ao campo de input assim que ele é exibido
  inputAdivinhar.focus();
}



function aplicarEstiloCerto(imagemId) {
  const imagem = document.getElementById(imagemId);
  imagem.classList.add('imagem-certa');
}

function aplicarEstiloErrado(imagemId) {
  const imagem = document.getElementById(imagemId);
  imagem.classList.add('imagem-errada');

  // Remove a classe de erro após 1 segundo para permitir o próximo clique
  setTimeout(() => {
    imagem.classList.remove('imagem-errada');
  }, 1000);
}

function exibirResultadoFinal() {
  // Limpa o contêiner de imagens
  const containerImagens = document.getElementById('container-imagens');
  containerImagens.innerHTML = '';

  // Cria um novo contêiner para o resultado e adiciona ao corpo do HTML
  const containerResultado = document.getElementById('resultado');
  containerResultado.innerHTML = ''; // Limpa o contêiner de resultado

  const porcentagemAcertos = (acertos / 20) * 10;

  // Exibe o número de acertos no contêiner de resultado
  const resultadoFinal = document.createElement('h2');
  resultadoFinal.insertAdjacentHTML('beforeend', `Você acertou ${acertos} vezes!<br>Sua nota foi ${porcentagemAcertos}!`);
  containerResultado.appendChild(resultadoFinal);

  // Adiciona a imagem do mascote
  const imagemPontuacao = document.createElement('img');
  imagemPontuacao.src = 'imagem/mascote.png';
  imagemPontuacao.alt = 'Imagem de Pontuação';
  imagemPontuacao.id = 'imagem-pontuacao';
  containerResultado.appendChild(imagemPontuacao);

  // Adiciona uma frase condicional
  const fraseCondicional = document.createElement('p');
  fraseCondicional.textContent = (porcentagemAcertos > 5) ? 'Parabéns! Você foi muito bem!' : 'Continue praticando. Você pode melhorar!';
  fraseCondicional.classList.add('frase-condicional');

  if (porcentagemAcertos > 5) {
    fraseCondicional.classList.add('pontuacao-alta');
  } else {
    fraseCondicional.classList.add('pontuacao-baixa');
    imagemPontuacao.src = 'imagem/mascoteTriste.png';
  }

  containerResultado.appendChild(fraseCondicional);





  // Adiciona o botão de voltar
  const voltarButton = document.createElement('button');
  voltarButton.textContent = 'JOGAR NOVAMENTE';
  voltarButton.id = 'button';
  voltarButton.onclick = function() {
    location.reload(); // Atualiza a página
  };
  containerResultado.appendChild(voltarButton);
}

// Inicia o jogo quando o script é carregado
iniciarJogo();
