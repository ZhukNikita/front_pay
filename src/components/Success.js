import Swal from 'sweetalert2';
import { useLocation} from 'react-router-dom'

export default function Success() {
    const { pathname } = useLocation();


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
            // window.location.href = 'http://localhost:3000'
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
          }
        })
      }
}