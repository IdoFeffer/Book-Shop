'use strict'

function onInit(){
    renderBooks()
}

function renderBooks(){
    const books = getBooks()
    var elTableBody = document.querySelector('.book-list')

    elTableBody.innerHtml = ''

    books.forEach(book => {
        elTableBody.innerHTML += `
        <tr>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td>
            <button onclick='onRead'(${book.id})>
            <button onclick='onUpdate'(${book.id})>
            <button onclick='onDelete'(${book.id})>`
    });
}