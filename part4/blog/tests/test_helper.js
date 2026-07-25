import Blog from '../models/blog.js'
import User from '../models/user.js'

const initialUsers = [
  {
    username: 'caigcada',
    name: 'carlos',
    passwordHash: '$2b$10$NxP9217kC6SPOOwv81P.EuA7Jdfh.1b4O1N1NkiVsnV0H2jD27cXO',
    blogs: []
  },
  {
    username: 'caigcada1',
    name: 'carlos1',
    passwordHash: '$2a$10$NxP9219kC6SPOOwc81P.EuJ7Jdfh.1b4O1N1NkiVsnV0H2jD27cXO',
    blogs: []
  }
]

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

export default { initialBlogs, blogsInDb, initialUsers, usersInDb }