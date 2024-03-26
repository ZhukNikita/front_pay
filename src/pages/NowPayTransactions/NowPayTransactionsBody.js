import styles from './NowPayTransactionsBody.module.scss'
import NowPayTransactionsList from './NowPayTransactionsList'
import { useState, useEffect } from 'react'
import $api from '../../axios'
import ApartmentIcon from '@mui/icons-material/Apartment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TransactionsChart from '../Transactions/TransactionsChart'
import { Oval } from 'react-loader-spinner';

import { styled } from '@mui/material/styles';
import dayjs from 'dayjs';
import secureLocalStorage from 'react-secure-storage';

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

export default function NowPayTransactionsBody() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [period, setPeriod] = useState('allTime');
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState(dayjs(new Date()))
  const [endDate, setEndDate] = useState(dayjs(new Date()))
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const { data } = await $api.post('/getAllTransactionsNow',{createdBy: secureLocalStorage.getItem('userId')})
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
      const uniqueBrands = [...new Set(transactions.map(el => el.description))];
      setBrands(uniqueBrands);
    }
  }, [transactions]);
  const getAmount = (brand) => {
    let filteredTransactions = transactions.filter(el =>
      el.description === brand &&
      el.status === 'completed' &&
      dayjs(el.createdAt).isBetween(startDate, endDate)
    );

    if (brand === 'VitalInvest' || brand === 'VetalInvest') {
      filteredTransactions = transactions.filter(el =>
        (el.description === 'VitalInvest' || el.description === 'VetalInvest') &&
        el.status === 'completed' &&
        dayjs(el.createdAt).isBetween(startDate, endDate)
      );
    }
    if (startDate > endDate) {
      return 0
    }
    return filteredTransactions.reduce((sum, obj) => sum + +obj.amount, 0);
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
        <h1>Транзакции NowPay</h1>
      </div>
      <NowPayTransactionsList transactions={transactions} isLoading={isLoading} setTransactions={setTransactions} />
      {/*<div className={styles.shpStats}>*/}

      {/*  <h1>Статистика Shp.ee</h1>*/}
      {/*  <div style={{ display: 'flex', gap: '20px' }}>*/}
      {/*    <div className={styles.allStats}>*/}
      {/*      <div className={styles.statsHeader}>*/}
      {/*        <h2>Сумма платежей</h2>*/}
      {/*      </div>*/}
      {/*      <div className={styles.datePickers}>*/}
      {/*        <div style={{ width: '50%' }}>*/}
      {/*          <label style={{ color: '#b7dce9' }}>Начальная дата</label>*/}
      {/*          <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
      {/*            <StyledDatePickerInput sx={{ width: '100%' }}*/}
      {/*                                   value={startDate}*/}
      {/*                                   defaultValue={new Date()}*/}
      {/*                                   onChange={handleChangeStartDate}*/}
      {/*            />*/}
      {/*          </LocalizationProvider>*/}
      {/*        </div>*/}
      {/*        <div style={{ width: '50%' }}>*/}
      {/*          <label style={{ color: '#b7dce9' }}>Конечная дата</label>*/}
      {/*          <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
      {/*            <StyledDatePickerInput sx={{ width: '100%' }}*/}
      {/*                                   value={endDate}*/}
      {/*                                   defaultValue={new Date(Date.now())}*/}
      {/*                                   onChange={handleChangeEndDate}*/}
      {/*            />*/}
      {/*          </LocalizationProvider>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <div className={styles.listStats}>*/}
      {/*        {*/}
      {/*          brands.map(el => el === 'VetalInvest' ? '' :*/}
      {/*            <div className={styles.brandStats} key={el}>*/}

      {/*              <div className={styles.brandName}>*/}
      {/*                <ApartmentIcon sx={{ color: '#1a91bb', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }} />*/}
      {/*                {el}*/}
      {/*              </div>*/}
      {/*              <div style={{ fontWeight: 'bold', color: '#2edf1e' , fontSize:'20px' }}>{getAmount(el, period)}€</div>*/}
      {/*            </div>*/}
      {/*          )*/}
      {/*        }*/}
      {/*      </div>*/}

      {/*    </div>*/}
      {/*    <div className={styles.shpPie}>*/}
      {/*      <h2>Транзакции Shp.ee</h2>*/}
      {/*      {isLoading ?*/}
      {/*        <div style={{ height: '189px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>*/}
      {/*          <Oval*/}
      {/*            height={80}*/}
      {/*            width={80}*/}
      {/*            color="#181729"*/}
      {/*            wrapperStyle={{}}*/}
      {/*            wrapperClass=""*/}
      {/*            visible={true}*/}
      {/*            ariaLabel='oval-loading'*/}
      {/*            secondaryColor="#b7dce9"*/}
      {/*            strokeWidth={2}*/}
      {/*            strokeWidthSecondary={2}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        : <TransactionsChart value={[transactions.filter(el => el.transaction_status === 'completed').length, transactions.filter(el => el.transaction_status === 'failed').length]} title={['Успешно', "Отклонено"]} totalTransactions={transactions.length} />}*/}

      {/*      <div className={styles.descriptions}>*/}
      {/*        <div className={styles.description}>*/}
      {/*          <div style={{ backgroundColor: 'rgb(255 45 38 / 76%)', width: '14px', height: '14px', borderRadius: '50%' }}></div>*/}
      {/*          <h4>Отклонено</h4>*/}
      {/*        </div>*/}
      {/*        <div className={styles.description}>*/}
      {/*          <div style={{ backgroundColor: 'rgb(34, 154, 22)', width: '14px', height: '14px', borderRadius: '50%' }}></div>*/}
      {/*          <h4>Успешно</h4>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}

      {/*</div>*/}
    </div>
  )
}

//Меню фильтрации для суммы платежей
// {/* <MoreVertIcon sx={{ color: 'white', cursor: 'pointer' }} onClick={()=> setIsOpen(!isOpen)} />
// {
//     isOpen
//     ?
//     <div className={styles.statsFilter}>
//         <p onClick={()=> {setIsOpen(false) ; setPeriod('allTime')}}>За всё время</p>
//         <p onClick={()=> {setIsOpen(false) ; setPeriod('month')}}>За последние 30 дней</p>
//         <p onClick={()=> {setIsOpen(false) ; setPeriod('week')}}>За последнюю неделю</p>
//         <p onClick={()=> {setIsOpen(false) ; setPeriod('day')}}>За последний день</p>
//     </div>
//     : ''
// } */}





































