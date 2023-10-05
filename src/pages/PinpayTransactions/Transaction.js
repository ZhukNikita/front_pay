import styles from './PinpayTransactionsList.module.scss'
import TimerOffIcon from '@mui/icons-material/TimerOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';
import {Link} from "react-router-dom";

export default function Transaction({transaction}) {
    const date = new Date(transaction.createdAt);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    

    function getStatus(status){
        if(status === 'pending'){
            return (<div className={styles.pending}><TimerIcon/> {status}</div>)
        }if(status === 'completed'){
            return (<div className={styles.success}><CheckCircleIcon/> {status}</div>)
        }if(status === 'failed'){
            return (<div className={styles.rejected}><CancelIcon/> {status}</div>)
        }if(status === 'timeout'){
            return (<div className={styles.rejected}><TimerOffIcon/> {status}</div>)
        }else{
            return status
        }
    }
    return(
        <div className={styles.transaction}>
            <div className={styles.body}>
            <h3 style={{ width: '7vw' }}>{formattedDate}</h3>
                <h3 style={{ width: '9vw' }}>{transaction.payment_id.slice(0,13)}</h3>
                <h3 style={{ width: '13.5vw'}}><p style={{width:'85%' , height:'40px' , wordBreak: 'break-word'}}>{transaction.raw_request.user_contact_email}</p></h3>
                <h3 style={{ width: '7vw' }}>{transaction.currency}</h3>
                <h3 style={{ width: '10vw' }}>{transaction.raw_request.description}</h3>
                <h3 style={{ width: '8vw' }}>{transaction.amount}</h3>
                <h3 style={{ width: '10vw' }}>{transaction.card}</h3>
                <h3 style={{ width: '7vw' }}>
                    {getStatus(transaction.transaction_status)}
                </h3>
                {/* <Link to={`https://merchantaccount.dev/edit-input-data/${transaction.uuid}`} style={{fontSize:'14px',fontWeight:'bold',backgroundColor:'#233e68', padding:'10px', borderRadius:'8px', color:'white',textDecoration:'none' , width:'70px' , display:'flex',justifyContent:'center' , textAlign:'center' , marginLeft:'3vw'}}>Загрузка данных</Link> */}
            </div>
        </div>
    )
}
//pending