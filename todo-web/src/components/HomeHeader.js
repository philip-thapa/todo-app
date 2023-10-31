import React, { useEffect, useState } from 'react';
import moment from 'moment';

function HomeHeader({sideFilter}) {
    const [currentDate, setCurrentDate] = useState(moment());
    const [title, setTitle] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
          setTitle(sideFilter)
          setCurrentDate(moment())
        }, 100);
    
        return () => clearInterval(interval);
      }, [sideFilter]);

    const formattedDate = currentDate.format('MMMM Do YYYY');
    return (
        <div style={{marginBottom: '25px'}}>
            <h4>{title}...</h4>
            {title === 'My Day' && formattedDate}
        </div>
    )
}

export default HomeHeader