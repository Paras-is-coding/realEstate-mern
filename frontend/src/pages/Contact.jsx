import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const[landlord,setLandlord] = useState(null);
    const[message,setMessage] = useState('');

    useEffect(()=>{
    
        const fetchLandlord = async () =>{
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
            const data = await res.json();
            setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchLandlord();
    },[listing.userRef])

    const onChange = (e)=>{
        setMessage(e.target.value)
    }

  return (
    <div className=' w-[80vw] mx-auto'>
    <div className=' flex flex-col gap-2'>
        <p className='w-[80vw] text-left pl-2'>Contact <span className=' font-semibold'>{landlord?.username}</span> for <span className=' font-semibold'>{listing.name.toLowerCase()}</span></p>
        <textarea
         name='message'
         id='message'
         rows='2' 
         value={message} 
         onChange={onChange}
         placeholder='Enter your message here...'
         className=' border outline-none focus:shadow-md rounded-md p-2 w-[80vw]'
          >
        </textarea>

         {/* Will activate mail system in our windows */}
       <Link 
        to={`mailto:${landlord?.email}?subject=Regarding ${listing?.name}&body=${message}`}
        className=' bg-slate-700 text-white py-2 rounded-lg hover:opacity-95'
        >
            Send message
        </Link>
       
    </div>
    </div>
  )
}
