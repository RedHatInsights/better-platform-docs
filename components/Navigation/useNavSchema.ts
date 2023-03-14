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
    const currSection = section.pop() || "";
    if (section && section.length > 0) {
      import(`./schemas/${section}/${currSection}.json`)
        .then((mod) => setSchema({ items: mod.default, section: currSection }))
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
