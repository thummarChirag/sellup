import React,{useEffect,useContext} from 'react';

import Header from '../Components/Header/Header';
import Banner from '../Components/Banner/Banner';

import Posts from '../Components/Posts/Posts';
import Footer from '../Components/Footer/Footer';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthContext } from '../contextStore/AuthContext';
import './Home.css';

function Home(props) {
 const {setUser}=useContext(AuthContext)
  useEffect(()=>{
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
 
  },[setUser])
  
  return (
    <div className="homeParentDiv">
      <div className="home-background">
        <div className="floating-elements">
          <div className="floating-element element-1"></div>
          <div className="floating-element element-2"></div>
          <div className="floating-element element-3"></div>
          <div className="floating-element element-4"></div>
        </div>
      </div>
      <Header />
      <Banner />
      <Posts />
      <Footer />
    </div>
  );
}

export default Home;
 
