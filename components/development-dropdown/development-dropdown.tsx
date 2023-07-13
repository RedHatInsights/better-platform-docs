import React, { useEffect, useRef, useState } from "react";
import {
  Backdrop,
  FlexItem,
  Icon,
  MenuToggle,
  Panel,
  PanelMain,
  Popper,
  Sidebar,
  SidebarPanel,
  Tabs,
  Tab,
  TabTitleText,
  SidebarContent,
  Card,
  CardHeader,
  Title,
  CardActions,
  Button,
  CardBody,
  Gallery,
} from "@patternfly/react-core";
import CommandLineIcon from "../Navigation/command-line";
import sections from "../Navigation/sections/sections.json";
import TimesIcon from "@patternfly/react-icons/dist/esm/icons/times-icon";
import { SectionType } from "../Navigation/SectionNavigation";
import Link from "next/link";

const TabWrapper = ({
  title,
  eventKey,
}: {
  title: React.ReactNode;
  eventKey: string;
}) => {
  const tabRef = useRef<HTMLButtonElement>(null);
  return <Tab ref={tabRef} title={title} eventKey={eventKey} />;
};

const DevelopmentDropdown = () => {
  const [selectedService, setSelectedService] = useState(
    Object.values(sections)[0]
  );
  const [activeTabKey, setActiveTabKey] = useState(Object.keys(sections)[0]);
  const [isExpanded, setIsExpanded] = useState();
  const [] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const onToggleClick = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    setIsOpen(!isOpen);
  };

  const toggle = (
    <MenuToggle
      className="pf-m-full-height"
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
    >
      <Icon className="pf-u-m-sm" isInline>
        <CommandLineIcon width="20" height="20" />
      </Icon>
      Development
    </MenuToggle>
  );

  return (
    <Popper
      trigger={toggle}
      appendTo={document.body}
      isVisible={isOpen}
      popper={
        <div ref={menuRef}>
          <Backdrop>
            <Panel variant="raised" className="pf-u-p-0">
              <PanelMain>
                <Sidebar>
                  <SidebarPanel className="pf-l-flex pf-u-flex-direction-column">
                    <Tabs
                      inset={{
                        default: "insetNone",
                      }}
                      activeKey={activeTabKey}
                      onSelect={(_ev, tabKey) => {
                        setSelectedService(sections[tabKey as SectionType]);
                        setActiveTabKey(tabKey as string);
                      }}
                      isVertical
                      expandable={{
                        default: "expandable",
                        md: "nonExpandable",
                      }}
                      isExpanded={isExpanded}
                      toggleText="Foo"
                      role="region"
                      className="pf-u-p-md pf-u-pr-0"
                    >
                      {Object.entries(sections).map(([key, section]) => (
                        <TabWrapper
                          eventKey={key}
                          key={key}
                          title={<TabTitleText>{section.title}</TabTitleText>}
                        />
                      ))}
                    </Tabs>
                  </SidebarPanel>
                  <SidebarContent>
                    <Card isPlain>
                      <CardHeader className="pf-u-pr-xs pf-u-pr-md-on-md">
                        <Title headingLevel="h2">{selectedService.title}</Title>
                        <CardActions>
                          <Button
                            variant="plain"
                            aria-label="Close menu"
                            onClick={() => setIsOpen(!isOpen)}
                          >
                            <TimesIcon />
                          </Button>
                        </CardActions>
                      </CardHeader>
                      <CardBody>
                        <Gallery hasGutter>
                          {selectedService.items.map((item, key) => (
                            <Link key={key} href={item.href}>
                              <Card
                                isFullHeight
                                isFlat
                                isSelectableRaised
                                onClick={() => setIsOpen(!isOpen)}
                              >
                                {item.title}
                              </Card>
                            </Link>
                          ))}
                        </Gallery>
                      </CardBody>
                    </Card>
                  </SidebarContent>
                </Sidebar>
              </PanelMain>
            </Panel>
          </Backdrop>
        </div>
      }
    />
  );
};

export default DevelopmentDropdown;
