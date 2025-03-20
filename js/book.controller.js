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

function onAddBook() {
  const newTitle = prompt("Enter new book")
  const newPrice = +prompt("Enter new price:")

  if (!newTitle || newPrice <= 0) {
    alert("Please enter a valid title and a positive price.")
    return
  }
  // Update the Model:
  addBook(newTitle, newPrice)
  // Update the Dom:
  renderBooks()
}

function onRead(bookId) {
  const book = gBooks.find((book) => book.id === bookId)
  if (!book) return

  document.querySelector(".book-details").innerHTML = `

        <div class="book-detail">
            <img src="${book.imgUrl || "default-cover.jpg"}"
            alt="${book.title}"class="book-cover">
            <div class="book-info">
                <h2>${book.title}</h2>
                <p><strong>Price:</strong> $${book.price}</p>
                <p><strong>ID:</strong> ${book.id}</p>
            </div>
        </div>
        `
  document.querySelector("#modal").classList.remove("hidden")
}

function onCloseModal() {
  document.querySelector(".modal").classList.add("hidden")
}
