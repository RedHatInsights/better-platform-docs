import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavigationProps } from ".";

const useNavSchema = () => {
  const router = useRouter();
  const [{ section, items }, setSchema] = useState<NavigationProps>({
    items: [],
    section: "",
  });

  useEffect(() => {
    const section = router.pathname.split("/").slice(1);
    const currSection = section.shift() || "";
    const currNav = section.shift() || "";
    if (currNav?.length > 0 && currSection?.length > 0) {
      import(`./schemas/${currSection}/${currNav}.json`)
        .then((mod) => setSchema({ items: mod.default, section: currNav }))
        .catch((error) => {
          // silet error
          console.log("No schema found: ", error);
          setSchema({
            items: [],
            section: "",
          });
        });
    } else {
      // index page
      setSchema({
        items: [],
        section: "",
      });
    }
  }, [router.pathname]);

  return { items, section };
};

export default useNavSchema;
