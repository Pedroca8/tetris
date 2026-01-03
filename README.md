# 🎮 O que aprendi neste projeto – Jogo Tetris em JavaScript

Neste projeto desenvolvi um **jogo completo estilo Tetris**, utilizando **JavaScript puro**, **Canvas API** e **lógica avançada de programação**, focado em performance, organização de código e experiência do usuário.

## ✅ Habilidades e conhecimentos adquiridos

- (x) Desenvolvimento de **jogos 2D utilizando HTML5 Canvas**
- (x) Manipulação direta do **Canvas API** para desenho de elementos gráficos
- (x) Implementação de **lógica de jogo (game loop)** com `setInterval`
- (x) Controle de **estado global do jogo** (pause, game over, score, velocidade)
- (x) Criação de **sistema de grid bidimensional (matriz)** para controle de peças
- (x) Trabalhar com **arrays e matrizes** para representar peças e cenários
- (x) Desenvolvimento de **sistema de colisão** entre peças e limites do jogo
- (x) Implementação de **movimentação de objetos** (esquerda, direita e queda)
- (x) Sistema de **rotação de peças utilizando transposição de matriz**
- (x) Validação de movimentos para evitar bugs e colisões inválidas
- (x) Criação de **peças dinâmicas com tamanhos e formatos diferentes**
- (x) Implementação de **pré-visualização da próxima peça**
- (x) Desenvolvimento de **sistema de pontuação baseado em regras do Tetris**
- (x) Detecção e remoção de **linhas completas**
- (x) Aumento progressivo da **dificuldade com base na pontuação**
- (x) Controle de **velocidade dinâmica do jogo**
- (x) Implementação de **eventos de teclado** para controle do jogador
- (x) Controle de aceleração ao segurar teclas (ArrowDown)
- (x) Implementação de **sistema de pausa**
- (x) Criação de **mensagens de estado** (PAUSADO / GAME OVER)
- (x) Manipulação dinâmica do **DOM com JavaScript**
- (x) Criação e injeção de **CSS via JavaScript**
- (x) Escrita de código modular e organizado por responsabilidades
- (x) Uso de boas práticas de **clean code em JavaScript**

### 🧠 Conceitos avançados aplicados

- Lógica de jogos
- Algoritmos de verificação de colisão
- Manipulação de matrizes
- Controle de tempo e loops
- Performance em JavaScript
- Estados finitos de aplicação
- Interação entre Canvas e DOM
- Programação orientada a lógica

#### 💼 Competências profissionais demonstradas

- JavaScript Avançado
- Desenvolvimento Front-end
- Game Development básico
- Lógica de programação sólida
- Resolução de problemas complexos
- Criação de sistemas interativos
- Manipulação gráfica com Canvas
- Código escalável e organizado

##### 🎯 Aplicação prática no mercado

Este projeto demonstra capacidade para atuar em:
- Desenvolvimento Front-end
- Criação de jogos em JavaScript
- Aplicações interativas
- Dashboards e sistemas visuais
- Projetos que exigem forte lógica de programação
- Empresas que valorizam resolução de problemas e código limpo

---
 
`javascript avançado`, `jogo em javascript`, `html5 canvas`, `frontend developer`, `lógica de programação`, `game development`, `desenvolvedor javascript`, `aplicações interativas`





###### teste de codigo

```javascript
const bloco = document.getElementById('js-box');
const velocidae = 10;

let psY = 0;
let psX = 0;

document.addEventListener('keydown', (event)=> {
    switch(event.key) {
        case 'ArrowUp': 
            psY -= velocidae;/*⬆️*/
        break;
        case  'ArrowDown':
            psY += velocidae; /*⬇️*/
        break;
        case 'ArrowLeft':
            psX -= velocidae; /*⬅️*/
        break;
        case 'ArrowRight':
            psX += velocidae; /*➡️*/
        break;
    }
    bloco.style.left = psX + 'px';
    bloco.style.top = psY + 'px';

})
