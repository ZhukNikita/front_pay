import React, { useState, useEffect } from 'react';
import User from './User';
import styles from '../styles/UsersList.module.scss';
import { Pagination } from '@mui/material';

export default function UserList({ users, setUsers }) {
  const [usersPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);

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


  return (
    <div className={styles.userList}>
      <div className={styles.search}>
        <input
        name='Search'
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.header}>
        <h3 style={{ width: '4vw' }}>ID</h3>
        <h3 style={{ width: '11vw' }}>Логин</h3>
        <h3 style={{ width: '10vw' }}>Пароль</h3>
        <h3 style={{ width: '140px' }}>Бренд</h3>
        <h3 style={{ width: '130px' }}>Роль</h3>
        <h3 style={{ width: '190px' }}>Платежные методы</h3>
      </div>
      {currentUser.map((el) => (
        <User key={el.id} user={el} users={users} setUsers={setUsers} />
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
    </div>
  );
}
