import React from 'react';

import './ImageGrid.css';

const imageGrid = (props) => {
    let grid = 
    <div className="ImageGrid">
        {
            props.images.map(image => {
            return <img 
            key={image.name} 
            src={image.src} 
            alt={image.name}
            onClick={!props.readonly ? () => props.onImageClick(image.name) : null}
            className={image.selected ? 'selected' : ''} />
        })}
    </div>
    if (props.readonly && props.images.find(image => image.selected === null)) {
        grid = null;
    }
    return grid
}

export default imageGrid;