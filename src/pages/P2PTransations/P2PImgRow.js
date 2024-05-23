import { useRef, useState } from 'react';
import $api, { API_URL } from '../../axios';
import styles from './FullTransactionInfo.module.scss'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { useParams } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
export default function P2PImgRow({ el, handleOpen, setFullImg, transaction , rowId , setImgs,setRowId }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const fileEditInputRef = useRef(null);
    const { id } = useParams();
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
    function getFormattedDate(param) {
        const date = new Date(param);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        return formattedDate
    }
    const handleEditIconClick = () => {
        if (fileEditInputRef.current) {
            fileEditInputRef.current.click();
        }
    };
   async function DeleteImg(img_path) {
        try {
            
            const { data } = await $api.post('/deleteImgsP2PTransation', { img_path })
            await $api.post('/getImgsP2PTransation', { id }).then(res => setImgs(res.data))
            setIsMenuOpen(false)
            return data
        } catch (e) {
            console.log(e)
        }
    }
    const EditImg = async (event, img_path) => {
        const id = transaction.transaction_id

        const img = new FormData();
        img.append('image', event.target.files[0]);
        try {
            await $api.patch(`/editP2PCheck/:${id}?login=${secureLocalStorage.getItem('userLogin')}&img_path=${img_path}&payment_method=P2P`, img, {
                headers: {
                    'content-type': 'mulpipart/form-data',
                },
            });
            await $api.post('/getImgsP2PTransation', { id }).then(res => setImgs(res.data))
            setIsMenuOpen(false)

        } catch (e) {
            console.log(e)
        }
    };
    const downloadImage = async (imgPath) => {
        try {
            const response = await fetch(`${API_URL}/${imgPath}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', `${imgPath.split('/').pop()}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Ошибка при скачивании изображения:', error);
        }
    };
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div key={el.id} className={styles.row}>
            <span style={{ width: '6vw' }}>
                <img onClick={() => { handleOpen(); setFullImg(el.img_path) }} src={`${API_URL}/${el.img_path}`} style={{ cursor: 'pointer' }} width={'70%'} height='70px' alt={'check'} />

            </span>
            <span style={{ width: '9vw', color: 'black', wordWrap: "break-word" }}>{getFormattedDate(el.date)}</span>
            <span style={{ width: '8vw', color: 'black' }}>{el.createdBy}</span>
            <div className={styles.moreButtons}>
            <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                        sx={{ marginRight: '20px' }}
                    >
                        <MoreVertIcon sx={{ color: 'black' }} />
                    </IconButton>
                    <ThemeProvider theme={theme}>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                                sx: { backgroundColor: '#325A96', color: 'white', borderRadius: '8px' }
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                        >
                            {
                                secureLocalStorage.getItem('role') === 'SuperAdmin'?
                                <MenuItem onClick={() => {handleEditIconClick()}}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontFamily: "'Nunito',sans-serif" }}>
                                    <input
                                            ref={fileEditInputRef}
                                            type='file'
                                            style={{ display: 'none' }}
                                            onChange={(event) => EditImg(event,el.img_path)}
                                            accept="image/png, image/gif, image/jpeg"
                                            name='file'
                                        />
                                        <EditIcon /> Изменить
                                    </div>
                                </MenuItem>:''
                            }
                            {
                                secureLocalStorage.getItem('role') === 'SuperAdmin'?
                                <MenuItem onClick={() => { DeleteImg(el.img_path); handleClose() }} sx={{ color: 'rgb(255, 72, 66)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontFamily: "'Nunito',sans-serif" }}>
                                        <DeleteIcon />Удалить
                                    </div>
                                </MenuItem>:''
                            }
                            <MenuItem onClick={() => { downloadImage(el.img_path); handleClose()}} sx={{ color: '#2edf1e' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontFamily: "'Nunito',sans-serif" }}>
                                    <DownloadForOfflineIcon /> Скачать
                                </div>
                            </MenuItem>
                        </Menu>
                    </ThemeProvider>
            </div>
        </div>
    )
}