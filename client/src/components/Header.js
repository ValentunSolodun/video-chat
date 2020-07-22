import React from 'react';

const style = {
  div: {
    height: 50,
    width: 100+ '%',
    display: 'flex',
    alignItems: 'center',
    fontSize: 20,
    padding: '0 20px',
    backgroundColor: '#9a9a9a',
    color: '#000'
  }
}

const Header = ({text}) => {
  return (
    <div style={style.div}>
      <span>
        {text}
      </span>
    </div>
  )
}

export {Header};
