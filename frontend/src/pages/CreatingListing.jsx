import React, { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable}  from 'firebase/storage'
import {app} from '../firebase'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function CreatingListing() {
    const {currentUser} = useSelector(state => state.user)
    const [files,setFiles] = useState([])
    const [formData,setFormData] = useState({
        imageUrls:[],
        name:"",
        description:"",
        address:"",
        type:"rent",
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    })

    const [imageUploadError,setImageUploadError] = useState(false);
    const [uploading,setUploading] = useState(false);

    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(false);
    console.log(formData)

    const navigate = useNavigate()

    const handleImageSubmit = (e)=>{
        if(files.length>0 && files.length + formData.imageUrls.length<7){
            setUploading(true);
            setImageUploadError(false); 
            const promises = [];

            for(let i=0; i<files.length ;i++){
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises)
            .then((urls)=>{
                setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)});
                setImageUploadError(false);
                setUploading(false)
            })
            .catch((err)=>{
                setImageUploadError("Image Upload Failed(2MB max per Image)")
                setUploading(false)
            });

        }
        else{
            setImageUploadError("You can only upload 6 images per listing!")
            setUploading(false)
        }
    }

    const storeImage = async (file) =>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                    console.log(progress)
                },
                (error)=>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL)=>{resolve(downloadURL)})}
            );

        })
    }

const handleRemoveImage = (index) =>{
    setFormData({
        ...formData,
        imageUrls:formData.imageUrls.filter((url,i)=> i!==index)
    })
}


const handleChange = (e)=>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
        setFormData({
            ...formData,
            type :e.target.id
        })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
        setFormData({
            ...formData,
            [e.target.id] : e.target.checked
        })
    }

    if( e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
        setFormData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }

}

const handleSubmit =async (e)=>{
    e.preventDefault();
    try {
        if(formData.imageUrls.length<1) return setError("You must upload at least one image!")
        if(+formData.discountPrice > +formData.regularPrice) return setError("Regular price should be more than discount!")
        setLoading(true)
        setError(false)
        const res = await fetch('/api/listing/create',{
            method:"POST",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                ...formData,
                userRef: currentUser._id,
            })
        });
        const data = await res.json()
        setLoading(false);
        if(data.success === false){
            setError(data.message)
        }
        setLoading(false)
        navigate(`/listing/${data._id}`)
    } catch (error) {
        setError(error.message)
        setLoading(false)
    }
}

  return (
    <main className=' p-3 max-w-4xl mx-auto'>
        <h1 className='font-bold text-3xl text-center mt-3'>Create a Listing</h1>
        <form onSubmit={handleSubmit} className='mt-6 flex flex-col sm:flex-row gap-4'>
        <div id='left' className=' flex flex-col gap-3 flex-1'>
           <div className=' flex flex-col gap-3'>
                <input 
                onChange={handleChange}
                value={formData.name}
                 className=" p-3 border rounded-sm outline-slate-400" type='text' id='name' placeholder='Name' maxLength={60} minLength={5}></input>

                <textarea
                onChange={handleChange}
                value={formData.description}
                 className=" p-3 border rounded-sm outline-slate-400"  id='description' placeholder='Description'></textarea>
                <input
                onChange={handleChange}
                value={formData.address}
                 className=" p-3 border rounded-sm outline-slate-400" type='text' id='address' placeholder='Address'></input>
            </div>
            <div className=' flex gap-8 flex-wrap'>
                <div className='flex gap-2 font-bold'>
                    <input
                    onChange={handleChange}
                    checked={formData.type === "sale"}
                     type='checkbox' id='sale'/>
                    <label htmlFor='sale'>Sell</label>
                </div>
                <div className='flex gap-2 font-bold'>
                    <input
                    onChange={handleChange}
                    checked={formData.type === "rent"}
                     type='checkbox' id='rent'/>
                    <label htmlFor='rent'>Rent</label>
                </div>
                <div className='flex gap-2 font-bold'>
                    <input
                    onChange={handleChange}
                    checked={formData.parking === true}
                     type='checkbox' id='parking'/>
                    <label htmlFor='parking'>Parking spot</label>
                </div>
                <div className='flex gap-2 font-bold'>
                    <input
                    onChange={handleChange}
                    checked={formData.furnished === true}
                     type='checkbox' id='furnished'/>
                    <label htmlFor='furnished'>Furnished</label>
                </div>
                <div className='flex gap-2 font-bold'>
                    <input
                    onChange={handleChange}
                    checked={formData.offer === true}
                     type='checkbox' id='offer'/>
                    <label htmlFor='offer'>Offer</label>
                </div>
            </div>
            <div className='flex gap-10 flex-wrap'>
                <div className=' font-bold flex gap-3 items-center'>
                    <input
                    onChange={handleChange}
                    value={formData.bedrooms}
                     className='p-3 w-16 h-10 border rounded-lg outline-slate-400' type='number' id='bedrooms' />
                    <label htmlFor="bedrooms">Beds</label>
                </div>
                <div className=' font-bold flex gap-3 items-center'>
                    <input
                    onChange={handleChange}
                    value={formData.bathrooms}
                     className='p-3 w-16 h-10 border rounded-lg outline-slate-400' type='number' id='bathrooms' />
                    <label htmlFor="bedrooms">Baths</label>
                </div>
                <div className=' font-bold flex gap-3 items-center'>
                    <input
                    onChange={handleChange}
                    value={formData.regularPrice}
                    min='50'
                    max='10000000'
                     className='p-3 w-16 h-10 border rounded-lg outline-slate-400' type='number' id='regularPrice' />
                    <div className='flex flex-col'>
                    <label htmlFor="regularPrice">Regular Price</label>
                    <label className=' text-xs' htmlFor='regularPrice'>(${(formData.type === 'rent') && (`/month`)})</label>
                    </div>                    
                </div>
                {formData.offer && (<div className=' font-bold flex gap-3 items-center'>
                    <input
                    onChange={handleChange}
                    value={formData.discountPrice}
                    min='0'
                    max='10000000'
                     className='p-3 w-16 h-10 border rounded-lg outline-slate-400' type='number' id='discountPrice' />
                    <div className='flex flex-col'>
                    <label htmlFor="discountPrice">Discounted Price</label>
                    <label className=' text-xs' htmlFor='discountPrice'>($ {(formData.type === 'rent') && (`/month`)} )</label>
                    </div>                    
                </div>)}
            </div>
        </div>
        <div id='right' className='flex flex-col gap-2 flex-1'>
            <p className=' font-bold'>
                Images : 
                <span className=' font-normal ml-3 text-sm'>The first image will be the cover max ( 6 )</span>
            </p>
            <div className='flex gap-2 flex-wrap sm:flex-nowrap '>
                <input onChange={(e)=> setFiles(e.target.files)}  className=' border p-3 ' type='file' id='image' accept='image/*' max={6} multiple />
                <button disabled={uploading} onClick={handleImageSubmit} type='button' className=' p-3 border rounded-lg hover:shadow-lg border-green-700 text-green-900'>{uploading ? "Uploading...":"Upload"}</button>
            </div>
            <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
            {formData.imageUrls.length >0 && formData.imageUrls.map((url,index)=>(
                <div key={url} className=' flex justify-between border items-center p-2'>
                <img src={url} alt='listing image' className=' h-24 w-24 object-contain rounded-lg' />
                <button type='button' onClick={()=>handleRemoveImage(index)} className=' p-3 rounded-lg uppercase hover:opacity-80 border bg-red-700 text-white'>Delete</button>
                </div>
            ))}
            <button type='submit' disabled={loading || uploading}  className=' p-3 bg-slate-700 text-white uppercase rounded-lg mt-3 hover:opacity-95 disabled:opacity-80'>{loading?"Creating..." : "Create Listing"}</button>
            {error && <p className=' text-red-700 text-sm'>{error}</p>}
        </div>

     </form>
    </main>
  )
}
