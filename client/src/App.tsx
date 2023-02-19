import React, { useState, useEffect } from 'react';
import Apartment from './Types/Apartment';
import ApartmentCard from './Components/ApartmentCard';
import PageNumber from './Components/PageNumber';

export default function App() {
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [page, setPage] = useState(1)
  const [recordsPerPage, setRecordsPerPage] = useState(8)

  useEffect(() => {
    fetchApartments(page, recordsPerPage)
  },[page, recordsPerPage])

  function fetchApartments(page:number, recordsPerPage:number){
    fetch(`/api/apartments?page=${page}&recordsPerPage=${recordsPerPage}`)
      .then(res => res.json())
      .then(data => {
        setApartments(data.apartments)
      })
  }

  const apartmentElemets = apartments.map(apartment => (
    <ApartmentCard key={apartment.id} apartment={apartment} />
  ))

  const paginationElements = genPageArray(page).map(pageNumber => (
    <PageNumber key={pageNumber} pageNumber={pageNumber} isActive={pageNumber === page} setPage={setPage} />
  ))

  return (
    <>
      <div className="header">
          Scrape Reality
      </div>
      <div className="container">
          {apartmentElemets}
      </div>
      <div className="pagination">
          <div className="paginationItemSolid" onClick={()=>setPage(1)}>
            <i className="fa-solid fa-chevron-left"></i>
            <i className="fa-solid fa-chevron-left"></i>
          </div>

          {paginationElements}

          <div className="paginationItemSolid" onClick={()=>setPage(63)}>
            <i className="fa-solid fa-chevron-right"></i>
            <i className="fa-solid fa-chevron-right"></i>
          </div>
      </div>
    </>
  );
}

function genPageArray(page:number){
  const pageArray = []
  if(page <= 5) return [1,2,3,4,5,6,7,8,9,10]
  if(page > 58) return [54,55,56,57,58,59,60,61,62,63]

  for(let i = page-5; i<page+5; i++){
      pageArray.push(i)
  }

  return pageArray
}