import React from 'react'

export default function CreatingListing() {
  return (
    <main className=' p-3 max-w-4xl mx-auto'>
        <h1 className='font-bold text-3xl text-center mt-3'>Create a Listing</h1>
        <form className='mt-6 flex flex-col sm:flex-row gap-4'>
        <div id='left' className=' flex flex-col gap-3 flex-1'>
           <div className=' flex flex-col gap-3'>
                <input className=" p-3 border rounded-sm outline-slate-400" type='text' id='name' placeholder='Name' maxLength={60} minLength={5}></input>
                <textarea className=" p-3 border rounded-sm outline-slate-400"  id='description' placeholder='Description'></textarea>
                <input className=" p-3 border rounded-sm outline-slate-400" type='text' id='address' placeholder='Address'></input>
            </div>
            <div className=' flex gap-8 flex-wrap'>
                <div className='flex gap-2 font-bold'>
                    <input type='checkbox' id='sell'/>
                    <label htmlFor='sell'>Sell</label>
                </div>
                <div className='flex gap-2 font-bold'>
                    <input type='checkbox' id='rent'/>
                    <label htmlFor='rent'>Rent</label>
                </div>
                <div className='flex gap-2 font-bold'>
                    <input type='checkbox' id='parking'/>
                    <label htmlFor='parking'>Parking spot</label>
                </div>
                <div className='flex gap-2 font-bold'>
                    <input type='checkbox' id='furnished'/>
                    <label htmlFor='furnished'>Furnished</label>
                </div>
                <div className='flex gap-2 font-bold'>
                    <input type='checkbox' id='offer'/>
                    <label htmlFor='offer'>Offer</label>
                </div>
            </div>
            <div className='flex gap-10 flex-wrap'>
                <div className=' font-bold flex gap-3 items-center'>
                    <input className='p-3 w-16 h-10 border rounded-lg outline-slate-400' type='number' id='bedrooms' />
                    <label htmlFor="bedrooms">Beds</label>
                </div>
                <div className=' font-bold flex gap-3 items-center'>
                    <input className='p-3 w-16 h-10 border rounded-lg outline-slate-400' type='number' id='bathrooms' />
                    <label htmlFor="bedrooms">Baths</label>
                </div>
                <div className=' font-bold flex gap-3 items-center'>
                    <input className='p-3 w-16 h-10 border rounded-lg outline-slate-400' type='number' id='regularPrice' />
                    <div className='flex flex-col'>
                    <label htmlFor="regularPrice">Regular Price</label>
                    <label className=' text-xs' htmlFor='regularPrice'>($/month)</label>
                    </div>                    
                </div>
                <div className=' font-bold flex gap-3 items-center'>
                    <input className='p-3 w-16 h-10 border rounded-lg outline-slate-400' type='number' id='discountPrice' />
                    <div className='flex flex-col'>
                    <label htmlFor="discountPrice">Discounted Price</label>
                    <label className=' text-xs' htmlFor='discountPrice'>($/month)</label>
                    </div>                    
                </div>
            </div>
        </div>
        <div id='right' className='flex flex-col gap-2 flex-1'>
            <p className=' font-bold'>
                Images : 
                <span className=' font-normal ml-3 text-sm'>The first image will be the cover max ( 6 )</span>
            </p>
            <div className='flex gap-2 flex-wrap sm:flex-nowrap '>
                <input  className=' border p-3 ' type='file' id='image' accept='image/*' max={6} multiple />
                <button className=' p-3 border rounded-lg hover:shadow-lg border-green-700 text-green-900'>Upload</button>
            </div>
            <button type='submit' className=' p-3 bg-slate-700 text-white uppercase rounded-lg mt-3 hover:opacity-95 disabled:opacity-80'>Create Listing</button>
        </div>

     </form>
    </main>
  )
}
