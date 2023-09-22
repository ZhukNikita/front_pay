import styles from '../styles/Navbar.module.scss'
import Logo from '../img/GPLogo.png'
import React from "react";
import {Link, useLocation} from "react-router-dom";
import secureLocalStorage from 'react-secure-storage';
import {Navigate} from 'react-router-dom'


export default function NavBar() {

    function useQuery() {
        const { search } = useLocation();
      
        return React.useMemo(() => new URLSearchParams(search), [search]);
      }
      let query = useQuery();

      const methods = [
        {
            id:1,
            name: 'PinPay',
            link:`/pinpay?brand=Admin`,
            instruction:['1. Полный Эквайринг без верефикации', "2. Заполнить реальные данные клиента ( если нет возможности то просто левые реальные данные)", "3. Создавшуюся ссылку скопировать и отправить клиенту", "4. Проверка зачисления через ПСП"],
            brands: ['SafeInvest','VetalInvest','InfinityInvest','Revolut','RiseInvest']
        },
        // {
        //     name: '2',
        //     link:`https://front-pay.vercel.app/global_payments?brand=${query.get('brand')}`,
        //     instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
        // },
        {
            id:3,

            name: 'P2P',
            link:`/p2p?brand=Admin`,
            instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
            brands:[]
        },
        {
            id:4,

            name: 'Inserix',
            link:query.get('brand') === 'SafeInvest'?'https://app.insirex.com/en/referral_form?trader%5Blabel%5D=IOVT':`https://app.insirex.com/referral_form?trader[label]=IOVC` ,
            instruction:["1.Эквайринг с верефикацией документов после оплаты",
            '2. Включаем ВПН страны где находится клиент', 
            "3. Открываем ссылку, заполняем реальные данные клиента",
            // `4. Обязательно указываем этот крипто кошелёк: ${query.get('brand') === 'SafeInvest'? 'bc1q5cf5cng938avegtadkuf98hwfyvwwdd0sqgezk' : 'bc1qrsr8q37neh7cf9sqmfau3a8gu4u6qngpev23rf'} , иначе деньги не будут зачислены`,
            "5.  Выбираем нужный вариант оплаты ( CC LPCS/WLC CC/ ZEN), не прошел один, значит пройдет другой", 
            "6. Отправляем клиенту на заполнение данных карты и оптаты", 
            "7. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
            brands: ['SafeInvest','VetalInvest','InfinityInvest','Revolut','RiseInvest']
        }
    ]

    const getMethods = () => {
        const brand = query.get('brand')
        const arr = methods
        return arr
    }
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    if(secureLocalStorage.getItem('role') !== 'SuperAdmin' && secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/'}/>
    }
    return(
        <div className={styles.body}>
            <div className={styles.content}>
                <img className={styles.logo} src={Logo}/>
                <h2>Платежные методы</h2>
                <div className={styles.paymentsList}>
                    {getMethods()?getMethods().map(el=><div key={el.name} className={styles.payment}>{el.name}</div>):''}
                    <Link to={'/transactions'} className={styles.payment} style={{textDecoration:'none'}}>Транзакции</Link>
                    <Link to={'/panel'} className={styles.payment} style={{textDecoration:'none'}}>Пользователи</Link>
                </div>
            </div>

            <button className={styles.logout} onClick={()=>{secureLocalStorage.removeItem('isLogged') ; secureLocalStorage.removeItem('role') ; secureLocalStorage.removeItem('userId') ; window.location.href = 'http://localhost:3000/login'}}>Вийти</button>
        </div>
    )
}