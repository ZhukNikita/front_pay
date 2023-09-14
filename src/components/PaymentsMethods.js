import styles from '../styles/PaymentsMethods.module.scss'
import React from "react";
import {useLocation , Link} from "react-router-dom";
import Logo from '../img/GPLogo.png'
import Method from './Method';

export default function PaymentsMethods() {
    function useQuery() {
        const { search } = useLocation();
      
        return React.useMemo(() => new URLSearchParams(search), [search]);
      }
      let query = useQuery();

      const methods = [
        {
            id:1,
            name: 'PinPay',
            link:`/pinpay?brand=${query.get('brand')}`,
            instruction:['1. Полный Эквайринг без верефикации', "2. Заполнить реальные данные клиента ( если нет возможности то просто левые реальные данные)", "3. Создавшуюся ссылку скопировать и отправить клиенту", "4. Проверка зачисления через ПСП"],
            brands: ['SaveInvest','VetalInvest']
        },
        // {
        //     name: '2',
        //     link:`https://front-pay.vercel.app/global_payments?brand=${query.get('brand')}`,
        //     instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
        // },
        {
            id:3,

            name: 'P2P',
            link:`/p2p?brand=${query.get('brand')}`,
            instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
            brands:[]
        },
        {
            id:4,

            name: 'Inserix',
            link:query.get('brand') === 'SafeInvest'?'https://app.insirex.com/en/referral_form?trader%5Blabel%5D=IOVT':`https://app.insirex.com/en/referral_form?trader%5Blabel%5D=IOVC` ,
            instruction:["1.Эквайринг с верефикацией документов после оплаты",'2. Включаем ВПН страны где находится клиент', "3. Открываем ссылку, заполняем реальные данные клиента", "4.  Выбираем нужный вариант оплаты ( CC LPCS/WLC CC/ ZEN), не прошел один, значит пройдет другой", "5. Отправляем клиенту на заполнение данных карты и оптаты", "6. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
            brands: ['SafeInvest','VetalInvest']
        }
    ]

    const getMethods = () => {
        const brand = query.get('brand')
        const arr = methods.filter(el=> el.brands.includes(brand))
        return arr
    }
    return(
        <div className={styles.body}>
            <Link to={'/'} style={{color:'white', fontWeight:'bold' , fontFamily:'"Montserrat" , sans-serif' , position:'absolute' , top:'20px' , right:'20px'}}>На главную</Link>

            <div className={styles.logo}>
                <img src={Logo}/>
            </div>
            <h2>Пожалуйста выберите метод платежа</h2>
            <div className={styles.methods}>
                {getMethods()?getMethods().map(el=><Method key={el.id} name={el.name} link={el.link} instruction={el.instruction}/>):''}
            </div>
        </div>
    )
}