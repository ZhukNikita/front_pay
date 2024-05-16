import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import styles from '../styles/AdvCash.module.scss';
import $api from '../axios'
export default function AdvCashPaymentLink() {
    const [amount , setAmount] = useState('')
    const [sign , setSign] = useState('')
    const [orderId , setOrderId] = useState('')
    if(!secureLocalStorage.getItem('isLogged') || !secureLocalStorage.getItem('methods').includes('AdvCash')){
        return <Navigate to={'/payments_methods'}/>
    }
    async function onClick (){
        try{
            const {data} = await $api.post('/getSign' , {amount : Number(amount)})
            setSign(data.signature)
            setOrderId(data.orderId)
        }catch(e){
            console.log(e)
        }
    }
    const generatePaymentLink = () => {
        return `https://wallet.advcash.com/sci/?ac_account_email=zantdeyker8@outlook.com&ac_sci_name=global-academy&ac_amount=12&ac_currency=USD&ac_order_id=12345672&ac_success_url=https://global-academy.work/success&ac_success_url_method=GET&ac_fail_url=https://global-academy.work/failure&ac_fail_url_method=GET&ac_status_url=https://global-academy.work/status&ac_status_url_method=GET&ac_comments=Brand`;
    };
    return (
        <div className={styles.body}>
            <form action="https://readies.biz/makePayment" method="post">
                    <input type="hidden" name="cmd" defaultValue="_pay_simple" />
                    <input type="hidden" name="reset" defaultValue={1} />
                    <input type="hidden" name="merchant" defaultValue="632f14dea899dfa73f126b877f8290c3" />
                    <input type="hidden" name="item_name" defaultValue="TestLink" />
                    <input type="hidden" name="item_desc" defaultValue="TestPay" />
                    <input type="hidden" name="item_number" defaultValue={1700} />
                    <input type="hidden" name="invoice" defaultValue={17123123} />
                    <input type="hidden" name="currency" defaultValue="USD" />
                    <input type="hidden" name="amountf" defaultValue={100.00} />
                    <input type="hidden" name="want_shipping" defaultValue={1} />
                    <input type="hidden" name="shippingf" defaultValue={1.00} />
                    <input type="hidden" name="success_url" defaultValue="https://pythonguix.pro/acsec" />
                    <input type="hidden" name="cancel_url" defaultValue="https://pythonguix.pro/Failet" />
                    <input type="hidden" name="ipn_url" defaultValue />
                    <input type="hidden" name="tax" defaultValue={0.00} />
                    <div className="infonotes"><i className="fa fa-info-circle" /><span className="noteshoww">Pay with READIES, the best and safest payment solution which can protect your privacy, used by millions of online shoppers and gamers globally! This site accepts READIES without any extra fee.<br />Not yet have a READIES account? Sign-upnow for free!</span></div>
                    <input type="image" style={{width: '25%'}} src="https://readies.biz/userpanel/images/payokepaybtn.png" alt />
            </form>
        </div>
    );
}