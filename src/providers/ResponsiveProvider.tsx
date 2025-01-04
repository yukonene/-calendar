import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
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
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = useState(false);

  const getWindowDimensions = useCallback(() => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setWindowDimensions(getWindowDimensions());
    };
    // 画面サイズの変更を検知する
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [getWindowDimensions]);

  useEffect(() => {
    if (innerWidth <= 600) {
      //画面のwidhtが600以下ならモバイルとする
      setIsMobile(true);
    }
  }, [windowDimensions]);

  return (
    <ResponsiveContext.Provider value={{ isMobile }}>
      {children}
    </ResponsiveContext.Provider>
  );
};
