import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [user,setUser] = useState({
    username:"",
    email:"",
    password:""
  })
  const [error,setError] = useState(null);
  const [loading,setLoading] =  useState(false);
  const navigate = useNavigate();

  const handleChange = (e)=>{
      setUser((prev)=>( {...prev,[e.target.id] : e.target.value}))
  }

  let data;
  const handleSubmit =async (e)=>{
    e.preventDefault();
    try{
      setLoading(true);
      //created proxy in viteconfig for route before /api
      const response = await fetch('/api/auth/sign-up',{
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify( user) 
      }
      )
      
      data = await response.json();
      if(data.success === false){
        setError(data.message);
        setLoading(false);
        return;
      }
      setError(null);
      setLoading(false);
      navigate('/sign-in')
    
    }catch(er){
      setError(error.message);
      setLoading(false);
    }
  }
   


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'  onSubmit={handleSubmit}>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button  disabled={loading}  className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Loading...":"Sign up"}</button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className=' text-red-800 mt-8'>{error}</p>}
    </div>
  )
}
