import Link from "next/link";
import { useRouter } from "next/router";
import { Nav, NavItem, NavItemProps, NavList } from "@patternfly/react-core";
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

export type NavigationProps = {
  items: { title: string; href: string }[];
  section: string;
};

const Navigation: React.FC<NavigationProps> = ({ items, section }) => {
  return (
    <Nav title={section} ouiaId="docs-nav">
      <NavList>
        {items.map(({ title, href }) => (
          <NavLink key={href} href={href} title={title} />
        ))}
      </NavList>
    </Nav>
  );
};

export default Navigation;
