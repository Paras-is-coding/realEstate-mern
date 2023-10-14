import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'

import { updateUserStart,updateUserSuccess,updateUserFailure } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'


export default function Profile() {
  
  const fileRef = useRef(null)
  const {currentUser,loading,error} = useSelector((state) => state.user)
  const [file,setFile] = useState(null) // we'll use later to store in dbase

  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData,setFormData] =useState({})
  console.log(formData)
  const dispatch =  useDispatch();
  const [updateSuccess,setUpdateSuccess] = useState(false);

  useEffect(()=>{
    if(file){
      setFileUploadErr(false);
      setFilePerc(0);
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload = (file)=>{
    // getStorage from firebase for this app(conn)
    const storage = getStorage(app) 

    //creating unique filename intead of storing file.originalname
    let random = Math.ceil(Math.random()*9999);
    let ext = (file.name.split(".")).pop();
    const filename = Date.now()+"-"+random+"."+ext;

    // set place to store file
    const storageRef = ref(storage,filename) // here `folder/${filename}` could be done

    // now begin uploadTask this var will be used to get percentage,error,...
    const uploadTask = uploadBytesResumable(storageRef,file);

    // now to track percentage of upload and errors
    uploadTask.on('state_changed',(snapshot)=>{
    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
    //we'll store progress in a state filePerc
      setFilePerc(Math.round(progress));
    },
    (error)=>{
      setFileUploadErr(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>setFormData({...formData,avatar:downloadURL}))
    }

    );
    
    

  };

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id] :e.target.value})
  };
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData),
      });
      
      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    }catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }
    
  return ( 
    <div className='p-4 max-w-lg mx-auto'>
      <h1 className=' font-bold text-2xl text-center '>Profile</h1>
      <form onSubmit={handleSubmit} className=' mt-6 flex flex-col gap-3'>
        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e)=>setFile(e.target.files[0])} />
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile" className=' rounded-full mx-auto h-24 w-24 object-cover cursor-pointer' />
        <p className=' text-sm self-center'>
          {fileUploadErr ? <span className=' text-red-700'>Error image must be less then 2MB</span>:
              filePerc>0 && filePerc<100?<span>{`Uploading ${filePerc}%`}</span>:
              filePerc ===100?<span className=' text-green-700'>Image uploaded successfully!</span>:
              ""
          }
        </p>
        <input type="text" placeholder='username' id='username' defaultValue={currentUser.username}  onChange={handleChange} className=' p-3 rounded-lg border'/>
        <input type="email" placeholder='email' id='email' defaultValue={currentUser.email} onChange={handleChange} className=' p-3 rounded-lg border'/>
        <input type="password" placeholder='password' id='password' onChange={handleChange} className=' p-3 rounded-lg border'/>
        <button className=' bg-slate-800 text-white rounded-lg p-3 uppercase disabled:opacity-80'>{loading?'Loading...':'Update'}</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className=' text-red-800 cursor-pointer'>Delete Account</span>
        <span className=' text-red-800 cursor-pointer'>Sign Out</span>
      </div>
      <p className=' text-red-700 mt-5'>{error?error:""}</p>
      <p className=' text-green-700'>{updateSuccess?"User updated successfully!":""}</p>
    </div>
  )
}
