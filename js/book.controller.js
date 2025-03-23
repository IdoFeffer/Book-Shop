"use strict"

var gFilterBook = ""
var gViewMode = "table"

const gQueryOptions = {
  filterBy: { txt: "", rating: 0 },
  sortBy: {},
  page: { idx: 0, size: 2 },
}

function onInit() {
  _createBooks()
  readQueryParams()
  gViewMode = loadFromStorage("viewMode") || "table"
  renderBooks()
}

function renderBooks() {
  var books = getBooks(gQueryOptions)
  const elTableView = document.querySelector(".book-container")
  const elGridView = document.querySelector(".book-grid")
  const elTableBody = document.querySelector(".book-list")
  // const books = getBooks().filter((book) =>
  //   book.title.toLowerCase().includes(gFilterBook.toLowerCase())
  // )

  if (books.length === 0) {
    elTableView.style.display = "block"
    elGridView.style.display = "none"
    elTableBody.innerHTML = `
      <tr>
        <td colspan="3">No books were found...</td>
      </tr>`
    return
  }

  if (gViewMode === "table") {
    elTableView.style.display = "block"
    elGridView.style.display = "none"

    const strHTMLs = books.map((book) => {
      return `
        <tr>
          <td>${book.title}</td>
          <td>${book.price.toFixed(2)}$</td>
          <td>
            <button class="read" onclick="onRead('${book.id}')">Read</button>
            <button class="update" onclick="onUpdateBook('${
              book.id
            }')">Update</button>
            <button class="delete" onclick="onRemoveBook('${
              book.id
            }',event)">Delete</button>
          </td>
          <td>${book.rating}⭐</td>
        </tr>`
    })
    elTableBody.innerHTML = strHTMLs.join("")
  } else if (gViewMode === "grid") {
    elGridView.style.display = "grid"
    elTableView.style.display = "none"

    const strHTMLs = books.map((book) => {
      return `
        <div class="book-card">
        <h3>${book.title}</h3>
        <p>${book.price.toFixed(2)}$</p>
        <td>${book.rating}⭐</td>
          <button class="read" onclick="onRead('${book.id}')">Read</button>
          <button class="update" onclick="onUpdateBook('${
            book.id
          }')">Update</button>
          <button class="delete" onclick="onRemoveBook('${
            book.id
          }',event)">Delete</button>
        </div>`
    })
    elGridView.innerHTML = strHTMLs.join("")
  }
  renderStat()
}

function renderStat() {
  document.querySelector(".total-exp-books").innerText = getTotalExpBooksCount()
  document.querySelector(".total-avg-books").innerText = getTotalAvgBooksCount()
  document.querySelector(".total-cheap-books").innerText =
    getTotalCheapBooksCount()
}

function onRemoveBook(bookId, ev) {
  // ev.stopPropagation()
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
  document.querySelector(".add-book-modal").style.display = "block"

  if (!newTitle || newPrice <= 0) {
    alert("Please enter a valid title and a positive price.")
    return
  }

  // const elInput = document.querySelector(`input[title='todo-txt']`)

  // Update the Model:
  addBook(newTitle, newPrice)
  // Update the Dom:
  showUserMsg("Book was added")
  renderBooks()
}

function onAddBookFromModal() {
  const elAddBook = document.querySelector(".add-book-modal")
  const title = document.querySelector(".book-title-input").value
  const price = +document.querySelector(".book-price-input").value

  if (!title || price <= 0) {
    alert("Please enter a valid title and a positive price.")
    return
  }

  addBook(title, price)
  showUserMsg("Book was added")
  elAddBook.style.display = "none"
  renderBooks()
}

function onCancelAddModal() {
  document.querySelector(".add-book-modal").style.display = "none"
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
                <button onclick="onChangeRating('${book.id}', -1)">➖</button>
                <span>${book.rating}</span>
                <button onclick="onChangeRating('${book.id}', 1)">➕</button>
            </div>
        </div>
        `
  document.querySelector("#modal").classList.remove("hidden")
}

function onCloseModal() {
  document.querySelector(".modal").classList.add("hidden")
}

function onFilterBooks(filterTxt) {
  gFilterBook = filterTxt
  renderBooks()
}

function onClearFilter() {
  gQueryOptions.filterBy.txt = ""
  gQueryOptions.filterBy.rating = 0

  document.querySelector('.filter-by input[type="text"]').value = ""
  // document.querySelector('.filter-by input[type="range"]').value = 0

  setQueryParams()
  renderBooks()
}

function onChangeDisplay(mode) {
  gViewMode = mode
  saveToStorage("viewMode", gViewMode)
  renderBooks()
}

function onChangeRating(bookId, diff) {
  const book = gBooks.find((book) => (book.id = bookId))
  const newRating = book.rating + diff
  if (newRating >= 0 && newRating <= 5) {
    book.rating = newRating
    _saveBooks()
    onRead(bookId)
  }
}

function onSetFilterBy(filterBy) {
  if (filterBy.txt !== undefined) {
    gQueryOptions.filterBy.txt = filterBy.txt
  } else if (filterBy.rating !== undefined) {
    gQueryOptions.filterBy.rating = filterBy.rating
  }
  setQueryParams()
  renderBooks()
}

function onSetSortBy() {
  const elSortField = document.querySelector(".sort-by select")
  const elSortRat = document.querySelector(".sort-by .sort-desc")

  const sortField = elSortField.value
  const sortRat = elSortRat.checked ? -1 : 1
  console.log("sortDir:", sortRat)

  gQueryOptions.sortBy = { [sortField]: sortRat }
  // console.log('gQueryOptions.sortBy:', gQueryOptions.sortBy)

  gQueryOptions.page.idx = 0
  renderBooks()
  setQueryParams()
}

function readQueryParams() {
  const queryParams = new URLSearchParams(window.location.search)

  gQueryOptions.filterBy = {
    txt: queryParams.get("title") || "",
    rating: +queryParams.get("rating") || 0,
  }

  if (queryParams.get("sortBy")) {
    const prop = queryParams.get("sortBy")
    const dir = queryParams.get("sort-by")
    gQueryOptions.sortBy[prop] = dir
  }

  // if (queryParams.get("pageIdx")) {
  //   gQueryOptions.page.idx = +queryParams.get("pageIdx")
  //   gQueryOptions.page.size = +queryParams.get("pageSize")
  // }
  renderQueryParams()
}

function renderQueryParams() {
  const elRange = document.querySelector('.filter-by input[type="range"]')
  if (elRange) elRange.value = gQueryOptions.filterBy.rating
  const elText = document.querySelector('.filter-by input[type="text"]')
  if (elText) elText.value = gQueryOptions.filterBy.txt

  // document.querySelector('.filter-by input[type="text"]').value =
  //   gQueryOptions.filterBy.txt
  // document.querySelector('.sort-by input[type="range"]').value =
  //   gQueryOptions.filterBy.rating

  const sortKeys = Object.keys(gQueryOptions.sortBy)
  const sortBy = sortKeys[0]
  const rating = gQueryOptions.sortBy[sortKeys[0]]

  document.querySelector(".sort-by select").value = sortBy || ""
  document.querySelector(".sort-by .sort-desc").checked =
    rating === "-1" ? true : false
}

function setQueryParams() {
  const queryParas = new URLSearchParams()

  queryParas.set("title", gQueryOptions.filterBy.txt)
  queryParas.set("rating", gQueryOptions.filterBy.rating)

  const sortKeys = Object.keys(gQueryOptions.sortBy)
  if (sortKeys.length) {
    queryParas.set("sortBy", sortKeys[0])
    queryParas.set("sortRating", gQueryOptions.sortBy[sortKeys[0]])
  }
  const newUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?" +
    queryParas.toString()

  window.history.pushState({ path: newUrl }, "", newUrl)
}



function onNextPage() {
  const pageCount = getPageCount(gQueryOptions)

  if (gQueryOptions.page.idx === pageCount - 1) {
    gQueryOptions.page.idx = 0
  } else {
    gQueryOptions.page.idx++
  }

  renderBooks()
  setQueryParams()
}

function onPrevPage() {
const pageCount = getPageCount(gQueryOptions)

  if (gQueryOptions.page.idx === 0) {
    gQueryOptions.page.idx = pageCount - 1
  } else {
    gQueryOptions.page.idx--
  }
  renderBooks()
  setQueryParams()
}
