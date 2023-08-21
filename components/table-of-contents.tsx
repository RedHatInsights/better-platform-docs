import { createUseStyles } from "react-jss";
import { useRouter } from "next/router";
import { RefObject, useEffect, useRef, useState } from "react";
import {
  JumpLinks,
  JumpLinksItem,
  Menu,
  MenuContent,
} from "@patternfly/react-core";

const useStyles = createUseStyles({
  list: {
    maxWidth: 250,
    boxShadow: "none !important",
    background: "none !important",
  },
});

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

  const intersectionObserver = () => {
    const wrapper = document.getElementById("content-wrapper");
    if (wrapper) {
      const options = {
        root: wrapper,
        rootMargin: `0px 0px -${
          wrapper.getBoundingClientRect().height / 1.3
        }px`,
        threshold: 0.5,
      };
      const contentLinks: HTMLAnchorElement[] =
        Array.from(document.querySelectorAll(".docs-content-link")) || [];
      const callback: IntersectionObserverCallback = (elements, observer) => {
        const firstElement = elements.reduce((acc, curr) => {
          if (!curr.isIntersecting) {
            return acc;
          }

          return curr;
        }, elements[0]);

        if (firstElement) {
          Array.from(contentLinks).forEach((link) => {
            if (link === firstElement?.target) {
              setActive(link.innerText.replace(/\s/gm, ""));
            }
          });
        }
      };
      let observer = new IntersectionObserver(callback, options);

      for (let index = 0; index < contentLinks.length; index++) {
        const element = contentLinks[index];
        observer.observe(element);
      }
    }
  };

  useEffect(() => {
    if (tocRef.current) {
      tocRef.current.style.position = "sticky";
      tocRef.current.style.right = "20px";
      tocRef.current.style.top = "0px";
    }
    intersectionObserver();
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
        <MenuContent className="pf-u-p-md">
          <JumpLinks isVertical label="Jump to section">
            {/* eslint-disable react/prop-types */}
            {links.map(({ targetId, title, ...props }) => (
              <JumpLinksItem
                key={targetId}
                isActive={targetId === activeItem}
                data-toc-ref={targetId}
                {...props}
                onClick={() => {
                  document.location.href = ("#" + targetId) as string;
                  setActive(targetId);
                }}
              >
                {title}
              </JumpLinksItem>
            ))}
            {/* eslint-enable react/prop-types */}
          </JumpLinks>
        </MenuContent>
      </Menu>
    </div>
  ) : null;
};

export default TableOfContents;
