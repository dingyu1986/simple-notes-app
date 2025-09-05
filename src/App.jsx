import { useState, useEffect, useCallback } from 'react';
import './App.css';
import './components/style.css';
import SearchNote from './components/SearchNote';
import NoteList from './components/NoteList';
import AddNote from './components/AddNote';
import Pagination from './components/Pagination';

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const pageSize = 3;

  function constructUrl(page, term) {
    let url = `http://localhost:8080/notes?page=${page}&pageSize=${pageSize}`;
    if (term) url += `&term=${encodeURIComponent(term)}`;
    return url;
  }

  const getNotes = useCallback(
    async (page = 1, term = searchTerm) => {
      setLoading(true);
      try {
        const res = await fetch(constructUrl(page, term));
        const data = await res.json();
        setNotes(data.data);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
      } catch (error) {
        console.error('加载笔记列表出错', error);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, pageSize]
  );

  useEffect(() => {
    getNotes();
  }, []);

  // 搜索时防抖
  const debouncedSearch = useCallback(
    debounce((term) => {
      getNotes(1, term);
    }, 600),
    []
  );

  function handleSearch(e) {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  }

  async function handleAdd(note) {
    setIsProcessing(true);
    try {
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
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDelete(id) {
    setIsProcessing(true);
    try {
      const res = await fetch(`http://localhost:8080/notes/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotes(notes.filter((note) => note.id !== id));
        // 删除后重新加载当前页
        getNotes(currentPage, searchTerm);
      }
    } finally {
      setIsProcessing(false);
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
      {isProcessing && <div className="global-loading">处理中...</div>}
      <div>
        <h1>我的笔记本</h1>
        <SearchNote searchTerm={searchTerm} onChange={handleSearch} />
        <NoteList
          notes={notes}
          loading={loading}
          onDelete={handleDelete}
          onPatch={handlePatch}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          getNotes={getNotes}
          searchTerm={searchTerm}
        />
        <AddNote onSubmit={handleAdd} />
      </div>
    </main>
  );
}

export default App;
