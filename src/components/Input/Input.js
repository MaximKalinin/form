import React from 'react';

import './Input.css';

const input = (props) => {
    let output = 
    <div className="Input">
        <label>{props.label}</label>
        <input
        className={(!props.valid && props.touched) ? 'incorrect' : ''} 
        placeholder={props.placeholder} 
        type={props.type} 
        value={props.value} 
        onChange={props.onChange}
        readOnly={props.readonly} />
        {!props.valid && props.touched ? <div className="hint">{props.hint}</div> : null}
    </div>
    ;
    if (props.type === 'select') 
    output = 
    <div className="Input">
        <label>{props.label}</label>
        <select
        placeholder={props.placeholder} 
        type={props.type} 
        value={props.value} 
        onChange={props.onChange}
        disabled={props.readonly}>
            {props.options.map(option => {
                return <option key={option}>{option}</option>
                })
            }
        </select>
    </div>
    ;
    return output;
}

export default input;