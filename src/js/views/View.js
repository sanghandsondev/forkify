import icons from 'url:../../img/icons.svg'      // Parcel 2

export default class View {
  _data
  _clear() {
    this._parentElement.innerHTML = ''
  }

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @this {Object} View instance
   */
  //Method
  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div> 
        `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

    this._data = data
    const markup = this._generateMarkup()
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
  renderMessage(message = this._message) {
    const markup = `
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div> 
    `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
  update(data) {          // compare old HTML vs new HTML  => update the change only not at all HTML recipe

    // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

    this._data = data
    const newMarkup = this._generateMarkup()
    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements = Array.from(newDOM.querySelectorAll('*'))                        // nodeList

    const curElements = Array.from(this._parentElement.querySelectorAll('*'))

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]
      // console.log(newEl, newEl.isEqualNode(curEl))         // compare content of newEl vs curEl

      // update changed TEXT
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent
      }

      // update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value)
        })
      }

    })
  }
}