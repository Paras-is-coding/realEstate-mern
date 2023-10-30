import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'

import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'

import {IoLocationSharp} from 'react-icons/io5'
import {FaParking,FaBed,FaBath, FaChair} from 'react-icons/fa'

export default function Listing() {
    SwiperCore.use([Navigation]);

    const [listing,setListing] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);
    const params = useParams()
    useEffect(()=>{
        const fetchListing = async()=>{
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingID}`)
                const data = await res.json()
                if(data.success === false){
                   setError(true)
                   setLoading(false);
                   return;
                }
                setListing(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    },[params.listingID])
  return (
            <main>
                {loading && <p className=' text-center text-2xl mt-8'>Loading...</p>}
                {error && <p className=' text-center text-2xl mt-8'>Something went wrong!</p>}

                {listing && !loading && !error && 
                <div>
                <Swiper navigation>
                        {
                           listing.imageUrls.map((url)=>(
                            <SwiperSlide key={url}>
                                <div className='h-[550px]' 
                                style={{background:`url(${url}) center no-repeat`,backgroundSize:"cover"}}
                                >
                                </div>
                            </SwiperSlide>
                           )) 
                        }
                </Swiper>   

                <div className=' w-[80vw] mx-auto'>
                {listing.name && 
                <h1 className=' text-3xl p-4 pl-0 font-bold'>
                     { listing.name} - {listing.discountPrice && `$ ${listing.discountPrice}`}
                     {listing.type === 'rent' ? ` / month`:''} 
                </h1>
                }

                {listing.address && 
                <p className=' flex gap-2 items-center p-4 pb-1 pl-0'><IoLocationSharp className=' text-green-700'/>{listing.address}</p>
                }

                {
                    listing.type && listing.type === 'rent' && 
                        <button className=' bg-rose-700 text-white px-10 py-2 mr-4 border rounded-lg text-lg'>For Rent</button>
                        
                }
                
                {
                 listing.offer && 
                        <button className=' bg-green-700 text-white px-10 py-2 border rounded-lg text-lg'>$ {listing.regularPrice-listing.discountPrice} discount</button>
                }
                
                {
                    listing.description && 
                        <p className=' p-4 mt-3 text-lg border '><span className=' font-semibold text-xl'>Description - </span>{listing.description}</p>
                }
                <div className=' p-4 pl-0 flex items-center flex-wrap gap-6 text-lg text-green-700 font-bold'>
                {
                    listing.bedrooms && 
                    <div className='flex gap-1 items-center'><FaBed/>{listing.bedrooms} Beds</div>
                }
                {
                    listing.bathrooms && 
                    <div className='flex gap-1 items-center'><FaBath/>{listing.bathrooms} Baths</div>
                }
                {
                    listing.parking && 
                    <div className='flex gap-1 items-center'><FaParking/>{listing.parking?" Parking":" No Parking"}</div>
                }
                {
                    listing.furnished && 
                    <div className='flex gap-1 items-center'><FaChair/>{listing.furnished?" Furnished":" Not Furnished"}</div>
                }
                </div>
                </div>


                <div className=' w-full text-center p-4 mt-8 '><button className=' bg-slate-700 text-white w-[80vw] rounded-lg text-lg py-4'>Contact Landlord</button></div>
                </div>
                
                }
            </main>
  )
}
