import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageToggleButton,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { BarsIcon } from "@patternfly/react-icons";
import { style } from "typestyle";
import { global_palette_white } from "@patternfly/react-tokens";

interface docsBreadCrumbProps {
  isNavOpen: boolean;
  onNavToggle: () => void;
}

const docsBreadcrumbClassName = style({
  color: global_palette_white.value,
});

export const DocsBreadcrumb: React.FunctionComponent<docsBreadCrumbProps> = (
  props
) => {
  return (
    <Split>
      <SplitItem>
        <PageToggleButton
          isNavOpen={props.isNavOpen}
          onNavToggle={props.onNavToggle}
        >
          <BarsIcon className="pf-u-mb-md" />
        </PageToggleButton>
      </SplitItem>
      <SplitItem>
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbItem to="#">fake text</BreadcrumbItem>
          <BreadcrumbItem to="#">fake text</BreadcrumbItem>
          <BreadcrumbItem to="#">fake text</BreadcrumbItem>
        </Breadcrumb>
      </SplitItem>
    </Split>
  );
};
