import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [sidebardata,setSidebardata] = useState({
        searchTearm:"",
        type:"all",
        offer:false,
        parking:false,
        furnished:false,
        sort:"createdAt",
        order:"desc"
    });

    const[loading,setLoading] = useState(false);
    const[listings,setListings] = useState([]);
    console.log(listings)

    const navigate = useNavigate();


    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search)

        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const offerFromUrl = urlParams.get('offer');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            offerFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            sortFromUrl ||
            orderFromUrl
        )
        {
            setSidebardata({
                searchTearm:searchTermFromUrl || '',
                type:typeFromUrl || 'all',
                offer:offerFromUrl || 'false',
                parking:parkingFromUrl || 'false ',
                furnished:furnishedFromUrl || 'false',
                sort:sortFromUrl || 'createdAt',
                order:orderFromUrl || 'desc'
            })
        }

        const fetchListings = async ()=>{
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            setListings(data);
            setLoading(false);

        }
        fetchListings();

    },[location.search])

    const handleChange = (e)=>{
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSidebardata((prevState)=>({...prevState,type:e.target.id}))
        }

        if(e.target.id === 'searchTerm'){
            setSidebardata((prevState)=>({...prevState,searchTearm:e.target.value}))
        }

        if(e.target.id === 'offer' || e.target.id === 'furnished' || e.target.id === 'parking'){
            setSidebardata((prevState)=>({...prevState,[e.target.id]:(e.target.value || e.target.value === 'true')?true:false}))
        }

        if(e.target.id === 'sort_order'){
            let sort = e.target.value.split('_')[0] || 'createdAt'
            let order = e.target.value.split('_')[1] || 'desc'
            setSidebardata((prevState)=>({...prevState,sort,order}))
        }
    }

    const handleSubmit =(e)=>{
        e.preventDefault();

        let urlParams = new URLSearchParams();
        urlParams.set('searchTerm',sidebardata.searchTearm)
        urlParams.set('type',sidebardata.type)
        urlParams.set('offer',sidebardata.offer)
        urlParams.set('parking',sidebardata.parking)
        urlParams.set('furnished',sidebardata.furnished)
        urlParams.set('sort',sidebardata.sort)
        urlParams.set('order',sidebardata.order)
        let searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form 
        onSubmit={handleSubmit}
        className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input
            value={sidebardata.searchTearm}
            onChange={handleChange}
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input
              checked ={sidebardata.type === 'all'}
              onChange={handleChange}
               type='checkbox' id='all' className='w-5' />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
              checked ={sidebardata.type === 'rent'}
              onChange={handleChange}
               type='checkbox' id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
              checked ={sidebardata.type === 'sale'}
              onChange={handleChange}
               type='checkbox' id='sale' className='w-5' />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
              checked ={sidebardata.offer === true}
              onChange={handleChange}
               type='checkbox' id='offer' className='w-5' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input
              checked ={sidebardata.parking === true}
              onChange={handleChange}
               type='checkbox' id='parking' className='w-5' />
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input
              onChange={handleChange}
              checked ={sidebardata.furnished === true}
               type='checkbox' id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
            onChange={handleChange}
            defaultValue='createdAt_desc'
             id='sort_order' className='border rounded-lg p-3'>
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>
      <div className=''>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
      </div>
    </div>
  );
}