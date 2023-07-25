import Link from "next/link";
import { useRouter } from "next/router";
import {
  Nav,
  NavItem,
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

const NavItemLink = ({ href, title }: NavItem) => (
  <NavLink href={href} title={title} />
);
const NavItemGroup: React.FC<NavGroup> = ({ groups, groupTitle }) => (
  <NavExpandable title={groupTitle}>
    {groups.map((item) =>
      isNavGroup(item) ? <NavItemGroup {...item} /> : <NavItemLink {...item} />
    )}
  </NavExpandable>
);

const Navigation: React.FC<NavigationProps> = ({ items, section }) => {
  return (
    <Nav title={section} ouiaId="docs-nav">
      <NavList>
        {items.map((item) =>
          isNavGroup(item) ? (
            <NavItemGroup {...item} />
          ) : (
            <NavItemLink key={item.href} {...item} />
          )
        )}
      </NavList>
    </Nav>
  );
};

export default Navigation;
