import React, { useContext, useState } from 'react'
import Heart from '../../assets/Heart'
import {useHistory} from "react-router-dom";
import {PostContext} from "../../contextStore/PostContext";
import "./postcards.css"

function PostCards({product,index}) {
  let { setPostContent } = useContext(PostContext)
  const history = useHistory()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageError = () => {
    console.log('Image failed to load for product:', product.name, 'URL:', product.url)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const fallbackImage = "https://via.placeholder.com/300x180/f7fafc/667eea?text=No+Image"

    return (
      <div className="card" key={index} onClick={()=>{
        setPostContent(product)
        history.push("/view")
      }}>
        <div className="favorite">
          <Heart></Heart>
        </div>
        <div className="image">
          {imageLoading && (
            <div className="image-skeleton">
              <div className="skeleton-animation"></div>
            </div>
          )}
          <img
            src={imageError ? fallbackImage : product.url}
            alt={product.name}
            className={`product-image ${imageLoading ? 'loading' : 'loaded'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
          <div className="image-overlay"></div>
        </div>
        <div className="content">
          <p className="rate">&#x20B9; {product.price}</p>
          <span className="category"> {product.category} </span>
          <p className="name"> {product.name}</p>
        </div>
        <div className="date">
          <span>{product.createdAt}</span>
        </div>
      </div>
    )
}

export default PostCards
