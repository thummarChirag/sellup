import React, { useContext, useState } from "react";
import "./pagination.css";
import { AllPostContext } from "../../contextStore/AllPostContext";

function Pagination({ setCurrentPage, currentPage, totalItems, itemsPerPage }) {
  const { allPost } = useContext(AllPostContext);
  const [activeItem, setActiveItem] = useState(currentPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const numberOfPages = [];

  for (let i = 1; i <= totalPages; i++) {
    numberOfPages.push(i);
  }

  const showNextPage = (e) => {
    const clickedPage = parseInt(e.target.id);
    setCurrentPage(clickedPage);
    setActiveItem(clickedPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setActiveItem(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setActiveItem(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>Page {currentPage} of {totalPages}</span>
        <span>Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items</span>
      </div>

      <div className="pagination">
        <button
          className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        {getVisiblePages().map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span key={`dots-${index}`} className="pagination-dots">
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              id={pageNumber}
              className={`pagination-btn ${activeItem === pageNumber ? "active" : ""}`}
              onClick={showNextPage}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          className={`pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Pagination;
