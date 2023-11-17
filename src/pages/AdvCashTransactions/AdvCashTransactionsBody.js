import AdvCashTransactionsList from "./AdvCashTransactionsList"
import styles from './AdvCashTransactionsBody.module.scss'
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import $api from "../../axios";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TransactionsChart from '../Transactions/TransactionsChart'
import { Oval } from 'react-loader-spinner';
import { styled } from '@mui/material/styles';
import ApartmentIcon from '@mui/icons-material/Apartment';
import secureLocalStorage from "react-secure-storage";
import utc from 'dayjs/plugin/utc';
const StyledDatePickerInput = styled(DatePicker)({
    backgroundColor: '#325A96',
    borderRadius: '10px',
    '& .MuiInputBase-input': {
        border: 'none',
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
export default function AdvCashTransactionsBody(params) {
    const [transactions, setTransactions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [brands, setBrands] = useState([])
    const [period, setPeriod] = useState('allTime');
    const [isOpen, setIsOpen] = useState(false)
    const [startDate, setStartDate] = useState(dayjs(new Date()).startOf('day'))
    const [endDate, setEndDate] = useState(dayjs(new Date()).endOf('day'))
    useEffect(() => {
        const createdBy = secureLocalStorage.getItem('userId')
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const { data } = await $api.post('/insirexGetAllTransactions',{createdBy})
                if (data) {
                    setTransactions(data)
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
            const uniqueBrands = [...new Set(transactions.map(el => el.brand))];
            setBrands(uniqueBrands);
        }
    }, [transactions]);

    const getAmount = (brand) => {

        let filteredTransactions = transactions.filter(el =>
            el.brand === brand &&
            el.Status === '1' &&
            dayjs(el.date).isBetween(startDate, endDate)
        );

        if (brand === 'VitalInvest' || brand === 'VetalInvest') {
            filteredTransactions = transactions.filter(el =>
                (el.brand === 'VitalInvest' || el.brand === 'VetalInvest') &&
                el.Status === '1' &&
                dayjs(el.date).isBetween(startDate, endDate)
            );
        }
        if (startDate > endDate) {
            return 0
        }
        return filteredTransactions.reduce((sum, obj) => sum + +obj.amount, 0);
    };
    
    const handleChangeStartDate = (newValue) => {
        const midnightStartDate = dayjs(newValue).startOf('day');
        setStartDate(midnightStartDate);
    };
    const handleChangeEndDate = (newValue) => {
        const midnightEndDate = dayjs(newValue).endOf('day');
        setEndDate(midnightEndDate);
    };
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <h1>Транзакции AdvCash</h1>
            </div>
            <AdvCashTransactionsList transactions={transactions} setTransactions={setTransactions}/>
            <div className={styles.pinpayStats}>
                <h1>Статистика AdvCash</h1>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className={styles.allStats}>
                        <div className={styles.statsHeader}>
                            <h2>Сумма платежей</h2>
                        </div>
                        <div className={styles.datePickers}>
                            <div style={{ width: '50%' }}>
                                <label style={{ color: '#b7dce9' }}>Начальная дата</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <StyledDatePickerInput sx={{ width: '100%' }}
                                        value={startDate}
                                        defaultValue={new Date()}
                                        onChange={handleChangeStartDate}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div style={{ width: '50%' }}>
                                <label style={{ color: '#b7dce9' }}>Конечная дата</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <StyledDatePickerInput sx={{ width: '100%' }}
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
                                        <div style={{ fontWeight: 'bold', color: '#2edf1e', fontSize: '20px' }}>{getAmount(el, period)}€</div>
                                    </div>
                                )
                            }
                        </div>

                    </div>
                    <div className={styles.pinpayPie}>
                        <h2>Транзакции AdvCash</h2>
                        {isLoading ?
                            <div style={{ height: '189px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Oval
                                    height={80}
                                    width={80}
                                    color="#181729"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#b7dce9"
                                    strokeWidth={2}
                                    strokeWidthSecondary={2}
                                />
                            </div>
                            : <TransactionsChart value={[transactions.filter(el => el.Status === '1').length, transactions.filter(el => el.Status === '0').length]} title={['Успешно', "Отклонено"]} totalTransactions={transactions.length} />}

                        <div className={styles.descriptions}>
                            <div className={styles.description}>
                                <div style={{ backgroundColor: 'rgb(255 45 38 / 76%)', width: '14px', height: '14px', borderRadius: '50%' }}></div>
                                <h4>Отклонено</h4>
                            </div>
                            <div className={styles.description}>
                                <div style={{ backgroundColor: 'rgb(34, 154, 22)', width: '14px', height: '14px', borderRadius: '50%' }}></div>
                                <h4>Успешно</h4>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}