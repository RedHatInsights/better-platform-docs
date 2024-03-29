import React from "react";
import { usePathname } from "next/navigation";
import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  FlexItem,
  PageBreadcrumb,
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/js/icons/bars-icon";

import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useStyles = createUseStyles({
  breadcrumbs: {
    backgroundColor: "var(--pf-global--BackgroundColor--dark-300) !important;",
  },
  breadcrumbItem: {
    color: "var(--pf-global--link--Color--light)",
  },
});

export const DocsBreadcrumb: React.FunctionComponent = () => {
  const paths = usePathname();
  const setPaths = paths.split("/").slice(1);
  const classes = useStyles();

  const breadcrumbs: { title: string; link: string }[] = [];
  setPaths.map((p, index) => {
    breadcrumbs.push({
      title: `${p}`,
      link: `/platform-docs/${setPaths.slice(0, index + 1).join("/")}`,
    });
  });

  return (
    <PageBreadcrumb
      className={clsx("pf-u-p-0", classes.breadcrumbs)}
      aria-label="breadcrumb"
    >
      <div className="pf-u-display-flex pf-u-justify-content-space-between pf-u-pt-xs pf-u-pb-0 pf-u-pl-md">
        <FlexItem>
          <div className="pf-c-masthead__toggle">
            <Button className="pf-m-plain">
              <BarsIcon />
            </Button>
          </div>
        </FlexItem>
        <FlexItem className="pf-u-flex-grow-1">
          <Breadcrumb className="pf-u-pt-md">
            {breadcrumbs.map((b) => (
              <BreadcrumbItem
                key={b.title}
                to={b.link}
                isActive
                className={clsx("pf-u-p-0", classes.breadcrumbItem)}
              >
                {b.title}
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        </FlexItem>
      </div>
    </PageBreadcrumb>
  );
};
