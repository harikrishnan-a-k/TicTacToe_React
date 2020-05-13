import React from 'react';

import './Header.css';
import logo from './logo.svg';

const Header=()=>{
    return(
        <div className="header">
            <img src={logo} className="Navbar-logo" alt="logo" />
            <div> Tic Tac Toe</div>
        </div>
    )
}
export default Header;