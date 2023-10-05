import styles from './PinPayTransactionsBody.module.scss'
import PinpayTransactionsList from './PinpayTransactionsList'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ApartmentIcon from '@mui/icons-material/Apartment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';

const StyledDatePickerInput = styled(DatePicker)({
  backgroundColor: '#325A96',
  borderRadius:'10px',
  '& .MuiInputBase-input': {
    border:'none',
    color: 'white',
    fontFamily: "'Nunito', sans-serif",
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgb(183, 220, 233)', 
  },
  '& .MuiSvgIcon-root': {
    color: 'rgb(183, 220, 233)', 
  },
});

export default function PinpayTransactionsBody() {
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [brands, setBrands] = useState([])
    const [period, setPeriod] = useState('allTime');
    const [isOpen , setIsOpen] = useState(false)
    const [startDate , setStartDate] = useState(dayjs(new Date()))
    const [endDate , setEndDate] = useState(dayjs(new Date()))

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const { data } = await axios.get('http://localhost:5000/getAllList')
                if (data) {
                    setTransactions(data.list.reverse())
                    setIsLoading(false)
                }
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        if (transactions.length > 0) {
            const uniqueBrands = [...new Set(transactions.map(el => el.raw_request.description))];
            setBrands(uniqueBrands);
        }
    }, [transactions]);
    const getAmount = (brand) => {
        
        let filteredTransactions = transactions.filter(el =>
            el.raw_request.description === brand &&
            el.transaction_status === 'completed' &&
            dayjs(el.createdAt).isBetween(startDate, endDate)
        );
    
        if (brand === 'VitalInvest' || brand === 'VetalInvest') {
            filteredTransactions = transactions.filter(el =>
                (el.raw_request.description === 'VitalInvest' || el.raw_request.description === 'VetalInvest') &&
                el.transaction_status === 'completed' &&
                dayjs(el.createdAt).isBetween(startDate, endDate)
            );
        }
        if(startDate > endDate){
            return 0
        }
        return filteredTransactions.reduce((sum, obj) => sum + +obj.net_amount, 0);
    };
    const handleChangeStartDate = (newValue) => {
        // Устанавливаем время на полночь
        const midnightStartDate = dayjs(newValue).startOf('day');
        setStartDate(midnightStartDate);
    };
    
    const handleChangeEndDate = (newValue) => {
        // Устанавливаем время на полночь
        const midnightEndDate = dayjs(newValue).endOf('day');
        setEndDate(midnightEndDate);
    };
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Транзакции PinPay</h1>
            </div>
            <PinpayTransactionsList transactions={transactions} isLoading={isLoading} setTransactions={setTransactions} />
            <div className={styles.pinpayStats}>
                <h1>Статистика Pinpay</h1>
                <div className={styles.allStats}>
                    <div className={styles.statsHeader}>
                        <h2>Сумма платежей</h2>
                        {/* <MoreVertIcon sx={{ color: 'white', cursor: 'pointer' }} onClick={()=> setIsOpen(!isOpen)} />
                        {
                            isOpen 
                            ? 
                            <div className={styles.statsFilter}>
                                <p onClick={()=> {setIsOpen(false) ; setPeriod('allTime')}}>За всё время</p>
                                <p onClick={()=> {setIsOpen(false) ; setPeriod('month')}}>За последние 30 дней</p>
                                <p onClick={()=> {setIsOpen(false) ; setPeriod('week')}}>За последнюю неделю</p>
                                <p onClick={()=> {setIsOpen(false) ; setPeriod('day')}}>За последний день</p>
                            </div> 
                            : ''
                        } */}

                    </div>
                    <div className={styles.datePickers}>
                    <div style={{width:'50%'}}>
                        <label  style={{color:'#b7dce9'}}>Начальная дата</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StyledDatePickerInput  sx={{width:'100%'}}
                              value={startDate}
                              defaultValue={new Date()}
                              onChange={handleChangeStartDate}
                              />
                        </LocalizationProvider>  
                    </div>
                    <div style={{width:'50%'}}>
                        <label style={{color:'#b7dce9'}}>Конечная дата</label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StyledDatePickerInput  sx={{width:'100%'}}
                                value={endDate}
                                defaultValue={new Date(Date.now())}
                                onChange={handleChangeEndDate}
                            />
                        </LocalizationProvider>  
                    </div>
                    </div>
                    <div className={styles.listStats}>
                        {
                            brands.map(el => el === 'VetalInvest' ? '' :
                                <div className={styles.brandStats} key={el}>

                                    <div className={styles.brandName}>
                                        <ApartmentIcon sx={{ color: '#1a91bb', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} />
                                        {el}
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: '#2edf1e' }}>{getAmount(el, period)}€</div>
                                </div>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}