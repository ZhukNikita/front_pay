import User from "./User";
import styles from '../styles/UsersList.module.scss'
import {useState} from 'react'
import {Pagination} from "@mui/material";

export default function UserList ({users , setUsers}){
    const [usersPerPage ] = useState(5)
    const [currentPage , setCurrentPage] = useState(1)
    const indexOfLastUser = currentPage*usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    let currentUser = users.slice(indexOfFirstUser , indexOfLastUser)
    const pageNumbers = []
    for(let i = 0 ;  i <= (users.length - 1)/ usersPerPage ; i++){
        pageNumbers.push(i)
    }
    const paginate = pageNumber => setCurrentPage(pageNumber)
    return (
        <div className={styles.userList}>
            <div className={styles.search}>
                <input placeholder="Поиск"></input>
            </div>
            <div className={styles.header}>
                <h3 style={{width:'80px'}}>ID</h3>
                <h3 style={{width:'230px'}}>Логин</h3>
                <h3 style={{width:'200px'}}>Бренд</h3>
                <h3 style={{width:'200px'}}>Роль</h3>
                <h3 style={{width:'200px'}}>Пароль</h3>
            </div>
            {currentUser.map(el=><User key={el.id} user={el} setUsers={setUsers}/>)}
            <div style={{width:'100%' , display:'flex' , justifyContent:'right'}}><Pagination count={pageNumbers.length} color="primary" shape="rounded" onChange={(event , page)=> paginate(page)} /></div>
        </div>
    )
}