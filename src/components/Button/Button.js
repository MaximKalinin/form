import React from 'react';

import './Button.css';

const Button = (props) => {
    const classes = ['Button'];
    if (props.full) {
        classes.push('Full');
    }
    return (
        <button 
        className={classes.join(' ')}
        onClick={props.onClick} >{props.label}</button>
    );
}

export default Button;