import * as React from 'react';

import { PieChart, pieArcLabelClasses , pieArcClasses} from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';


export default function PieChartWithCustomizedLabel({value,title,totalTransactions}) {
  const data = [
    { label: title[1], value: value[1], color: 'rgb(255 45 38 / 76%)' , fill:'black' },
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
    return ``;
  };
  const StyledText = styled('text')(({ theme }) => ({
    fill: '#b7dce9',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
  }));
  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }
  return (
    <PieChart
      series={[
        {
          outerRadius: 100,
          data,
          arcLabel: getArcLabel ,
          innerRadius: 40,
          cornerRadius: 12,
          startAngle: 0,
          endAngle: 360,
          paddingAngle:  5
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
            transition:'all 0.5s ease',
        },
        
      }}
      {...sizing}
    >
      <PieCenterLabel>{totalTransactions}</PieCenterLabel>
    </PieChart>
  );
}
