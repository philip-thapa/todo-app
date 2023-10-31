import React from 'react';
import NavBar from './NavBar';

const Base = React.memo(({children}) => {
    return (
        <>
            <NavBar />
            {children}
        </>
        
    )    
})

export default Base;