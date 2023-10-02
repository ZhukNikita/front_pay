import styles from './Methods.module.scss'
import React from "react";
import {useLocation , Link, Navigate} from "react-router-dom";
import Logo from '../../img/GPLogo.png'
import Method from './Method.js';
import secureLocalStorage from 'react-secure-storage';
import NavBar from '../../components/NavBar';
export default function Methods() {
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
            brands: ['SafeInvest','VitalInvest','InfinityInvest','Revolut','RiseInvest']
        },
        {
            id:3,

            name: 'P2P',
            link:`/p2p?brand=${query.get('brand')}`,
            instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
            brands:[]
        },
        {
            id:4,

            name: 'WLX',
            link:`/wlx`,
            instruction:['P2P на KZ, RU и Молдову'],
            brands:[]
        },
        {
            id:5,
            name: 'Inserix',
            link:query.get('brand') === 'SafeInvest'?'https://app.insirex.com/en/referral_form?trader%5Blabel%5D=IOVT':`https://app.insirex.com/referral_form?trader[label]=IOVC` ,
            instruction:["1.Эквайринг с верефикацией документов после оплаты",
            '2. Включаем ВПН страны где находится клиент', 
            "3. Открываем ссылку, заполняем реальные данные клиента",
            `4. Обязательно указываем этот крипто кошелёк: ${query.get('brand') === 'SafeInvest'? 'bc1q5cf5cng938avegtadkuf98hwfyvwwdd0sqgezk' : 'bc1qrsr8q37neh7cf9sqmfau3a8gu4u6qngpev23rf'} , иначе деньги не будут зачислены`,
            "5.  Выбираем нужный вариант оплаты ( CC LPCS/WLC CC/ ZEN), не прошел один, значит пройдет другой", 
            "6. Отправляем клиенту на заполнение данных карты и оптаты", 
            "7. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
            brands: ['SafeInvest','VitalInvest','InfinityInvest','Revolut','RiseInvest']
        }
    ]

    const userMethods = secureLocalStorage.getItem('methods')
    const getMethods = () => {
        let methodsTemp = []
        for(let method of userMethods){
            methodsTemp.push(methods.filter(el=> el.name === method))
        }
        return methodsTemp.flat()
    }
    if(!secureLocalStorage.getItem('isLogged')){
        return <Navigate to={'/login'}/>
    }
    return(
        <div className={styles.methodsPage}>
            <NavBar/>
            <div className={styles.body}>
            <h1>Платёжные методы</h1>
            <div className={styles.methods}>
                {getMethods()?getMethods().map(el=><Method key={el.id} name={el.name} link={el.link} instruction={el.instruction}/>):''}
            </div>
        </div>
        </div>
        
    )
}