import React from 'react';
import styled from 'styled-components';
import 'papercss/dist/paper.min.css';
import TicTacToe from './TicTacToe';
import Header from './Header';


const Main=styled.main`
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
`;
function App(){
  return(
    <Main>
      <Header></Header>
      <TicTacToe/>
      
    </Main>
  )

}


export default App;
