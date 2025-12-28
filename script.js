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
