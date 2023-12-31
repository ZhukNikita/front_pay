import '../App.css';
import logo from '../img/GPLogo.png'
import {useEffect, useState} from 'react'
import {Link , useLocation} from 'react-router-dom'
import { Countries } from '../countries';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import styles from '../styles/PinPay.module.scss'
import React from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from 'react-secure-storage';
import Clipboard from 'react-clipboard.js';

function PinPay() {
  const navigate = useNavigate()

  function useQuery() {
    const { search } = useLocation();
  
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  const [holderName , setHolderName] = useState('');
  const [amount , setAmount] = useState('');
  const [email , setEmail] = useState('');
  const [emailError , setEmailError] = useState('');
  const [phone , setPhone] = useState('');
  const [phoneError , setPhoneError] = useState('');
  const [country , setCountry] = useState('');
  const [countryError , setCountryError] = useState('');
  const [city , setCity] = useState('');
  const [cityError , setCityError] = useState('');
  const [state , setState] = useState('');
  const [stateError , setStateError] = useState('');
  const [address , setAddress] = useState('');
  const [addressError , setAddressError] = useState('');
  const [postalCode , setPostalCode] = useState('');
  const [postalCodeError , setPostalCodeError] = useState('');
  const [amountError , setAmountError] = useState('')
  const [nameError , setNameError] = useState('')
  const [currency , setCurrency] = useState('USD')
  const [url , setUrl] = useState('')
  const {pathname} = useLocation()
  function onPay(){
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let newAmountError = '';
    let newNameError = '';
    let newEmailError = '';
    let newPhoneError = '';
    let newCountryError = '';
    let newCityError = '';
    let newStateError = '';
    let newAddressError = '';
    let newPostalError = '';
    let error
    if(holderName.length<5){
      setNameError('Минимальное количество символов: 5')
      error = true
      newNameError = 'Минимальное количество символов: 5';
    }
    if(/[^\x00-\x7F]+/.test(holderName)){
      setNameError('Введите имя латинскими буквами алфавита')
      error = true
      newNameError = 'Введите имя латинскими буквами алфавита';
    }
    if(!holderName.includes(' ')){
      setNameError('Введите имя и фамилию')
      error = true
      newNameError = 'Введите имя и фамилию';
    }
    if(!re.test(String(email).toLowerCase())){
      setEmailError('Неверный формат почты')
      error = true
      newEmailError = 'Неверный формат почты'
    }
    if(!phone){
      setPhoneError('Пожалуйста, введите номер телефона')
      error = true
      newPhoneError = 'Пожалуйста, введите номер телефона'
    }
    if(/[a-zA-Z]/.test(phone)){
      setPhoneError('Неверный формат номера телефона')
      error = true
      newPhoneError = 'Неверный формат номера телефона'
    }
    if(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/-]/.test(phone)){
      setPhoneError('Номер телефона не должен содержать символы')
      error = true
      newPhoneError = 'Номер телефона не должен содержать символы'
    }
    if(phone.includes(' ')){
      setPhoneError('Номер телефона не должен содержать пробелы')
      error = true
      newPhoneError = 'Номер телефона не должен содержать пробелы'
    }
    if(!country){
      setCountryError('Пожалуйста, выберите страну из списка')
      error = true
      newCountryError = 'Пожалуйста, выберите страну из списка'
    }
    if(country.length > 2){
      setCountryError('Please enter only country code')
      error = true
      newCountryError = 'Please enter only country code'
    }
    if(!city){
      setCityError('Пожалуйста, введите город')
      error = true
      newCityError = 'Пожалуйста, введите город'
    }
    if(/[^\x00-\x7F]+/.test(city)){
      setCityError('Введите город латинскими буквами алфавита')
      error = true
      newCityError = 'Введите город латинскими буквами алфавита';
    }
    if(!state){
      setStateError('Пожалуйста, введите область')
      error = true
      newStateError = 'Пожалуйста, введите область'
    }
    if(/[^\x00-\x7F]+/.test(state)){
      setStateError('Введите область латинскими буквами алфавита')
      error = true
      newStateError = 'Введите область латинскими буквами алфавита';
    }
    if(!address){
      setAddressError('Пожалуйста, введите адрес')
      error = true
      newAddressError= 'Пожалуйста, введите адрес'
    }
    if(/[^\x00-\x7F]+/.test(address)){
      setAddressError('Введите адрес латинскими буквами алфавита')
      error = true
      newAddressError = 'Введите адрес латинскими буквами алфавита';
    }
    if(!postalCode){
      setPostalCodeError('Пожалуйста, введите почтовый индекс')
      error = true
      newPostalError = 'Пожалуйста, введите почтовый индекс'
    }
    if(+amount < 10){
      setAmountError(`Минимальная сумма платежа 10(${currency})`)
      error = true
      newAmountError = `Минимальная сумма платежа 10(${currency})`;
    }
    if(+amount >= 20000){
      setAmountError(`Максимальная сумма платежа 19999(${currency})`)
      error = true
      newAmountError = `Максимальная сумма платежа 19999(${currency})`;
    }
    if(/[a-zA-Z]/.test(amount)){
      setAmountError('Неверный формат суммы платежа')
      error = true
      newAmountError = 'Неверный формат суммы платежа';
    }
    if(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/-\d]/.test(holderName)){
      setNameError('Поле имя не может содержать символы')
      error = true
      newNameError = 'Поле имя не может содержать символы';
    }
    if (newAmountError === '' 
    && newNameError === ''
    && newEmailError === '' 
    && newPhoneError === '' 
    && newCountryError === ''
    && newCityError === ''
    && newStateError === ''
    && newAddressError === ''
    && newPostalError === '') {
      const orderId = Date.now();
      const redirectUrl = `https://secure.pinpaygate.com/hpp?project=${currency === 'EUR'?'cfdf3b4d14cb4cfc87c18d2c553c11c5':'136f9fcb141849f8b1143bf717bbc8d1'}&price=${(+amount).toFixed(2)}&user_name=${holderName.replace(/ /g, "+")}&user_contact_email=${email}&user_phone=${phone}&result_url=https%3A%2F%2Fexample.com%2Fresult&description=${secureLocalStorage.getItem('userBrand')}&user_country=${country.toUpperCase()}&user_city=${city.replace(/ /g, "+")}&user_state=${state.replace(/ /g, "+")}&user_address=${address.replace(/ /g, "+")}&user_postal_code=${postalCode.replace(/ /g, "+")}&order_id=${orderId}&currency=${currency}&success_url=http://global-payment-solutions.com/success&failure_url=http://global-payment-solutions.com/failure&locale=en`;
      setUrl(redirectUrl)
      // window.location.href = redirectUrl;
    } else {
      setNameError(newNameError);
      setAmountError(newAmountError);
    }
  }
  useEffect(()=>{
    if(!query.get('brand')){
      navigate('/')
    }
  },[])



  return (
    <div className={styles.App}>
          <div className={styles.Card}>
            <Link to={secureLocalStorage.getItem('role') !== 'User'?'/panel':'/payments_methods'} style={{color:'white' , fontWeight:'bold' , fontFamily:'"Montserrat" , sans-serif' , position:'absolute' , top:'20px' , right:'20px'}}>На главную</Link>

                <img className={styles.Logo} src={logo} alt='logo'/>
                <div className={styles.wrapper}>
                <form>
                  <div className={styles.CardNumber}>
                      <div className={styles.CardInputs}>
                        <label>Имя и фамилия</label>
                        <input type="tel" placeholder='Имя и фамилия' maxLength='23' className={styles.ccNumberInput} onChange={(e)=>{setHolderName(e.target.value); setNameError('');setUrl('')}}/>
                        {nameError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{nameError}</p> : ''}
                      </div>
                  </div>
                  <div className={styles.CardNumber}>
                      <div className={styles.CardInputs}>
                        <label>Почта</label>
                        <input type="tel" placeholder='example@email.com' maxLength='33' className={styles.ccNumberInput} onChange={(e)=>{setEmail(e.target.value); setEmailError('');setUrl('')}}/>
                        {emailError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{emailError}</p> : ''}
                      </div>
                  </div>
                  <div className={styles.CardNumber}>
                      <div className={styles.CardInputs}>
                        <label>Номер телефона</label>
                        <input type="tel" placeholder='Номер телефона' maxLength='23' className={styles.ccNumberInput} onChange={(e)=>{setPhone(e.target.value); setPhoneError('');setUrl('')}}/>
                        {phoneError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{phoneError}</p> : ''}
                      </div>
                  </div>
                  <div className={styles.CardNumber}>
                    <div className={styles.CardInputs}>
                    <label style={{bottom:'47px'}}>Страна</label>
                      <Select
                        value={country}
                        onChange={(e)=>{setCountry(e.target.value);setCountryError('');setUrl('')}}
                        displayEmpty
                        sx={{borderRadius:'12px' , height:'44px' , width:'100%' , outline:'none', fontSize:'18px' , fontFamily:'"Montserrat" , sans-serif' , fontWeight:'400' , backgroundColor:'white'}}
                        
                      >
                        <MenuItem value="">
                          Страна
                        </MenuItem>
                        {
                            Countries.map(el=> <MenuItem style={{height:'30px', width:'200px'}} key={el.code} value={el.code}>{el.code}&emsp;{el.name}</MenuItem>)
                        }
                      </Select>
                      {countryError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{countryError}</p> : ''}
                    </div>
                  </div>
                  <div className={styles.CardNumber}>
                      <div className={styles.CardInputs}>
                        <label>Город</label>
                        <input type="tel" placeholder='Город' maxLength='23' className={styles.ccNumberInput}onChange={(e)=>{setCity(e.target.value); setCityError('');setUrl('')}}/>
                        {cityError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{cityError}</p> : ''}
                      </div>
                  </div>
                  <div className={styles.CardNumber}>
                      <div className={styles.CardInputs}>
                        <label>Область</label>
                        <input type="tel" placeholder='Область' maxLength='23' className={styles.ccNumberInput}onChange={(e)=>{setState(e.target.value); setStateError('');setUrl('')}}/>
                        {stateError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{stateError}</p> : ''}
                      </div>
                  </div>
                  <div className={styles.CardNumber}>
                      <div className={styles.CardInputs}>
                        <label>Адрес</label>
                        <input type="tel" placeholder='Адрес' maxLength='23' className={styles.ccNumberInput}onChange={(e)=>{setAddress(e.target.value); setAddressError('');setUrl('')}}/>
                        {addressError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{addressError}</p> : ''}
                      </div>
                  </div>
                  <div className={styles.CardNumber}>
                      <div className={styles.CardInputs}>
                        <label>Почтовый индекс</label>
                        <input type="tel" placeholder='Почтовый индекс' maxLength='23' className={styles.ccNumberInput}onChange={(e)=>{setPostalCode(e.target.value); setPostalCodeError('');setUrl('')}}/>
                        {postalCodeError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{postalCodeError}</p> : ''}
                      </div>
                  </div>
                </form>  
                <div className={styles.CardPayment} style={{position:'relative'}}>
                  <div style={{display:'flex' , alignItems:'center' , justifyContent:'left'}}>
                  <div className={styles.CardPaymentInput}>
                        <label>Сумма платежа({currency})</label>
                        <input type="text" maxLength="30" placeholder='00.0' className={styles.ccCvcInput} onChange={(e)=>{setAmount(e.target.value);setAmountError('');setUrl('')}}/>
                        {amountError? <p style={{color:'red',width:'200px' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'30px', position:'absolute' , bottom:'-47px'}}>{amountError}</p> : ''}
                  </div>
                    <select onChange={(e)=>{setCurrency(e.target.value);setUrl('')}}>
                      <option value={'USD'}>USD</option>
                      <option value={'EUR'}>EUR</option>
                    </select>
                  </div>

                    <div><button onClick={onPay} className={amountError === '' && nameError === '' && holderName !== '' && amount !== ''?styles.Pay:styles.buttonDisable}>Создать платёж</button></div>
                  </div>
                  {
                    url && (
                      <div style={{width:'90%' , height:'100%',wordWrap:'break-word', display:'flex' , alignItems:'center', flexDirection:'column' , justifyContent:'center'}}>
                        <div style={{width:'90%' , height:'100%',wordBreak: 'break-all' , color:'#fff'}}>
                          {url} 
                        </div>
                        <Clipboard style={{background:'none' , border:'none'}} data-clipboard-text={url}>
                          <button className={styles.Pay} style={{marginTop:'20px'}} onClick={()=> navigator.clipboard.writeText(url)}>Copy</button>
                        </Clipboard>
                      </div>
                    )
                  }
              </div>
            </div>
    </div>
  );
}

export default PinPay;