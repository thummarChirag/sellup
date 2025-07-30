import React, { useState } from "react";
import DynamicPosts from "../DynamicPosts/DynamicPosts";

import "./Banner.css";

function Banner() {
  let [category, setCategory] = useState();
  
  return (
    <div className="bannerParentDiv">
      <div className="bannerChildDiv">
        <div className="menuBar">
          <div className="categoryMenu">
            <select
              name="Category"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              className="category-select"
            >
              <option value="null">ALL CATEGORIES</option>
              <option value="Cars">Cars</option>
              <option value="Cameras & Lenses">Cameras & Lenses</option>
              <option value="Computers & Laptops">Computers & Laptops</option>
              <option value="Mobile Phones">Mobile Phones</option>
              <option value="Motorcycles">Motorcycles</option>
              <option value="Tablets">Tablets</option>
            </select>
          </div>
          <div className="otherQuickOptions">
            <span
              onClick={() => setCategory("Cars")}
              className={category === "Cars" ? "active" : ""}
            >
              Cars
            </span>
            <span
              onClick={() => setCategory("Cameras & Lenses")}
              className={category === "Cameras & Lenses" ? "active" : ""}
            >
              Cameras & Lenses
            </span>
            <span
              onClick={() => setCategory("Computers & Laptops")}
              className={category === "Computers & Laptops" ? "active" : ""}
            >
              Computers & Laptops
            </span>
            <span
              onClick={() => setCategory("Mobile Phones")}
              className={category === "Mobile Phones" ? "active" : ""}
            >
              Mobile Phones
            </span>
            <span
              onClick={() => setCategory("Motorcycles")}
              className={category === "Motorcycles" ? "active" : ""}
            >
              Motorcycles
            </span>
            <span
              onClick={() => setCategory("Tablets")}
              className={category === "Tablets" ? "active" : ""}
            >
              Tablets
            </span>
          </div>
        </div>
        <div className="banner">
          <img src="../../../Images/banner copy.png" alt="Banner" className="banner-image" />
        </div>
      </div>
      {category != null && <DynamicPosts category={category} />}
    </div>
  );
}

export default Banner;
