import React, { useRef, useState } from 'react';
import styles from './RuCassaTransactionsList.module.scss';
import Tooltip from '@mui/material/Tooltip';
import UpdateIcon from '@mui/icons-material/Update';
import { Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import axios from 'axios';
import $api from '../../axios';
import secureLocalStorage from 'react-secure-storage';



export default function Transaction({ transaction, setTransactions }) {

    const date = new Date(+transaction.order_id);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    function getStatus(transaction){
        if(transaction.status === 'WAIT' || transaction.status.includes('requires')){
            return (<Tooltip title={<span style={{fontFamily:'"Nunito",sans-serif' , margin:'0' , padding:'0'}}>{transaction.status}</span>} className={styles.pending}><span><TimerIcon/> WAIT</span></Tooltip>)
        }if(transaction.status === 'PAID'){
            return (<Tooltip title={<span style={{fontFamily:'"Nunito",sans-serif'}}>{transaction.status}</span>}  className={styles.success}><span><CheckCircleIcon/> {transaction.status}</span></Tooltip>)
        }if(transaction.status.includes('CANCEL') || transaction.status === 'canceled'){
            return (<Tooltip title={<span style={{fontFamily:'"Nunito",sans-serif'}}>{transaction.status}</span>} className={styles.rejected}><span><CancelIcon/> {transaction.status}</span></Tooltip>)
        }else{
            return transaction.status
        }
    }
    function decodeHtmlEntities(text) {
        const entities = {
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": "\"",
          "&#39;": "'"
        };
      
        return text.replace(/&[^;]+;/g, entity => entities[entity] || entity);
      }
    async function HandleUpdate(id){
        try {
            await $api.post('/updateRuCassaTransaction',{id})
            const { data } = await $api.post('/getAllListRuCassa' , {brand : secureLocalStorage.getItem('userBrand' ), role: secureLocalStorage.getItem('role') })
            if (data) {
                setTransactions(data.flat().reverse())
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    return (
        <div className={styles.transaction} style={{ position: 'relative' ,textDecoration:'none'}}>
            <div className={styles.body}>
                <h3 className={styles.login}>{transaction.order_id}</h3>
                <h3 className={styles.id}>
                    {transaction.id}
                </h3>
                <h3 className={styles.brand}>{JSON.parse(decodeHtmlEntities(transaction.data)).brand}</h3>
                <h3 className={styles.amount}>{transaction.amount} ₽</h3>
                <h3 className={styles.amount}>{formattedDate}</h3>
                <h3 style={{ width: '9vw' }}>
                    {getStatus(transaction)}
                </h3>
                {
                    transaction.status === 'WAIT' && (
                        <h3 style={{ width: '6vw' , display:'flex' , alignItems:'center' , cursor:'pointer' }}><UpdateIcon onClick={()=>HandleUpdate(transaction.id)}/></h3>
                    )
                }
                {/* <input
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
                /> */}
                {/* {
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
                } */}
            </div>
        </div>
    );
}
