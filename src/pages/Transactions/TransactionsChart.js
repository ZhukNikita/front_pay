import * as React from 'react';

import { PieChart, pieArcLabelClasses , pieArcClasses} from '@mui/x-charts/PieChart';



export default function PieChartWithCustomizedLabel({value,title}) {
  if(!value){
    return <div>Loading</div>
  }
  const data = [
    { label: title[1], value: value[2], color: 'rgba(255, 72, 66, 0.66)' },
    { label: title[0], value: value[0], color: 'rgb(34, 154, 22)' },
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
          fill: 'black',
          fontSize: 14,
          fontFamily:"'Nunito',sans-serif",
          fontWeight:'bold'
        },
        [`& .${pieArcClasses.root}`]: {
            stroke:'none',
        },
      }}
      {...sizing}
    />
  );
}
