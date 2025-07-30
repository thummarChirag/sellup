import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import "./Post.css";
import { db } from "../../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import BarLoading from "../Loading/BarLoading";
import PostCards from "../PostCards/PostCards";

import { AllPostContext } from "../../contextStore/AllPostContext";

function Posts() {
  const { setAllPost } = useContext(AllPostContext);
  let [posts, setPosts] = useState([]); //for showing all posts in Descending order of date
  let [posts2, setPosts2] = useState([]); //for showing all posts in Ascending order of date
  let [loading, setLoading] = useState(false);
  let [loading2,setLoading2] = useState(false)

  useEffect(() => {
    setLoading(true);
    setLoading2(true)

    // Fetch posts in descending order
    const fetchDescendingPosts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        let allPostsDescendingOder = snapshot.docs.map((product) => {
          return {
            ...product.data(),
            id: product.id,
          };
        });
        console.log("Posts2 (descending) data:", allPostsDescendingOder);
        setPosts2(allPostsDescendingOder); //set to post
        setAllPost(allPostsDescendingOder);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching descending posts:", error);
        setLoading(false);
      }
    };

    // Fetch posts in ascending order
    const fetchAscendingPosts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        let allPostsAscendingOder = snapshot.docs.map((product) => {
          return {
            ...product.data(),
            id: product.id,
          };
        });
        console.log("Posts (ascending) data:", allPostsAscendingOder);
        setPosts(allPostsAscendingOder);
        setLoading2(false)
      } catch (error) {
        console.error("Error fetching ascending posts:", error);
        setLoading2(false);
      }
    };

    fetchDescendingPosts();
    fetchAscendingPosts();
  }, [setAllPost]);

  // quickMenuCards assign all cards of post item later it will be displayed
  let quickMenuCards = posts.map((product, index) => {
    console.log(`Quick menu product ${index}:`, product);
    return(<div className="quick-menu-cards" key={index}> <PostCards product={product} index={index} /> </div>);
  });

  // Fixed freshRecomendationCards mapping
  let freshRecomendationCards = posts2.map((product, index) => {
    if (index < 4) {
      console.log(`Fresh recommendation product ${index}:`, product);
      return (<div className="fresh-recomendation-card" key={index}> <PostCards product={product} index={index} /> </div>);
    }
    return null;
  });

  return (
    <div className="postParentDiv">
      <div className="moreView">
        <div className="heading">
          <span>Fresh recommendations</span>
          <Link to="/viewmore">View more</Link>
        </div>
        <div className="cards">
          {loading2 ? (
            <BarLoading />
          ) : (
            freshRecomendationCards
          )}
        </div>
      </div>
      <div className="recommendations">
        <div className="heading">
          <span>Fresh recommendations</span>
          <Link to="/viewmore">View more</Link>
        </div>
        <div className="cards">
          {loading ? (
            <BarLoading />
          ) : (
            quickMenuCards
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;
