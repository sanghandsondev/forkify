import icons from 'url:../../img/icons.svg'      // Parcel 2
import View from './View'

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list')
    _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it! `
    _message = ''

    _generateMarkup() {
        // console.log(this._data)
        return this._data.map(this._generateMarkupPreview).join('')
    }

    _generateMarkupPreview(result) {
        const id = window.location.hash.slice(1)       //  URL: #id
        return `
                <li class="preview">
                    <a class="preview__link ${result.id === id ? 'preview__link--active' : ''}" href="#${result.id}">
                        <figure class="preview__fig">
                            <img src="${result.image}" alt="Test" />
                        </figure>
                        <div class="preview__data">
                            <h4 class="preview__title">${result.title}</h4>
                            <p class="preview__publisher">${result.publisher}</p>
                        </div>
                        <div class="recipe__user-generated ${result.key ? '' : 'hidden'}">
                            <svg>
                            <use href="${icons}#icon-user"></use>
                            </svg>
                        </div>
                    </a>
                </li>
        `
    }

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }
}

export default new BookmarksView()