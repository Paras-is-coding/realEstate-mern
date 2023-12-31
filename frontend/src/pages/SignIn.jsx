import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice.js'
import OAuth from '../components/OAuth.jsx'

export default function SignIn() {
  const [user,setUser] = useState({
    email:"",
    password:""
  })
  // const [error,setError] = useState(null);
  // const [loading,setLoading] =  useState(false);

  //instead of making hooks we import from global state /user slice
  const{loading,error} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e)=>{
      setUser((prev)=>( {...prev,[e.target.id] : e.target.value}))
  }

  let data;
  const handleSubmit =async (e)=>{
    e.preventDefault();
    try{
      // setLoading(true);
      dispatch(signInStart())
      //created proxy in viteconfig for route before /api
      const response = await fetch('/api/auth/sign-in',{
        method: 'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify( user) 
      }
      )
      
      data = await response.json();
      if(data.success === false){
        // setError(data.message);
        // setLoading(false);
        dispatch(signInFailure(data.message));
        return;
      }
      // setError(null);
      // setLoading(false);
      dispatch(signInSuccess(data));
      navigate('/')
    
    }catch(error){
      // setError(error.message);
      // setLoading(false);
      dispatch(signInFailure(error.message))
    }
  }
   


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4'  onSubmit={handleSubmit}>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button  disabled={loading}  className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? "Loading...":"Sign up"}</button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Create an account</span>
        </Link>
      </div>
      {error && <p className=' text-red-800 mt-8'>{error}</p>}
    </div>
  )
}
