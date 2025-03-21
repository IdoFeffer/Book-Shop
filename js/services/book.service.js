"use strict"

var gBooks
const STORAGE_KEY = "booksDB"

// var gBooks = [
//   { id: 1, title: "The Adventure of Lori Ipsi", price: 120 },
//   { id: 2, title: "World Atlas", price: 300 },
//   { id: 3, title: "Zorba The Greek", price: 87 },
// ]

function getBooks() {
  return gBooks
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex((book) => book.id === bookId.toString()) // bookId)
  if (bookIdx !== -1) gBooks.splice(bookIdx, 1)
  _saveBooks()
}

function updatePrice(bookId, newPrice) {
  const book = gBooks.find((book) => book.id === bookId.toString())
  if (!book) return
  book.price = newPrice
  _saveBooks()
}

function addBook(title, price) {
  const add = _createBook(title, price)

  gBooks.unshift(add)
  _saveBooks()
}

function _createBooks() {
  gBooks = loadFromStorage(STORAGE_KEY)

  if (!gBooks || !gBooks.length === 0) {
    gBooks = [
      _createBook("The Adventure of Lori Ipsi", 120),
      _createBook("World Atlas", 300),
      _createBook("Zorba The Greek", 87),
    ]
    _saveBooks()
  }
}

function _createBook(title, price) {
  return {
    id: "t" + getRandomInt(100, 900),
    title,
    price,
  }
}

function _saveBooks() {
  saveToStorage(STORAGE_KEY, gBooks)
}

function getTotalExpBooksCount() {
  return gBooks.filter(book => book.price > 200 ).length
}

function getTotalAvgBooksCount() {
  return gBooks.filter(book => book.price >= 80 && book.price <= 200).length
}

function getTotalCheapBooksCount() {
  return gBooks.filter(book => book.price <= 80).length
}
  