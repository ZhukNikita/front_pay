import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};



function getStyles(brand, choosenbrands, theme) {
  return {
    backgroundColor: 'White',
    fontWeight:
    choosenbrands.indexOf(brand) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip({brands , choosenbrands , setChoosenBrands}) {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setChoosenBrands(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  return (
    <div>
      <FormControl sx={{
            width: 300, 
            backgroundColor:'white' ,
             borderRadius:'8px',
             fontFamily:"'Nunito' , sans-serif",
            '& .MuiOutlinedInput-root': {
              border: 'none', 
              backgroundColor:'white' ,

              '&:hover fieldset': {
                borderColor: 'transparent',
              },
            },
          }}>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={choosenbrands}
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 , outline:'none' }}>
              {selected.map((value) => (
                <Chip key={value.id} label={value.brand} sx={{fontFamily:"'Nunito' , sans-serif", fontWeight:'bold' }}/>
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {brands.map((brand) => (
            <MenuItem
              key={brand.id}
              value={brand}
              style={getStyles(brand, choosenbrands, theme)}
              sx={{fontFamily:"'Nunito' , sans-serif" , backgroundColor:'white' }}
            >
              {brand.brand}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
