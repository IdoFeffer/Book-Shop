"use strict"

var gBooks
const STORAGE_KEY = "booksDB"

// var gBooks = [
//   { id: 1, title: "The Adventure of Lori Ipsi", price: 120 },
//   { id: 2, title: "World Atlas", price: 300 },
//   { id: 3, title: "Zorba The Greek", price: 87 },
// ]

function getBooks(options) {
  const filterBy = options.filterBy

  const sortBy = options.sortBy

  const page = options.page

  var books = gBooks

  if (filterBy.txt) {
    books = books.filter((book) =>
      book.title.toLowerCase().includes(filterBy.txt.toLowerCase())
    )
  }
  if (filterBy.rating) {
    books = books.filter((book) => book.rating >= filterBy.rating)
  }

  if(sortBy.title){
    const sortDir = sortBy.title
    books = books.toSorted((b1,b2) => b1.title.localeCompare(b2.title) * sortDir)
  }

  if (sortBy.rating){
    const sortDir = sortBy.rating
    books = books.toSorted((b1, b2) => (b1.rating - b2.rating) * sortDir)
  }

  if (sortBy.price){
    const sortDir = sortBy.price
    books = books.toSorted((b1, b2) => (b1.price - b2.price) * sortDir)
  }

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

function addBook(title, price) {
  const add = _createBook(title, price)

  gBooks.unshift(add)
  _saveBooks()
  ///////////////////////////////////////
  return add
}

function _createBooks() {
  gBooks = loadFromStorage(STORAGE_KEY)

  if (!gBooks || !gBooks.length === 0) {
    gBooks = [
      _createBook("The Adventure of Lori Ipsi", 120),
      _createBook("World Atlas", 300, "img/atlas.jpg"),
      _createBook("Zorba The Greek", 87, "img/zobra.jpg"),
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
      books = cars.filter(book => book.title.includes(filterBy.txt))
  }
  if (filterBy.minSpeed) {
      books = cars.filter(book => book.rating >= filterBy.rating)
  }
  return books
}

// TODO
function resetAddBookModal() {
  const title = document.querySelector(".book-title-input")
  const price = +document.querySelector(".book-price-input")

  title.value = ""
  price.value = ""
}

