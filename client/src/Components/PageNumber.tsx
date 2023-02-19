export default function PageNumber({pageNumber: pageNumber, isActive: isActive, setPage: setPage}: {pageNumber: number, isActive: boolean, setPage: Function}) {
  return (
    <div className={"paginationItem" + (isActive? " activePage":"") } onClick={()=>setPage(pageNumber)}>{pageNumber}</div>
  )
}
