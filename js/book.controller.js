"use strict"

var gFilterBy = ""

function onInit() {
  _createBooks()
  renderBooks()
}

function renderBooks() {
  const books = getBooks().filter((book) =>
    book.title.toLowerCase().includes(gFilterBy.toLowerCase())
  )
  // const books = getBooks()
  const elTableBody = document.querySelector(".book-list")

  var strHTMLs = books.map((book) => {
    return `
          <tr>
              <td>${book.title}</td>
              <td>${book.price}</td>
              <td>
                  <button class="read" onclick="onRead('${book.id}')">Read</button>
                  <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                  <button class="delete" onclick="onRemoveBook('${book.id}',event)">Delete</button>
              </td>
          </tr>`
  })
  elTableBody.innerHTML = strHTMLs.join("")

  renderStat()
}

function renderStat() {

  document.querySelector(".total-exp-books").innerText = getTotalExpBooksCount()
  document.querySelector(".total-avg-books").innerText = getTotalAvgBooksCount() 
  document.querySelector(".total-cheap-books").innerText = getTotalCheapBooksCount()
}

function onRemoveBook(bookId, ev) {
  ev.stopPropagation()
  // Update the Model:
  removeBook(bookId)
  // Update the Dom:
  showUserMsg("Book was removed")
  renderBooks()
}

function onUpdateBook(bookId) {
  const newPrice = +prompt("Enter new price:")
  if (!newPrice || newPrice === 0) return

  updatePrice(bookId, newPrice)

  showUserMsg("Book was updated")
  renderBooks()
}

function onAddBook(ev) {
  const newTitle = prompt("Enter new book")
  const newPrice = +prompt("Enter new price:")

  if (!newTitle || newPrice <= 0) {
    alert("Please enter a valid title and a positive price.")
    return
  }

  const elInput = document.querySelector(`input[title='todo-txt']`)
  // Update the Model:
  addBook(newTitle, newPrice)
  // Update the Dom:
  showUserMsg("Book was added")
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

function onFilterBooks(filterTxt) {
  gFilterBy = filterTxt
  renderBooks()
}

function onClearFilter() {
  gFilterBy = ""
  document.querySelector(`input[type='text']`).value = ""
  renderBooks()
}

function showUserMsg(txt) {
  const elMsg = document.querySelector(".user-msg")
  elMsg.innerText = txt

  elMsg.style.display = "block"
  setTimeout(() => {
    elMsg.style.display = "none"
  }, 2000)
}
