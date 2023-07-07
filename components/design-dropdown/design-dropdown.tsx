import React from "react";
import { Icon, MenuToggle } from "@patternfly/react-core";
import PenToolIcon from "../Navigation/pen-tool";

const DesignDropdown = () => {
  return (
    <MenuToggle className="pf-m-full-height">
      <Icon className="pf-u-mr-sm" isInline>
        <PenToolIcon />
      </Icon>
      Design
    </MenuToggle>
  );
};

export default DesignDropdown;
