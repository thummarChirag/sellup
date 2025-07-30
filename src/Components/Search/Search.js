import React,{useState,useContext} from 'react'
import {AllPostContext} from "..//../contextStore/AllPostContext"
import { PostContext } from '../../contextStore/PostContext'
import SearchIcon from "..//../assets/SearchIcon"
import CloseIcon from "..//../assets/CloseIcon/CloseIcon"
import { useHistory } from 'react-router'
import "./search.css"

function Search() {
    const {allPost,setAllPost}=useContext(AllPostContext)
    const {setPostContent}=useContext(PostContext)
    const history=useHistory()
    
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = allPost.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase())||value.category.toLowerCase().includes(searchWord.toLowerCase());
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

  const handleSelectedSearch=(item)=>{
       setPostContent(item)
       history.push("/view")
  }

  const handleSearchClick=()=>{
    if(filteredData.length===0){
     alert("No items found.., please search by product category or product name");
     }
     
    else {
      setAllPost(filteredData);
      history.push("/viewmore")
    }
  }

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder="Find Cars, Mobile, Motorcycles and more..."
          value={wordEntered}
          onChange={handleFilter}
          className="main-search-input"
        />
        <div className="searchIcon">
          <div onClick={handleSearchClick} className="search-button">
            <SearchIcon />
          </div>
          {filteredData.length !== 0 && (
            <div id="clearBtn" onClick={clearInput} className="clear-button">
              <CloseIcon />
            </div>
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <div key={key} className="dataItem" onClick={()=>handleSelectedSearch(value)}>
                <div className="search-item-content">
                  <p className="search-item-name">{value.name}</p>
                  <span className="search-item-category">{value.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Search
