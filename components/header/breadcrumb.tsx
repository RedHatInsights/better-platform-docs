import React from "react";
import { useRouter } from "next/router";
import { Breadcrumb, BreadcrumbItem, Skeleton } from "@patternfly/react-core";

export const DocsBreadcrumb: React.FunctionComponent = () => {
  const router = useRouter();
  const paths = router.pathname.split("/").slice(1);

  const breadcrumbs: { title: string; link: string }[] = [];
  paths.map((p, index) => {
    breadcrumbs.push({
      title: `${p}`,
      link: `/${paths.slice(0, index + 1).join("/")}`,
    });
  });

  return (
    <Breadcrumb className="pf-v5-u-pt-sm" aria-label="breadcrumb">
      {breadcrumbs &&
        breadcrumbs.map((b, index) =>
          index !== breadcrumbs.length - 1 ? (
            <BreadcrumbItem
              key={b.title}
              to={b.link}
              isActive
              className="pf-v5-u-pb-sm"
            >
              {b.title}
            </BreadcrumbItem>
          ) : (
            <Skeleton />
          )
        )}
    </Breadcrumb>
  );
};
