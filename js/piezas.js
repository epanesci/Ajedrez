import {UICtrl} from './ppal.js';

export class Pieza {
   constructor(color) {
      this.color = color; //Black, White
   }
   getColor() { return this.color }
   getNombrePieza() { return this.tipo }
}
export class King extends Pieza {
   constructor(color){
      super(color); this.tipo = 'King';
   }
   moveValid(i1,j1,i2,j2){
      const moveNormal = () => {
         const difis = Math.abs(i1-i2); const difjs = Math.abs(j1-j2);
         let movNorm = false;
         if (!(difis === 0 && difjs === 0)){
            if (difis <= 1 && difjs <=1){ movNorm = true }
         }
         return movNorm;
      }
      return (moveNormal());
   }
}
export class Queen extends Pieza {
   constructor(color){
      super(color); this.tipo = 'Queen'
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
   moveValid(i1,j1,i2,j2){ return (i1 === i2) || (j1 === j2) }
   getMoveRook(){ return this.move }
   setMoveRook(bool){ this.move = bool }
}
export class Bishop extends Pieza {
   constructor(color){
      super(color); this.tipo = 'Bishop'
   }
   moveValid(i1,j1,i2,j2){ return (i1 + j1) === (i2 + j2) || (i1 - j1) === (i2 - j2) }
}
export class Knight extends Pieza {
   constructor(color){
      super(color); this.tipo = 'Knight'
   }
   moveValid(i1,j1,i2,j2) {
      let op1 = (Math.abs(i1-i2) === 1) && (Math.abs(j1-j2) === 2)
      let op2 = (Math.abs(i1-i2) === 2) && (Math.abs(j1-j2) === 1)
      return op1 || op2;
   }
}
export class Pawn extends Pieza {
   constructor(color){
      super(color); this.tipo = 'Pank'
   }
   moveValid(i1,j1,i2,j2,hayPiezaContraria,peonPaso) {
      const avanzeDoble = () => {
         let esPasoDoble;
         if (j1 === j2){esPasoDoble = (this.color === 'White') ? (i1 === 1) && (i2 === 3): (i1 === 6) && (i2 === 4)}
         return esPasoDoble;
      }
      const avanzeSimple = () => {
         return (this.color === 'White') ? (i1 === (i2 - 1)) && (j1 === j2) : (i1 === (i2 + 1)) && (j1 === j2);
      }
      const comeAlCostado = () => {
         return (this.color === 'White') ? (i1 === (i2 - 1)) && ((j1 === j2 + 1) || (j1 === (j2 - 1)))
         : (i1 === (i2 + 1)) && ((j1 === j2 + 1) || (j1 === (j2 - 1)));
      }
      if (!hayPiezaContraria) {
         if (peonPaso[2] && j2 === peonPaso[1] && (i1 === 4 || i1 === 3)) { return true }//come al paso
         else { return avanzeSimple() || avanzeDoble() }
      } 
      else { return comeAlCostado() }
   }
}
