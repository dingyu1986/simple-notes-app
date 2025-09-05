import { useState, useEffect, useCallback } from 'react';
import './App.css';
import './components/style.css';
import SearchNote from './components/SearchNote';
import NoteList from './components/NoteList';
import AddNote from './components/AddNote';
import Pagination from './components/Pagination';
import request from './utils/request';

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
    let url = `/api/notes?page=${page}&pageSize=${pageSize}`;
    if (term) url += `&term=${encodeURIComponent(term)}`;
    return url;
  }

  async function handleAdd(note) {
    setIsProcessing(true);
    try {
      const data = await request('/api/notes', 'POST', note);
      setNotes([data, ...notes]);
      getNotes(1, searchTerm);
    } catch (err) {
      console.error('添加笔记出错', err);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDelete(id) {
    setIsProcessing(true);
    try {
      await request(`/api/notes/${id}`, 'DELETE');
      setNotes(notes.filter((note) => note.id !== id));
      // 删除后重新加载当前页
      getNotes(currentPage, searchTerm);
    } catch (err) {
      console.log('删除笔记出错', err);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handlePatch({ title, content, id }) {
    setIsProcessing(true);
    try {
      const data = await request(`/api/notes/${id}`, 'PATCH', {
        title,
        content,
      });
      setNotes(notes.map((note) => (note.id === id ? data : note)));
    } catch (err) {
      console.log('更新笔记出错', err);
    } finally {
      setIsProcessing(false);
    }
  }

  const getNotes = useCallback(
    async (page = 1, term = searchTerm) => {
      setLoading(true);

      try {
        const data = await request(constructUrl(page, term));
        setNotes(data.data);
        setTotalPages(data.pagination.totalPages);
        setCurrentPage(data.pagination.currentPage);
      } catch (err) {
        console.error('加载笔记列表出错', err);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, pageSize]
  );

  useEffect(() => {
    const controller = new AbortController();
    getNotes(null, null, controller);
    return () => {
      controller.abort();
    };
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
