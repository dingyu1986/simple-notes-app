// import './style.css';

function Pagination({ currentPage, totalPages, getNotes, searchTerm }) {
  function handlePrevPage() {
    if (currentPage > 1) {
      getNotes(currentPage - 1, searchTerm);
    }
  }

  // 下一页
  function handleNextPage() {
    if (currentPage < totalPages) {
      getNotes(currentPage + 1, searchTerm);
    }
  }

  // 跳转到指定页
  function handlePageChange(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      getNotes(page, searchTerm);
    }
  }

  function getPageRange() {
    const range = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

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
        {getPageRange().map((page) => (
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
