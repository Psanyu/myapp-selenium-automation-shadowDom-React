import React, { useRef, useEffect, useState } from 'react';

const BOOKS = [
  { id: 1, title: 'Clean Code',               author: 'Robert C. Martin',  genre: 'Tech'    },
  { id: 2, title: 'The Pragmatic Programmer',  author: 'Andrew Hunt',       genre: 'Tech'    },
  { id: 3, title: 'You Don\'t Know JS',        author: 'Kyle Simpson',      genre: 'Tech'    },
  { id: 4, title: 'Refactoring',               author: 'Martin Fowler',     genre: 'Tech'    },
  { id: 5, title: 'The Hobbit',                author: 'J.R.R. Tolkien',    genre: 'Fiction' },
  { id: 6, title: 'Atomic Habits',             author: 'James Clear',       genre: 'Self-Help'},
  { id: 7, title: 'Deep Work',                 author: 'Cal Newport',       genre: 'Self-Help'},
  { id: 8, title: 'Design Patterns',           author: 'Gang of Four',      genre: 'Tech'    },
  { id: 9, title: 'The Alchemist',             author: 'Paulo Coelho',      genre: 'Fiction' },
  { id:10, title: 'Sapiens',                   author: 'Yuval Noah Harari', genre: 'History' },
];

// ── Shadow DOM Search Component ──────────────────────────────────────────────
function ShadowSearch({ onSearch }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (host.shadowRoot) return;                // avoid double-attach

    const shadow = host.attachShadow({ mode: 'open' });

    // Styles inside the shadow root — completely isolated
    const style = document.createElement('style');
    style.textContent = `
      .search-box {
        display: flex;
        gap: 8px;
        padding: 14px 18px;
        background: linear-gradient(135deg, #1f4e79, #2e75b6);
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      input {
        flex: 1;
        padding: 10px 14px;
        border: none;
        border-radius: 6px;
        font-size: 15px;
        outline: none;
      }
      button {
        padding: 10px 20px;
        background: #f0a500;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 15px;
        font-weight: bold;
        cursor: pointer;
      }
      button:hover { background: #d4920a; }
      p {
        color: rgba(255,255,255,0.75);
        font-size: 11px;
        margin: 6px 0 0 0;
        font-family: Arial;
      }
    `;

    const wrapper = document.createElement('div');

    const box = document.createElement('div');
    box.className = 'search-box';

    const input = document.createElement('input');
    input.type        = 'text';
    input.placeholder = 'Search by title or author...';

    const btn = document.createElement('button');
    btn.textContent = '🔍 Search';

    const note = document.createElement('p');
    note.textContent = '⚡ This search bar lives inside a Shadow DOM — styles are fully encapsulated';

    box.appendChild(input);
    box.appendChild(btn);
    wrapper.appendChild(box);
    wrapper.appendChild(note);

    shadow.appendChild(style);
    shadow.appendChild(wrapper);

    // Fire search on button click or Enter key
    const doSearch = () => onSearch(input.value);
    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    input.addEventListener('input', doSearch);   // live filter

  }, []);                                        // runs once on mount

  return (
    <div
      ref={hostRef}
      style={{ marginBottom: '28px' }}
      title="Shadow Host Element"
    />
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [query,   setQuery]   = useState('');
  const [filtered, setFiltered] = useState(BOOKS);

  const handleSearch = (val) => {
    setQuery(val);
    const q = val.toLowerCase();
    setFiltered(
      BOOKS.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
      )
    );
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'Arial', padding: '0 20px' }}>

      <h1 style={{ color: '#1f4e79', borderBottom: '3px solid #2e75b6', paddingBottom: 10 }}>
        📚 My Book Log
      </h1>

      {/* Shadow DOM component */}
      <ShadowSearch onSearch={handleSearch} />

      {/* Results count */}
      <p style={{ color: '#595959', marginBottom: 16 }}>
        Showing <strong>{filtered.length}</strong> of {BOOKS.length} books
        {query && <span> for "<em>{query}</em>"</span>}
      </p>

      {/* Book list — regular React DOM */}
      {filtered.length === 0 ? (
        <p style={{ color: '#c00', fontStyle: 'italic' }}>No books found.</p>
      ) : (
        filtered.map(book => (
          <div key={book.id} style={{
            padding: '14px 18px',
            marginBottom: 10,
            borderRadius: 8,
            border: '1px solid #dde',
            background: '#f9fbff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong style={{ fontSize: 16, color: '#1a1a1a' }}>{book.title}</strong>
              <div style={{ color: '#595959', fontSize: 14, marginTop: 3 }}>{book.author}</div>
            </div>
            <span style={{
              background: '#e8f0fe',
              color: '#2e75b6',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 'bold'
            }}>{book.genre}</span>
          </div>
        ))
      )}
    </div>
  );
}
