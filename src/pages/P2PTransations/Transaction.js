import React, { useRef, useState } from 'react';
import styles from './P2PTransactionsList.module.scss';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import secureLocalStorage from 'react-secure-storage';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import Tooltip from '@mui/material/Tooltip';
import $api from '../../axios';

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
    width: "300px",
    border: 'none'
};

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
function FileUploadModal({ selectedFile, open, handleClose, handleUpload }) {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <h3 style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: "'Nunito',sans-serif", margin: '0px' }}>Ваш чек</h3>
                    {selectedFile && (
                        <div>
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Предварительный просмотр файла"
                                style={{ maxWidth: '100%', maxHeight: '300px' }}
                            />
                            {/* Здесь можно добавить дополнительные элементы для предварительного просмотра и действий */}
                        </div>
                    )}
                    <button onClick={handleUpload}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: "'Nunito',sans-serif",
                            border: 'none',
                            backgroundColor: '#38b6ff',
                            color: 'white',
                            padding: '10px',
                            gap: '5px',
                            borderRadius: '6px'
                        }}
                    >
                        <UploadFileIcon />Загрузить</button>

                </Box>
            </Fade>
        </Modal>
    );
}

export default function Transaction({ transaction, setTransactions }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const date = new Date(transaction.date);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    const fileInputRef = useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const deleteOpen = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDeleteClose = () => {
        setAnchorEl(null);
    };
    const handleUploadIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const Delete = async () => {
        Swal.fire({
            title: 'Вы уверенны?',
            text: "Вы не сможете восстановить транзакцию!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const id = transaction.id
                    const createdBy = secureLocalStorage.getItem('userId')
                    const { data } = await $api.post('/p2pDeleteTransaction', { id, createdBy })
                    await $api.post('/p2pGetAllTransactions', { createdBy }).then(res => setTransactions(res.data))
                    Swal.fire(
                        "",
                        'Транзакция успешно удалена!',
                        'success'
                    )
                    return data
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }
    const addImg = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            handleOpen();
        }
    };

    const handleUpload = async () => {
        const id = transaction.id
        const img = new FormData();
        img.append('image', selectedFile);
        const createdBy = secureLocalStorage.getItem('userId')


        try{
           await $api.patch(`/uploadP2PTransactionCheck/:${id}` , img ,{
                headers:{
                    'content-type': "mulpipart/form-data"
                }})
            await $api.post('/p2pGetAllTransactions', {createdBy}).then(res => setTransactions(res.data))

        } catch (e) {
            console.log(e)
        }
        handleClose();
    };

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
                <h3 className={styles.amount}>{formattedDate}</h3>
                <h3 className={transaction.Status === '0' ? styles.status : styles.statusTrue}>
                    {transaction.Status === '0' ? <div>Не подтверждено</div> : <div>Подтверждено</div>}
                </h3>
                <input
                    ref={fileInputRef}
                    type='file'
                    style={{ display: 'none' }}
                    onChange={addImg}
                    accept="image/png, image/gif, image/jpeg"
                    name='file'
                />
                <UploadFileIcon
                    sx={{ width: '7vw', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={handleUploadIconClick}
                />
                <FileUploadModal
                    selectedFile={selectedFile}
                    open={open}
                    handleClose={handleClose}
                    handleUpload={handleUpload}
                />
                {
                    secureLocalStorage.getItem('role') === 'SuperAdmin'?
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

                            <MenuItem onClick={() => { handleDeleteClose(); Delete() }} sx={{ color: 'rgb(255, 72, 66)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontFamily: "'Nunito',sans-serif" }}>
                                    <DeleteIcon />Удалить <br /> транзакцию
                                </div>
                            </MenuItem>
                        </Menu>
                    </ThemeProvider>
                </span>
                :''
                }
            </div>
        </div>
    );
}
