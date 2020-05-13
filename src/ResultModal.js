import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import {border} from './styles';
import './customStyles.css';


const customStyles={
    overlay:{
        backgroundColor:"rgba(0,0,0,0.6)",
    }
};

export const ResultModal=({isOpen,close,startNewGame,winner})=>{
    return(
        <StyledModal isOpen={isOpen} onRequestClose={close} style={customStyles}>
            <ModalWrapper>
                <ModalTitle> Game Over</ModalTitle>
                <ModalContent className="floating-text">{winner}</ModalContent>

                <ModalFooter>
                    <Button onClick={close}>close</Button>
                    <Button onClick={startNewGame}>Start Over</Button>
                </ModalFooter>
            </ModalWrapper>
        </StyledModal>
    );

};

const StyledModal=styled(Modal)`
    display:flex;
    flex-direction:column;
    height:300px;
    position:relative;
    margin:0 auto;
    top:15%;
    right:auto;
    bottom:auto;
    width:80vh;
    max-width:320px;


`;

const ModalWrapper=styled.div`
    display:flex;
    flex-direction:column;
    padding:24px;
    background-color:rgba(255,255,255,0.8);
    max-height:100%;
    height:100%;
    align-items:center;
    backface-visibility:hidden;
    border:1px solid black;
    ${border};
`;

const ModalTitle = styled.p`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
`;

const ModalContent = styled.p`
  flex: 1 1 auto;
  text-align: center;
  font-size:30px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 0 0 auto;
  width: 100%;
`;

const Button = styled.button`
  font-size: 16px;
`;