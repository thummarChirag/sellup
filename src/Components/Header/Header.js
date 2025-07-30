import React, { useContext,useState } from "react";
import { useHistory } from "react-router";
import { AllPostContext } from "../../contextStore/AllPostContext";
import { PostContext } from "../../contextStore/PostContext";
import "./Header.css";
import sellupLogo from "../../download.png";
import SearchIcon from "../../assets/SearchIcon"
import Arrow from "../../assets/Arrow";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contextStore/AuthContext";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import Search from "../Search/Search";

function Header() {
  const{allPost}=useContext(AllPostContext)
  const{setPostContent}=useContext(PostContext)
  const history = useHistory();
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = allPost.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const handleSelectedSearch=(value)=>{
       setPostContent(value)
    history.push("/view")
  }

  const handleEmptyClick=()=>{
     alert("No items found.., please search by product name");
  }

  const { user } = useContext(AuthContext);
  
  const logoutHandler = async () => {
    try {
      await signOut(auth);
      history.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="headerParentDiv">
      <div className="childDiv">
        <div className="brandName">
          <Link to="/">
            <img src={sellupLogo} alt="SellUp Logo" />
          </Link>
        </div>
        <div className="placeSearch">
          <SearchIcon></SearchIcon>
          <input type="text" placeholder="India" />
          <Arrow></Arrow>
        </div>
        <div className="productSearch">
          <div className="input">
            <input
              type="text"
              placeholder="Find car,mobile phone and more..."
              value={wordEntered}
              onChange={handleFilter}
            />
          </div>
          <div className="searchAction">
            <SearchIcon color="#a61a32"></SearchIcon>
          </div>
        </div>
        <div className="language">
          <span> ENGLISH </span>
          <Arrow></Arrow>
        </div>
        <div className="loginPage">
          {user ? (
            <div className="user-section">
              <span className="user-name">Hi, {user.displayName || user.email}</span>
              <button onClick={logoutHandler} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login">
              <span>Login</span>
            </Link>
          )}
        </div>
        <div className="sellMenu">
          <Link to="/create">
            <SellButton></SellButton>
            <span>SELL</span>
          </Link>
        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <div
                key={key}
                className="dataItem"
                onClick={() => handleSelectedSearch(value)}
              >
                <p>{value.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Header;
