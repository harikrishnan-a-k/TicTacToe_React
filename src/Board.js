import {BOARD_DIM,DRAW} from './constants';

export default class Board{
    constructor(grid){
        this.grid=grid|| new Array(BOARD_DIM**2).fill(null);
        this.winningIndex=null;
    }
    // collect indices of empty squares and return them.
    getEmptySquares=(grid=this.grid)=>{
        let squares=[];
        grid.forEach((square,index)=>{
            if(square===null){
                squares.push(index);
            }
        });
        return squares;
    }

    isEmpty=(grid=this.grid)=>{
        return this.getEmptySquares(grid).length===BOARD_DIM**2;
    }

    getWinner=(grid=this.grid)=>{
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
          ];
        let res=null;
        winningCombos.forEach((el,i)=>{
            if(grid[el[0]]!==null&&
               grid[el[0]]===grid[el[1]] &&
               grid[el[0]]===grid[el[2]]){

                    res=grid[el[0]];
                    this.winningIndex = i;
            }
            else if(res===null && this.getEmptySquares(grid).length===0){
                res=DRAW;
                this.winningIndex=null;
            }
        });
        return res;
    }

    clone=()=>{
        return new Board(this.grid.slice());
    }
    //makeMove function for using dummy moves for minmax function
    makeMove=(square,player)=>{
        if(this.grid[square]===null){
            this.grid[square]=player;
        }
    }
    //getting strikethrough styles based on winningIndex
    getStrikethroughStyles = () => {
        const defaultWidth = 285;
        const diagonalWidth = 400;
        switch (this.winningIndex) {
          case 0:
            return `
              transform: none;
              top: 41px;
              left: 15px;
              width: ${defaultWidth}px;
            `;
          case 1:
            return `
              transform: none;
              top: 140px;
              left: 15px;
              width: ${defaultWidth}px;
            `;
          case 2:
            return `
              transform: none;
              top: 242px;
              left: 15px;
              width: ${defaultWidth}px;
            `;
          case 3:
            return `
              transform: rotate(90deg);
              top: 145px;
              left: -86px;
              width: ${defaultWidth}px;
            `;
          case 4:
            return `
              transform: rotate(90deg);
              top: 145px;
              left: 15px;
              width: ${defaultWidth}px;
            `;
          case 5:
            return `
              transform: rotate(90deg);
              top: 145px;
              left: 115px;
              width: ${defaultWidth}px;
            `;
          case 6:
            return `
              transform: rotate(45deg);
              top: 145px;
              left: -44px;
              width: ${diagonalWidth}px;
            `;
          case 7:
            return `
              transform: rotate(-45deg);
              top: 145px;
              left: -46px;
              width: ${diagonalWidth}px;
            `;
          default:
            return null;
        }
      }
}