import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'

export default function Listing() {
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
                <div>{listing.name}</div>}
            </main>
  )
}
