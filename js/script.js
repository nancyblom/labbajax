let key = `gUKrM`;  // once you have a key, it is ok to store it in a variable
let newKey;         //ifall användaren vill skaffa en ny key.
let baseUrl = `https://www.forverkliga.se/JavaScript/api/crud.php?key=${key}`;
let status;
init(); //anropar funktionen direkt så att böckerna som finns visas från början.


document.querySelector('#newKey').addEventListener('click', async () => {

    let url = `https://www.forverkliga.se/JavaScript/api/crud.php?requestKey`;

    let resp = await fetch(url);
    let data = await resp.json();
    
    if(data.status == 'success'){
      // update newkey el.
      newKey = data.key
      document.querySelector(`#theNewKey`).innerHTML = "your new key:<br>" + newKey;
    }
console.log(newKey)

})
//fixa här så att newKey visas på sidan och inte bara i konsollen.
//tänker kanske att man kan ha en variabel med värdet "Status", skriver den variabeln
//I html och sedan med JS ändrar värdet till success/fail beroende på.

////////////////////////////////////////////////////////////////////////////

//Fixa så att success/failure visas på sidan och inte bara i konsollen.
async function getBooks(){

    console.log(`Getting books from server...`);

    let url = `${baseUrl}&op=select`;

    try {

    let attempts = 1;
    const maxAttempts = 5;

    for(let attempt = 0; attempt < maxAttempts; attempt++){

        let resp = await fetch(url);
        let data = await resp.json();
        
        if(data.status !== `success`) {
            if(attempts > maxAttempts){
            
                return `No Success after ${maxAttempts} attempts.`

            
            } else {
                console.error(`Error in attempt ${attempt}. Msg: ${data.message}`);
                attempts++;
            }

        } else {
            
            return data.data;
        }

    }

    } catch(error){
        console.error(`oops, we got an error!` + error);
        // Try again
    }
}


document.querySelector(`#addButton`).addEventListener(`click`, async () => {

    let author = document.querySelector(`#author`).value;
    let title = document.querySelector(`#title`).value;

    let book = {
        author: author,
        title: title
    }

    await newBook(book);
    let books = await getBooks();

    if(Array.isArray(books)){
        updateBookList(books);
    } else {
        // Error to display
        document.querySelector(`#books`).innerHTML = `API request failed.`;
        //visar för användaren om API-anropen misslyckats.
    }
    
    // reset input
    document.querySelector(`#author`).value = '';
    document.querySelector(`#title`).value = '';

})


function updateBookList(books){

    document.querySelector(`#books`).innerHTML = ``;

    books.forEach(book => {
      
        let el = document.createElement(`li`);
        el.innerHTML = book.title + " by " +  book.author;

        document.querySelector(`#books`).appendChild(el);

    });
}





async function newBook(book){

    console.log(`Adding new book...`);

    let url = `${baseUrl}&op=insert&author=${book.author}&title=${book.title}`;

    try {

        let attempts = 1;
        const maxAttempts = 5;

        for(let attempt = 0; attempt < maxAttempts; attempt++){

            let resp = await fetch(url, {
                method: `POST`
            });

            let data = await resp.json();

            if(data.status !== `success`) {
                if(attempts >= maxAttempts){
                    
                    
                    return `No Success after ${maxAttempts} attempts.`
                
                } else {
                    console.error(`error in attempt ${attempt}. Msg: ${data.message}`);
                    attempts++;
                }
            } else {
                return `book successfully added on attempt ${attempts}.`;        
            }
        }

    } catch(error){
        console.error(`whoops, error in post!` + error);
        // Try again
    }


}


async function init() {

    let books = await getBooks();

    if(Array.isArray(books)){
        updateBookList(books);
        document.querySelector(`#status`).innerHTML = `API request successful.`
    } else {
        // Error to display
        document.querySelector(`#books`).innerHTML = `API request failed.`;
    }
};   