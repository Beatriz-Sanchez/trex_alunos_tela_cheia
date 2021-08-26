var trex, trex_correndo, trex_colidiu, trex_parado;
var solo, soloInvisivel, imagemDoSolo;
var imagemDaNuvem, grupoDeNuvens, obstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6, grupoDeObstaculos;
var font, fonte, record, pontuacao, imagemFimDoJogo, fimDoJogo, imagemReiniciar, reiniciar, imagemPause, pause;
var somSalto, somMorte, somCheckPoint;

const START = -1;
const JOGAR = 1;
const PAUSE = 0.5;
const ENCERRAR = 0;
var estadoJogo = START;
var txtSize;

function preload() {

  //criar animações do T-Rex
  trex_parado = loadAnimation("trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexParado.png", "trexPiscando.png")
  trex_correndo = loadAnimation('trex1.png', 'trex3.png', 'trex4.png');
  trex_colidiu = loadAnimation("trex_colidiu.png");

  //carregar imagem do solo
  imagemDoSolo = loadImage("solo2.png");

  //carregar imagem da nuvem
  imagemDaNuvem = loadImage("nuvem.png");

  // carregar imagens dos obstaculos
  obstaculo1 = loadImage("obstaculo1.png");
  obstaculo2 = loadImage("obstaculo2.png");
  obstaculo3 = loadImage("obstaculo3.png");
  obstaculo4 = loadImage("obstaculo4.png");
  obstaculo5 = loadImage("obstaculo5.png");
  obstaculo6 = loadImage("obstaculo6.png");

  //carregar imagens de final e pause
  imagemFimDoJogo = loadImage("fimDoJogo.png");
  imagemReiniciar = loadImage("reiniciar.png");
  imagemPause = loadImage("pause.png");

  //carregar sons
  somSalto = loadSound("pulo.mp3");
  somMorte = loadSound("morte.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
  somSalto.volume = 0.5;

  fonte = loadFont("fonte.ttf")

  record = 0;
  txtSize = windowHeight / 20;
}

function setup() {

  //cria a tela
  createCanvas(windowWidth, windowHeight);

  //cria solo
  solo = createSprite(windowWidth / 2, windowHeight - 30);
  //adiciona imagem de solo
  solo.addImage("solo", imagemDoSolo)
  solo.x = solo.width / 2;

  //cria solo invisível
  soloInvisivel = createSprite(300, windowHeight, 600, 30);
  soloInvisivel.visible = false;

  //cria sprite do T-Rex
  trex = createSprite(50, windowHeight - 40, 20, 50);
  trex.scale = 0.5;
  trex.x = 50;
  trex.addAnimation("parado", trex_parado);
  trex.addAnimation("correndo", trex_correndo);
  trex.addAnimation("colidiu", trex_colidiu);

  //atribuir valor inicial à pontuação
  pontuacao = 0

  //criar grupos de nuvens e obstáculos
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();

  //adicionar e ajustar imagens do fim e pause
  fimDoJogo = createSprite(windowWidth / 2, windowHeight / 2 - (windowHeight / 12), 400, 20);
  fimDoJogo.addImage(imagemFimDoJogo);
  fimDoJogo.visible = false;

  reiniciar = createSprite(windowWidth / 2, windowHeight / 2 + (windowHeight / 12));
  reiniciar.addImage(imagemReiniciar);
  reiniciar.visible = false;

  pause = createSprite(windowWidth / 2, windowHeight / 2 + (windowHeight / 12));
  pause.addImage(imagemPause);
  pause.visible = false;

  fimDoJogo.scale = windowWidth / 1000;
  fimDoJogo.depth = fimDoJogo.depth + 10000;
  reiniciar.scale = windowWidth / 1000;
  reiniciar.depth = reiniciar.depth + 10000;
  pause.scale = windowWidth / 5000;
  pause.depth = reiniciar.depth + 10000;

  trex.setCollider("circle", 0, 0);

  //para Trex inteligente
  //trex.setCollider("rectangle",250,0);

}

function draw() {

  //fundo branco
  background("white");

  fill("red");
  textSize(txtSize / 1.2);
  text("♥", 7 * txtSize, 10 + txtSize / 2.4);
  textSize(txtSize / 2.4);
  textFont(fonte);
  fill("blue");
  text("Presented by Bia JJ", 20, 10 + txtSize / 3.6);

  if (record > 0) {
    textSize(txtSize);
    textFont(fonte);
    fill("darkgray");
    text(record, windowWidth - (9 * txtSize), 10 + txtSize);
  }
  if (pontuacao === 0) {
    textSize(txtSize);
    textFont(fonte);
    fill("dimgray");
    text("0000", windowWidth - (4 * txtSize), 10 + txtSize);
  } else if (pontuacao > 0 && pontuacao < 10) {
    textSize(txtSize);
    textFont(fonte);
    fill("dimgray");
    text("000" + pontuacao, windowWidth - (4 * txtSize), 10 + txtSize);
  } else if (pontuacao >= 10 && pontuacao < 100) {
    textSize(txtSize);
    textFont(fonte);
    fill("dimgray");
    text("00" + pontuacao, windowWidth - (4 * txtSize), 10 + txtSize);
  } else if (pontuacao >= 100 && pontuacao < 1000) {
    textSize(txtSize);
    textFont(fonte);
    fill("dimgray");
    text("0" + pontuacao, windowWidth - (4 * txtSize), 10 + txtSize);
  } else {
    textSize(txtSize);
    textFont(fonte);
    fill("dimgray");
    text(pontuacao, windowWidth - (4 * txtSize), 10 + txtSize);
  }

  //desenha os sprites
  drawSprites();

  //Trex colide com o solo
  trex.collide(soloInvisivel);

  //estados de jogo
  if (estadoJogo === START) {
    fimDoJogo.visible = false;
    reiniciar.visible = false;

    //gravidade
    trex.velocityY = trex.velocityY + 1;

    if (touches.length > 0 && trex.isTouching(solo) || keyDown('space') && trex.isTouching(solo)) {
      trex.velocityY = -15;
      somSalto.play();
      estadoJogo = JOGAR;
    }

  } else if (estadoJogo === JOGAR) {

    pause.visible = false;
    grupoDeObstaculos.setVelocityXEach(solo.velocityX);

    trex.changeAnimation("correndo", trex_correndo);
    //faz o T-Rex correr adicionando velocidade ao solo
    if (pontuacao < 500) {
      solo.velocityX = -(10 + pontuacao / 10);
      //faz o solo voltar ao centro se metade dele sair da tela
    }
    if (solo.x < solo.width / 4) {
      solo.x = solo.width / 2;
    }

    //som a cada 100 pontos
    if (pontuacao > 0 && pontuacao % 100 === 0) {
      somCheckPoint.play();
    }

    //T-Rex pula ao apertar espaço
    if (touches.length > 0 && trex.isTouching(solo) || keyDown('space') && trex.isTouching(solo)) {
      if (pontuacao < 100) {
        trex.velocityY = -15;
      } else {
        trex.velocityY = -30;
      }
      somSalto.play();
    }

    //gravidade
    if (pontuacao < 100) {
      trex.velocityY = trex.velocityY + 1;
    } else {
      trex.velocityY = trex.velocityY + 3;
    }
    //gerar nuvens
    gerarNuvens();
    //gerar obstáculos
    gerarObstaculos();

    //pontuação continua rodando
    pontuacao = pontuacao + Math.round(frameRate() / 60)

    //imagens do fim ficam invisíveis
    fimDoJogo.visible = false;
    reiniciar.visible = false;

    //quando a tecla P é pressionada, o jogo é pausado
    if (keyDown("p")) {
      estadoJogo = PAUSE;
    }

    //quando o trex toca o obstáculo, o jogo se encerra
    if (grupoDeObstaculos.isTouching(trex)) {
      estadoJogo = ENCERRAR;
      //som de morte
      somMorte.play();

      //Trex inteligente
      //trex.velocityY= -12;
      //somSalto.play();
    }
  } else if (estadoJogo === ENCERRAR) {
    //para os sprites em movimento
    grupoDeObstaculos.setVelocityXEach(0);
    trex.velocityY = 0;
    solo.velocityX = 0;
    grupoDeNuvens.setVelocityXEach(0);
    //impede que obstáculos sumam
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);

    //animação de T-Rex colidido
    trex.changeAnimation("colidiu", trex_colidiu);

    //mostrar imagens do fim
    fimDoJogo.visible = true;
    reiniciar.visible = true;

    if (mousePressedOver(reiniciar) || touches.length > 0 || keyDown("space")) {
      if (pontuacao > record) {
        record = pontuacao;
      }
      reinicie();
      touches = [];
    }

  } else if (estadoJogo === PAUSE) {
    pause.visible = true;
    textFont(fonte);
    textSize(txtSize * 2);
    fill("dimgray");
    text("P A U S E D", (windowWidth / 2) - (txtSize * 8), windowHeight / 2 - (windowHeight / 10));
    grupoDeObstaculos.setVelocityXEach(0);
    trex.velocityY = 0;
    solo.velocityX = 0;
    grupoDeNuvens.setVelocityXEach(0);
    //impede que obstáculos sumam
    grupoDeObstaculos.setLifetimeEach(-1);
    grupoDeNuvens.setLifetimeEach(-1);
    //animação de T-Rex parado
    trex.changeAnimation("parado", trex_parado);
    if (keyDown("space") || touches.length > 0) {
      grupoDeObstaculos.setLifetimeEach((windowWidth / solo.velocityX) + 10);
      grupoDeNuvens.setLifetimeEach((windowWidth / 3) + 10);
      touches = [];
      grupoDeNuvens.setVelocityXEach(-3);
      estadoJogo = JOGAR;
    }
  }
}

function gerarNuvens() {
  //gerar sprites de nuvem a cada 60 quadros, com posição Y aleatória
  if (frameCount % 60 === 0) {
    nuvem = createSprite(windowWidth + 10, windowHeight / 2, 40, 10);
    nuvem.y = Math.round(random(windowHeight / 5, windowHeight * 3 / 5));
    //atribuir imagem de nuvem e adequar escala
    nuvem.addImage(imagemDaNuvem);
    nuvem.scale = 0.5;
    //ajustar profundidade da nuvem
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //dar velocidade e direção à nuvem
    nuvem.velocityX = -3;
    //dar tempo de vida à nuvem
    nuvem.lifetime = windowWidth / 3 + 20;
    //adicionar a um grupo
    grupoDeNuvens.add(nuvem);
  }
}

function gerarObstaculos() {
  //criar sprite de obstáculo a cada 40 quadros
  if (frameCount % 30 === 0 && solo.velocityX < -50 || frameCount % 40 === 0 && solo.velocityX < -15 && solo.velocityX >= -50 || frameCount % 100 == 0 && solo.velocityX >= -15) {
    obstaculo = createSprite(windowWidth + 20, windowHeight - 40, 10, 40);
    obstaculo.velocityX = solo.velocityX

    //adicionar imagem ao obstaculo aleatoriamente
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstaculo.addImage(obstaculo1);
        break;
      case 2:
        obstaculo.addImage(obstaculo2);
        break;
      case 3:
        obstaculo.addImage(obstaculo3);
        break;
      case 4:
        obstaculo.addImage(obstaculo4);
        break;
      case 5:
        obstaculo.addImage(obstaculo5);
        break;
      case 6:
        obstaculo.addImage(obstaculo6);
        break;
      default:
        break;
    }
    //atribuir escala e tempo de vida aos obstáculos
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
    //ajustar profundidade da nuvem
    obstaculo.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //adicionar a um grupo
    grupoDeObstaculos.add(obstaculo);
  }
}

function reinicie() {
  estadoJogo = START;
  fimDoJogo.visible = false;
  reiniciar.visible = false;

  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();

  trex.changeAnimation("parado", trex_parado);

  pontuacao = 0;
}
