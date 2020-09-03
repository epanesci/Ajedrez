import {UICtrl} from './ppal.js';
import {Pieza,King,Queen,Rook,Bishop,Knight,Pawn} from './piezas.js';
export class Tablero {
    //Constructors

   constructor(){
       this.table = [[],[],[],[],[],[],[],[]]; //es una matriz q simula un tablero de ajedrez
       this.move = [0,0,null];//variable auxiliar para ayudar a hacer verificaciones antes de realizar el movimiento
       this.activePlayer = 0;//determina el turno (0 si es blancas y 1 si es negras)
       this.flagPeonPaso = [0,0,false];//es una bandera q se activa cuando es posible comer al paso y guarda q posicion es
       this.moveKings = [false,false];//sirve para controlar si es rey se movio o no para validar el enroque 
       this.numberMov = 1; //lleva un contador de lo movimientos de cada jugador para mostrar en el PGN
       this.listOfMoves = ''; //PGN (listado de movimientos segun anotacion oficial de ajedrez)
      
   }
   cloneTable(tableOrig){//clona el tablero para poder hacer una simulacion para no quedar en jaque en la proxima jugada
      for (var i = 0; i < 8; i++) {
         for (var j = 0; j < 8; j++) { this.table[i][j] = tableOrig.table[i][j] }
      }
      this.move = [tableOrig.move[0],tableOrig.move[1],tableOrig.move[2]];
      this.activePlayer = tableOrig.activePlayer;
      this.flagPeonPaso = [tableOrig.flagPeonPaso[0],tableOrig.flagPeonPaso[1],tableOrig.flagPeonPaso[2]];
      this.moveKings = [tableOrig.moveKings[0],tableOrig.moveKings[1]];
      this.numberMov = tableOrig.numberMov;
      this.listOfMoves = tableOrig.listOfMoves;
   }
   initTable(){//inicializa el tablero en la formacion tradicional de ajedrez
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
 
       for (var j = 0; j <= 7; j++) { this.table[1][j] = new Pawn('White') }
 
       //Filas Casillas Vacias
       for (var i = 2; i <= 5; i++) {
          for (var j = 0; j < 8; j++) { this.table[i][j] = null }
       }
       //Filas Peones Negros
       for (var j = 0; j <= 7; j++) { this.table[6][j] = new Pawn('Black') }
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

   //Geters
   
   getPieza(i,j){ return this.table[i][j] }
   getMove(){ return this.move }
   getFlagPeonPaso(){ return this.flagPeonPaso }
   hayPiezaContraria(i1,j1,i2,j2){
      let hayPiezaCont;
      if (this.getPieza(i2,j2) !== null){
         hayPiezaCont = this.getPieza(i1,j1).getColor() !== this.getPieza(i2,j2).getColor();
      }
      return hayPiezaCont;
   }
   getRecorrido(i1,j1,i2,j2) {
       let recorrido = [];
       //vertical
       if (i1===i2){
          if (j1 < j2) {
             for (let k = j1+1; k < j2; k++) { recorrido.push(this.table[i1][k]) }
          }
          else {
             for (let k = j2+1; k < j1; k++) { recorrido.push(this.table[i1][k]) }
          }
       }
       //horizontal
       else if (j1 === j2) {
          if (i1 < i2) {
             for (let k = i1+1; k < i2; k++) { recorrido.push(this.table[k][j1]) }
          }
          else {
             for (let k = i2+1; k < i1; k++) { recorrido.push(this.table[k][j1]) }
          }
       }
       //Diagonal ascendiente creciente
       let cont;
       if (i1<i2 && j1<j2){
          cont = j1;
          for (let k = i1+1; k < i2; k++) { cont++; recorrido.push(this.table[k][cont]) }
       }
       //Diagonal descendiente creciente
       if (i1>i2 && j1>j2){
          cont = j1;
          for (let k = i1-1; k > i2; k--) { cont--; recorrido.push(this.table[k][cont]) }
       }
       //Diagonal descendiente decreciente
       if (i1>i2 && j1<j2){
          cont = j1;
          for (let k = i1-1; k > i2; k--) { cont++; recorrido.push(this.table[k][cont]);
          }
       }
       //Diagonal ascendiente decreciente
       if (i1<i2 && j1>j2){
          cont = j1;
          for (let k = i1+1; k < i2; k++) { cont--; recorrido.push(this.table[k][cont]) }
       }
       return recorrido;
   }
   validarTurno(i1,j1,i2,j2) {//valida el movimiento en funcion de si es o no su turno
       if (this.activePlayer === 0){ return (this.getPieza(i1,j1).getColor() === 'White') }
       else { return (this.getPieza(i1,j1).getColor() === 'Black') }
   }
   destinoValido (i1,j1,i2,j2) {// verificar que en la casilla destino no haya una pieza de mismo color
       let isValid = true;
       if (this.table[i2][j2] !== null) {
         isValid = (this.table[i1][j1].getColor() !== this.table[i2][j2].getColor())
       }
       return isValid;
   }
   movPiezaValido (i1,j1,i2,j2) {//verifica si el movimiento es valido para una pieza en particular
       let hayPiezaContraria = this.hayPiezaContraria(i1,j1,i2,j2);
       return this.getPieza(i1,j1).moveValid(i1,j1,i2,j2,hayPiezaContraria,this.flagPeonPaso);
   }
   recorridoValido(i1,j1,i2,j2) {
      //verifica que no haya piezas en el camino para ayudar a verificar si el mov es valido (excepto caballo)
       let valid = true;
       if (this.getPieza(i1,j1).getNombrePieza() !== 'Knight'){
          let reco = this.getRecorrido(i1,j1,i2,j2);
          for (var i = 0; i < reco.length; i++) {
             if (reco[i] !== null ){ valid = false; break }
          }
       }
       return valid;
   }
   recorridoValidoEnro(i1,j1,i2,j2) {//verifica que no haya ninguna pieza entre torre y rey (ayuda a verficar si el enroque es posible)
       let valid = true;
       let fin = 0;
       switch (j2) {
          case 6: fin = 7; break;
          case 2: fin = 0; break;
       }
       let reco = this.getRecorrido(i1,j1,i2,fin);
       for (var i = 0; i < reco.length; i++) {
          if (reco[i] !== null ){ valid = false; break }
       }
       return valid;
   }
   
   moveValid(i1,j1,i2,j2) {//verifica todos los criterios para determinar si un movimiento "normal" es valido 
       return this.validarTurno(i1,j1,i2,j2) && this.destinoValido(i1,j1,i2,j2) && this.movPiezaValido(i1,j1,i2,j2) && this.recorridoValido(i1,j1,i2,j2);
   }
   hayAtaque(i1,j1,i2,j2){//verifica si alguna pieza esta atacando a una casilla en particular
      return this.destinoValido(i1,j1,i2,j2) && this.movPiezaValido(i1,j1,i2,j2) && this.recorridoValido(i1,j1,i2,j2);
   }
   buscarAtaque(i2,j2,color){
      let atack = false;
      for (let i = 0; i < 8; i++){
         for (let j = 0; j < 8; j++){
           if (this.table[i][j] != null){
               if (this.table[i][j].getColor() != color){
                  if (this.hayAtaque(i,j,i2,j2)){ atack = true }    
               }        
           } 
         }
      }
      return atack;
   }
   hayJaque(active){//verifica si en la posicion hay o no jaque al rey del jugador activo en ese momento
         let color = (active === 0) ? 'White' : 'Black';
         let jaque = false;
         //localizar rey del color
         let kingOfColor = this.searchKing(color);
         //buscar todas las piezas que no sean del color y verificar q ninguna tenga un moveValid a esa casilla
         jaque = this.buscarAtaque(kingOfColor[0],kingOfColor[1],color)
         return jaque;
   }
   searchKing(color){//devuelve la posicion del rey de un determinado color
      let positionKing;
      for (let i = 0; i < 8; i++){
         for (let j = 0; j < 8; j++){
           if (this.table[i][j] != null && this.table[i][j].getNombrePieza() === 'King' && this.table[i][j].getColor()=== color){ positionKing = [i,j] }
         }
      }
      return positionKing;
   }

   //Seters
    
   enrocar (i1,j1,i2,j2) {//verifica si el movimiento es enroque y lo realiza caso afirmativo
      const torreMovida = (i1, j1, i2, j2) => {//verifica si una torre fue o no movida (para evaluar si es posible un enroque)
         let esquina = 7; let moveRook = false;
         if (j2 === 2) { esquina = 0 }
         if (this.getPieza(i2, esquina).getNombrePieza() === 'Rook') {
            if (this.getPieza(i2, esquina).getMoveRook()) { moveRook = true }
         }
         else { moveRook = true }
         return moveRook;
      }
      const esValidoEnroque = (i1, j1, i2, j2) => {
         let esValMove = this.validarTurno(i1, j1, i2, j2) && this.destinoValido(i1, j1, i2, j2) && this.recorridoValidoEnro(i1, j1, i2, j2) && !torreMovida(i1, j1, i2, j2);
         let moveKing = true;
         if (i1 === 0) { moveKing = this.moveKings[0] }
         else if (i1 === 7) { moveKing = this.moveKings[1] }
         return esValMove && !moveKing;
      }
      let enroque = false;
      if (this.getPieza(i1, j1).getNombrePieza() === 'King' && esValidoEnroque(i1, j1, i2, j2)) {
         if (i1 === 0 && j1 === 4) {
            if (i2 === 0 && j2 === 6 ) {// ENROQUE CORTO BLANCO
               if (!this.buscarAtaque(0, 4, 'White') && !this.buscarAtaque(0, 5, 'White') && !this.buscarAtaque(0, 6, 'White')) {
                  this.setPieza(0, 6, this.getPieza(0, 4)); UICtrl.move(0, 4, 0, 6);
                  this.setPieza(0, 4, null); UICtrl.delete(0, 4);
                  this.setPieza(0, 5, this.getPieza(0, 7)); UICtrl.move(0, 7, 0, 5);
                  this.setPieza(0, 7, null); UICtrl.delete(0, 7);
                  enroque = true; this.listOfMoves += ' ' + this.numberMov + '. ' + 'O-O';
               }
            }
            else if (j2 === 2 && i2 === 0) {// ENROQUE LARGO BLANCO
               if (!this.buscarAtaque(0, 2, 'White') && !this.buscarAtaque(0, 3, 'White') && !this.buscarAtaque(0, 4, 'White')) {
                  this.setPieza(0, 2, this.getPieza(0, 4)); UICtrl.move(0, 4, 0, 2);
                  this.setPieza(0, 4, null); UICtrl.delete(0, 4);
                  this.setPieza(0, 3, this.getPieza(0, 0)); UICtrl.move(0, 0, 0, 3);
                  this.setPieza(0, 0, null); UICtrl.delete(0, 0);
                  enroque = true; this.listOfMoves += ' ' + this.numberMov + '. ' + 'O-O-O';
               }
            }
         }
         else if (i1 === 7 && j1 === 4) {
            if (j2 === 6 && i2 === 7) {// ENROQUE CORTO NEGRO
               if (!this.buscarAtaque(7, 4, 'Black') && !this.buscarAtaque(7, 5, 'Black') && !this.buscarAtaque(7, 6, 'Black')) {
                  this.setPieza(7, 6, this.getPieza(7, 4)); UICtrl.move(7, 4, 7, 6);
                  this.setPieza(7, 4, null); UICtrl.delete(7, 4);
                  this.setPieza(7, 5, this.getPieza(7, 7)); UICtrl.move(7, 7, 7, 5);
                  this.setPieza(7, 7, null); UICtrl.delete(7, 7);
                  enroque = true; this.listOfMoves += ' O-O'; this.numberMov++;
               }
            }
            else if (j2 === 2 && i2 === 7) {// ENROQUE LARGO NEGRO
               if (!this.buscarAtaque(7, 2, 'Black') && !this.buscarAtaque(7, 3, 'Black') && !this.buscarAtaque(7, 4, 'Black')) {
                  this.setPieza(7, 2, this.getPieza(7, 4)); UICtrl.move(7, 4, 7, 2);
                  this.setPieza(7, 4, null); UICtrl.delete(7, 4);
                  this.setPieza(7, 3, this.getPieza(7, 0)); UICtrl.move(7, 0, 7, 3);
                  this.setPieza(7, 0, null); UICtrl.delete(7, 0);
                  enroque = true; this.listOfMoves += ' O-O-O '; this.numberMov++;
               }
            }
         }
       }
       UICtrl.actPgn(this.listOfMoves);
       return enroque;
   }

   enrocarNew(i1,j1,i2,j2){
      const torreMovida = (i1, j1, i2, j2) => {//verifica si una torre fue o no movida (para evaluar si es posible un enroque)
         let esquina = 7; let moveRook = false;
         if (j2 === 2) { esquina = 0 }
         if (this.getPieza(i2, esquina).getNombrePieza() === 'Rook') {
            if (this.getPieza(i2, esquina).getMoveRook()) { moveRook = true }
         }
         else { moveRook = true }
         return moveRook;
      }
      const esValidoEnroque = (i1, j1, i2, j2) => {
         let esValMove = this.validarTurno(i1, j1, i2, j2) && this.destinoValido(i1, j1, i2, j2) && this.recorridoValidoEnro(i1, j1, i2, j2) && !torreMovida(i1, j1, i2, j2);
         let moveKing = true;
         if (i1 === 0) { moveKing = this.moveKings[0] }
         else if (i1 === 7) { moveKing = this.moveKings[1] }
         return esValMove && !moveKing;
      }
      let enroque = false;
      if (this.getPieza(i1, j1).getNombrePieza() === 'King' && esValidoEnroque(i1, j1, i2, j2)) {
         if (i1 === 0 && j1 === 4 && i2 === 0 && j2 === 6 ){// ENROQUE CORTO BLANCO
               if (!this.buscarAtaque(0, 4, 'White') && !this.buscarAtaque(0, 5, 'White') && !this.buscarAtaque(0, 6, 'White')) {
                  this.setPieza(0, 6, this.getPieza(0, 4)); UICtrl.move(0, 4, 0, 6);
                  this.setPieza(0, 4, null); UICtrl.delete(0, 4);
                  this.setPieza(0, 5, this.getPieza(0, 7)); UICtrl.move(0, 7, 0, 5);
                  this.setPieza(0, 7, null); UICtrl.delete(0, 7);
                  enroque = true; this.listOfMoves += ' ' + this.numberMov + '. ' + 'O-O';
               }
         }
      }         
   }
   enrocarAux(i1,j1,i2,j2) {//es una funcion que simula enrocar pero no muestra los cambios en la interfaz
      const torreMovida = (i1, j1, i2, j2) => {//verifica si una torre fue o no movida (para evaluar si es posible un enroque)
         let esquina = 7; let moveRook = false;
         if (j2 === 2) { esquina = 0 }

         if (this.getPieza(i2, esquina).getNombrePieza() === 'Rook') {
            if (this.getPieza(i2, esquina).getMoveRook()) { moveRook = true }
         }
         else { moveRook = true }
         return moveRook;
      } 
      const esValidoEnroque = (i1,j1,i2,j2) => {
         let esValMove = this.validarTurno(i1,j1,i2,j2) && this.destinoValido (i1,j1,i2,j2) && this.recorridoValidoEnro(i1,j1,i2,j2) && !torreMovida(i1,j1,i2,j2);
         let moveKing = true;
         if (i1 === 0){ moveKing = this.moveKings[0] }
         else if (i1 === 7) { moveKing = this.moveKings[1] }

         return esValMove && !moveKing ;
      }

      let enroque = false;
      if (this.getPieza(i1,j1).getNombrePieza() === 'King'){
         if (i1 === 0 && j1 === 4) {
            if (j2 === 6 && i2 === 0 && esValidoEnroque(0,4,0,6)){// ENROQUE CORTO BLANCO
               if (!this.buscarAtaque(0,4,'White') && !this.buscarAtaque(0,5,'White') && !this.buscarAtaque(0,6,'White')){
                  this.setPieza(0, 6, this.getPieza(0, 4)); this.setPieza(0, 4, null); 
                  this.setPieza(0,5,this.getPieza(0,7)); this.setPieza(0,7,null);
                  enroque = true;
               }
            }
            else if (j2 === 2 && i2 === 0 && esValidoEnroque(0,4,0,2)){// ENROQUE LARGO BLANCO
               if (!this.buscarAtaque(0,2,'White') && !this.buscarAtaque(0,3,'White') && !this.buscarAtaque(0,4,'White')){
                  this.setPieza(0,2,this.getPieza(0,4)); this.setPieza(0,4,null); 
                  this.setPieza(0,3,this.getPieza(0,0)); this.setPieza(0,0,null); 
                  enroque = true;
               }   
            }
         }
         else if (i1 === 7 && j1 === 4){
            if (j2 === 6 && i2 === 7 && esValidoEnroque(7,4,7,6)){// ENROQUE CORTO NEGRO
               if (!this.buscarAtaque(7,4,'Black') && !this.buscarAtaque(7,5,'Black') && !this.buscarAtaque(7,6,'Black')){
                  this.setPieza(7,6,this.getPieza(7,4)); this.setPieza(7,4,null); 
                  this.setPieza(7,5,this.getPieza(7,7)); this.setPieza(7,7,null); 
                  enroque = true;
               }
            }
            else if (j2 === 2  && i2 === 7 && esValidoEnroque(7,4,7,2)){// ENROQUE LARGO NEGRO
               if (!this.buscarAtaque(7,2,'Black') && !this.buscarAtaque(7,3,'Black') && !this.buscarAtaque(7,4,'Black')){
                  this.setPieza(7,2,this.getPieza(7,4)); this.setPieza(7,4,null); 
                  this.setPieza(7,3,this.getPieza(7,0)); this.setPieza(7,0,null); 
                  enroque = true;
               }
            }
         }
      }
      return enroque;
   }
   checkKing(actPlayer,bool){//pone y saca el color rojo del rey cuando hay jaque y cuando ya no hay jaque respectivamente
      let color = (actPlayer === 0) ? 'White' : 'Black';
      let positionKing = this.searchKing(color);
      if (bool) { UICtrl.set(positionKing[0],positionKing[1],color,'KingAtack')}
      else { UICtrl.set(positionKing[0],positionKing[1],color,'King')}
     
   }
   enListarMov(i1,j1,i2,j2,pieza){ //agrega al PGN el movimiento (falta caso de mov de 2 piezas iguales a la misma casilla)
      const getPieceLetter = (pieza) => {//determina la letra para el PGN de la pieza, en caso de peon queda vacio
         let pieceLetter = '';
         let nomPieza = pieza.getNombrePieza();
         if (nomPieza === 'Knight') { pieceLetter = 'N' }
         else if (nomPieza != 'Pank') { pieceLetter = nomPieza[0] }
         return pieceLetter;//si es peon la letra de la pieza queda vacia
      }
      const nroAletra = (nro) => { //convierte el nro de columna en letra para el codigo PGN
         let letra = '';
         switch (nro){
            case 0: letra = 'a';break;
            case 1: letra = 'b';break;
            case 2: letra = 'c';break;
            case 3: letra = 'd';break;
            case 4: letra = 'e';break;
            case 5: letra = 'f';break;
            case 6: letra = 'g';break;
            case 7: letra = 'h';break;
         }
         return letra;
      }
      const come = (i1,j1,i2,j2,pieza) => {// agrega la letra de peon(si es peon) y x en caso q coma
         let com = '';
         if (this.getPieza(i2,j2) != null) { //si hay pieza enemiga esta comiendo por lo tanto va la x  
            if (pieza.getNombrePieza() === 'Pank') { com = nroAletra(j1) }//si peon agrego letra de la columna de origen
            com += 'x'
         }
         else if (pieza.getNombrePieza() === 'Pank' && j1 != j2){ com = nroAletra(j1) + 'x' }//caso particular del peon pasado
         return com;
      }
      if (pieza.getColor() === 'White'){ //si es blanco pongo el nro de movimiento 
         this.listOfMoves += ` ${this.numberMov}.`;
      }    
      this.listOfMoves += ` ${getPieceLetter(pieza)}${come(i1,j1,i2,j2,pieza)}${nroAletra(j2)}${i2+1}`;
      UICtrl.actPgn(this.listOfMoves); //actualiza el PGN de la interfaz

   }
   moverPieza(i1,j1,i2,j2,pieza){
       if (pieza.getNombrePieza() === 'King'){
          if (pieza.getColor() === 'White') { this.moveKings[0] = true }
          else { this.moveKings[1] = true }
       }
       else if (pieza.getNombrePieza() === 'Rook'){ pieza.setMoveRook(true) }
       this.enListarMov(i1,j1,i2,j2,pieza); this.setPieza(i2,j2,pieza); this.setPieza(i1,j1,null);
       if (pieza.getColor() === 'Black') { this.numberMov++ }
       UICtrl.move(i1,j1,i2,j2);
       if (pieza.getNombrePieza() === 'Pank'){ //si hay coronacion
            if (i2 === 7 || i2 === 0) { this.coronar(i2,j2,pieza.getColor()) }
       }    
   }
   moverPiezaAux(i1,j1,i2,j2,pieza){
     
      this.setPieza(i2,j2,pieza);
      this.setPieza(i1,j1,null);
     
   }
   specialMovePank(move,i2,j2,pieza){
        if (move[2].getNombrePieza() === 'Pank'){
            if (move[0] === 1 && i2 === 3 || move[0] === 6 && i2 === 4) {//si es paso doble
                    this.setFlagPeonPaso(i2,j2,true);
            }
            else if (move[0] === 4 && j2 !== move[1] && pieza === null) {//si comio al paso y es blanca
                this.setPieza(i2-1,j2,null); UICtrl.delete(i2-1,j2);
            }
            else if (move[0] === 3 && (j2 !== move[1] && pieza === null)){//si comio al paso y es negra
                this.setPieza(i2+1,j2,null); UICtrl.delete(i2+1,j2);
            }
        }    
   }   
   coronar(i,j,color){//pide que pieza queremos coronar y la pone en el tablero
        let pieza = prompt();
        switch (pieza) {
            case 'Rook': 
                    this.table[i][j] = new Rook(color); this.listOfMoves += '=R'; break;
            case 'Bishop': 
                    this.table[i][j] = new Bishop(color); this.listOfMoves += '=B'; break;
            case 'Knight': 
                    this.table[i][j] = new Knight(color); this.listOfMoves += '=N'; break;
            default: 
                    this.table[i][j] = new Queen(color); pieza = 'Queen'; this.listOfMoves += '=Q'; break;
        }
        UICtrl.set(i,j,color,pieza); UICtrl.actPgn(this.listOfMoves);
   }
   setPieza(i,j,valor){ this.table[i][j] = valor } // pone una pieza en el tablero
   setMove(i,j,valor){ this.move = [i,j,valor] }//pone una pieza en el move (variable auxiliar)
   changePlayer(){ this.activePlayer === 0 ? this.activePlayer = 1: this.activePlayer = 0 }//cambia el turno del jugador
   setFlagPeonPaso(i, j, bool) { //cambia la bandera del peon al paso
      this.flagPeonPaso[0] = i;  this.flagPeonPaso[1] = j;  this.flagPeonPaso[2] = bool 
   }
   
}