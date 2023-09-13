import styles from '../styles/PaymentsMethods.module.scss'
import React from "react";
import {useLocation} from "react-router-dom";
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
            name: '1',
            link:`https://front-pay.vercel.app/global_payments?brand=${query.get('brand')}`,
            instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
        },
        {
            name: '2',
            link:`https://front-pay.vercel.app/global_payments?brand=${query.get('brand')}`,
            instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
        },
        {
            name: 'P2P',
            link:`https://front-pay.vercel.app/p2p?brand=${query.get('brand')}`,
            instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
        },
        {
            name: 'Inserix',
            link:`https://app.insirex.com/en/referral_form?trader%5Blabel%5D=IOVC`,
            instruction:['1. Включаем ВПН страны где находится клиент', "2. Открываем ссылку, заполняем реальные данные клиента", "3. Выбираем нужный вариант оплаты из 3 више указаных", "4. Отправляем клиенту на заполнение", "5. После успешного пополнения отправляем в Тикет запрос на зачисление в формате: Название платежки 'Inserix', Почта клиента, Сумма и время пополнения, Документы Лида"],
        }
    ]
    return(
        <div className={styles.body}>
            <div className={styles.logo}>
                <img src={Logo}/>
            </div>
            <h2>Пожалуйста выберите метод платежа</h2>
            <div className={styles.methods}>
                {methods.map(el=> <Method name={el.name} key={el.name} link={el.link} instruction={el.instruction}/>)}
            </div>
        </div>
    )
}