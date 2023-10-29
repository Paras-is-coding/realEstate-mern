import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js'

import { updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess, deleteUserFailure,signOutUserStart,signOutUserSuccess,signOutUserFailure} from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'



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

  const [showListingsError,setShowListingsError] = useState(false)
  const [userListings,setUserListings] = useState([])

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

  const handleUserDelete =async (e) =>{
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      })
      const data = await response.json;
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut =async (e)=>{
    try{
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/sign-out');
      const data = res.json()
      if(data.success === false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data))

    }catch(except){
      dispatch(signOutUserFailure(except))
    }

  }

  const handleShowListings = async () =>{
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/listing/${currentUser._id}`)
      const data = await res.json()
      if(data.success === false){
        setShowListingsError(true)
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true)     
    }

  }

  const handleListingDelete = async (id)=>{
    try {
      const res = await fetch(`api/listing/delete/${id}`,{
        method:"DELETE"
      })
      const data = await res.json();
      if(data.success === false){
        console.log(data.message)
        return;
      }

      setUserListings((prev)=> prev.filter((listing)=> listing._id !== id))

    } catch (error) {
      console.log(error)
      
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
        <input type="text" placeholder='username' id='username' defaultValue={currentUser.username}  onChange={handleChange} className=' p-3 rounded-lg border outline-slate-400'/>
        <input type="email" placeholder='email' id='email' defaultValue={currentUser.email} onChange={handleChange} className=' p-3 rounded-lg border outline-slate-400'/>
        <input type="password" placeholder='password' id='password' onChange={handleChange} className=' p-3 rounded-lg border outline-slate-400'/>
        <button className=' bg-slate-800 text-white rounded-lg p-3 uppercase disabled:opacity-80'>{loading?'Loading...':'Update'}</button>
        <Link className=' bg-green-700 text-white p-3 rounded-lg uppercase text-center disabled:opacity-90 hover:opacity-95' to='/create-listing'>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleUserDelete} className=' text-red-800 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className=' text-red-800 cursor-pointer'>Sign Out</span>
      </div>
      <p className=' text-red-700 mt-5'>{error?error:""}</p>
      <p className=' text-green-700'>{updateSuccess?"User updated successfully!":""}</p>

      <button onClick={handleShowListings} className=' text-green-700 w-full border p-3 bg-slate-200 font-bold rounded-lg mb-4'>Show Listings</button>
      <p>{showListingsError ? "Error showing Listings!" : ""}</p>
       
       {
        userListings && userListings.length >0 && 
        <div className=' w-full'>
          <div className=' w-full text-center p-3 font-extrabold text-xl opacity-80'>Your Listings </div>
          {
            userListings.map((listing)=>{
              return (
                <div key={listing._id} className=' flex p-2 border justify-between items-center mt-1 gap-2'>
                  <Link to={`/listing/${listing._id}`}>       
                         <img className=' h-32 w-32 object-contain' src={listing.imageUrls[0]} alt="image" />
                        </Link>
    
                  <Link className='flex-1' to={`/listing/${listing._id}`}>       
                  <h2 className=' font-bold text-lg hover:underline truncate'>{listing.name}</h2>
                        </Link>
    
                  <div className=' flex flex-col font-bold justify-between'>
                    <Link to={`/update-listing/${listing._id}`}>
                    <button className=' text-green-700 text-lg'>Edit</button>
                    </Link>
                    <button onClick={()=>handleListingDelete(listing._id)} className=' text-red-700 text-lg'>Delete</button>
                  </div>
                </div>
              )
            })
          }
        </div>
       }
    </div>
  )
}
