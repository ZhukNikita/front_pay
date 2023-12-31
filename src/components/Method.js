import styles from "../styles/PaymentsMethods.module.scss"
import { Link } from "react-router-dom"
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import HelpIcon from '@mui/icons-material/Help';

export default function Method({link,name,instruction}) {
    const style = {
        position: 'absolute' ,
        top: '50%',
        left: '49.5%',
        transform: 'translate(-50%, -50%)',
        width: 592,
        bgcolor: '#05152c',
        boxShadow: 24,
        color:'white',
        p: 4,
        

      };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return(
        <div className={styles.methods} style={{position:'relative' , width:'40%'}}>
        <Link to={link} className={styles.method}>
            <h3>{name}</h3>
        </Link>
        {
            instruction.length>0?<HelpIcon onClick={handleOpen} sx={{position:'absolute',color:'#fff', zIndex:'3', top:'6px' , right:'8px'}}/>:''
        }
        
        <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontFamily:'"Nunito",sans-serif'}}>
                        {name}
                    </Typography>
                    {
                        instruction.map(el=><Typography key={el} id="modal-modal-description" sx={{ mt: 2  , fontFamily:'"Nunito",sans-serif'}}>
                                                {el}
                                            </Typography>
                    )
                    }
                </Box>
            </Modal>
        </div>

    )
}