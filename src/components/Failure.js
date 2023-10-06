import Swal from 'sweetalert2';
import { useLocation} from 'react-router-dom'

export default function Failure(){
    const { pathname } = useLocation();

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