import Link from "next/link";
import sections from "./sections/sections.json";
import {
  Bullseye,
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
  Card,
  List,
  ListItem,
  CardBody,
  CardTitle,
} from "@patternfly/react-core";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  description: {
    color: "black",
    fontSize: "var(--pf-global--FontSize--sm)",
  },
  cardBody: {
    overflow: "hidden",
    height: 130,
  },
  link: {
    textDecoration: "none",
  },
  card: {
    height: 210,
    textDecoration: "none",
    letterSpacing: 2,
    "& .pf-c-card__title": {
      background: "var(--pf-global--BackgroundColor--dark-400)",
      color: "var(--pf-global--Color--light-200)",
      height: 80,
    },
    "&:hover": {
      "& .pf-c-card__title": {
        background: "var(--pf-global--BackgroundColor--dark-200)",
      },
    },
  },
});

const SectionNavigation = () => {
  const classes = useStyles();
  return (
    <Gallery hasGutter>
      {Object.entries(sections).map(([parentKey, { title, items }]) => (
        <GalleryItem key={parentKey}>
          <Card key={parentKey} className={classes.card} isSelectable>
            <CardTitle className="pf-u-pb-lg">{title}</CardTitle>
            <CardBody>
              <List isPlain>
                {items.map(({ title, href }, key) => (
                  <ListItem key={`${parentKey}-${key}`}>
                    <Link href={href}>{title}</Link>
                  </ListItem>
                ))}
              </List>
            </CardBody>
          </Card>
        </GalleryItem>
      ))}
    </Gallery>
  );
};
export default SectionNavigation;
