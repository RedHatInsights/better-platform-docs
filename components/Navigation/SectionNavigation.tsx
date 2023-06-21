import Link from "next/link";
import sections from "./sections/sections.json";
import {
  Bullseye,
  Card,
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
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

const useStyles = createUseStyles({
  gallery: {
    columnCount: "auto",
    columnWidth: "330px",
  },
  card: {
    overflow: "hidden",
    breakInside: "avoid-column",
  },
});

const SectionNavigation = () => {
  const classes = useStyles();

  return (
    <Gallery className="pf-u-display-block" className={classnames(classes.gallery, "pf-u-display-block")} hasGutter>
      {Object.entries(sections).map(([parentKey, { title, items }]) => (
        <GalleryItem key={parentKey}>
          <Card key={parentKey} className={classnames(classes.card, "pf-u-display-block pf-u-mb-md pf-u-background-color-100")}  isSelectable>
            <CardTitle className="pf-u-pb-md">{title}</CardTitle>
            <CardBody>
              {items.map(({ title, href }, key) => (
                <TextContent className="pf-u-font-size-sm pf-u-pb-sm">
                  <Text key={`${parentKey}-${key}`} href={href} component={TextVariants.a} className="pf-u-mb-md">
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
