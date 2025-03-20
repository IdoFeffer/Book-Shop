"use strict"

function onInit() {
  renderBooks()
}

function renderBooks() {
  const books = getBooks()
  const elTableBody = document.querySelector(".book-list")

  var strHTMLs = books.map((book) => {
    return `
          <tr>
              <td>${book.title}</td>
              <td>${book.price}</td>
              <td>
                  <button class="read" onclick="onRead(${book.id})">Read</button>
                  <button class="update" onclick="onUpdateBook(${book.id})">Update</button>
                  <button class="delete" onclick="onRemoveBook(${book.id},event)">Delete</button>
              </td>
          </tr>`
  })
  elTableBody.innerHTML = strHTMLs.join("")
}

function onRemoveBook(bookId, ev) {
  ev.stopPropagation()
  // Update the Model:
  removeBook(bookId)
  // Update the Dom:
  renderBooks()
}

function onUpdateBook(bookId) {
  const newPrice = +prompt("Enter new price:")
  if (!newPrice || newPrice === 0) return

  updatePrice(bookId, newPrice)
  renderBooks()
}
