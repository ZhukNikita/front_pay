import styles from './WlxTransactionsList.module.scss'
import TimerOffIcon from '@mui/icons-material/TimerOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TimerIcon from '@mui/icons-material/Timer';

export default function Transaction({transaction}) {
    const date = new Date(transaction.created_at);
    const formattedDate = `${date.getDate()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    

    function getStatus(status){
        if(status === 'pending'){
            return (<div className={styles.pending}><TimerIcon/> {status}</div>)
        }if(status === 'success'){
            return (<div className={styles.success}><CheckCircleIcon/> {status}</div>)
        }if(status === 'rejected'){
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
                <h3 style={{ width: '160px' }}>{transaction.uuid}</h3>
                <h3 style={{ width: '7vw' }}>{transaction.currency}</h3>
                <h3 style={{ width: '10vw' }}>{transaction.customer_uid}</h3>
                <h3 style={{ width: '8vw' }}>{transaction.entered_amount}</h3>
                <h3 style={{ width: '9.5vw' }}>{transaction.sent_amount}</h3>
                <h3 style={{ width: '7vw' }}>
                    {getStatus(transaction.status)}
                </h3>
            </div>
        </div>
    )
}
//pending