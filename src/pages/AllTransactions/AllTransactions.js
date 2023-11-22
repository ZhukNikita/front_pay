import secureLocalStorage from "react-secure-storage";
import NavBar from "../../components/NavBar";
import styles from './AllTransactions.module.scss'
import { Link, Navigate } from "react-router-dom";

export default function AllTransations(){
    const methods = [
        {
            id:1,
            name: 'PinPay',
            link:`/pinpay-transactions`,
            instruction:['1. Полный Эквайринг без верефикации', "2. Заполнить реальные данные клиента ( если нет возможности то просто левые реальные данные)", "3. Создавшуюся ссылку скопировать и отправить клиенту", "4. Проверка зачисления через ПСП"],
            brands: ['SafeInvest','VitalInvest','InfinityInvest','Revolut','RiseInvest']
        },
        {
            id:3,
            name: 'P2P',
            link:`/p2p-transactions`,
            instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Insirex', Почта клиента, Сумма и время пополнения, Документы Лида"],
            brands:[]
        },
        {
            id:4,
            name: 'WLX',
            link:`/wlx-transactions`,
            instruction:['P2P на KZ, RU и Молдову'],
            brands:[]
        },
        {
            id:5,
            name: 'Insirex',
            link:"/insirex-transactions" ,
            instruction:["1.Эквайринг с верефикацией документов после оплаты",
            '2. Включаем ВПН страны где находится клиент', 
            "3. Открываем ссылку, заполняем реальные данные клиента",
            `4. Обязательно указываем этот крипто кошелёк: ${secureLocalStorage.getItem('userBrand') === 'SafeInvest'? 'bc1q5cf5cng938avegtadkuf98hwfyvwwdd0sqgezk' : 'bc1qrsr8q37neh7cf9sqmfau3a8gu4u6qngpev23rf'} , иначе деньги не будут зачислены`,
            "5.  Выбираем нужный вариант оплаты ( CC LPCS/WLC CC/ ZEN), не прошел один, значит пройдет другой", 
            "6. Отправляем клиенту на заполнение данных карты и оптаты", 
            "7. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Insirex', Почта клиента, Сумма и время пополнения, Документы Лида"],
            brands: ['SafeInvest','VitalInvest','InfinityInvest','Revolut','RiseInvest']
        },
        {
            id:6,
            name: 'AdvCash',
            link:'/advcash-transactions' ,
            instruction:[],
            brands: ['SafeInvest']
        },
        {
            id:7,
            name: 'shp.ee',
            link:'/shp-transactions' ,
            instruction:[],
            brands: ['SafeInvest']
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
        <div className={styles.body}>
            <NavBar/>
            <div className={styles.content}>
            <h1>Транзакции</h1>
            <div className={styles.transactions}>
                {getMethods()?getMethods().map(el=>
                <Link to={el.link} className={styles.transaction} key={el.id}>
                    <h1>{el.name}</h1>
                </Link >):''}
            </div>
            </div>
        </div>
    )
}