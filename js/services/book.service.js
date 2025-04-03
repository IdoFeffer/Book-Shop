"use strict"

var gBooks
const STORAGE_KEY = "booksDB"

function getBooks(options) {
  const filterBy = options.filterBy
  const sortBy = options.sortBy
  const page = options.page

  var books = gBooks

  // Filter
  if (filterBy.txt) {
    books = books.filter((book) =>
      book.title.toLowerCase().includes(filterBy.txt.toLowerCase())
    )
  }
  if (filterBy.rating) {
    books = books.filter((book) => book.rating >= filterBy.rating)
  }

  // Sorting
  if (sortBy.title) {
    const sortDir = sortBy.title
    books = books.toSorted(
      (b1, b2) => b1.title.localeCompare(b2.title) * sortDir
    )
  } else if (sortBy.rating) {
    const sortDir = sortBy.rating
    books = books.toSorted((b1, b2) => (b1.rating - b2.rating) * sortDir)
  } else if (sortBy.price) {
    const sortDir = sortBy.price
    books = books.toSorted((b1, b2) => (b1.price - b2.price) * sortDir)
  }

  // Pages
  const startIdx = page.idx * page.size
  books = books.slice(startIdx, startIdx + page.size)

  return books
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex((book) => book.id === bookId.toString()) // bookId)
  if (bookIdx !== -1) gBooks.splice(bookIdx, 1)
  _saveBooks()
  ////////////////////////////////////
  return bookIdx
}

function updatePrice(bookId, newPrice) {
  const book = gBooks.find((book) => book.id === bookId.toString())
  if (!book) return
  book.price = newPrice
  _saveBooks()
  ///////////////////////////////////////
  return book
}

function updateBook(bookId, title, price) {
  const book = gBooks.find((book) => book.id === bookId)
  if (!book) return null

  book.title = title
  book.price = price
  _saveBooks()
  return book
}

function addBook(title, price) {
  const add = _createBook(title, price)

  gBooks.unshift(add)
  _saveBooks()
  return add
}

function _createBooks() {
  gBooks = loadFromStorage(STORAGE_KEY)

  if (!gBooks || gBooks.length === 0) {
    gBooks = [
      _createBook("The Adventure of Lori Ipsi", 120),
      _createBook("World Atlas", 300, "img/atlas.jpg"),
      _createBook("Zorba The Greek", 87, "img/zobra.jpg"),
      _createBook("Hary Potter 1", 200, "img/HaryPotter1.jpg"),
      _createBook("Hary Potter 2", 150, "img/HaryPotter2.jpg"),
      _createBook("Hary Potter 3", 100, "img/HaryPotter3.jpg"),
      _createBook("Hary Potter 4", 300, "img/HaryPotter4.jpg"),
      _createBook("Hary Potter 5", 175, "img/HaryPotter5.jpg"),
      _createBook("Hary Potter 6", 80, "img/HaryPotter6.jpg"),
      _createBook("Hary Potter 7", 1250, "img/HaryPotter7.jpg"),
    ]
    _saveBooks()
  }
}

function _createBook(title, price, imgUrl = "img/default.jpg") {
  return {
    id: "t" + getRandomInt(100, 900),
    title,
    price,
    rating: getRandomInt(1, 6),
    imgUrl,
  }
}

function _saveBooks() {
  saveToStorage(STORAGE_KEY, gBooks)
}

function getTotalExpBooksCount() {
  return gBooks.filter((book) => book.price > 200).length
}

function getTotalAvgBooksCount() {
  return gBooks.filter((book) => book.price >= 80 && book.price <= 200).length
}

function getTotalCheapBooksCount() {
  return gBooks.filter((book) => book.price <= 80).length
}

function showUserMsg(txt) {
  const elMsg = document.querySelector(".user-msg")
  elMsg.innerText = txt

  elMsg.style.display = "block"
  setTimeout(() => {
    elMsg.style.display = "none"
  }, 2000)
}

function getPageCount(options) {
  const page = options.page
  const filterBy = options.filterBy

  const books = _filterBooks(filterBy)
  const pageCount = Math.ceil(books.length / page.size)

  return pageCount
}

function _filterBooks(filterBy) {
  var books = gBooks

  if (filterBy.txt) {
    books = books.filter((book) => book.title.includes(filterBy.txt))
  }
  if (filterBy.rating) {
    books = books.filter((book) => book.rating >= filterBy.rating)
  }
  return books
}

function resetAddBookModal() {
  const title = (document.querySelector(".book-title-input").value = "")
  const price = (document.querySelector(".book-price-input").value = "")
}
