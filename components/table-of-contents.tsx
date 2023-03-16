import { createUseStyles } from "react-jss";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import classnames from "clsx";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Menu, MenuContent, MenuItem, MenuList } from "@patternfly/react-core";

const useStyles = createUseStyles({
  tableOfContent: {
    maxHeight: "100vh",
    overflowY: "auto",
  },
  list: {
    width: 250,
    boxShadow: "none !important",
    background: "none !important",
  },
  listItem: {
    color: "var(--pf-global--palette--black-700)",
    "&:hover": {
      color: "var(--pf-global--palette--black-900)",
    },
  },
  activeLink: {
    color: "var(--pf-global--palette--black-900) !important",
    background: "var(--pf-global--palette--white) !important",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      left: -8,
      top: 0,
      bottom: 0,
      borderLeft: "10px solid var(--pf-global--palette--blue-400)",
    },
  },
});

const ContentLink: React.FC<
  PropsWithChildren<{
    title: string;
    setActive: (targetId: string) => void;
    isActive: boolean;
    targetId: string;
  }>
> = ({ title, setActive, isActive, targetId }) => {
  const classes = useStyles();
  return (
    <MenuItem
      onClick={() => {
        setActive(targetId);
      }}
      title={title}
      className={classnames(classes.listItem, {
        [classes.activeLink]: isActive,
      })}
      to={`#${targetId}`}
    >
      {title}
    </MenuItem>
  );
};

const TableOfContents = () => {
  const tocRef = useRef<HTMLDivElement>(null);
  const classes = useStyles();
  const { pathname } = useRouter();
  const [links, setLinks] = useState<
    {
      component: string;
      title: string | null;
      targetId: string | undefined;
      level: number;
    }[]
  >([]);
  const [activeItem, setActive] = useState<string>();
  let isMounted = true;

  const scrollListener = (setActive: any) => {
    const contentElement = document.getElementById("docs-content");
    const anchors = Array.from(
      contentElement?.getElementsByClassName("docs-content-link") || []
    );
    const min = -20;
    const max = 20;
    const elem = anchors.find((elem) => {
      const { top } = elem.getBoundingClientRect();
      return top > min && top < max;
    });
    if (isMounted && elem) {
      setActive(elem?.firstElementChild?.id);
    }
  };

  useEffect(() => {
    if (tocRef.current) {
      tocRef.current.style.position = "sticky";
      tocRef.current.style.right = "20px";
      tocRef.current.style.top = "0px";
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    isMounted = true;
    document
      ?.querySelector(".pf-c-page__main")
      ?.addEventListener("scroll", () => scrollListener(setActive));
    scrollListener(setActive);

    return () => {
      isMounted = false;
      document.removeEventListener("scroll", scrollListener);
    };
  }, []);

  useEffect(() => {
    const contentElement = document.getElementById("docs-content");
    const anchors = Array.from(
      contentElement?.getElementsByClassName("docs-content-link") || []
    );
    const links = anchors.map((elem) => ({
      component: elem.tagName,
      title: elem.textContent,
      targetId: elem?.firstElementChild?.id,
      level: Number(elem.tagName.replace("H", "")) - 1,
    }));
    setLinks(links);
  }, [pathname]);

  return links.length > 0 ? (
    <div ref={tocRef}>
      <Menu className={classes.list}>
        <MenuContent>
          <MenuList className={classes.tableOfContent}>
            {/* eslint-disable react/prop-types */}
            {links.map(({ targetId, title, ...props }) => (
              <ContentLink
                setActive={setActive}
                key={targetId}
                isActive={targetId === activeItem}
                targetId={targetId as string}
                title={title as string}
                {...props}
              />
            ))}
            {/* eslint-enable react/prop-types */}
          </MenuList>
        </MenuContent>
      </Menu>
    </div>
  ) : null;
};

export default TableOfContents;
