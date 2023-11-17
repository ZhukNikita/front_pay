import { useEffect } from "react"
import axios from 'axios'
import $api from "../../axios"



export default function Transaction (){
    useEffect(()=>{
        async function fetchData (){
            const {data} = await $api.get('/getShpTransactions')
            console.log(data)
        }
        fetchData()
    },[])

    return(
        <div>

        </div>
    )
}