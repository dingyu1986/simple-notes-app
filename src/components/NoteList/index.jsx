import Modal from '../Modal';
import { useState } from 'react';

function NoteList({ notes, loading, onDelete, onPatch }) {
  const [openNoteId, setOpenNoteId] = useState(null);
  const currentNote = notes.find((note) => note.id === openNoteId) || {};

  return (
    <div className="noteList">
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="note">
            <h2>
              {note.title}
              <div>
                <button onClick={() => setOpenNoteId(note.id)}>修改</button>{' '}
                <button onClick={() => onDelete(note.id)}>删除</button>
              </div>
            </h2>
            <article>
              <p>{note.content}</p>
            </article>
          </div>
        ))
      )}
      <Modal
        show={!!openNoteId}
        note={currentNote}
        onClose={() => setOpenNoteId(null)}
        onSubmit={({ title, content }) => {
          onPatch({ title, content, id: openNoteId });
          setOpenNoteId(null);
        }}
      />
    </div>
  );
}

export default NoteList;
