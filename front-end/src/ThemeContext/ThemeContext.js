import React, { createContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

function ThemeProvider(props) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    if (prefersDark) {
      setIsDarkTheme(true);
    }
  }, []);

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
