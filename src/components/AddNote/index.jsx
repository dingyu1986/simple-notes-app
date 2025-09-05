import { useState } from 'react';
// import './style.css';

function AddNote({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('*标题和内容不能为空');
      return;
    }
    setError('');
    onSubmit({ title, content });
    setTitle('');
    setContent('');
  }

  return (
    <div className="addNote">
      <h2>添加新笔记</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="请输入笔记标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows="6"
          placeholder="请输入笔记内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">添加笔记</button>
      </form>
    </div>
  );
}

export default AddNote;
