import {Pieza,King,Queen,Rook,Bishop,Knigth,Pawn} from './piezas.js';
import {Tablero} from './tablero.js';
const UIController = () => {
   return {
      move: (i1,j1,i2,j2) => {
         let origen = document.getElementById(i1.toString()+j1.toString());
         let aux = origen.innerHTML;
         console.log(aux);
         origen.innerHTML = '';
         document.getElementById(i2.toString()+j2.toString()).innerHTML = aux;
      },
      set: (i,j,color,p) => {
         let aux = '';
         let pepe;
         if (color === 'White'){
            switch (p) {
               case 'Queen': aux = '<img src="img/white-queen.png" alt="Q">';break;
               case 'Rook': aux = '<img src="img/white-rook.png" alt="R">';break;
               case 'Bishop': aux = '<img src="img/white-bishop.png" alt="B">';break;
               case 'Knigth': aux = '<img src="img/white-knigth.png" alt="N">';break;
            }

         }
         else if (color === 'Black') {
            switch (p) {
               case 'Queen': aux = '<img src="img/black-queen.png" alt="Q">';break;
               case 'Rook': aux = '<img src="img/black-rook.png" alt="R">';break;
               case 'Bishop': aux = '<img src="img/black-bishop.png" alt="B">';break;
               case 'Knigth': aux = '<img src="img/black-knigth.png" alt="N">';break;
            }
         }
         console.log(aux);
         document.getElementById(i.toString()+j.toString()).innerHTML = aux;
         

      },
      delete: (i,j) => {
         document.getElementById(i.toString()+j.toString()).innerHTML = '';
      }
   }
}
const controller = () => {
   const jugar = (i,j) => {
         let pieza = table.getPieza(i,j);
         let move = table.getMove();
         if (move[2] === null) {// primer click
            if (pieza !== null){
               table.setMove(i,j,table.getPieza(i,j));
            }
         }
         else { //segundo click
               let enro = table.enrocar(move[0],move[1],i,j);
               if (enro) {
                     table.setFlagPeonPaso(0,0,false);
                     table.changePlayer();
               }
               else if (table.moveValid(move[0],move[1],i,j)) {
                     table.setFlagPeonPaso(0,0,false);
                     table.specialMovePank(move,i,j,move[2]);
                     table.moverPieza(move[0],move[1],i,j,move[2]);
                     table.changePlayer();
               }
               table.setMove(0,0,null);
         }
   }
   const setupEventListener = () => {
      let casillas  = document.querySelectorAll('.casilla');
      for (let k = 0; k < casillas.length; k++) {
         casillas[k].addEventListener('click', () => {
            let j = k % 8;
            let i = 7 - Math.floor(k / 8);
            jugar(i,j);
         });
      }

   }
   let table = new Tablero();
   table.initTable();
   setupEventListener();

}
export let UICtrl = UIController();
controller();
