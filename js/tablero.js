import {UICtrl} from './ppal.js';
import {Pieza,King,Queen,Rook,Bishop,Knight,Pawn} from './piezas.js';
export class Tablero {
    constructor(){
       this.table = [[],[],[],[],[],[],[],[]];
       this.move = [0,0,null];
       this.activePlayer = 0;
       this.flagPeonPaso = [0,0,false];
       this.moveKings = [false,false]
       this.numberMov = 1;
       this.listOfMoves = '';
       for (var i = 0; i <= 7; i++) {
          for (var j = 0; j <= 7; j++) {
             this.table[i].push(null);
          }
       }
    }
    cloneTable(tableOrig){
      for (var i = 0; i < 8; i++) {
         for (var j = 0; j < 8; j++) {
            if (tableOrig.table[i][j] === null){
               this.table[i][j]  = null;
            }
            else {
               this.table[i][j] = tableOrig.table[i][j];
            }
         }
      }
      this.move = [tableOrig.move[0],tableOrig.move[1],tableOrig.move[2]];
      this.activePlayer = tableOrig.activePlayer;
      this.flagPeonPaso = [tableOrig.flagPeonPaso[0],tableOrig.flagPeonPaso[1],tableOrig.flagPeonPaso[2]];
      this.moveKings = [tableOrig.moveKings[0],tableOrig.moveKings[1]];
      this.numberMov = tableOrig.numberMov;
      this.listOfMoves = tableOrig.listOfMoves;
    }
    initTable(){
       //Fila piezas Blancas
       this.table[0][0] = new Rook('White');
       this.table[0][1] = new Knight('White');
       this.table[0][2] = new Bishop('White');
       this.table[0][3] = new Queen('White');
       this.table[0][4] = new King('White');
       this.table[0][5] = new Bishop('White');
       this.table[0][6] = new Knight('White');
       this.table[0][7] = new Rook('White');
 
       //Fila Peones Blancos
 
       for (var j = 0; j <= 7; j++) {
          this.table[1][j] = new Pawn('White');
       }
 
       //Filas Casillas Vacias
       for (var i = 2; i <= 5; i++) {
          for (var j = 0; j < 8; j++) {
             this.table[i][j] = null;
          }
       }
       //Filas Peones Negros
       for (var j = 0; j <= 7; j++) {
          this.table[6][j] = new Pawn('Black');
       }
       //Filas Piezas Negras
       this.table[7][0] = new Rook('Black');
       this.table[7][1] = new Knight('Black');
       this.table[7][2] = new Bishop('Black');
       this.table[7][3] = new Queen('Black');
       this.table[7][4] = new King('Black');
       this.table[7][5] = new Bishop('Black');
       this.table[7][6] = new Knight('Black');
       this.table[7][7] = new Rook('Black');
    }
    mostrarTablero(){
       for (var i = 0; i <= 7; i++) {
          for (var j = 0; j <= 7; j++) {
             console.log(this.table[i][j]);
          }
       }
    }
    getRecorrido(i1,j1,i2,j2) {
       let recorrido = [];
       //vertical
       if (i1===i2){
          if (j1 < j2) {
             for (let k = j1+1; k < j2; k++) {
                recorrido.push(this.table[i1][k])
             }
          }
          else {
             for (let k = j2+1; k < j1; k++) {
                recorrido.push(this.table[i1][k])
             }
          }
       }
       //horizontal
       else if (j1 === j2) {
          if (i1 < i2) {
             for (let k = i1+1; k < i2; k++) {
                recorrido.push(this.table[k][j1])
             }
          }
          else {
             for (let k = i2+1; k < i1; k++) {
                recorrido.push(this.table[k][j1])
             }
          }
       }
       //Diagonal ascendiente creciente
       let cont;
       if (i1<i2 && j1<j2){
          cont = j1;
          for (let k = i1+1; k < i2; k++) {
             cont++;
             recorrido.push(this.table[k][cont]);
          }
       }
       //Diagonal descendiente creciente
       if (i1>i2 && j1>j2){
          cont = j1;
          for (let k = i1-1; k > i2; k--) {
             cont--;
             recorrido.push(this.table[k][cont]);
          }
       }
       //Diagonal descendiente decreciente
       if (i1>i2 && j1<j2){
          cont = j1;
          for (let k = i1-1; k > i2; k--) {
             cont++;
             recorrido.push(this.table[k][cont]);
          }
       }
       //Diagonal ascendiente decreciente
       if (i1<i2 && j1>j2){
          cont = j1;
          for (let k = i1+1; k < i2; k++) {
             cont--;
             recorrido.push(this.table[k][cont]);
          }
       }
       return recorrido;
    }
    validarTurno(i1,j1,i2,j2) {
       if (this.activePlayer === 0){
          return (this.getPieza(i1,j1).getColor() === 'White');
       }
       else {
          return (this.getPieza(i1,j1).getColor() === 'Black')
       }
    }
    destinoValido (i1,j1,i2,j2) {// verificar si casilla destino hay pieza de mismo color
       let isValid = true;
       if (this.table[i2][j2] !== null) {
         isValid = (this.table[i1][j1].getColor() !== this.table[i2][j2].getColor())
       }
       return isValid;
      
    }
    movPiezaValido (i1,j1,i2,j2) {
       let hayPiezaContraria = this.hayPiezaContraria(i1,j1,i2,j2);
 
       return this.getPieza(i1,j1).moveValid(i1,j1,i2,j2,hayPiezaContraria,this.flagPeonPaso);
    }
    recorridoValido(i1,j1,i2,j2) {
       let valid = true;
       if (this.getPieza(i1,j1).getNombrePieza() !== 'Knight'){
          let reco = this.getRecorrido(i1,j1,i2,j2);
          for (var i = 0; i < reco.length; i++) {
             if (reco[i] !== null ){
                valid = false; break;
             }
          }
       }
       return valid;
    }
    recorridoValidoEnro(i1,j1,i2,j2) {
       let valid = true;
       let fin = 0;
       switch (j2) {
          case 6:
             fin = 7
             break;
          case 2:
             fin = 0
             break;
       }
       let reco = this.getRecorrido(i1,j1,i2,fin);
       for (var i = 0; i < reco.length; i++) {
          if (reco[i] !== null ){
             valid = false; break;
          }
       }
       return valid;
    }
    torreMovida(i1,j1,i2,j2){
       let moveRook = false;
       if (j2 === 6) {
          if (this.getPieza(i1,7).getNombrePieza() === 'Rook'){
             if (this.getPieza(i1,7).getMoveRook()){
                moveRook = true;
             }
          }
          else {
             moveRook = true;
          }
       }
       else if (j2 === 2) {
          if (this.getPieza(i2,0).getNombrePieza() === 'Rook'){
             if (this.getPieza(i2,0).getMoveRook()){
                moveRook = true;
             }
          }
          else {
             moveRook = true;
          }
       }
       return moveRook;
    }
    moveValid(i1,j1,i2,j2) {
       return this.validarTurno(i1,j1,i2,j2) && this.destinoValido(i1,j1,i2,j2) && this.movPiezaValido(i1,j1,i2,j2) && this.recorridoValido(i1,j1,i2,j2);
    }
    hayAtaque(i1,j1,i2,j2){
      return this.destinoValido(i1,j1,i2,j2) && this.movPiezaValido(i1,j1,i2,j2) && this.recorridoValido(i1,j1,i2,j2);
    }
    hayJaque(active){
         let color = (active === 0) ? 'White' : 'Black';
         let jaque = false;
         //localizar rey del color
         let kingOfColor = [0,0];
         for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
              if (this.table[i][j] != null) {
                 if (this.table[i][j].getNombrePieza() === 'King' && this.table[i][j].getColor() === color){
                     kingOfColor[0] = i;
                     kingOfColor[1] = j;
                 }
              }
            }
         }
        
         //buscar todas las piezas que no sean del color y verificar q ninguna tenga un moveValid a esa casilla
         for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
              if (this.table[i][j] != null){
                  if (this.table[i][j].getColor() != color){
                     if (this.hayAtaque(i,j,kingOfColor[0],kingOfColor[1])){
                        jaque = true;
                     }    
                  }        
              } 
            }
         }
        
         return jaque;
    }
    enrocar(i1,j1,i2,j2) {
       const esValidoEnroque = (i1,j1,i2,j2) => {
          let esValMove = this.validarTurno(i1,j1,i2,j2) && this.destinoValido (i1,j1,i2,j2) && this.recorridoValidoEnro(i1,j1,i2,j2) && !this.torreMovida(i1,j1,i2,j2);
          let moveKing = true;
          if (i1 === 0){ moveKing = this.moveKings[0] }
          else if (i1 === 7) { moveKing = this.moveKings[1] }
 
          return esValMove && !moveKing ;
       }
      
       let enroque = false;
       if (this.getPieza(i1,j1).getNombrePieza() === 'King'){
          if (i1 === 0 && j1 === 4) {
             if (j2 === 6 && i2 === 0 && esValidoEnroque(0,4,0,6)){// ENROQUE CORTO BLANCO
                this.setPieza(0,6,this.getPieza(0,4));
                UICtrl.move(0,4,0,6);
                this.setPieza(0,4,null); UICtrl.delete(0,4);
 
                this.setPieza(0,5,this.getPieza(0,7));
                UICtrl.move(0,7,0,5);
                this.setPieza(0,7,null); UICtrl.delete(0,7);
                enroque = true;
                this.listOfMoves += ' ' + this.numberMov + '. ' + 'O-O';
                
             }
             else if (j2 === 2 && i2 === 0 && esValidoEnroque(0,4,0,2)){// ENROQUE LARGO BLANCO
                this.setPieza(0,2,this.getPieza(0,4));
                UICtrl.move(0,4,0,2);
                this.setPieza(0,4,null); UICtrl.delete(0,4);
 
                this.setPieza(0,3,this.getPieza(0,0));
                UICtrl.move(0,0,0,3);
                this.setPieza(0,0,null); UICtrl.delete(0,0);
                enroque = true;
                this.listOfMoves += ' ' + this.numberMov + '. ' + 'O-O-O';
             }
          }
          else if (i1 === 7 && j1 === 4){
             
             if (j2 === 6 && i2 === 7 && esValidoEnroque(7,4,7,6)){// ENROQUE CORTO NEGRO
               
               this.setPieza(7,6,this.getPieza(7,4));
                UICtrl.move(7,4,7,6);
                this.setPieza(7,4,null); UICtrl.delete(7,4);
 
                this.setPieza(7,5,this.getPieza(7,7));
                UICtrl.move(7,7,7,5);
                this.setPieza(7,7,null); UICtrl.delete(7,7);
                enroque = true;
                this.listOfMoves += ' O-O'
                this.numberMov++; 
                
             }
             else if (j2 === 2  && i2 === 7 && esValidoEnroque(7,4,7,2)){// ENROQUE LARGO NEGRO
                this.setPieza(7,2,this.getPieza(7,4));
                UICtrl.move(7,4,7,2);
                this.setPieza(7,4,null); UICtrl.delete(7,4);
 
                this.setPieza(7,3,this.getPieza(7,0));
                UICtrl.move(7,0,7,3);
                this.setPieza(7,0,null); UICtrl.delete(7,0);
                enroque = true;
                this.listOfMoves += ' O-O-O '
                this.numberMov++;
             }
          }
       }
       UICtrl.actPng(this.listOfMoves);
       return enroque;
    }
    enrocarAux(i1,j1,i2,j2) {
      const esValidoEnroque = (i1,j1,i2,j2) => {
         let esValMove = this.validarTurno(i1,j1,i2,j2) && this.destinoValido (i1,j1,i2,j2) && this.recorridoValidoEnro(i1,j1,i2,j2) && !this.torreMovida(i1,j1,i2,j2);
         let moveKing = true;
         if (i1 === 0){ moveKing = this.moveKings[0] }
         else if (i1 === 7) { moveKing = this.moveKings[1] }

         return esValMove && !moveKing ;
      }

      let enroque = false;
      if (this.getPieza(i1,j1).getNombrePieza() === 'King'){
         if (i1 === 0 && j1 === 4) {
            if (j2 === 6 && i2 === 0 && esValidoEnroque(0,4,0,6)){// ENROQUE CORTO BLANCO
               this.setPieza(0,6,this.getPieza(0,4));
               this.setPieza(0,4,null); 

               this.setPieza(0,5,this.getPieza(0,7));
               
               this.setPieza(0,7,null); 
               enroque = true;
               this.listOfMoves += ' ' + this.numberMov + '. ' + 'O-O';
            }
            else if (j2 === 2 && i2 === 0 && esValidoEnroque(0,4,0,2)){// ENROQUE LARGO BLANCO
               this.setPieza(0,2,this.getPieza(0,4));
               this.setPieza(0,4,null); 
               this.setPieza(0,3,this.getPieza(0,0));
              
               this.setPieza(0,0,null); 
               enroque = true;
               this.listOfMoves += ' ' + this.numberMov + '. ' + 'O-O-O';
            }
         }
         else if (i1 === 7 && j1 === 4){
            if (j2 === 6 && i2 === 7 && esValidoEnroque(7,4,7,6)){// ENROQUE CORTO NEGRO
               this.setPieza(7,6,this.getPieza(7,4));
              
               this.setPieza(7,4,null); 

               this.setPieza(7,5,this.getPieza(7,7));
              
               this.setPieza(7,7,null); 
               enroque = true;
               this.listOfMoves += ' O-O'
               this.numberMov++; 
              
            }
            else if (j2 === 2  && i2 === 7 && esValidoEnroque(7,4,7,2)){// ENROQUE LARGO NEGRO
               this.setPieza(7,2,this.getPieza(7,4));
               
               this.setPieza(7,4,null); 

               this.setPieza(7,3,this.getPieza(7,0));
               
               this.setPieza(7,0,null); 
               enroque = true;
               this.listOfMoves += ' O-O-O '
               this.numberMov++;
            }
         }
      }
      
      return enroque;
   }
    enListarMov(i1,j1,i2,j2,pieza){
      
      let nomPieza = pieza.getNombrePieza();
      let pieceLetter = '';
      if (nomPieza === 'Knight') {
         pieceLetter = 'N'
      }
      else {
         if (nomPieza != 'Pank') {
            pieceLetter = nomPieza[0];
         }
      }
      

      let colMove = '';
      switch (j2){
         case 0: colMove = 'a';break;
         case 1: colMove = 'b';break;
         case 2: colMove = 'c';break;
         case 3: colMove = 'd';break;
         case 4: colMove = 'e';break;
         case 5: colMove = 'f';break;
         case 6: colMove = 'g';break;
         case 7: colMove = 'h';break;
      }






      let eat = '';
      if (this.getPieza(i2,j2) != null) {   
         if (nomPieza === 'Pank'){
            switch (j1){
                  case 0: eat = 'a';break;
                  case 1: eat = 'b';break;
                  case 2: eat = 'c';break;
                  case 3: eat = 'd';break;
                  case 4: eat = 'e';break;
                  case 5: eat = 'f';break;
                  case 6: eat = 'g';break;
                  case 7: eat = 'h';break;
               }
         }
         eat += 'x';
      }
      else {
         if (nomPieza === 'Pank' && j1 != j2){
            switch (j1){
                  case 0: eat = 'a';break;
                  case 1: eat = 'b';break;
                  case 2: eat = 'c';break;
                  case 3: eat = 'd';break;
                  case 4: eat = 'e';break;
                  case 5: eat = 'f';break;
                  case 6: eat = 'g';break;
                  case 7: eat = 'h';break;
               }
            eat += 'x';
         }
      }







      if (pieza.getColor() != 'Black'){
         this.listOfMoves += ` ${this.numberMov}. ${pieceLetter}${eat}${colMove}${i2+1}`;
      }
      else {
         this.listOfMoves += ` ${pieceLetter}${eat}${colMove}${i2+1}`;
      }
      
      UICtrl.actPng(this.listOfMoves);
    
    }
    moverPieza(i1,j1,i2,j2,pieza){
       if (pieza.getNombrePieza() === 'King'){
          if (pieza.getColor() === 'White') {
             this.moveKings[0] = true;
          }
          else {
             this.moveKings[1] = true;
          }
       }
       else if (pieza.getNombrePieza() === 'Rook'){
          pieza.setMoveRook(true);
       }
       
       this.enListarMov(i1,j1,i2,j2,pieza);
       this.setPieza(i2,j2,pieza);
       this.setPieza(i1,j1,null);
       if (pieza.getColor() === 'Black') {
            this.numberMov++;
       }
       UICtrl.move(i1,j1,i2,j2);
       if (pieza.getNombrePieza() === 'Pank'){ //si hay coronacion
            if (i2 === 7 || i2 === 0) {
                this.coronar(i2,j2,pieza.getColor())
            }
       }    
    }
    moverPiezaAux(i1,j1,i2,j2,pieza){
      if (pieza.getNombrePieza() === 'King'){
         if (pieza.getColor() === 'White') {
            this.moveKings[0] = true;
         }
         else {
            this.moveKings[1] = true;
         }
      }
      else if (pieza.getNombrePieza() === 'Rook'){
         pieza.setMoveRook(true);
      }
      
      this.setPieza(i2,j2,pieza);
      this.setPieza(i1,j1,null);
      if (pieza.getColor() === 'Black') {
           this.numberMov++;
      }
      
      if (pieza.getNombrePieza() === 'Pank'){ //si hay coronacion
           if (i2 === 7 || i2 === 0) {
               this.coronar(i2,j2,pieza.getColor())
           }
      }    
   }
    specialMovePank(move,i,j,pieza){
        if (move[2].getNombrePieza() === 'Pank'){
            
            let color = this.getPieza(move[0],move[1]).getColor();
            if (move[0] === 1 && i === 3 || move[0] === 6 && i === 4) {//si es paso doble
                    this.setFlagPeonPaso(i,j,true);
            }
            else if (move[0] === 4 && j !== move[1] && pieza === null) {//si comio al paso y es blanca
                this.setPieza(i-1,j,null); UICtrl.delete(i-1,j);
            }
            else if (move[0] === 3 && (j !== move[1] && pieza === null)){//si comio al paso y es negra
                this.setPieza(i+1,j,null); UICtrl.delete(i+1,j);
              
            }
        }    
    }   
    coronar(i,j,color){
        let pieza = prompt();
        switch (pieza) {
            case 'Rook': 
                    this.table[i][j] = new Rook(color);
                    this.listOfMoves += '=R';
                    break;
            case 'Bishop': 
                    this.table[i][j] = new Bishop(color);
                    this.listOfMoves += '=B';
                    break;
            case 'Knight': 
                    this.table[i][j] = new Knight(color);
                    this.listOfMoves += '=N';
                    break;
            default: 
                    this.table[i][j] = new Queen(color);
                    pieza = 'Queen';
                    this.listOfMoves += '=Q';
                    break;

        }
        UICtrl.set(i,j,color,pieza);
        UICtrl.actPng(this.listOfMoves);
  
    }
    getPieza(i,j){
       return this.table[i][j];
    }
    setPieza(i,j,valor){
       this.table[i][j] = valor;
    }
    getMove(){
       return this.move;
    }
    setMove(i,j,valor){
       this.move = [i,j,valor];
    }
    hayPiezaContraria(i1,j1,i2,j2){
       let hayPiezaCont = false;
       if (this.getPieza(i2,j2) !== null){
          if (this.getPieza(i1,j1).getColor() !== this.getPieza(i2,j2).getColor() ){
             hayPiezaCont = true;
          }
       }
       return hayPiezaCont
    }
    changePlayer(){
       this.activePlayer === 0 ? this.activePlayer = 1: this.activePlayer = 0;
    }
   
    getFlagPeonPaso(){
       return this.flagPeonPaso;
    }
    setFlagPeonPaso(i,j,bool){
       this.flagPeonPaso[0] = i;
       this.flagPeonPaso[1] = j;
       this.flagPeonPaso[2] = bool;
    }
 
 }
 