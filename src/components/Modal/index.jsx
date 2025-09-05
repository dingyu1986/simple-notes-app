import React, { useState, useEffect } from 'react';
// import './style.css';

function Modal({ show, onClose, onSubmit, note }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');

  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
  }, [note]);

  const handleSubmit = () => {
    onSubmit({ title, content });
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>修改</h2>
        <div className="modal-field">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <textarea
            rows="6"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            取消
          </button>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            提交
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
