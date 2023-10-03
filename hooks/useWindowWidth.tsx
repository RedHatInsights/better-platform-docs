import { useEffect, useState } from 'react';

const useWindowWidth = () => {
  const localWindow = typeof window !== 'undefined' ? window : { innerWidth: 1500 };
  const [xxl, setXxl] = useState(localWindow?.innerWidth >= 1450);
  const [xl, setXl] = useState(localWindow?.innerWidth >= 1200);
  const [lg, setLg] = useState(localWindow?.innerWidth >= 992);
  const [md, setMd] = useState(localWindow?.innerWidth >= 768);
  const [sm, setSm] = useState(localWindow?.innerWidth >= 576);
  const [xs, setXs] = useState(localWindow?.innerWidth < 0);

  useEffect(() => {
    const handleResize = () => {
      setXxl(localWindow?.innerWidth >= 1450);
      setXl(localWindow?.innerWidth >= 1200);
      setLg(localWindow?.innerWidth >= 992);
      setMd(localWindow?.innerWidth >= 768);
      setSm(localWindow?.innerWidth >= 576);
      setXs(localWindow?.innerWidth < 0);
    };
    localWindow?.addEventListener?.('resize', handleResize);
    () => localWindow?.removeEventListener?.('resize', handleResize);
  }, []);

  return { xs, sm, md, lg, xl, xxl };
};

export default useWindowWidth;
