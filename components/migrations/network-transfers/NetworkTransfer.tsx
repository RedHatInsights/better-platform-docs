import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartBarProps,
  ChartGroup,
  ChartTooltip,
  ChartVoronoiContainer,
} from "@patternfly/react-charts";
import { Title } from "@patternfly/react-core";
import clsx from "clsx";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  heading: {
    textAlign: "center",
  },
});

const data: {
  title: string;
  pf4: {
    transfer: number;
    buildSize: number;
  };
  pf5: {
    transfer: number;
    buildSize: number;
  };
}[] = [
  {
    title: "Sources",
    pf4: {
      transfer: 2545,
      buildSize: 3220,
    },
    pf5: {
      transfer: 767,
      buildSize: 2250,
    },
  },
];

const pf4TData = data.map(({ title, pf4 }) => ({
  name: "PF4",
  x: title,
  y: pf4.transfer,
}));
const pf5TData = data.map(({ title, pf5 }) => ({
  name: "PF5",
  x: title,
  y: pf5.transfer,
}));

const pf4BData = data.map(({ title, pf4 }) => ({
  name: "PF4",
  x: title,
  y: pf4.buildSize,
}));
const pf5BData = data.map(({ title, pf5 }) => ({
  name: "PF5",
  x: title,
  y: pf5.buildSize,
}));
const ChartBase = ({
  pf4Data,
  pf5Data,
  title,
}: {
  pf4Data: { name: string; x: string; y: number }[];
  pf5Data: { name: string; x: string; y: number }[];
  title: string;
}) => {
  return (
    <Chart
      title={title}
      containerComponent={
        <ChartVoronoiContainer
          labels={({ datum }) => `${datum.name}: ${datum.y}`}
          constrainToVisibleArea
        />
      }
      domain={{
        y: [
          0,
          Math.max(
            ...pf4Data?.map(({ y }) => y),
            ...pf5Data?.map(({ y }) => y)
          ) + 100,
        ],
      }}
      domainPadding={{ x: [30, 25] }}
      legendData={[{ name: "PF4" }, { name: "PF5" }]}
      legendOrientation="vertical"
      legendPosition="right"
      height={250}
      padding={{
        bottom: 50,
        left: 75,
        right: 200, // Adjusted to accommodate legend
        top: 20,
      }}
      width={600}
    >
      <ChartAxis />
      <ChartAxis dependentAxis showGrid />
      <ChartGroup animate offset={11}>
        <ChartBar data={pf4Data} />
        <ChartBar data={pf5Data} />
      </ChartGroup>
    </Chart>
  );
};

const NetworkTransfer = () => {
  return (
    <>
      <Title className={clsx("pf-u-mb-0")} headingLevel="h3">
        First load JS network transfer in kB
      </Title>
      <p>
        The following chart displays difference between UI module initial JS
        assets sizes. Lower is better.
      </p>
      <ChartBase
        pf4Data={pf4TData}
        pf5Data={pf5TData}
        title="First load JS network transfer in kB"
      />
      <Title className={clsx("pf-u-mb-0")} headingLevel="h3">
        Modules production build output
      </Title>
      <p>
        The following chart displays difference between UI module production
        build sizes. Lower is better.
      </p>
      <ChartBase
        pf4Data={pf4BData}
        pf5Data={pf5BData}
        title="First load JS network transfer in kB"
      />
    </>
  );
};

export default NetworkTransfer;
