import { useEffect, useState } from "react";

const useWindowWidth = () => {
  const [xxl, setXxl] = useState(false);
  const [xl, setXl] = useState(false);
  const [lg, setLg] = useState(false);
  const [md, setMd] = useState(false);
  const [sm, setSm] = useState(false);
  const [xs, setXs] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setXxl(window?.innerWidth >= 1450);
      setXl(window?.innerWidth >= 1200);
      setLg(window?.innerWidth >= 992);
      setMd(window?.innerWidth >= 768);
      setSm(window?.innerWidth >= 576);
      setXs(window?.innerWidth < 0);
    };
    window?.addEventListener?.("resize", handleResize);
    () => window?.removeEventListener?.("resize", handleResize);
    setXxl(window?.innerWidth >= 1450);
    setXl(window?.innerWidth >= 1200);
    setLg(window?.innerWidth >= 992);
    setMd(window?.innerWidth >= 768);
    setSm(window?.innerWidth >= 576);
    setXs(window?.innerWidth >= 0);
  }, []);

  return { xs, sm, md, lg, xl, xxl };
};

export default useWindowWidth;
