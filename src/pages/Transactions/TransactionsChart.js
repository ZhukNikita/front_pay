import * as React from 'react';

import { PieChart, pieArcLabelClasses , pieArcClasses} from '@mui/x-charts/PieChart';

const data = [
  { label: 'Group A', value: 333, color: '#325A96' },
  { label: 'Group B', value: 333, color: 'rgb(122, 12, 56)' },
  { label: 'Group C', value: 333, color: 'rgb(84, 214, 44)' },
];

const sizing = {
  margin: { right: 5 },
  width: 200,
  height: 200,
  legend: { hidden: true },
};
const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);

const getArcLabel = (params) => {
  const percent = params.value / TOTAL;
  return `${(percent * 100).toFixed(0)}%`;
};

export default function PieChartWithCustomizedLabel() {
  return (
    <PieChart
      series={[
        {
          outerRadius: 80,
          data,
          arcLabel: getArcLabel,
          innerRadius: 30,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontSize: 14,
        },
        [`& .${pieArcClasses.root}`]: {
            stroke:'none',
        },
      }}
      {...sizing}
    />
  );
}
