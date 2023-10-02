import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid} from '@mui/x-data-grid';
import axios from 'axios';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'login',
    headerName: 'Логин',
    width: 150,
    editable: (params) => params.field === 'login',
  },
  {
    field: 'brand',
    headerName: 'Бренд',
    width: 150,
    editable:  (params) => params.field === 'brand',
  },
  {
    field: 'role',
    headerName: 'Роль',
    width: 160,
  },
];


export default function UsersTable({users}) {

  const [gridData, setGridData] = React.useState(users);

  const onEdit = async (params) => {
    const { field, id, value } = params;
    console.log(params)
    // Отправьте запрос на сервер для сохранения изменений в базе данных
    // и получите обновленные данные
    try {
      const response = await axios.patch('http://156.67.52.151:5000/editUser', {
        field,
        id,
        value,
      });

      // Обновите состояние данных с новыми данными с сервера
      setGridData(response.data);
    } catch (error) {
      console.error('Ошибка при редактировании пользователя:', error);
    }
  };
  if(!gridData) return <>Loading...</>
  return (
    <Box sx={{ height: 400, width: '100%'}}>
      <DataGrid
        rows={users}
        columns={columns}
        sx={{color:'white' , backgroundColor:'#325A96' , width:'92%' , margin:'0 auto', fontFamily:'"Nunito", sans-serif'  ,
         borderColor: 'black',
        '& .MuiDataGrid-cell:hover': {
          color: 'black',
        },
        '& .MuiDataGrid-cell': {
          fontSize: '18px',
        },
      }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 4,
            },
          },
        }}
        pageSizeOptions={[4]}
        editMode='cell'
        onCellEditStop={(params) => onEdit(params)}
        rowHeight={73} 
      />
    </Box>
  );
}
