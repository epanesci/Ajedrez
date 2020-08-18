import {Pieza,King,Queen,Rook,Bishop,Knight,Pawn} from './piezas.js';
import {Tablero} from './tablero.js';
const UIController = () => {// metodos controlan la interfaz
   return {
      move: (i1,j1,i2,j2) => { //mover pieza en la interfaz grafica
         let origen = document.getElementById(i1.toString()+j1.toString());
         let aux = origen.innerHTML;
         origen.innerHTML = '';
         document.getElementById(i2.toString()+j2.toString()).innerHTML = aux;
      },
      set: (i,j,color,p) => { //poner una pieza en un lugar determinado de la interfaz (se usa para coronacion o movimientos especiales)
         let aux = '';
         if (color === 'White'){
            switch (p) {
               case 'Queen': aux = '<img src="img/white-queen.png" alt="Q">';break;
               case 'Rook': aux = '<img src="img/white-rook.png" alt="R">';break;
               case 'Bishop': aux = '<img src="img/white-bishop.png" alt="B">';break;
               case 'Knight': aux = '<img src="img/white-Knight.png" alt="N">';break;
               case 'King': aux = '<img src="img/white-king.png" alt="N">';break;
               case 'KingAtack': aux = '<img src="img/white-king-atack.png" alt="N">';break;
            }

         }
         else if (color === 'Black') {
            switch (p) {
               case 'Queen': aux = '<img src="img/black-queen.png" alt="Q">';break;
               case 'Rook': aux = '<img src="img/black-rook.png" alt="R">';break;
               case 'Bishop': aux = '<img src="img/black-bishop.png" alt="B">';break;
               case 'Knight': aux = '<img src="img/black-Knight.png" alt="N">';break;
               case 'King': aux = '<img src="img/black-king.png" alt="N">';break;
               case 'KingAtack': aux = '<img src="img/black-king-atack.png" alt="N">';break;
            }
         }
         document.getElementById(i.toString()+j.toString()).innerHTML = aux;
      },
      delete: (i,j) => { //eliminar una pieza de la interfaz del tablero
         document.getElementById(i.toString()+j.toString()).innerHTML = '';
      },
      actPgn: (listOfMoves) => { //actualiza la lista de movimiento en la interfaz
         document.getElementById('containerPNG').innerHTML = listOfMoves;
      }
   }
}
const controller = () => {
   const jugar = (i,j) => {
         let pieza = table.getPieza(i,j);
         let move = table.getMove();  
         //move: se utiliza como memoria auxiliar para mover las piezas y 
         //poder cancerlar el movimiento si es invalido y facilitar los controles
         
         if (move[2] === null) {       // primer click
            if (pieza !== null){
               table.setMove(i,j,table.getPieza(i,j));
            }
         }
         else {                        //segundo click
               let tableAux = new Tablero();
               tableAux.cloneTable(table); //tableAux se crea tablero clon para verificar 
               //que no quedemos en jaque al mover una pieza y no tener q volver atras en el tablero original
               let enro = tableAux.enrocarAux(tableAux.move[0],tableAux.move[1],i,j);
               if (enro) {             // si el movimiento es enroque
                  if (!tableAux.hayJaque(tableAux.activePlayer)){
                     table.enrocar(table.move[0],table.move[1],i,j);
                     table.setFlagPeonPaso(0,0,false);
                     table.changePlayer();
                  }
               }
               else if (table.moveValid(move[0],move[1],i,j)) {   // si el movimiento es "normal" y valido
                  tableAux.moverPiezaAux(tableAux.move[0],tableAux.move[1],i,j,tableAux.move[2]);
                  if (!tableAux.hayJaque(tableAux.activePlayer)){ //se hace una prueba para verificar de no quedar en jaque
                     table.setFlagPeonPaso(0,0,false);
                     table.specialMovePank(move,i,j,pieza);
                     table.moverPieza(move[0],move[1],i,j,move[2]);
                     table.checkKing(table.activePlayer,false);
                     table.changePlayer();  
                     if (table.hayJaque(table.activePlayer)){ //si el moviemiento probocó un jaque al equipo contrario
                        table.listOfMoves += '+';
                        UICtrl.actPgn(table.listOfMoves);
                        table.checkKing(table.activePlayer,true);
                     }     
                  }    
               }
               table.setMove(0,0,null); //se vuelve a valores iniciales a la memoria auxiliar
            }
   }
   const setupEventListener = () => {//se utiliza para saber en q casilla hizo click el usuario
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
