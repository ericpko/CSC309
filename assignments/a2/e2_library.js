/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = []; // Array of books owned by the library (whether they are loaned or not)
const patrons = []; // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron object

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this;
		// keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {

			console.log('overdue book!', self.title);
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
};


// Adding these books does not change the DOM - we are simply setting up the
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'));
patrons.push(new Patron('Kelly Jones'));

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0];
// Set the overdue timeout
libraryBooks[0].setLoanTime();  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */
const bookAddForm = document.querySelector('#bookAddForm'); // same as document.getElementById('element')
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable');
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo');
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons');

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron);
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary);

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
  let newBookForm = e.target.children;
  let bookName = newBookForm[0].value;
  let bookAuthor = newBookForm[1].value;
  let bookGenre = newBookForm[2].value;
  let newBook = new Book(bookName, bookAuthor, bookGenre);

  // -- this also works --
  // let newBookName = document.querySelector('#newBookName').value;
  // let newBookAuthor = document.querySelector('#newBookAuthor').value;
  // let newBookGenre = document.querySelector('#newBookGenre').value;
  // let newBook = new Book(newBookName, newBookAuthor, newBookGenre);

  // add book to library
  libraryBooks.push(newBook);

	// Call addBookToLibraryTable properly to add book to the DOM
  addBookToLibraryTable(newBook);

}

// Changes book patron information, and calls
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
  const bookId = document.querySelector('#loanBookId').value;
  const cardNum = document.querySelector('#loanCardNum').value;
  let book = libraryBooks[bookId];

	// Add patron to the book's patron property
  book.patron = patrons[cardNum];

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(book);

	// Add patron card Number to book table
  for (let row of bookTable.rows) {

    if (parseInt(row.children[0].textContent) === parseInt(bookId)) {
      row.children[2].textContent = book.patron.cardNumber;
      break;
    }
  }

	// Start the book loan timer.
	book.setLoanTime();

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e) {
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
  if (!e.target.classList.contains("return")) {
    return;
  }

	// Call removeBookFromPatronTable()
  // -- these all work --
  // const tableRowEl = e.target.parentElement.parentNode;
  // let bookId = Number(tableRowEl.getElementsByTagName('td')[0].textContent);
  // let bookId = parseInt(tableRowEl.children[0].innerText);
  let bookId = parseInt(e.target.parentNode.parentElement.children[0].textContent);
  let book = libraryBooks[bookId];
  removeBookFromPatronTable(book);

	// Change the book object to have a patron of 'null'
  book.patron = null;


  // find the patron's card number
  // let cardNumber = parseInt(e.target.parentNode.parentNode.parentNode.parentNode.parentNode
  //     .children[1].children[0].textContent);
  //
  // // for (let patronEntry of patronEntries.children) {
  // //   // console.log(patronEntry);
  // //   console.log(patronEntry.children);
  // //   let cardNum = parseInt(patronEntry.children[1].children[0].textContent);
  // //   // console.log(cardNum);
  // // }
  //
  // // Remove the patron card number in the DOM bookTable
  // for (let row of bookTable.children[0].children) {
  //   let curBookId = parseInt(row.children[0].textContent);
  //   let curCardNum = parseInt(row.children[2].textContent);
  //
  //   if (curBookId === bookId && curCardNum === cardNumber) {
  //     // then set the patron card num to empty string
  //     row.children[2].textContent = '';
  //     break;
  //   }
  // }
}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
  // Can either use querySelector OR ...
  let name = e.target.children[0].value;
  // const name = document.querySelector('#newPatronName').value
  const patron = new Patron(name);
  patrons.push(patron);

	// Call addNewPatronEntry() to add patron to the DOM
  addNewPatronEntry(patron);
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
  const bookId = parseInt(e.target.children[0].value);      // can use .value or .textContent
  // const bookId = e.target.children[0].value;             // apparently you don't need the parseInt
  const book = libraryBooks[bookId];

  // also works without parseInt
  // const bookId = document.querySelector('#bookInfoId').value;
  // const book = libraryBooks[bookId];


	// Call displayBookInfo()
  displayBookInfo(book);

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {

  // get the text from the book to fill in the table
  let id = book.bookId;
  let title = book.title;
  let cardNum = book.patron != null ? book.patron.cardNumber : '';
  let bookVals = [id, title, cardNum];

  // bookTable.childNodes[1] == bookTable.children[0] == tbody element
  // create a table row element
  let tableRow = document.createElement('tr');

  // iterate over the columns of the table to add each 'td' element
  for (let i = 0; i < 3; i++) {
    let tableData = document.createElement('td');

    if (i === 1) {
      let strong = document.createElement('strong');
      strong.textContent = bookVals[i];
      tableData.appendChild(strong);

    } else {
      tableData.textContent = bookVals[i];
    }

    tableRow.appendChild(tableData);
  }

  bookTable.appendChild(tableRow);
}


// Displays detailed info on the book in the Book Info Section
function displayBookInfo(book) {
	// note: can use textContent OR innerText
  bookInfo.children[0].children[0].textContent = book.bookId;
  bookInfo.children[1].children[0].innerText = book.title;
  bookInfo.children[2].children[0].innerText = book.author;
  bookInfo.children[3].children[0].innerText = book.genre;
  bookInfo.children[4].children[0].textContent = book.patron != null ? book.patron.name : "N/A";

}

// Adds a book to a patron's book list with a status of 'Within due date'.
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {

  // get the patron's card number
  const cardNum = parseInt(book.patron.cardNumber);

  // iterate over each patron entry on the DOM
  for (let patronEntry of patronEntries.children) {

    // if this isn't the correct patron, skip
    if (cardNum !== parseInt(patronEntry.children[1].children[0].textContent)) {
      continue;
    }

    // if it is the correct patron, create a new row
    let tbody = patronEntry.children[3].children[0];
    let newRow = tbody.insertRow(tbody.rows.length);

    let newCell;
    let newText;
    for (let i = 0; i < 4; i++) {
      newCell = newRow.insertCell(i);
      if (i === 0) {
        newText = document.createTextNode(book.bookId);
        newCell.appendChild(newText);
      } else if (i === 1) {
        newText = document.createTextNode(book.title);
        let strong = document.createElement('strong');
        strong.appendChild(newText);
        newCell.appendChild(strong);
      } else if (i === 2) {
        newText = document.createTextNode("Within due date");
        let span = document.createElement('span');
        span.className = 'green';
        span.appendChild(newText);
        newCell.appendChild(span);
      } else {
        newText = document.createTextNode("return");
        let btn = document.createElement('button');
        btn.className = 'return';
        btn.appendChild(newText);
        newCell.appendChild(btn);
      }
    }
    break;
  }

}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {

  // create a new div class=patron element
  const patronDiv = document.createElement('div');
  patronDiv.classList.add("patron");

  // add the proper internal elements
  patronDiv.className = 'patron';
  patronDiv.innerHTML = "<p>Name: <span>"+
      patron.name+"</span></p><p>Card Number: <span>"+
      patron.cardNumber+"</span></p><h4>Books on loan:</h4>"+
      "<table class='patronLoansTable'><tr><th>BookID</th><th>Title</th>"+
      "<th>Status</th>	<th>Return</th></tr></table>";

  // append this new patronDiv to all the patronEntries on the DOM
  patronEntries.appendChild(patronDiv);
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {

  let patronCardNum;

  Loop1:
  for (let patronEntry of patronEntries.children) {

    patronCardNum = parseInt(patronEntry.children[1].children[0].textContent);
    if (patronCardNum !== book.patron.cardNumber) {
      continue;
    }

    let patronLoansTable = patronEntry.children[3];

    for (let i = 1; i < patronLoansTable.children[0].children.length; i++) {
      let bookId = parseInt(patronLoansTable.children[0].children[i].children[0].textContent);
      if (bookId === book.bookId) {
        patronLoansTable.deleteRow(i);
        break Loop1;
      }
    }
  }

  // remove patron card number from library book table
  for (let row of bookTable.children[0].children) {
    let curBookId = parseInt(row.children[0].textContent);
    let curCardNum = parseInt(row.children[2].textContent);

    console.log(patronCardNum);
    console.log(curCardNum);
    if (curBookId === book.bookId && curCardNum === patronCardNum) {
      // then set the patron card num to empty string
      row.children[2].textContent = '';
      break;
    }
  }
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {

  const patronsList = document.querySelectorAll(".patron");
  // const patronsLst = document.getElementsByClassName('patron');        // same

  for (let i = 0; i < patronsList.length; i++) {

    let cardNum = parseInt(patronsList[i].children[1].children[0].textContent);
    let table = patronsList[i].children[3];

    if (book.patron.cardNumber !== cardNum) {
      continue;
    }

    for (let j = 0; j < table.rows.length; j++) {
      let bookId = parseInt(table.rows[j].children[0].textContent);
      if (book.bookId === bookId) {
        table.rows[j].children[2].textContent = "Overdue";
        table.rows[j].children[2].className = "red";
      }
    }
  }
}
