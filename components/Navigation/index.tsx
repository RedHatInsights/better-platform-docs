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
      <Link
        href={href}
        className={clsx("pf-c-nav__link", {
          "pf-m-current": href === pathname,
        })}
      >
        {title}
      </Link>
    </li>
  );
};

export type NavItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  groups: (NavItem | NavGroup)[];
  groupName: string;
  groupTitle: string;
};

export type NavigationProps = {
  items: (NavItem | NavGroup)[];
  section: string;
};

export function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return typeof (item as any).groupName === "string";
}

const Navigation: React.FC<NavigationProps> = ({ items, section }) => {
  return (
    <Nav title={section} ouiaId="docs-nav">
      <NavList>
        {items.map((item) =>
          isNavGroup(item) ? (
            <NavExpandable title={item.groupTitle || ""}>
              {item.groups?.map(({ title: navTitle, href: navHref }) => (
                <NavLink key={navHref} href={navHref} title={navTitle} />
              ))}
            </NavExpandable>
          ) : (
            <NavLink key={item.href} href={item.href} title={item.title} />
          )
        )}
      </NavList>
    </Nav>
  );
};

export default Navigation;
