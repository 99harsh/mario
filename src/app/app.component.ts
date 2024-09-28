import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'game-ui';

  isGameCompleted:boolean = false;
  isGameOver:boolean = false;
  arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  gameLevelMatrix: any[] = [];
  matrixSize: number = 5
  starCount:number =0;
  canMove = true;
  marioPosition: any = {
    //@ts-ignore
    row: parseInt(this.matrixSize / 2),
    //@ts-ignore
    col: parseInt(this.matrixSize / 2)
  };

  _cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    this.gameLevelMatrix = this.createNxNArray(this.matrixSize);

    this.listenKeyboardEvent()

  }

  eventListener = (event:any) => {
      event.preventDefault();
      if (this.arrowKeys.includes(event.key)) {
        this.move(event.key);
      }
    }
  

  listenKeyboardEvent = () => {
    document.addEventListener("keydown", this.eventListener)

  }

  move = (keyName: string) => {
    try{
      if(!this.canMove) return;
      const mp = this.marioPosition;
      this.gameLevelMatrix[mp.row][mp.col].isMario = false;
      switch (keyName) {
        case "ArrowUp":
          mp.row -= 1;
          break;
        case "ArrowDown":
          mp.row += 1;
          break;
        case "ArrowLeft":
          mp.col -= 1;
          break;
        case "ArrowRight":
          mp.col += 1;
          break;
      }
  
      this.gameLevelMatrix[mp.row][mp.col].isMario = true;
      this.starCount += this.gameLevelMatrix[mp.row][mp.col].isStar ? 1 : 0;
      this.gameLevelMatrix[mp.row][mp.col].isStar = false;
      this.marioPosition = mp;
      if(this.gameLevelMatrix[mp.row][mp.col].isBomb){
        this.canMove = false;
        setTimeout(()=>{
            document.removeEventListener('keydown',this.eventListener);
            this.isGameOver = true;
        }, 300)
        return;
      } 

      if((this.matrixSize*this.matrixSize) - this.matrixSize - 1 === this.starCount){
        document.removeEventListener('keydown',this.eventListener);
        this.isGameCompleted = true;
      }
  
    } catch(error){
      document.removeEventListener('keydown',this.eventListener);
      this.isGameOver = true;
      this.canMove = false;
    } 
  }

  resetGame = () =>{
    this.marioPosition = {
      //@ts-ignore
      row: parseInt(this.matrixSize / 2),
      //@ts-ignore
      col: parseInt(this.matrixSize / 2)
    };
    this.gameLevelMatrix  = this.createNxNArray(this.matrixSize);

    this.starCount = 0;
    this.isGameOver = false;
    this.isGameCompleted = false;
    this.canMove = true;
    this.listenKeyboardEvent();

  }

  createNxNArray(n: number) {
    // Create an empty NxN array
    let array = new Array(n).fill(null).map(() => new Array(n).fill(null));

    for (let i = 0; i < n; i++) {
      // const randomBombIndex = Math.floor(Math.random() * n);
      let randomBombIndex;
      do{
        randomBombIndex = Math.floor(Math.random() * n)
      }
      while(randomBombIndex === this.marioPosition.col && this.marioPosition.row === i);
      for (let j = 0; j < n; j++) {
        if (this.marioPosition.row === i && this.marioPosition.col === j) {
          array[i][j] = {
            isMario: true,
            isStar: false,
            isBomb: false
          }; 
        } else {
          array[i][j] = {
            isMario: false,
            isStar: !(randomBombIndex === j),
            isBomb: randomBombIndex === j
          };
        }

      }
    }

    return array;
  }
}
