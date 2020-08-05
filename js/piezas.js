import {UICtrl} from './ppal.js';

export class Pieza {
   constructor(color) {
      this.color = color; //Black, White
   }
   getColor(){
      return this.color;
   }
   getNombrePieza(){
      return this.tipo;
   }
}
export class King extends Pieza {
   constructor(color){
      super(color);
      this.tipo = 'King';
      // this.seMovio = false;
   }
   moveValid(i1,j1,i2,j2){
      const moveNormal = () => {
         const difis = Math.abs(i1-i2);
         const difjs = Math.abs(j1-j2);
         let movNorm = false;
         if (!(difis === 0 && difjs === 0)){
            if (difis <= 1 && difjs <=1){
               movNorm = true;
            }
         }
         return movNorm;
      }
      return (moveNormal());
   }
}
export class Queen extends Pieza {
   constructor(color){
      super(color);
      this.tipo = 'Queen'
   }
   moveValid(i1,j1,i2,j2){
      // si es movimiento como la torre
      let op1 = (i1 === i2) || (j1 === j2);
      // si es movimiento como el alfil
      let op2 = (i1 + j1) === (i2 + j2) || (i1 - j1) === (i2 - j2);
      return (op1 || op2);
   }
}
export class Rook extends Pieza {
   constructor(color){
      super(color);
      this.tipo = 'Rook'
      this.move = false;
   }
   moveValid(i1,j1,i2,j2){
      return (i1 === i2) || (j1 === j2);
   }
   getMoveRook(){
      return this.move;
   }
   setMoveRook(bool){
      this.move = bool;
   }
}
export class Bishop extends Pieza {
   constructor(color){
      super(color);
      this.tipo = 'Bishop'
   }
   moveValid(i1,j1,i2,j2){
      return (i1 + j1) === (i2 + j2) || (i1 - j1) === (i2 - j2);
   }
}
export class Knigth extends Pieza {
   constructor(color){
      super(color);
      this.tipo = 'Knigth'
   }
   moveValid(i1,j1,i2,j2) {
      let op1 = (Math.abs(i1-i2) === 1) && (Math.abs(j1-j2) === 2)
      let op2 = (Math.abs(i1-i2) === 2) && (Math.abs(j1-j2) === 1)
      return op1 || op2;
   }
}
export class Pawn extends Pieza {
   constructor(color){
      super(color);
      this.tipo = 'Pank'
   }
   moveValid(i1,j1,i2,j2,hayPiezaContraria,peonPaso) {
      const avanzeDoble = () => {
         let valid;
         if (this.color === 'White') {
            valid = (i1 === 1) && (i2 === 3) && (j1 === j2)
         }
         else {
            valid = (i1 === 6) && (i2 === 4) && (j1 === j2)
         }
         return valid;
      }
      const avanzeSimple = () => {
         let valid;
         if (this.color === 'White') {
            valid = (i1 === (i2 - 1)) && (j1 === j2)
         }
         else {
            valid = (i1 === (i2 + 1)) && (j1 === j2)
         }
         return valid;
      }
      const comeAlCostado = () => {
         let valid;
         if (this.color === 'White') {
            valid = (i1 === (i2 - 1)) && ((j1 === j2 + 1) || (j1 === (j2 - 1)))
         }
         else {
            valid = (i1 === (i2 + 1)) && ((j1 === j2 + 1) || (j1 === (j2 - 1)))
         }
         return valid;
      }

      //Falta caso de comer al paso
      if (hayPiezaContraria){
         return comeAlCostado();
      }
      else {
         if (peonPaso[2] && j2 === peonPaso[1] && (i1 === 4 || i1 === 3)){
             return comeAlCostado() || avanzeSimple() || avanzeDoble();
         }
         else {
            return avanzeSimple() || avanzeDoble();
         }
      }
   }
}
