import styles from './NowPayTransactionsList.module.scss'
import TimerOffIcon from '@mui/icons-material/TimerOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import {Link} from "react-router-dom";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { useRef,useState,useEffect } from 'react';
import $api from '../../axios';
import secureLocalStorage from 'react-secure-storage';
import Tooltip from '@mui/material/Tooltip';

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
                  {selectedFile ? selectedFile.map(el=>(
                    <div key={el.name}>
                        <img
                          src={URL.createObjectURL(el)}
                          alt="Предварительный просмотр файла"
                          style={{ maxWidth: '100%', maxHeight: '300px' }}
                        />
                    </div>
                  )):''}

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
export default function Transaction({transaction}) {
    const date = new Date(transaction.date);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${(date.getHours()-2).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {setOpen(false);setSelectedFile([])};
    const fileInputRef = useRef(null);

    function getStatus(transaction){
        if(transaction.status === 'processing' || transaction.status.includes('requires')){
            return (<Tooltip title={<span style={{fontFamily:'"Nunito",sans-serif' , margin:'0' , padding:'0'}}>{transaction.status}</span>} className={styles.rejected}><span><CancelIcon/> failed</span></Tooltip>)
        }if(transaction.status === 'succeeded'){
            return (<Tooltip title={<span style={{fontFamily:'"Nunito",sans-serif'}}>{transaction.status}</span>}  className={styles.success}><span><CheckCircleIcon/> {transaction.status}</span></Tooltip>)
        }if(transaction.status.includes('failed') || transaction.status === 'canceled'){
            return (<Tooltip title={<span style={{fontFamily:'"Nunito",sans-serif'}}>{transaction.status}</span>} className={styles.rejected}><span><CancelIcon/> {transaction.status}</span></Tooltip>)
        }if(transaction.status === 'timeout'){
            return (<Tooltip title={<span style={{fontFamily:'"Nunito",sans-serif'}}>{transaction.status}</span>} className={styles.rejected}><TimerOffIcon/> {transaction.status}</Tooltip>)
        }else{
            return transaction.status
        }
    }
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
            handleOpen();
        }
    };
    const handleUpload = async () => {
        const id = transaction.payment_id

        const img = new FormData();
        selectedFile.forEach((file, index) => {
            img.append(`image`, file);
        });

        try{
            await $api.patch(`/uploadPinpayCheck/:${id}?login=${secureLocalStorage.getItem('userLogin')}`, img, {
                headers: {
                    'content-type': 'mulpipart/form-data',
                },
            });
            handleClose();

        } catch (e) {
            console.log(e)
        }
    };
    return(
      <div className={styles.transaction} style={{zIndex:'1'}}>
          <Link to={`/shp-transaction/${transaction.id}`} className={styles.body}>
              <h3 style={{ width: '7vw' }}>{formattedDate}</h3>
              <h3 style={{ width: '10vw' }}>{transaction.id.slice(13)}</h3>
              <h3 style={{ width: '13.5vw'}}><p style={{width:'85%' , wordBreak: 'break-word'}}>{transaction?.brand}</p></h3>
              <h3 style={{ width: '6vw' }}>{transaction.currency}</h3>
              <h3 style={{ width: '7vw' }}>{transaction.brand}</h3>
              <h3 style={{ width: '8vw' }}>{transaction.amount / 100} {transaction.currency}</h3>
              <h3 style={{ width: '7vw' }}>
                  {getStatus(transaction)}
              </h3>
          </Link>

          {/* <Link to={`https://merchantaccount.dev/edit-input-data/${transaction.uuid}`} style={{fontSize:'14px',fontWeight:'bold',backgroundColor:'#233e68', padding:'10px', borderRadius:'8px', color:'white',textDecoration:'none' , width:'70px' , display:'flex',justifyContent:'center' , textAlign:'center' , marginLeft:'3vw'}}>Загрузка данных</Link> */}
          {/* <input
            ref={fileInputRef}
            type='file'
            style={{ display: 'none' }}
            onChange={addImg}
            accept="image/png, image/gif, image/jpeg"
            name='file'
            multiple
          />
          <UploadFileIcon
            sx={{ width: '7vw', display: 'flex', alignItems: 'center', cursor: 'pointer' , zIndex:0 }}
            onClick={handleUploadIconClick}
          />
          <FileUploadModal
            selectedFile={selectedFile}
            open={open}
            handleClose={handleClose}
            handleUpload={handleUpload}
          /> */}
      </div>
    )
}
//pending