import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';

const ResponsiveContext = createContext(
  {} as {
    isMobile: boolean;
  }
);

export const useResponsiveContext = () => {
  return useContext(ResponsiveContext);
};
type Props = {
  children: ReactNode;
};

export const ResponsiveProvider = ({ children }: Props) => {
  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => {
      setWindowDimensions(getWindowDimensions());
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (innerWidth <= 600) {
      setIsMobile(true);
    }
  }, [windowDimensions]);

  return (
    <ResponsiveContext.Provider value={{ isMobile }}>
      {children}
    </ResponsiveContext.Provider>
  );
};
