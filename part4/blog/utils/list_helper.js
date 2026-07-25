const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + (item.likes || 0)
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((provicionalFavorite, currentBlog) => {
    if (currentBlog.likes > provicionalFavorite.likes) {
      return currentBlog
    } else {
      return provicionalFavorite
    }
  }, blogs[0])

  return {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs) => {

  const diccionario = blogs.reduce((conteoAutores, currentBlog) => {
    const autor = currentBlog.author
    if (conteoAutores[autor] === undefined) {
      conteoAutores[autor] = 1
    } else {
      conteoAutores[autor]++
    }
    return conteoAutores
  }, {});

  const autores = Object.keys(diccionario)

  const autorGanador = autores.reduce((ganadorProvicional, autorActual) => {
    if (diccionario[autorActual] > diccionario[ganadorProvicional]) {
      return autorActual
    } else {
      return ganadorProvicional
    }
  }, autores[0])

  return {
    author: autorGanador,
    blogs: diccionario[autorGanador]
  }
}

const mostLikes = (blogs) => {
  const diccionario = blogs.reduce((conteoAutores, currentBlog) => {
    const autor = currentBlog.author;
    const likesActuales = currentBlog.likes
    if (conteoAutores[autor] === undefined) {
      conteoAutores[autor] = likesActuales;
    } else {
      conteoAutores[autor] += likesActuales
    }
    return conteoAutores
  }, {})

  const autores = Object.keys(diccionario)

  const autorGanador = autores.reduce((ganadorProvicional, autorActual) => {
    if (diccionario[autorActual] > diccionario[ganadorProvicional]) {
      return autorActual
    } else {
      return ganadorProvicional
    }
  }, autores[0])

  return {
    author: autorGanador,
    likes: diccionario[autorGanador]
  }
}
export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }