import React from "react";
import { Icon, MenuToggle } from "@patternfly/react-core";
import PenToolIcon from "../Navigation/pen-tool";

const DesignDropdown = () => {
  return (
    <MenuToggle className="pf-m-full-height">
      <Icon className="pf-u-m-sm" isInline>
        <PenToolIcon width="22" height="22" />
      </Icon>
      Design
    </MenuToggle>
  );
};

export default DesignDropdown;
