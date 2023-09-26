import React, { useState, useEffect } from 'react';
import User from './User';
import styles from '../styles/UsersList.module.scss';
import { Pagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import secureLocalStorage from 'react-secure-storage';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: '15px',
  backgroundColor: '#233e68',
  width: "300px"
};

const arrowDownStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(180deg)', cursor: 'pointer' }
const arrowUpStyle = { width: '17px', transition: 'all 0.3s ease', transform: 'rotate(0deg)', cursor: 'pointer' }

export default function UserList({ users, setUsers }) {
  const [usersPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [checkbox, setCheckbox] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false)
  const [deletePayment, setDeletePayments] = React.useState('');
  const [deletePaymentError, setDeletePaymentError] = React.useState('')
  const [snack, setSnack] = React.useState(false);
  const [snackError, setSnackError] = React.useState('')
  const [roleSort, setRoleSort] = React.useState(null)
  const [brandSort, setBrandSort] = React.useState(null)
  const [loginSort, setLoginSort] = React.useState(null)
  const [deleteOrAddPayment, setDeleteOrAddPayment] = React.useState('')
  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnack(false);
  };
  useEffect(() => {
    if (loginSort) {
      const sortedUsers = [...users].sort((a, b) => a.login.localeCompare(b.login));
      setUsers(sortedUsers);
      setBrandSort(null)
      setRoleSort(null)
    }
    if (loginSort === false) {
      const sortedUsers = [...users].sort((a, b) => b.login.localeCompare(a.login));
      setUsers(sortedUsers);
      setBrandSort(null)
      setRoleSort(null)
    }
  }, [loginSort]);
  useEffect(() => {
    if (roleSort) {
      const sortedUsers = [...users].sort((a, b) => a.role.localeCompare(b.role));
      setUsers(sortedUsers);
      setBrandSort(null)
      setLoginSort(null)
    }
    if (roleSort === false) {
      const sortedUsers = [...users].sort((a, b) => b.role.localeCompare(a.role));
      setUsers(sortedUsers);
      setBrandSort(null)
      setLoginSort(null)
    }
  }, [roleSort]);
  useEffect(() => {
    if (brandSort) {
      const sortedUsers = [...users].sort((a, b) => a.brand.localeCompare(b.brand));
      setUsers(sortedUsers);
      setRoleSort(null)
      setLoginSort(null)
    }
    if (brandSort === false) {
      const sortedUsers = [...users].sort((a, b) => b.brand.localeCompare(a.brand));
      setUsers(sortedUsers);
      setRoleSort(null)
      setLoginSort(null)
    }
  }, [brandSort]);

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  useEffect(() => {
    if (users) {
      const filtered = users.filter(
        (user) => user.login.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [users, search]);

  const totalFilteredUsers = filteredUsers.length;
  const totalPageCount = Math.ceil(totalFilteredUsers / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUser = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allUserIds = filteredUsers.map((user) => user.id);
      setCheckbox(allUserIds);
    } else {
      setCheckbox([]);
    }
  };
  const Delete = async () => {
    const createdBy = secureLocalStorage.getItem('userId')

    try {
      const { data } = await axios.post('http://localhost:5000/deletePayment', { deletePayment, checkbox })
      await axios.post('http://localhost:5000/users', { createdBy }).then(res => setUsers(res.data.reverse()))
      return data
    } catch (e) {
      console.log(e)
    } finally {
      handleCloseDeleteModal()
    }
  }
  const AddPayment = async ()=>{
    const createdBy = secureLocalStorage.getItem('userId')
    try {
      const { data } = await axios.post('http://localhost:5000/addPayment', { deletePayment, checkbox })
      await axios.post('http://localhost:5000/users', { createdBy }).then(res => setUsers(res.data.reverse()))
      return data
    } catch (e) {
      console.log(e)
    } finally {
      handleCloseDeleteModal()
    }
  }
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="warning"
        onClick={handleCloseSnack}

      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <div className={styles.userList}>
      <div className={styles.search}>
        <input
          name='Search'
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.buttons}>
          <button onClick={() => {
            if (checkbox.length === 0) {
              setSnackError('Не выбран ни один пользователь!')
              setSnack(true)
            } else {
              setDeleteOrAddPayment('add')
              handleOpenDeleteModal()
            }
          }}><AddIcon />Добавить метод</button>
          <button className={styles.deleteButton} onClick={() => {
            if (checkbox.length === 0) {
              setSnackError('Не выбран ни один пользователь!')
              setSnack(true)
            } else {
              setDeleteOrAddPayment('delete')
              handleOpenDeleteModal()
            }
          }}>
            <DeleteIcon />Удалить метод
          </button>
        </div>
      </div>
      <div className={styles.header}>
        <h3 className={styles.checkbox}>
          {
            users.length > 0 ?
              <Checkbox
                sx={{
                  color: '#b7dce9',
                  '&.Mui-checked': {
                    color: '#b7dce9',
                  },
                }}
                checked={selectAll}
                onChange={() => handleSelectAll()}
              /> : ''
          }
        </h3>
        <h3 className={styles.login}>Логин
          <ArrowUpwardIcon
            onClick={() => { loginSort ? setLoginSort(!loginSort) : setLoginSort(true) }}
            sx={loginSort ?
              arrowDownStyle
              : arrowUpStyle}
          />
        </h3>
        <h3 className={styles.password} >Пароль</h3>
        <h3 className={styles.brand}>Бренд
          <ArrowUpwardIcon
            onClick={() => { brandSort ? setBrandSort(!brandSort) : setBrandSort(true) }}
            sx={brandSort ?
              arrowDownStyle
              : arrowUpStyle}
          />
        </h3>
        <h3  className={styles.role} >Роль
          <ArrowUpwardIcon
            onClick={() => { roleSort ? setRoleSort(!roleSort) : setRoleSort(true) }}
            sx={roleSort ?
              arrowDownStyle
              : arrowUpStyle}
          />
        </h3>
        <h3 style={{ width: '190px' }}>Платежные методы</h3>
      </div>
      {currentUser.map((el) => (
        <User key={el.id} user={el} users={users} setCheckbox={setCheckbox} selectAll={selectAll} setSelectAll={setSelectAll} checkbox={checkbox} setUsers={setUsers} />
      ))}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'right',
          padding: '10px 0px',
        }}
      >
        <Pagination
          count={totalPageCount}
          color="primary"
          shape="rounded"
          page={currentPage}
          onChange={(event, page) => paginate(page)}
        />
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openDeleteModal}>
          <Box sx={style}>
            <h3 style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: "'Nunito',sans-serif", marginBottom: '0px' }}>
            {deleteOrAddPayment ==='delete'? 'Удаление платёжного метода' : 'Добавление платёжного метода'}
            </h3>
            <h4 style={{ color: 'white', fontFamily: "'Nunito' , sans-serif", margin: '0' }}>Выберите платежныe методы</h4>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Платёжный метод</label>
              <select onChange={(e) => { setDeletePayments(e.target.value); setDeletePaymentError('') }} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                <option value="">None</option>
                <option value="1">PinPay</option>
                <option value="2">Inserix</option>
                <option value="3">P2P</option>
              </select>
              {
                deletePaymentError && <div style={{ color: 'red', fontSize: '13px', margin: '0', fontFamily: "'Nunito',sans-serif", fontWeight: 'bold' }}>{deletePaymentError}</div>
              }
            </div>
            {
              !deletePaymentError && deletePayment ? 
                <button onClick={deleteOrAddPayment ==='delete'?Delete:AddPayment} 
              style={{ padding: '15px 20px',
               fontFamily: '"Nunito"  ,sans-serif',
               color: 'white',
               fontSize: '18px',
               border: '1px solid #38b6ff',
               borderRadius: '8px',
               backgroundColor: '#38b6ff',
               cursor: 'pointer' }}>{deleteOrAddPayment ==='delete'?'Удалить':'Добавить'}</button>
                : <button onClick={() => setDeletePaymentError('Выберите платежный метод')} 
                style={{ padding: '15px 20px',
                 color: 'white',
                 fontFamily: '"Nunito"  ,sans-serif',
                 fontSize: '18px',
                 border: '1px solid #38b6ff',
                 borderRadius: '8px',
                 background: 'none',
                 cursor: 'pointer' }}>{deleteOrAddPayment ==='delete'?'Удалить':'Добавить'}</button>
            }
          </Box>
        </Fade>
      </Modal>
      <div>
        <Snackbar
          open={snack}
          autoHideDuration={4000}
          onClose={handleCloseSnack}
          message={snackError}
          action={action}
        >
          <Alert severity="warning" sx={{fontFamily:"'Nunito' , sans-serif"}}>{snackError}</Alert>

        </Snackbar>
      </div>
    </div>
  );
}
