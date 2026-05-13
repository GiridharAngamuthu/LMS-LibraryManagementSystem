let books = JSON.parse(localStorage.getItem('books')) || [];

const bookForm = document.getElementById('bookForm');
const bookTableBody = document.getElementById('bookTableBody');
const searchInput = document.getElementById('search');

bookForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const isbn = document.getElementById('isbn').value.trim();

  const book = {
    id: Date.now(),
    title,
    author,
    isbn,
    status: 'Available',
    issuedTo: ''
  };

  books.push(book);
  saveBooks();
  bookForm.reset();
  renderBooks();
});

searchInput.addEventListener('input', renderBooks);

function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

function renderBooks() {
  const searchText = searchInput.value.toLowerCase();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchText) ||
    book.author.toLowerCase().includes(searchText)
  );

  bookTableBody.innerHTML = '';

  filteredBooks.forEach(book => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td class="${book.status === 'Available' ? 'status-available' : 'status-issued'}">
        ${book.status}
      </td>
      <td>${book.issuedTo || '-'}</td>
      <td>
        ${book.status === 'Available'
          ? `<button class="action-btn issue-btn" onclick="issueBook(${book.id})">Issue</button>`
          : `<button class="action-btn return-btn" onclick="returnBook(${book.id})">Return</button>`}
        <button class="action-btn delete-btn" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    `;

    bookTableBody.appendChild(row);
  });

  updateDashboard();
}

function issueBook(id) {
  const student = prompt('Enter student name:');

  if (!student) return;

  books = books.map(book => {
    if (book.id === id) {
      book.status = 'Issued';
      book.issuedTo = student;
    }
    return book;
  });

  saveBooks();
  renderBooks();
}

function returnBook(id) {
  books = books.map(book => {
    if (book.id === id) {
      book.status = 'Available';
      book.issuedTo = '';
    }
    return book;
  });

  saveBooks();
  renderBooks();
}

function deleteBook(id) {
  if (!confirm('Are you sure you want to delete this book?')) return;

  books = books.filter(book => book.id !== id);

  saveBooks();
  renderBooks();
}

function updateDashboard() {
  document.getElementById('totalBooks').textContent = books.length;
  document.getElementById('availableBooks').textContent =
    books.filter(book => book.status === 'Available').length;
  document.getElementById('issuedBooks').textContent =
    books.filter(book => book.status === 'Issued').length;
}

// Sample data if empty
if (books.length === 0) {
  books = [
    {
      id: 1,
      title: 'C Programming',
      author: 'Dennis Ritchie',
      isbn: '9781234567890',
      status: 'Available',
      issuedTo: ''
    },
    {
      id: 2,
      title: 'Embedded Systems',
      author: 'Raj Kamal',
      isbn: '9780987654321',
      status: 'Issued',
      issuedTo: 'Giri'
    }
  ];
  saveBooks();
}

renderBooks();