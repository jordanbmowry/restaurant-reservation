import React, { useEffect, useState } from 'react';
import { formatAsTime } from '../utils/date-time';

export default function CurrentTime() {
  const [time, setTime] = useState(new Date().toTimeString());
  const timeFormatted = formatAsTime(time);

  const updateTime = () => {
    const timeString = new Date().toTimeString();
    setTime(timeString);
  };

  useEffect(() => {
    updateTime();
    const intervalId = setInterval(() => {
      updateTime();
    }, 6000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <h3 className='my-4 font-weight-bold'>
        Current Time:{' '}
        <i style={{ fontSize: '2rem' }} className='fas fa-clock'>
          {' '}
        </i>{' '}
        <span
          style={{ color: '#fff', fontSize: '2rem' }}
          className='badge bg-secondary'
        >
          {timeFormatted}
        </span>
      </h3>
    </>
  );
}
