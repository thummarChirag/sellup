import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import { AllPostContext } from "../../contextStore/AllPostContext";
import Pagination from "../Pagination/Pagination";
import PostCards from "../PostCards/PostCards";
import "./allposts.css";

function AllPosts() {
  const { allPost } = useContext(AllPostContext);
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");

  let length = allPost.length;

  // Filter products by category
  const filteredProducts = filterCategory === "all"
    ? allPost
    : allPost.filter(product => product.category === filterCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  // Pagination logic
  const itemsPerPage = 12;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const displayThesePosts = currentProducts.map((product, index) => {
    return (
      <div className="all-post-card" key={product.id || index}>
        <PostCards product={product} index={index} />
      </div>
    );
  });

  // Get unique categories
  const categories = ["all", ...new Set(allPost.map(product => product.category))];

  if (length === 0) {
    history.push("/");
    return null;
  }

  return (
    <div className="display-all-parent">
      <div className="page-header">
        <h1 className="page-title">All Products</h1>
        <p className="page-subtitle">Discover amazing deals on SellUp</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label className="filter-label">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>

        <div className="results-info">
          <span className="results-count">
            Showing {currentProducts.length} of {sortedProducts.length} products
          </span>
        </div>
      </div>

      <div className="container-allpost">
        {displayThesePosts.length > 0 ? (
          displayThesePosts
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>

      {sortedProducts.length > itemsPerPage && (
        <Pagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalItems={sortedProducts.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

export default AllPosts;
