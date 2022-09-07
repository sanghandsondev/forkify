import * as model from './model'
import { MODAL_CLOSE_SEC } from './config'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultsView'
import bookmarksView from './views/bookmarksView'
import paginationView from './views/paginationView'
import addRecipeView from './views/addRecipeView'

import 'core-js/stable'                     // polyfilling everything else
import 'regenerator-runtime/runtime'        // polyfilling async/await


// https://forkify-api.herokuapp.com/v2

// if (module.hot) {          // from Parcel
//   module.hot.accept()
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)      // id recipe in URL     #123
    if (!id) return;
    recipeView.renderSpinner()
    // 0) Update results view to mark selected search result
    // resultsView.render(model.getSearchResultsPage())          // re-rendered results view
    resultsView.update(model.getSearchResultsPage())             // just only update change 

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks)

    // 2) Loading recipe
    await model.loadRecipe(id)         // MODEL 

    // 3) Rendering recipe
    recipeView.render(model.state.recipe)         // VIEW

  } catch (err) {
    // Temp error handling
    recipeView.renderError()
  }
}

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner()

    // 1) Get search query
    const query = searchView.getQuery()
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query)

    // 3) Render results
    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage())        // default page 1

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search)

  } catch {
    console.log(err)
  }
}

const controlPagination = (goToPage) => {
  // console.log(goToPage)
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = (newServings) => {
  // Update the recipe servings (in state)
  model.updateServings(newServings)

  // Update the recipe view
  // recipeView.render(model.state.recipe)        // re-rendered
  recipeView.update(model.state.recipe)           // just only update change 
}

const controlAddBookmark = () => {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  }
  else {
    model.deleteBookmark(model.state.recipe.id)
  }
  // 2) Update recipe view
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddReicpe = async (newRecipe) => {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner()

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe)

    // Render recipe
    console.log(model.state.recipe)
    recipeView.render(model.state.recipe)

    // Success message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)
    // window.history.back()

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)

  } catch (err) {
    addRecipeView.renderError(err.message)
  }
}

const init = function () {         // DOM Browser
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddReicpe)
}
init()
