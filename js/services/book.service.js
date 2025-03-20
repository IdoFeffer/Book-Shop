"use strict"

// var gBooks

const gBooks = [
  { id: 1, title: "The Adventure of Lori Ipsi", price: 120 },
  { id: 2, title: "World Atlas", price: 300 },
  { id: 3, title: "Zorba The Greek", price: 87 },
]

function getBooks() {
  return gBooks
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex((book) => book.id === bookId)
  if (bookIdx !== -1) gBooks.splice(bookIdx, 1)
}

function updatePrice(bookId, newPrice) {
  const book = gBooks.find(book => book.id === bookId);
  if (!book) return;
  book.price = newPrice; 
}

