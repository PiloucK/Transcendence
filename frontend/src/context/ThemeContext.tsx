import React, { useState, FC } from 'react';
// import React, { useState, useEffect, createContext } from 'react';

interface IThemeContext {
  dark: boolean;
  toggleDark?: () => void;
}

const defaultState = {
  dark: false,
};

export const ThemeContext = React.createContext<IThemeContext>(defaultState);

export const ThemeProvider: FC = ({ children }) => {
  const [dark, setDark] = useState(defaultState.dark);

  const toggleDark = () => {
    setDark(!dark);
  };

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggleDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
