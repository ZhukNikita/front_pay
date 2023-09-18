import styles from '../styles/UsersList.module.scss'
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function User ({user,setUsers}){

    const Delete = ()=>{
        Swal.fire({
            title: 'Вы уверенны?',
            text: "Вы не сможете восстановить пользователя!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да',
          }).then(async (result) => {
            if (result.isConfirmed) {
                try{
                   const createdBy = secureLocalStorage.getItem('userId')
                    const id = user.id
                    const {data} = await axios.post('http://localhost:5000/deleteUser',{id});
                    await axios.post('http://localhost:5000/users',{createdBy}).then(res=> setUsers(res.data[0].reverse()));
                }
                catch(e){
                    console.log(e)
                }
              Swal.fire(
                "",
                'Пользователь удалён!',
                'success'
              )
            }
          })
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const options = [
        'Изменить',
        'Удалить',
      ];
      const ITEM_HEIGHT = 48;
    return(
        <div className={styles.user}>
            <h3 style={{width:'80px'}}>{user.id}</h3>
            <h3 style={{width:'230px'}}>{user.login}</h3>
            <h3 style={{width:'200px'}}>{user.brand}</h3>
            <h3 style={{width:'200px'}}>{user.role}</h3>
            <h3 style={{width:'200px'}}>{atob(user.password)}</h3>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <EditIcon/>
                    </div>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <DeleteIcon/>
                    </div>
                </MenuItem>
            </Menu>
            {/* <Button variant="contained" sx={{width:'30px'}}><EditIcon/></Button>
            <Button variant="contained" sx={{width:'30px' , marginLeft:'10px', backgroundColor:'rgb(223, 86, 86)'}} onClick={Delete}><DeleteIcon/></Button> */}

            
        </div>
    )
}