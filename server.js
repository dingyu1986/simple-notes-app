import express from 'express';

// create an express server with in-memory data to save notes
const app = express();
app.use(express.json());

const notes = [
  { id: 1, title: '笔记 1', content: '这是笔记 1' },
  { id: 2, title: '笔记 2', content: '这是笔记 2' },
  { id: 3, title: '笔记 3', content: '这是笔记 3' },
  { id: 4, title: '笔记 4', content: '这是笔记 4' },
  { id: 5, title: '笔记 5', content: '这是笔记 5' },
  { id: 6, title: '笔记 6', content: '这是笔记 6' },
  { id: 7, title: '笔记 7', content: '这是笔记 7' },
  { id: 8, title: '笔记 8', content: '这是笔记 8' },
  { id: 9, title: '笔记 9', content: '这是笔记 9' },
  { id: 10, title: '笔记 10', content: '这是笔记 10' },
  { id: 11, title: '笔记 11', content: '这是笔记 11' },
  { id: 12, title: '笔记 12', content: '这是笔记 12' },
  { id: 13, title: '笔记 13', content: '这是笔记 13' },
  { id: 14, title: '笔记 14', content: '这是笔记 14' },
  { id: 15, title: '笔记 15', content: '这是笔记 15' },
  { id: 16, title: '笔记 16', content: '这是笔记 16' },
  { id: 17, title: '笔记 17', content: '这是笔记 17' },
  { id: 18, title: '笔记 18', content: '这是笔记 18' },
];

// enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );

  next();
});

// GET /notes?term=  search notes by content
app.get('/notes', (req, res) => {
  const term = req.query.term;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  let filteredNotes = notes;

  if (term) {
    filteredNotes = notes.filter((note) => note.content.includes(term));
  }
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);
  res.json({
    data: paginatedNotes,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalItems: filteredNotes.length,
      totalPages: Math.ceil(filteredNotes.length / pageSize),
      hasNextPage: endIndex < filteredNotes.length,
    },
  });
  // res.status(500).json({ message: "加载笔记列表出错" });
});

app.post('/notes', (req, res) => {
  const note = req.body;
  note.id = notes.length + 1;
  notes.push(note);
  res.json(note);
});

app.delete('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    res.status(200).json({ message: '删除成功' });
  } else {
    res.status(404).json({ message: '笔记不存在' });
  }
});

app.patch('/notes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    const updatedNote = { ...notes[index], ...req.body };
    notes[index] = updatedNote;
    res.json(updatedNote);
  }
});

// listen on port 8080
app.listen(8080, () =>
  console.log('Server listening on http://localhost:8080')
);
