import * as React from 'react';

import { PieChart, pieArcLabelClasses , pieArcClasses} from '@mui/x-charts/PieChart';



export default function PieChartWithCustomizedLabel({value,title}) {
  const data = [
    { label: title[1], value: value[2], color: 'rgb(255 45 38 / 76%)' , fill:'black' },
    { label: title[0], value: value[0], color: 'rgb(34, 154, 22)', fill:'white' },
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
    if(isNaN(percent.toFixed(0))){
      return ''
    }
    return `${(percent * 100).toFixed(0)}%`;
  };
  return (
    <PieChart
      series={[
        {
          outerRadius: 100,
          data,
          arcLabel: getArcLabel ,
          innerRadius: 40,
          paddingAngle: 5,
          cornerRadius: 12,
          startAngle: -90,
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {

          fontSize: 14,
          fontFamily:"'Nunito',sans-serif",
          fontWeight:'bold',
          '&:nth-of-type(1)': {
            fill: '#ffbac3',
          },
          '&:nth-of-type(2)': {
            fill: '#2edf1e',
          },
        },
        [`& .${pieArcClasses.root}`]: {
            stroke:'none',
        },
        
      }}
      {...sizing}
    />
  );
}
