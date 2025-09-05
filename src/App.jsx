import { useState, useEffect } from 'react';
import './App.css';
import SearchNote from './components/SearchNote';
import NoteList from './components/NoteList';
import AddNote from './components/AddNote';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3;

  async function getNotes(page = 1, term = '') {
    setLoading(true);
    let url = `http://localhost:8080/notes?page=${page}&pageSize=${pageSize}`;
    if (term) {
      url += `&term=${encodeURIComponent(term)}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      setNotes(data.data);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
    } catch (error) {
      console.error('加载笔记列表出错', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getNotes();
  }, []);

  function handleSearch(e) {
    const term = e.target.value;
    setSearchTerm(term);
    getNotes(1, term);
  }

  // 上一页
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

  async function handleAdd(note) {
    const res = await fetch('http://localhost:8080/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    const data = await res.json();
    if (res.ok) {
      setNotes([data, ...notes]);
      // 添加后重新加载第一页
      getNotes(1, searchTerm);
    }
  }

  async function handleDelete(id) {
    const res = await fetch(`http://localhost:8080/notes/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setNotes(notes.filter((note) => note.id !== id));
      // 删除后重新加载当前页
      getNotes(currentPage, searchTerm);
    }
  }

  async function handlePatch({ title, content, id }) {
    const res = await fetch(`http://localhost:8080/notes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    setNotes(notes.map((note) => (note.id === id ? data : note)));
  }

  return (
    <main className="container">
      <div>
        <h1>我的笔记本</h1>
        <SearchNote searchTerm={searchTerm} onChange={handleSearch} />
        {loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <>
            <NoteList
              notes={notes}
              onDelete={handleDelete}
              onPatch={handlePatch}
            />
            <div className="pagination">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                上一页
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`page-number ${
                        currentPage === page ? 'active' : ''
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                下一页
              </button>
            </div>
          </>
        )}
        <AddNote onSubmit={handleAdd} />
      </div>
    </main>
  );
}

export default App;
