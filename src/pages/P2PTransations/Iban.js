import React, { useState } from 'react';
import styles from './P2PTransactionsList.module.scss';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import secureLocalStorage from 'react-secure-storage';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import $api from '../../axios';
import ChangeCircleRoundedIcon from '@mui/icons-material/ChangeCircleRounded';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
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
    width: "400px"
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
export default function Iban({ iban, setIbans,brands }) {

    const [openEdit, setOpenEdit] = useState(false);
    const [brandToChange, setBrandToChange] = useState(iban.brand);

    const [snack, setSnack] = useState(false);

    const [snackMessage, setSnackMessage] = useState('');
    const [snackType, setSnackType] = useState('');
    const handleOpenEdit = () => setOpenEdit(true);

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackMessage('')
        setSnack(false);
    };
    const handleEditClose = () => {
        setOpenEdit(false);
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const deleteOpen = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleDeleteClose = () => {
        setAnchorEl(null);
    };
    const ChangeBrand = async () => {
        const createdBy = secureLocalStorage.getItem('userId')
        console.log(brandToChange)
        try {
            const { data } = await $api.post('/changeIban', { ibanToDelete: iban.IBAN, createdBy, brandToChange })
            await $api.get('/p2pGetAll').then(res => setIbans(res.data))
            setSnack(true)
            setSnackType('success')
            setSnackMessage('IBAN успешно изменён')
            handleEditClose()
            return data
        } catch (e) {

        }
    }
    return (
        <div className={styles.transaction} style={{ position: 'relative', textDecoration: 'none' }}>
            <div className={styles.body}>
                <h3 className={styles.iban} style={{ width: "25vw" }}>
                    <Tooltip title={<span style={{ fontFamily: "'Nunito',sans-serif", fontSize: '14px' }}>{iban.IBAN}</span>} arrow>
                        <span>
                            {iban.IBAN}
                        </span>
                    </Tooltip>
                </h3>
                <h3 className={styles.brand}>{iban.brand}</h3>
                <h3 className={styles.brand}>{iban.country}</h3>
                {
                    secureLocalStorage.getItem('role') === 'SuperAdmin' ?
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

                                    <MenuItem onClick={() => { }} sx={{ color: '#fff' }}>
                                        <div onClick={handleOpenEdit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontWeight: 'bold', fontFamily: "'Nunito',sans-serif" }}>
                                            <ChangeCircleRoundedIcon />Изменить<br /> бренд
                                        </div>
                                    </MenuItem>
                                </Menu>
                            </ThemeProvider>
                        </span>
                        : ''
                }
            </div>

            <Modal
                open={openEdit}
                onClose={handleEditClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2 style={{ fontFamily: "'Nunito',sans-serif", color: 'rgb(183, 220, 233)', marginTop: '0' }}>Изменить IBAN</h2>
                    <div style={{ width: '100%' }}>
                        <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>IBAN</label>
                        <p style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif",fontSize:'16px' }}>{iban.IBAN}</p>
                    </div>
                    <div style={{width:'100%'}}>

                        <label style={{ color: 'white', width: '100%', fontFamily: "'Nunito',sans-serif" }}>Бренд</label>
                        <select value={brandToChange} onChange={(e) => { setBrandToChange(e.target.value)}} style={{ outline: 'none', padding: '15px 20px', fontFamily: '"Nunito"  ,sans-serif', fontSize: '18px', border: '1px solid #38b6ff', borderRadius: '8px', width: '100%' }} placeholder='Бренд'>
                            <option value="all">All</option>
                            {brands.map(el => <option style={{ width: '300px', wordBreak: 'break-all' }} value={el.brand} key={el.brand}>{el.brand}</option>)}
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={ChangeBrand}
                            style={{
                                border: 'none',
                                padding: '15px',
                                borderRadius: '8px',
                                backgroundColor: 'rgb(56, 182, 255)',
                                fontFamily: "'Nunito',sans-serif",
                                fontWeight: '600',
                                color: 'white',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                cursor: 'pointer'
                            }}>
                            Изменить
                        </button>
                    </div>
                </Box>
            </Modal>
            
            <Snackbar
                open={snack}
                autoHideDuration={2000}
                onClose={handleCloseSnack}
                message={snackMessage}
            >
                <Alert severity={snackType}>{snackMessage}</Alert>

            </Snackbar>
        </div>
    );
}
