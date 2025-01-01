import { useResponsiveContext } from '../common/ResponsiveProvider';
import { DesktopMain } from './desktop_main/DesktopMain';
import { MobileMain } from './mobile_main/MobileMain';

export const Main = () => {
  const { isMobile } = useResponsiveContext();
  return <>{!!isMobile ? <MobileMain /> : <DesktopMain />}</>;
};
