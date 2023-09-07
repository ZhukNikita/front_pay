import './App.css';
import logo from './img/GP.png'
import chip from './img/chip.png'
import {useEffect,useState} from 'react'
import Swal from 'sweetalert2';

function App() {
  const [number , setNumber] = useState('')
  const [cvc , setCvc] = useState('')
  const [expire , setExpire] = useState('')
  const [method , setMethod] = useState('')
  const [isLoading , setIsLoading] = useState(false)
  const [holderName , setHolderName] = useState('')
  const [amount , setAmount] = useState('')
  const [error , setError] = useState('')
  console.log(number.length)
  function onPay(){
    if(number.length < 16){
      setError('Card number must contain at least 16 characters.')
    }else if(cvc.length < 3){
        setError('CVC must contain at least 3 characters.')
      }else if(expire.length < 4){
        setError('Expire date must contain at least 4 characters.')
      }else if(+expire.slice(3) < `${new Date().getFullYear()}`.slice(2)){
        setError('Invalid expire date.')
      }else if(!holderName){
        setError("Enter cardholder's name")
      }else if(!amount || /[a-zA-Z]/.test(amount)){
        setError('Invalid amount')
      }
    setIsLoading(true)
    // if(isLoading){
    //   Swal.fire({
    //     title: 'Loading',
    //     timerProgressBar: true,
    //     didOpen: () => {
    //       Swal.showLoading()
    //     },
    //   })
    // }
  }
  console.log()
  console.log()
  useEffect(()=>{
  let ccNumberInput = document.querySelector('.cc-number-input'),

		ccNumberSeparator = " ",
		ccNumberInputOldValue,
		ccNumberInputOldCursor,
		
		ccExpiryInput = document.querySelector('.cc-expiry-input'),
		ccExpiryPattern = /^\d{0,4}$/g,
		ccExpirySeparator = "/",
		ccExpiryInputOldValue,
		ccExpiryInputOldCursor,
		
		ccCVCInput = document.querySelector('.cc-cvc-input'),
		ccCVCPattern = /^\d{0,3}$/g,
		
		mask = (value, limit, separator) => {
			var output = [];
			for (let i = 0; i < value.length; i++) {
				if ( i !== 0 && i % limit === 0) {
					output.push(separator);
				}
				
				output.push(value[i]);
			}
			
			return output.join("");
		},
		unmask = (value) => value.replace(/[^\d]/g, ''),
		checkSeparator = (position, interval) => Math.floor(position / (interval + 1)),
		ccNumberInputKeyDownHandler = (e) => {
			let el = e.target;
			ccNumberInputOldValue = el.value;
			ccNumberInputOldCursor = el.selectionEnd;
		},
		ccNumberInputInputHandler = (e) => {
      setError('')
			let el = e.target,
					newValue = unmask(el.value),
					newCursorPosition;
          setNumber(newValue)

      let lengthPattern = '{0,20}',
      ccNumberPattern = new RegExp('^\\d' + lengthPattern + '$', 'g');

			if ( newValue.match(ccNumberPattern) ) {
				newValue = mask(newValue, 4, ccNumberSeparator);
				
				newCursorPosition = 
					ccNumberInputOldCursor - checkSeparator(ccNumberInputOldCursor, 4) + 
					checkSeparator(ccNumberInputOldCursor + (newValue.length - ccNumberInputOldValue.length), 4) + 
					(unmask(newValue).length - unmask(ccNumberInputOldValue).length);
				
				el.value = (newValue !== "") ? newValue : "";
			} else {
				el.value = ccNumberInputOldValue;
				newCursorPosition = ccNumberInputOldCursor;
			}
			
			el.setSelectionRange(newCursorPosition, newCursorPosition);
			
			highlightCC(el.value);
		},
		highlightCC = (ccValue) => {
			let ccCardType = '',
					ccCardTypePatterns = {
						visa: /^4/,
						mastercard: /^5/,
						maestro: /^6/,
					};
			
			for (const cardType in ccCardTypePatterns) {
				if ( ccCardTypePatterns[cardType].test(ccValue) ) {
					ccCardType = cardType;
          setMethod(cardType)
					break;
				}
			}
			
			let activeCC = document.querySelector('.cc-types__img--active'),
					newActiveCC = document.querySelector(`.cc-types__img--${ccCardType}`);
			
			if (activeCC) activeCC.classList.remove('cc-types__img--active');
			if (newActiveCC) newActiveCC.classList.add('cc-types__img--active');
		},
		ccExpiryInputKeyDownHandler = (e) => {
			let el = e.target;
			ccExpiryInputOldValue = el.value;
			ccExpiryInputOldCursor = el.selectionEnd;
		},
		ccExpiryInputInputHandler = (e) => {
      setExpire(e.target.value)
			let el = e.target,
					newValue = el.value;
			
			newValue = unmask(newValue);
			if ( newValue.match(ccExpiryPattern) ) {
				newValue = mask(newValue, 2, ccExpirySeparator);
				el.value = newValue;
			} else {
				el.value = ccExpiryInputOldValue;
			}
		};
    if(ccNumberInput){
      ccNumberInput.addEventListener('keydown', ccNumberInputKeyDownHandler);
      ccNumberInput.addEventListener('input', ccNumberInputInputHandler);
    }
    if(ccExpiryInput){
      ccExpiryInput.addEventListener('keydown', ccExpiryInputKeyDownHandler);
      ccExpiryInput.addEventListener('input', ccExpiryInputInputHandler);
    }
  },[])

  console.log(error)
  return (
    <div className="App">
        <div className='Card'>
            <img className='Logo' src={logo}/>
            <div className="wrapper">
            <div className="cc-types">
              <img className="cc-types__img cc-types__img--visa" style={method ==='visa'? {filter:'none'}:{}} onClick={()=>setMethod('visa')}/>
              <img className="cc-types__img cc-types__img--mastercard" style={method ==='mastercard'? {filter:'none'}:{}} onClick={()=>setMethod('mastercard')}/>
              <img className="cc-types__img cc-types__img--maestro" style={method ==='maestro'? {filter:'none'}:{}} onClick={()=>setMethod('maestro')}/>
            </div>

            <div className='CardTemplate'>
              <div className='CardNumber' style={{justifyContent:'space-between' , height:'41.83px'}}>
                <img src={chip} width={50}  style={{filter:'brightness(0.9)'}}/>
                {method === 'visa'? <img className="cc-types__img cc-types__img--visa"  style={{filter:'none'}}/>
                :method === 'mastercard'?<img className="cc-types__img cc-types__img--mastercard"   style={{filter:'none'}}/>
                :method === 'maestro'?<img className="cc-types__img cc-types__img--maestro"  style={{filter:'none'}}/> : <div className='empty'></div>}
              </div>
              <div className='CardNumber'>
                  <div className='CardInputs'>
                    <label>Card Number</label>
                    <input type="tel" placeholder='0000 0000 0000 0000' maxLength='23' className="cc-number-input" />
                  </div>
                  <div className='CardInputsCVC'>
                    <label>Expires</label>
                    <input type="text" placeholder='MM/YY' maxLength="5" className="cc-expiry-input"/>
                  </div>
              </div>
              <div className='CardNumber'>
                  <div className='CardInputs'>
                    <label>Cardholder Name</label>
                    <input type="text" maxLength="30" placeholder='Cardholder Name' className="cc-card-name"onChange={(e)=>setHolderName(e.target.value)}/>
                  </div>
                  <div className='CardInputsCVC'>
                    <label>CVC</label>
                    <input type="text" maxLength="3" placeholder='123' className="cc-cvc-input"onChange={(e)=>setCvc(e.target.value)}/>
                  </div>
              </div>
            </div>
            <div className='CardPayment'>
              <div className='CardPaymentInput'>
                    <label>Payment Amount</label>
                    <input type="text" maxLength="30" placeholder='00.0' className="cc-cvc-input" onChange={(e)=>setAmount(e.target.value)}/>
              </div>
              <button onClick={amount && number && cvc && holderName && expire?onPay: ()=>{}} className={amount && number && cvc && holderName && expire?'':'buttonDisable'}>Pay</button>
              </div>
              <div>
                <p style={{color:'red' , fontFamily:"'Montserrat', sans-serif", fontWeight:'bold' , fontSize:'13px'}}>
                  {error}
                </p>
              </div>
          </div>
        </div>
    </div>
  );
}

export default App;
