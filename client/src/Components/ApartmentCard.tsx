import Apartment from "../Types/Apartment"
import { useState } from "react"

export default function ApartmentCard({apartment}: {apartment: Apartment}) {
    const [imageIndex, setImageIndex] = useState<number>(0)
    const images = apartment.images
    const image = images[imageIndex]

    function nextImage(){
        if(imageIndex < images.length - 1){
            setImageIndex(imageIndex + 1)
        }
    }

    function prevImage(){
        if(imageIndex > 0){
            setImageIndex(imageIndex - 1)
        }
    }

    return(
    <div className="apartmentCard">
        <div className="cardHeader">
            <div className="image">
                <div className="prevImage" onClick={prevImage}> <i className="fa-solid fa-chevron-left"></i> </div>
                <img src={image} alt="apartment image" />
                <div className="nextImage" onClick={nextImage}> <i className="fa-solid fa-chevron-right"></i> </div>
            </div>
        </div>
        <div className="cardBody">
            <h2 className="cardTitle">{apartment.title}</h2>
        </div>
        <div className="cardFooter">

        </div>
    </div>
    )
}
