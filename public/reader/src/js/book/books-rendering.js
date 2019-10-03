const bookTemplateBlock = `
    <div class='book'>
        <a href="$book_link$">
            <span class="book-title">$book_title$</span>
            <span class="book-domain">$book_domain$</span>
        </a>
    </div>`;

export function addBookToPage(book) {
    if (!book.title) {
        return
    }
    const page = document.getElementsByClassName('page')[0];
    const dummyDiv = document.createElement('div');
    const hostname = new URL(book.url).hostname;
    dummyDiv.innerHTML = bookTemplateBlock
        .replace('$book_title$', book.title)
        .replace('$book_domain$', hostname)
        .replace('$book_link$', book.link);
    page.appendChild(dummyDiv);
}