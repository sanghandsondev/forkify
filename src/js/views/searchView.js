import icons from 'url:../../img/icons.svg'      // Parcel 2


class SearchView {
    _parentEl = document.querySelector('.search')
    _clearInput() {
        this._parentEl.querySelector('.search__field').value = ''
    }

    //method
    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value
        this._clearInput()
        return query
    }

    addHandlerSearch(handler) {
        // this._parentEl.querySelector('.search__field').addEventListener('input', handler)  
        this._parentEl.addEventListener('submit', (e) => {
            e.preventDefault()
            handler()
        })
    }
}

export default new SearchView()