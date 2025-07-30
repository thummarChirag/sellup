import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../../contextStore/PostContext";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useHistory } from "react-router";
import "./View.css";

function View() {
  let { postContent } = useContext(PostContext);
  const [userDetails, setUserDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let { userId } = postContent;
    if (userId === undefined) {
      history.push("/");
      return;
    }

    setLoading(true);

    const fetchUserDetails = async () => {
      try {
        const q = query(collection(db, "users"), where("id", "==", userId));
        const res = await getDocs(q);
        res.forEach((doc) => {
          setUserDetails(doc.data());
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [history, postContent]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!postContent || !postContent.userId) {
    return (
      <div className="view-error">
        <div className="error-content">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => history.push("/")} className="back-btn">
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="viewParentDiv">
      <div className="viewParentDiv2">
        <div className="imageShowDiv">
          <img
            src={postContent.url}
            alt={postContent.name}
            className="product-image"
            onLoad={() => setImageLoaded(true)}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
          {!imageLoaded && (
            <div className="image-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
        <div className="rightSection">
          <div className="productDetails">
            <p>&#x20B9; {postContent.price}</p>
            <span>{postContent.name}</span>
            <p>{postContent.category}</p>
            <span>{postContent.description}</span>
          </div>
          {loading ? (
            <div className="contactDetails">
              <div className="loading-spinner"></div>
              <p>Loading seller details...</p>
            </div>
          ) : (
            <div className="contactDetails">
                <p>Seller details</p>
                <p>{userDetails?.name}</p>
                <p>{userDetails?.phone}</p>
                <p>{postContent.createdAt}</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default View;
