import { Page, PageHeader, PageSidebar } from "@patternfly/react-core";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";
import { createUseStyles } from "react-jss";
import Image from "next/image";
import Navigation from "../../Navigation";
import useNavSchema from "../../Navigation/useNavSchema";

const useStyles = createUseStyles({
  page: {
    height: "100vh",
  },
  brandLink: {
    display: "flex",
  },
});

const schema = {
  index: {
    title: "To home",
    href: "/",
  },
  items: [
    {
      title: "Bar",
      href: "/foo",
    },
    {
      title: "Baz",
      href: "/baz",
    },
  ],
};

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [isNavOpen, setIsnavOpen] = useState(true);
  const classes = useStyles();
  const { section, items: navItems } = useNavSchema();
  const Header = (
    <PageHeader
      logo={
        <Link href="/">
          <a className={classes.brandLink}>
            <Image width={100} height={50} src="/logo.svg" alt="logo" />
          </a>
        </Link>
      }
      showNavToggle
      isNavOpen={isNavOpen}
      logoComponent="div"
      onNavToggle={() => setIsnavOpen((prev) => !prev)}
    />
  );
  return (
    <Page
      sidebar={
        navItems.length > 0 ? (
          <PageSidebar
            isNavOpen={isNavOpen}
            nav={<Navigation section={section} items={navItems} />}
          />
        ) : undefined
      }
      className={classes.page}
      header={Header}
    >
      {children}
    </Page>
  );
};

export default BaseLayout;
