import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import {app} from '../firebase.js'

import { signInSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';



export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick =async () =>{
        try{
        const provider = new  GoogleAuthProvider()
        const auth = getAuth(app);
        let result = await signInWithPopup(auth,provider);

        let response = await fetch('/api/auth/google',{
            method : 'POST',
            headers : {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL
            })
        })
        const data = await response.json();
        console.log(data)
        
        dispatch(signInSuccess(data));
        navigate('/');


        }catch(error){
            console.log("Cannot sign in using google",error);
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className=' hover:opacity-95 bg-red-800 p-3 text-white uppercase rounded-lg'>Continue with Google</button>
  )
}
