import React from 'react';
import styles from './P2PTransactionsList.module.scss';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RestoreIcon from '@mui/icons-material/Restore';
import Swal from 'sweetalert2';
import Tooltip from '@mui/material/Tooltip';


const theme = createTheme({
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    backgroundColor: '#325A96',
                    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.45)",
                },
            },
        },
    },
});


export default function DeletedTransaction({ transaction, setTransactions }) {

    const date = new Date(transaction.date);
    const deletedDate = new Date(transaction.deleteTime);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    const formattedDeletedDate = `${deletedDate.getDate()}-${(deletedDate.getMonth() + 1).toString().padStart(2, '0')}-${deletedDate.getFullYear()} ${deletedDate.getHours().toString().padStart(2, '0')}:${deletedDate.getMinutes().toString().padStart(2, '0')}:${deletedDate.getSeconds().toString().padStart(2, '0')}`;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const deleteOpen = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDeleteClose = () => {
        setAnchorEl(null);
    };

    const Delete = async () => {
        // Swal.fire({
        //     title: 'Вы уверенны?',
        //     text: "Вы не сможете восстановить транзакцию!",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#3085d6',
        //     cancelButtonColor: '#d33',
        //     confirmButtonText: 'Да',
        // }).then(async (result) => {
        //     if (result.isConfirmed) {
        //         try {
        //             const id = transaction.id
        //             const createdBy = secureLocalStorage.getItem('userId')
        //             const { data } = await axios.post('http://localhost:5000/p2pDeleteTransaction', { id, createdBy })
        //             axios.post('http://localhost:5000/p2pGetAllTransactions', { createdBy }).then(res => setTransactions(res.data))
        //             Swal.fire(
        //                 "",
        //                 'Транзакция успешно удалена!',
        //                 'success'
        //             )
        //             return data
        //         } catch (e) {
        //             console.log(e)
        //         }
        //     }
        // })
    }

    return (
        <div className={styles.transaction} style={{ position: 'relative' }}>
            <div className={styles.body}>
                <h3 className={styles.login}>{transaction.login}</h3>
                <h3 className={styles.brand}>{transaction.brand}</h3>
                <h3 className={styles.iban}>
                <Tooltip title={<span style={{fontFamily:"'Nunito',sans-serif" , fontSize:'14px'}}>{transaction.IBAN}</span>} arrow>
                    <span>
                    {transaction.IBAN.slice(0,8) + '*************' + transaction.IBAN.slice(-4)}
                    </span>
                </Tooltip>
                    </h3>
                <h3 className={styles.amount}>{transaction.amount}</h3>
                <h3 className={styles.date}>{formattedDate}</h3>
                <h3 className={styles.date}>{formattedDeletedDate}</h3>
                <h3 className={transaction.Status === '0' ? styles.status : styles.statusTrue}>
                    {transaction.Status === '0' ? <div>Не подтверждено</div> : <div>Подтверждено</div>}
                </h3>
                <span style={{ position: 'absolute', right: '0px' }}>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={deleteOpen ? 'long-menu' : undefined}
                        aria-expanded={deleteOpen ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{ marginRight: '20px' }}
                    >
                        <MoreVertIcon sx={{ color: 'white' }} />
                    </IconButton>
                    <ThemeProvider theme={theme}>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                                sx: { backgroundColor: '#325A96', color: 'white', borderRadius: '8px' }
                            }}
                            anchorEl={anchorEl}
                            open={deleteOpen}
                            onClose={handleDeleteClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >

                            <MenuItem onClick={() => { handleDeleteClose(); Delete() }} sx={{ color: 'rgb(183, 220, 233)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontFamily: "'Nunito',sans-serif" }}>
                                    <RestoreIcon />Восстановить <br /> транзакцию
                                </div>
                            </MenuItem>
                        </Menu>
                    </ThemeProvider>
                </span>
            </div>
        </div>
    );
}
