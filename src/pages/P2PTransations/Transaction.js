import React, { useRef, useState } from 'react';
import styles from './P2PTransactionsList.module.scss';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

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
    border:'none'
};
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

export default function Transaction({ transaction , setTransactions }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const date = new Date(transaction.date);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    const fileInputRef = useRef(null);

    const handleUploadIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

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
           await axios.patch(`http://156.67.52.151:5000/uploadP2PTransactionCheck/:${id}` , img ,{
                headers:{
                    'content-type': "mulpipart/form-data"
                }})
            await axios.post('http://156.67.52.151:5000/p2pGetAllTransactions', {createdBy}).then(res => setTransactions(res.data))

        }catch(e){
            console.log(e)
        }
        handleClose();
    };

    return (
        <div className={styles.transaction}>
            <div className={styles.body}>
                <h3 className={styles.login}>{transaction.login}</h3>
                <h3 className={styles.brand}>{transaction.brand}</h3>
                <h3 className={styles.iban}>{transaction.IBAN}</h3>
                <h3 className={styles.amount}>{transaction.amount}</h3>
                <h3 className={styles.amount}>{formattedDate}</h3>
                <h3 className={transaction.Status === '0' ? styles.status : styles.statusTrue}>
                    {transaction.Status === '0' ? <span>Не подтверждено</span> : <span>Подтверждено</span>}
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
            </div>
        </div>
    );
}
