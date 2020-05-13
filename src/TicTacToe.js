import React,{useState,useEffect,useCallback} from 'react';
import styled from 'styled-components';
import {BOARD_DIM,PLAYER_X,PLAYER_O,SQUARE_DIM,GAME_STAES,DRAW,GAME_MODES} from './constants';
import {getRandomInt,switchPlayer} from './utils';
import Board from './Board';
import {minimax} from './minimax';
import {ResultModal} from './ResultModal';
import {border} from './styles';
import clickSound from './sounds/click2.mp3';
import winOrTieSound from './sounds/winOrTie.mp3';
import lostSound from './sounds/lost.mp3';


const board= new Board(); 

const arr= new Array(BOARD_DIM**2).fill(null);

const TicTacToe=()=>{
    const [grid,setGrid]=useState(arr);
    const [players,setPlayers]=useState({
        human:null,
        computer:null
    });
    const [gameState,setGameState]=useState(GAME_STAES.notStarted);
    const [nextMove,setNextMove]=useState(null);
    const [winner,setWinner]=useState(null);
    const [mode,setMode]=useState(GAME_MODES.medium);
    const [computerMoveCount,setComputerMoveCount]=useState(1);
    const [modalOpen,setModalOpen]=useState(false);
    

    
    const choosePlayer=(option)=>{
        setPlayers({human:option,computer:switchPlayer(option)});
        setGameState(GAME_STAES.inProgress);
        setNextMove(PLAYER_X);
    }

    const move=useCallback((index,player)=>{
        if(player&&gameState===GAME_STAES.inProgress){
            setGrid((grid)=>{
                const gridCopy=grid.slice();
                gridCopy[index]=player;
                return gridCopy;
            });
        }
        
    },[gameState]);

    const computerMove=useCallback(()=>{
        
        console.log('computerMove runs');
        const board=new Board(grid.slice());
        const emptySquares=board.getEmptySquares(grid);
        let index;
        switch(mode){
            case GAME_MODES.easy:
                index=getRandomInt(0,8);
                while(!emptySquares.includes(index)){
                    index=getRandomInt(0,8);
                }
                break;
            case GAME_MODES.medium:
                const smartMove = !board.isEmpty() && computerMoveCount<=2;
                if(smartMove){
                    index=minimax(board,players.computer)[1];
                }
                else{
                    index=getRandomInt(0,8);
                    while(!emptySquares.includes(index)){
                        index=getRandomInt(0,8);
                    }
                }
                break;
            case GAME_MODES.difficult:
            default:
                index=board.isEmpty(grid)?getRandomInt(0,8):
                    minimax(board,players.computer)[1];

        }
         
        if(!grid[index]){
            setComputerMoveCount(computerMoveCount+1);
            move(index,players.computer);
            setNextMove(players.human);
        }
        
        
        
    },[move,grid,players,mode,computerMoveCount]); 

    const humanMove=(index)=>{
        if(!grid[index]&&nextMove===players.human){
            document.querySelector('#clickAudio').play();
            move(index,players.human);
            setNextMove(players.computer);
        }
    };

    useEffect(()=>{
        
        let timeoutId;
        if(nextMove!==null &&
           nextMove===players.computer &&
           gameState!==GAME_STAES.over
        ){
            // delaying computer move to looks natural.
            
            timeoutId = setTimeout(()=>{
                computerMove();
            },700);
        }
        return ()=> timeoutId && clearTimeout(timeoutId);

    },[nextMove,computerMove,players.computer,gameState]);

    // useEffect for checking and declaring winner
    useEffect(()=>{
        const winner=board.getWinner(grid);
        const declareWinner=(winner)=>{
            let winnerStr;
            switch(winner){
                case players.human:
                    winnerStr='you won!!!';
                    break;
                case players.computer:
                    winnerStr='aw...you loose';
                    break;
                case DRAW:
                default:
                    winnerStr=`It's a draw...`;
            }
            setGameState(GAME_STAES.over);
            setWinner(winnerStr);
            setTimeout(()=>{
                setModalOpen(true);
                if(winnerStr!=='aw...you loose')
                    document.querySelector('#winOrTieAudio').play();
                else
                document.querySelector('#lostAudio').play();
            },800);
        }

        if(winner!==null && gameState!==GAME_STAES.over){
            declareWinner(winner);
        }
    },[gameState,grid,nextMove,players.human,players.computer]);

    const startNewGame=()=>{
        setGameState(GAME_STAES.notStarted);
        setGrid(arr);
        setComputerMoveCount(0);
        setModalOpen(false);
    }
    const changeMode=(e)=>{
        setMode(e.target.value);
    }

    return gameState=== GAME_STAES.notStarted? (
                <Screen>
                    <Inner>
                        <ChooseText>Choose Difficulty Level</ChooseText>
                        <select onChange={changeMode} value={mode}>
                            {
                                Object.keys(GAME_MODES).map((key)=>{
                                        const gameMode=GAME_MODES[key];
                                        return(
                                        <option key={gameMode} value={gameMode}> {gameMode}</option>
                                        );
                                })
                            }
                        </select>
                    </Inner>
                    <Inner>
                        <ChooseText> Choose your Marker</ChooseText>
                        <ButtonRow>
                            <button onClick={()=>choosePlayer(PLAYER_X)}>X</button>
                            <p>or</p>
                            <button onClick={()=>choosePlayer(PLAYER_O)}>O</button>
                        </ButtonRow>
                        <SmallText>X will play first</SmallText>
                    </Inner>
                </Screen>
            ):(  
                <Container dims={BOARD_DIM}>
                  {grid.map((value, index) => {
                    const isActive = value !== null;
            
                    return (
                      <Square
                        key={index}
                        onClick={() =>{
                            
                            humanMove(index);} }
                      >
                        {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
                      </Square>
                    );
                  })}

                    <ResultModal
                        isOpen={modalOpen}
                        winner={winner}
                        close={() => setModalOpen(false)}
                        startNewGame={startNewGame}
                    />
                    <Strikethrough
                        styles={
                        gameState === GAME_STAES.over && board.getStrikethroughStyles()
                        }
                    />
                    <audio media-player="audioPlayer"  preload="auto" id="clickAudio"
                crossOrigin="anonymous" src={clickSound}></audio>
                    <audio media-player="audioPlayer"  preload="auto" id="winOrTieAudio"
                crossOrigin="anonymous" src={winOrTieSound}></audio>
                    <audio media-player="audioPlayer"  preload="auto" id="lostAudio"
                crossOrigin="anonymous" src={lostSound}></audio>
                    
                </Container>
              );
       

    
    
    
    
    
};

const Container=styled.div`
    display:flex;
    justify-content:center;
    width:${({dims})=>`${dims*(SQUARE_DIM+5)}px`};
    flex-flow:wrap;
    position:relative;
`;
const Square=styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    width:${SQUARE_DIM}px;
    height:${SQUARE_DIM}px;
    
    ${border};
    &:hover{
        cursor:pointer;
    }
`;
const Marker=styled.p`
    font-size:68px;
    color:#a626aa;
`;


const ButtonRow=styled.div`
    display:flex;
    width:150px;
    justify-content:space-between;    
`;
const Screen=styled.div``;
const Inner=styled.div`
    display:flex;
    flex-direction:column;
    align-items:center;
    margin-bottom;30px;
`;
const ChooseText=styled.p``;
const SmallText=styled.p`
    font-size:0.7rem;
`;


const Strikethrough = styled.div`
    position: absolute;
    ${({ styles }) => styles}
    background-color: indianred;
    height: 5px;
    width: ${({ styles }) => !styles && "0px"};
  `;

export default TicTacToe;