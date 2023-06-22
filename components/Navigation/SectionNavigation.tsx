import Link from "next/link";
import sections from "./sections/sections.json";
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
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { createUseStyles } from "react-jss";
import classnames from "clsx";
import CommandLineIcon from "./command-line";
// import PenToolIcon from './pen-tool';

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

const SectionNavigation = () => {
  const classes = useStyles();

  return (
    <Gallery
      className={classnames(classes.gallery, "pf-u-display-block")}
      hasGutter
    >
      {Object.entries(sections).map(([parentKey, { title, items }]) => (
        <GalleryItem key={parentKey}>
          <Card
            key={parentKey}
            className={classnames(
              classes.card,
              "pf-u-display-block pf-u-mb-md pf-u-background-color-100"
            )}
            isSelectable
          >
            <CardTitle className="pf-u-pb-md">
              {title}
              <Label
                color="orange"
                className={classnames(classes.label, "pf-u-float-right")}
              >
                <CommandLineIcon />
              </Label>
              {/*<Label color="purple" className={classnames(classes.label, "pf-u-float-right")}><PenToolIcon/></Label>*/}
            </CardTitle>
            <CardBody>
              {items.map(({ title, href }, key) => (
                <TextContent
                  key={`${parentKey}-${key}`}
                  className="pf-u-font-size-sm pf-u-pb-sm"
                >
                  <Text
                    href={href}
                    component={TextVariants.a}
                    className="pf-u-mb-md"
                  >
                    {title}
                  </Text>
                </TextContent>
              ))}
            </CardBody>
          </Card>
        </GalleryItem>
      ))}
    </Gallery>
  );
};
export default SectionNavigation;
