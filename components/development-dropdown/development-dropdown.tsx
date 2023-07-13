import React from "react";
import { Icon, MenuToggle } from "@patternfly/react-core";
import CommandLineIcon from "../Navigation/command-line";

const DevelopmentDropdown = () => {
  return (
    <MenuToggle className="pf-m-full-height">
      <Icon className="pf-u-m-sm" isInline>
        <CommandLineIcon width="20" height="20" />
      </Icon>
      Development
    </MenuToggle>
  );
};

export default DevelopmentDropdown;
