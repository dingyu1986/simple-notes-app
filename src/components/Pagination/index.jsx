import './style.css';

function Pagination({ currentPage, totalPages, getNotes, searchTerm }) {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      getNotes(currentPage - 1, searchTerm);
    }
  };

  // 下一页
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getNotes(currentPage + 1, searchTerm);
    }
  };

  // 跳转到指定页
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      getNotes(page, searchTerm);
    }
  };
  return (
    <div className="pagination">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        上一页
      </button>
      <div className="page-numbers">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`page-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        下一页
      </button>
    </div>
  );
}

export default Pagination;
