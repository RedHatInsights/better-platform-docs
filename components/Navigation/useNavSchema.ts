import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NavigationProps } from ".";

const useNavSchema = () => {
  const router = useRouter();
  const [{ section, items }, setSchema] = useState<NavigationProps>({
    items: [],
    section: "",
  });

  const getNavigationSegment = async (
    currSection: string,
    currNav: string,
    pathname: string
  ) => {
    const promises = [];
    // custom schema generated from docs source
    promises.push(
      import(`../../pages/${currSection}/${currNav}/navigation.json`).then(
        (m) => ({
          // add absolute fragment to relative link
          default: m.default.map((l: any) => ({
            ...l,
            href: `/${currSection}/${currNav}/${l.href}`.replace(/index$/, "/"),
          })),
        })
      )
    );
    if (currNav?.length > 0 && currSection?.length > 0) {
      promises.push(import(`./schemas/${currSection}/${currNav}.json`));
    }

    try {
      const results = await Promise.allSettled(promises);
      const schema:
        | {
            value: {
              default: NavigationProps["items"];
            };
          }
        | undefined = results.find((p) => p.status === "fulfilled") as any;
      if (!schema) {
        throw new Error("No navigation schema found for: " + pathname);
      }
      setSchema({
        section: currNav,
        items: schema.value.default,
      });
    } catch (error) {
      // silent fail non existing schema
      console.log("No schema found: ", error);
      setSchema({
        items: [],
        section: "",
      });
    }
  };

  useEffect(() => {
    const section = router.pathname.split("/").slice(1);
    const currSection = section.shift() || "";
    const currNav = section.shift() || "";
    getNavigationSegment(currSection, currNav, router.pathname);
  }, [router.pathname]);

  return { items, section };
};

export default useNavSchema;
