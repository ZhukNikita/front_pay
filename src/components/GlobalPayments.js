import '../App.css';
import logo from '../img/GPLogo.png'
import chip from '../img/chip.png'
import {useEffect,useState} from 'react'
import Swal from 'sweetalert2';
import {Link , useLocation} from 'react-router-dom'
import { Countries } from '../countries';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function GlobalPayments() {
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
  const [description , setDescription] = useState('');
  const [descriptionError , setDescriptionError] = useState('');
  const [postalCode , setPostalCode] = useState('');
  const [postalCodeError , setPostalCodeError] = useState('');
  const [amountError , setAmountError] = useState('')
  const [nameError , setNameError] = useState('')
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
    let newDescriptionError = '';
    let newPostalError = '';
    let error
    if(holderName.length<5){
      setNameError('Name min length 5')
      error = true
      newNameError = 'Name min length 5';
    }
    if(!holderName.includes(' ')){
      setNameError('Enter name and surname')
      error = true
      newNameError = 'Enter name and surname';
    }
    if(!re.test(String(email).toLowerCase())){
      setEmailError('Invalid Email')
      error = true
      newEmailError = 'Invalid Email'
    }
    if(!phone){
      setPhoneError('Please enter phone number')
      error = true
      newPhoneError = 'Please enter phone number'
    }
    if(/[a-zA-Z]/.test(phone)){
      setPhoneError('Invalid phone')
      error = true
      newPhoneError = 'Invalid phone'
    }
    if(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/-]/.test(phone)){
      setPhoneError('Must not contain characters')
      error = true
      newPhoneError = 'Must not contain characters'
    }
    if(phone.includes(' ')){
      setPhoneError('Must not contain characters')
      error = true
      newPhoneError = 'Must not contain characters'
    }
    if(!country){
      setCountryError('Please enter country code')
      error = true
      newCountryError = 'Please enter country code'
    }
    if(country.length > 2){
      setCountryError('Please enter only country code')
      error = true
      newCountryError = 'Please enter only country code'
    }
    if(!city){
      setCityError('Please enter city')
      error = true
      newCityError = 'Please enter city'
    }
    if(!state){
      setStateError('Please enter state')
      error = true
      newStateError = 'Please enter state'
    }
    if(!address){
      setAddressError('Please enter address')
      error = true
      newAddressError= 'Please enter address'
    }
    if(!description){
      setDescriptionError('Please enter description')
      error = true
      newDescriptionError = 'Please enter description'
    }
    if(!postalCode){
      setPostalCodeError('Please enter postal code')
      error = true
      newPostalError = 'Please enter postal code'
    }
    if(+amount < 1){
      setAmountError('Min amount 1$')
      error = true
      newAmountError = 'Min amount 1$';
    }
    if(+amount > 20000){
      setAmountError('Max amount 20000$')
      error = true
      newAmountError = 'Max amount 20000$';
    }
    if(/[a-zA-Z]/.test(amount)){
      setAmountError('Invalid amount')
      error = true
      newAmountError = 'Invalid amount';
    }
    if(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\|/-\d]/.test(holderName)){
      setNameError('Invalid name')
      error = true
      newNameError = 'Invalid name';
    }
    if (newAmountError === '' 
    && newNameError === ''
    && newEmailError === '' 
    && newPhoneError === '' 
    && newCountryError === ''
    && newCityError === ''
    && newStateError === ''
    && newAddressError === ''
    && newDescriptionError === ''
    && newPostalError === '') {
      const orderId = Date.now();
      const redirectUrl = `https://secure.pinpaygate.com/hpp?project=25edc473c934416299879ccb691f8899&price=${(+amount).toFixed(2)}&user_name=${holderName.replace(/ /g, "+")}&user_contact_email=${email}&user_phone=${phone}&result_url=https%3A%2F%2Fexample.com%2Fresult&description=${description.replace(/ /g, "+")}&user_country=${country.toUpperCase()}&user_city=${city}&user_state=${state}&user_address=${address.replace(/ /g, "+")}&user_postal_code=${postalCode}&order_id=${orderId}&currency=EUR&success_url=http://localhost:3000/success&failure_url=http://localhost:3000/failure&locale=en`;
      setUrl(redirectUrl)
      // window.location.href = redirectUrl;
    } else {
      setNameError(newNameError);
      setAmountError(newAmountError);
    }
  }
  if(pathname.includes('success')){
    let timerInterval
    Swal.fire({
      title: 'Payment success!',
      icon:'success',
      timer: 3000,
      timerProgressBar: true,
      confirmButtonText: 'Close',
      didOpen: () => {
        timerInterval = setInterval(() => {
        }, 100)
      },
      willClose: () => {
        window.location.href = 'http://localhost:3000'
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }
  if(pathname.includes('failure')){
    let timerInterval
    Swal.fire({
      title: 'Payment fail!',
      icon:'error',
      timer: 3000,
      timerProgressBar: true,
      confirmButtonText: 'Close',
      didOpen: () => {
        timerInterval = setInterval(() => {
        }, 100)
      },
      willClose: () => {
        window.location.href = 'http://localhost:3000'
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }
  return (
    <div className="App">

          <div className='Card'>
            <Link to={'/'} style={{color:'white' , position:'absolute' , top:'20px' , right:'20px'}}>На главную</Link>

                <img className='Logo' src={logo}/>
                <div className="wrapper">
                <form>
                  <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>Full Name</label>
                        <input type="tel" placeholder='Full Name' maxLength='23' className="cc-number-input" onChange={(e)=>{setHolderName(e.target.value); setNameError('')}}/>
                        {nameError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{nameError}</p> : ''}
                      </div>
                  </div>
                  <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>Email</label>
                        <input type="tel" placeholder='example@email.com' maxLength='23' className="cc-number-input" onChange={(e)=>{setEmail(e.target.value); setEmailError('')}}/>
                        {emailError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{emailError}</p> : ''}
                      </div>
                  </div>
                  <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>Phone</label>
                        <input type="tel" placeholder='Phone number' maxLength='23' className="cc-number-input" onChange={(e)=>{setPhone(e.target.value); setPhoneError('')}}/>
                        {phoneError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{phoneError}</p> : ''}
                      </div>
                  </div>
                  <div className='CardNumber'>
                    <div className='CardInputs'>
                    <label style={{bottom:'47px'}}>Country</label>
                      <Select
                        value={country}
                        onChange={(e)=>{setCountry(e.target.value);setCountryError('')}}
                        displayEmpty
                        sx={{borderRadius:'12px' , height:'44px' , width:'100%' , outline:'none' , fontFamily:'"Montserrat" , sans-serif' , fontWeight:'400' , backgroundColor:'white'}}
                        
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {
                            Countries.map(el=> <MenuItem style={{height:'30px', width:'200px'}} key={el.code} value={el.code}>{el.code}&emsp;{el.name}</MenuItem>)
                        }
                      </Select>
                      {countryError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{countryError}</p> : ''}
                    </div>
                    {/* <div className='CardInputs'>
                      <label>Country</label>
                      <select className='CardNumber' style={{width:'100%' , border:'1px solid #ddd' , borderRadius:'12px' , height:'44px' , fontSize:'18px' , padding:'10px 0 10px 15px', fontFamily:"'Montserrat', sans-serif"}} onChange={(e)=>setCountry(e.target.value)}>
                        <option value={''} defaultValue={''}>Choose country</option>
                        {
                          Countries.map(el=> <option style={{height:'30px', width:'200px'}} key={el.code} value={el.code}>{el.code}&emsp;{el.name}</option>)
                        }
                      </select>
                    </div>   */}
                  </div>
                  {/* <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>User country</label>
                        <input type="tel" placeholder='Country' maxLength='23' className="cc-number-input" onChange={(e)=>{setCountry(e.target.value); setCountryError('')}}/>
                        {countryError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{countryError}</p> : ''}
                      </div>
                  </div> */}
                  <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>User city</label>
                        <input type="tel" placeholder='City' maxLength='23' className="cc-number-input" onChange={(e)=>{setCity(e.target.value); setCityError('')}}/>
                        {cityError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{cityError}</p> : ''}
                      </div>
                  </div>
                  <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>User state</label>
                        <input type="tel" placeholder='State' maxLength='23' className="cc-number-input" onChange={(e)=>{setState(e.target.value); setStateError('')}}/>
                        {stateError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{stateError}</p> : ''}
                      </div>
                  </div>
                  <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>User address</label>
                        <input type="tel" placeholder='Address' maxLength='23' className="cc-number-input" onChange={(e)=>{setAddress(e.target.value); setAddressError('')}}/>
                        {addressError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{addressError}</p> : ''}
                      </div>
                  </div>
                  <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>User postal code</label>
                        <input type="tel" placeholder='Postal code' maxLength='23' className="cc-number-input" onChange={(e)=>{setPostalCode(e.target.value); setPostalCodeError('')}}/>
                        {postalCodeError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{postalCodeError}</p> : ''}
                      </div>
                  </div>
                  <div className='CardNumber'>
                      <div className='CardInputs'>
                        <label>Description</label>
                        <input type="tel" placeholder='Description' maxLength='23' className="cc-number-input" onChange={(e)=>{setDescription(e.target.value); setDescriptionError('')}}/>
                        {descriptionError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px' , position:'absolute' , bottom:'-32px'}}>{descriptionError}</p> : ''}
                      </div>
                  </div>
                </form>  
                <div className='CardPayment'>
                  <div className='CardPaymentInput'>
                        <label>Payment Amount(EUR)</label>
                        <input type="text" maxLength="30" placeholder='00.0' className="cc-cvc-input" onChange={(e)=>{setAmount(e.target.value);setAmountError('')}}/>
                        {amountError? <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px' , marginTop:'20px', position:'absolute' , bottom:'-32px'}}>{amountError}</p> : ''}

                  </div>
                    <button onClick={onPay} className={amountError === '' && nameError === '' && holderName !== '' && amount !== ''?"Pay":'buttonDisable'}>Pay</button>
                  </div>
                  {
                    url && (
                      <div style={{width:'90%' , height:'100%',wordWrap:'break-word', display:'flex' , alignItems:'center', flexDirection:'column' , justifyContent:'center'}}>
                        <div style={{width:'90%' , height:'100%',wordWrap:'break-word'}}>
                          {url} 
                        </div>
                        <button className='Pay' style={{marginTop:'20px'}} onClick={()=> navigator.clipboard.writeText(url)}>Copy</button>
                      </div>
                    )
                  }
              </div>
            </div>
    </div>
  );
}

export default GlobalPayments;