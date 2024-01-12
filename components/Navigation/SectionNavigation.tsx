import Link from "next/link";
import sections from "./sections/sections.json";
import sectionMeta from "./section-meta.json";
import {
  Bullseye,
  Card,
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  CardBody,
  CardTitle,
  TextVariants,
} from "@patternfly/react-core";
import { createUseStyles } from "react-jss";
import classnames from "clsx";
import CommandLineIcon from "./command-line";
import PenToolIcon from "./pen-tool";
import React from "react";

const useStyles = createUseStyles({
  gallery: {
    columnCount: "auto",
    columnWidth: "330px",
  },
  card: {
    overflow: "hidden",
    breakInside: "avoid-column",
  },
  label: {
    padding:
      "var(--pf-global--spacer--sm) 12px var(--pf-global--spacer--sm) 12px",
  },
});

export type SectionType = keyof typeof sections;
export type SectionItem = {
  title: string;
  href: string;
  indexPage?: string;
  groupTitle?: string;
  groups?: { title: string }[];
};
export type NavSection = {
  title: string;
  items: SectionItem[];
  category?: string;
};
export type NavRecord = Partial<Record<SectionType, SectionItem[]>>;

const SectionNavigation = ({ navigations }: { navigations: SectionType[] }) => {
  const classes = useStyles();

  const getLabelProps = (
    category: string
  ): { labelColor: string; labelIcon: React.ReactNode } => {
    switch (category) {
      case "code":
        return {
          labelColor: "orange",
          labelIcon: <CommandLineIcon width="16" height="16" />,
        };
      case "design":
        return {
          labelColor: "purple",
          labelIcon: <PenToolIcon width="16" height="16" />,
        };
      default:
        return {
          labelColor: "purple",
          labelIcon: <PenToolIcon width="16" height="16" />,
        };
    }
  };

  return (
    <Gallery
      className={classnames(classes.gallery, "pf-u-display-block")}
      hasGutter
    >
      {navigations.flatMap((parentKey) => {
        const section = sections[parentKey as SectionType] as NavSection;
        const { title, items } = section;
        const category = sectionMeta[parentKey]?.category || "default";
        const { labelColor, labelIcon } = getLabelProps(category);

        return (
          <GalleryItem key={String(parentKey)}>
            <Card
              key={String(parentKey)}
              className={classnames(
                classes.card,
                "pf-u-display-block pf-u-mb-md pf-u-background-color-100"
              )}
              isSelectable
            >
              <CardTitle className="pf-u-pb-md">
                {title}
                <Label
                  color={labelColor as "orange" | "purple"}
                  className={classnames(classes.label, "pf-u-float-right")}
                >
                  {labelIcon}
                </Label>
              </CardTitle>
              <CardBody>
                <List isPlain>
                  {items.map(({ title, indexPage, href }, key) => (
                    <ListItem
                      key={`${String(parentKey)}-${key}`}
                      className="pf-u-font-size-sm pf-u-pb-sm"
                    >
                      <Link href={indexPage || href}>{title}</Link>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </GalleryItem>
        );
      })}
    </Gallery>
  );
};
export default SectionNavigation;
