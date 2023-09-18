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

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', brand: 'VetalInvest' , role:'Адмін' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', brand: 'RiseInvest', role:'Финансист' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', brand: 'Revolut', role:'Супер Пользователь' },
  { id: 4, lastName: 'Stark', firstName: 'Arya', brand: 'InfinityInvest', role:'Супер Пользователь' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', brand: 'RiseInvest', role:'Супер Пользователь' },
  { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', brand: 'Revolut', role:'Финансист' },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', brand: 'InfinityInvest', role:'Супер Пользователь' },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', brand: 'RiseInvest', role:'Супер Пользователь' },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', brand: 'RiseInvest', role:'Финансист' },
];

export default function UsersTable({users}) {

  const [gridData, setGridData] = React.useState(users);

  const onEdit = async (params) => {
    const { field, id, value } = params;
    console.log(params)
    // Отправьте запрос на сервер для сохранения изменений в базе данных
    // и получите обновленные данные
    try {
      const response = await axios.patch('http://localhost:5000/editUser', {
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
