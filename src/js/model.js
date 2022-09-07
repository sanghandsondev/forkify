import 'regenerator-runtime/runtime'        // polyfilling async/await
import { API_URL, RES_PER_PAGE, KEY } from './config'
// import { getJSON, sendJSON } from './helpers'
import { AJAX } from './helpers'

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,           // default
        resultsPerPage: RES_PER_PAGE
    },
    bookmarks: [],
}

const createRecipeObject = (data) => {
    const { recipe } = data.data
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),

    }
}

export const loadRecipe = async function (id) {           // as a Promise
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${KEY}`)

        state.recipe = createRecipeObject(data)

        if (state.bookmarks.some(bookmark => {           // if the recipe has been in bookmarks
            return bookmark.id === state.recipe.id
        })) {
            state.recipe.bookmarked = true               // the icon will be filled
        } else {
            state.recipe.bookmarked = false              // the icon will be empty
        }
    } catch (err) {
        console.error(err)
        throw err                     // reject
    }
}

export const loadSearchResults = async function (query) {       // as a Promise
    try {
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)

        state.search.query = query
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            }
        })
        // console.log(state.search)
        state.search.page = 1
    } catch {
        console.error(err)
        throw err                     // reject
    }
}

export const getSearchResultsPage = (page = state.search.page) => {
    state.search.page = page
    // 0-9 10-19 20-29
    const start = (page - 1) * state.search.resultsPerPage     // 0 10 20
    const end = page * state.search.resultsPerPage   // 10 20 30

    return state.search.results.slice(start, end)
}

export const updateServings = (newServings) => {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings
        //newQt = oldQt * newServings / oldServings
    })

    state.recipe.servings = newServings
}

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

const clearBookmarks = () => {
    localStorage.clear('bookmarks')
}

export const addBookmark = (recipe) => {
    // Add bookmark
    state.bookmarks.push(recipe)     // add current recipe

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true

    persistBookmarks()    // localStorage
}

export const deleteBookmark = (id) => {        // when DELETE just use the ID
    // Delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index, 1)

    // Mark current recipe as NOT bookmarked
    if (id === state.recipe.id) state.recipe.bookmarked = false

    persistBookmarks()     // localStorage
}

const init = () => {
    const storage = localStorage.getItem('bookmarks')
    if (storage) state.bookmarks = JSON.parse(storage)
}
init()

export const uploadRecipe = async (newRecipe) => {        // as a Promise
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim())
                // const ingArr = ing[1].replaceAll(' ', '').split(',')
                if (ingArr.length !== 3)
                    throw new Error('Wrong ingredient format! Please use the correct format :)')
                const [quantity, unit, description] = ingArr
                return { quantity: quantity ? +quantity : null, unit, description }
            })
        // console.log(ingredients)
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: newRecipe.cookingTime,
            servings: newRecipe.servings,
            ingredients,
        }
        // console.log(recipe)
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)

        state.recipe = createRecipeObject(data)

        addBookmark(state.recipe)         // add new recipe into Bookmarks

    } catch (err) {
        throw err
    }
}