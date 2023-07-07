import React from "react";
import { Icon, MenuToggle } from "@patternfly/react-core";
import CommandLineIcon from "../Navigation/command-line";

const DevelopmentDropdown = () => {
  return (
    <MenuToggle className="pf-m-full-height">
      <Icon className="pf-u-mr-sm" isInline>
        <CommandLineIcon />
      </Icon>
      Development
    </MenuToggle>
  );
};

export default DevelopmentDropdown;
