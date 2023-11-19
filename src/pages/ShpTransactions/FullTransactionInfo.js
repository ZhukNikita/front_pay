import React, { useEffect, useState, useMemo, useRef } from 'react';
import styles from './FullTransactionInfo.module.scss'
import { useParams } from 'react-router-dom';
import $api, { API_URL } from '../../axios';
import NavBar from '../../components/NavBar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from "@mui/icons-material/Info";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useLocation } from 'react-router-dom';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import secureLocalStorage from 'react-secure-storage';
import LinearProgress from '@mui/material/LinearProgress';
import PinpayImgRow from './ShpImgRow';

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
    width: '550px',
    outline: 'none'
};

function FileUploadModal({ selectedFile, openPreview, handleClose, handleUpload }) {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openPreview}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={openPreview}>
                <Box sx={style}>
                    <h3 style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: "'Nunito',sans-serif", margin: '0px' }}>Ваш чек</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {selectedFile ? selectedFile.map(el => (
                            <div key={el.name} >
                                <img
                                    src={URL.createObjectURL(el)}
                                    alt="Предварительный просмотр файла"
                                    style={{ width: '250px', height: '250px' }}
                                />
                            </div>
                        )) : ''}
                    </div>


                    <button onClick={() => { handleUpload(); handleClose() }}
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


export default function FullTransactionInfo({ setSnack, setSnackMessage, setSnackType }) {
    const [transaction, setTransaction] = useState()
    const [imgs, setImgs] = useState([])
    const [fullImg, setFullImg] = useState('')
    const { id } = useParams();
    const [info, setInfo] = useState(false);
    const [open, setOpen] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)
    const handleOpen = () => setOpen(true);
    const [rowId, setRowId] = useState(null)
    const handleOpenPreview = () => setOpenPreview(true);
    const handleClose = () => { setOpen(false); setFullImg('') };
    const handleClosePreview = () => { setOpenPreview(false); setFullImg(''); setSelectedFile(null) };
    function useQuery() {
        const { search } = useLocation();
        return useMemo(() => new URLSearchParams(search), [search]);
    }

    let query = useQuery();
    const handleUploadIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const addImg = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFilesArray = Array.from(files);
            setSelectedFile(selectedFilesArray);
            handleOpenPreview();
        }
    };

    useEffect(() => {
        const payment_id = id
        setIsLoading(true)
        try {
            $api.post('/getOneTransation', { payment_id }).then(res => setTransaction(res.data))
            $api.post('/getImgsPinPayTransation', { id }).then(res => setImgs(res.data))
            if (transaction) {
                setIsLoading(false)
            }

        } catch (e) {
            console.log(e)
        }
    }, [])

    if (!transaction) {
        return (
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {
                    isLoading && (<LinearProgress sx={{ width: '45%', color: "white" }} color='inherit' />)
                }
            </div>)
    }

    function getStatus(status) {
        if (status === 'completed') {
            return (<div className={styles.success}><CheckCircleIcon /> {status}</div>)
        } if (status === 'failed') {
            return (<div className={styles.rejected}><CancelIcon /> {status}</div>)
        } else {
            return status
        }
    }

    function getFormattedDate(param) {
        const date = new Date(param);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate
    }
    const handleUpload = async () => {
        const id = transaction.payment_id

        const img = new FormData();
        selectedFile.forEach((file, index) => {
            img.append(`image`, file);
        });

        try {
            await $api.patch(`/uploadPinpayCheck/:${id}?login=${secureLocalStorage.getItem('userLogin')}&payment_method=PinPay`, img, {
                headers: {
                    'content-type': 'mulpipart/form-data',
                },
            });
            await $api.post('/getImgsPinPayTransation', { id }).then(res => setImgs(res.data))
            setSnackMessage('Фото успешно загружено');
            setSnackType('success');
            setSnack(true)

        } catch (e) {
            console.log(e)
        }
    };
    return (
        <div className={styles.body}  onClick={() => isMenuOpen ? setIsMenuOpen(false) : ''}>
            <NavBar />
            <div className={styles.content}>
                <div className={styles.transactionBody}>
                    <div className={styles.header}>
                        <h1>Транзакция #
                            <span style={{ fontSize: '16px', backgroundColor: '#153769', padding: '7px', borderRadius: '8px' }}>
                                {transaction.payment_id}
                            </span>
                        </h1>
                        {getStatus(transaction.transaction_status)}
                    </div>
                    <div className={styles.section}>
                        <div className={styles.section1}>
                            <div className={styles.amount}>
                                <h2>Сумма: </h2>
                                <span style={transaction.transaction_status === 'completed' ? { fontSize: '24px', color: "#2edf1e" } : { fontSize: '24px', color: "rgb(255 ,0, 34)" }}>
                                    {transaction.amount}€
                                </span>
                            </div>
                            <div className={styles.date}>
                                <h2>Дата:</h2> <span>{getFormattedDate(transaction.create_date)}</span>
                            </div>
                            <div className={styles.date}>
                                <h2>Бренд:</h2> <span>{query.get('brand')}</span>
                            </div>
                        </div>
                        <div className={styles.section2}>
                            <div className={styles.currency}>
                                <h2>Валюта:</h2> <span style={{ fontSize: '24px' }}>{transaction.currency}</span>
                            </div>
                            <div className={styles.card}>
                                <h2>Номер карты:</h2> <span>{transaction.card_pan}</span>
                            </div>
                            <div className={styles.card}>
                                <h2>Email:</h2> <span>{query.get('email')}</span>
                            </div>
                        </div>
                        <div className={styles.section3}>
                            <div className={styles.imgs}>
                                <h2>Загруженные чеки:
                                    <input
                                        ref={fileInputRef}
                                        type='file'
                                        style={{ display: 'none' }}
                                        onChange={addImg}
                                        accept="image/png, image/gif, image/jpeg"
                                        name='file'
                                        multiple
                                    />
                                    <span className={styles.uploadImg} onClick={handleUploadIconClick}>
                                        <UploadFileIcon
                                            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', zIndex: 0 }}

                                        /> Загрузить Чек
                                    </span>

                                    <FileUploadModal
                                        selectedFile={selectedFile}
                                        openPreview={openPreview}
                                        handleClose={handleClosePreview}
                                        handleUpload={handleUpload}
                                    />
                                </h2>
                                <div className={styles.imgList}>
                                    <div className={styles.listHeader}>
                                        <h3 className={styles.headerimg} style={{ width: '6vw' }}>Чек
                                            <InfoIcon style={{ height: '18px', width: '18px', color: 'black' }} onMouseEnter={() => setInfo(true)} onMouseLeave={() => setInfo(false)} />
                                            {
                                                info && (<span className={styles.infoBlock}>Нажмите на фото для просмотра чека</span>)
                                            }
                                        </h3>
                                        <h3 style={{ width: '9vw' }}>Дата загрузки</h3>
                                        <h3 style={{ width: '8vw' }}>Загружено</h3>
                                    </div>

                                    {imgs.map(el =>
                                        <PinpayImgRow key={el.id}
                                            el={el}
                                            handleOpen={handleOpen}
                                            rowId={rowId}
                                            setRowId={setRowId}
                                            setFullImg={setFullImg}
                                            setImgs={setImgs}
                                            transaction={transaction} />
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <img src={`${API_URL}/${fullImg}`} width='100%' alt='full' />
                </Box>
            </Modal>
        </div>
    )
}