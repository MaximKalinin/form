import React from 'react';

import './ProgressBar.css';

const progressBar = (props) => {
    const style = {width: '0%'};
    if (props.stage === 1)
        style.width = '50%';
    else if (props.stage === 2)
        style.width = '95%';
    return (<div className="ProgressBar" style={style}></div>);
}

export default progressBar;