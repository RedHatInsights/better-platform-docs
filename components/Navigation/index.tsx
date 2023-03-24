import Link from "next/link";
import { useRouter } from "next/router";
import {
  Nav,
  NavItem,
  NavItemProps,
  NavList,
  NavGroup,
  NavExpandable,
} from "@patternfly/react-core";
import clsx from "clsx";
import { ReactNode } from "react";

const NavLink: React.FC<{ href?: string; title: ReactNode }> = ({
  href,
  title,
}) => {
  const { pathname } = useRouter();
  if (!href) {
    return null;
  }
  return (
    <li className="pf-c-nav__item" id={href}>
      <Link href={href}>
        <a
          className={clsx("pf-c-nav__link", {
            "pf-m-current": href === pathname,
          })}
        >
          {title}
        </a>
      </Link>
    </li>
  );
};

export type NavItem = {
  title?: string;
  href?: string;
};

export type NavigationProps = {
  items: (NavItem & {
    groups?: NavItem[];
    groupName?: string;
    groupTitle?: string;
  })[];
  section: string;
};

const Navigation: React.FC<NavigationProps> = ({ items, section }) => {
  return (
    <Nav title={section} ouiaId="docs-nav">
      <NavList>
        {items.map(({ title, href, groupName, groupTitle, groups }) =>
          groupName ? (
            <NavExpandable title={groupTitle || ""}>
              {groups?.map(({ title: navTitle, href: navHref }) => (
                <NavLink key={navHref} href={navHref} title={navTitle} />
              ))}
            </NavExpandable>
          ) : (
            <NavLink key={href} href={href} title={title} />
          )
        )}
      </NavList>
    </Nav>
  );
};

export default Navigation;
