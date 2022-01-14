import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

function ThemeProvider(props) {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const retrievedValue = localStorage.getItem('isDarkTheme');

    return retrievedValue !== null ? retrievedValue === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem('isDarkTheme', isDarkTheme);
  }, [isDarkTheme]);

  function toggleTheme() {
    setIsDarkTheme(!isDarkTheme);
  }

  const value = {
    isDarkTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };
