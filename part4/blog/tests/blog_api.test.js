import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import app from '../app.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import mongoose from 'mongoose'
import helper from './test_helper.js'

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let token = null

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    const savedUser = await user.save()

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    }
    token = jwt.sign(userForToken, process.env.SECRET)

    const blogsWithUser = helper.initialBlogs.map(blog => ({ ...blog, user: savedUser._id }))
    await Blog.insertMany(blogsWithUser)
  })

  describe('getting or viewing blogs', () => {
    test('blogs are returned as json and the amount is correct', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blogs have unique identifier property named id', async () => {
      const response = await api.get('/api/blogs')
      const firstBlog = response.body[0]
      assert.notStrictEqual(firstBlog.id, undefined)
    })
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added when token is provided', async () => {
      const newBlog = {
        title: 'Testing with JWT',
        author: 'FullStackOpen',
        url: 'https://fullstackopen.com/',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('if the likes property is missing from the request, it will default to 0', async () => {
      const newBlogWithNoLikes = {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithNoLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)

      const blogsAtEnd = await helper.blogsInDb()
      const savedBlog = blogsAtEnd.find(b => b.title === 'TDD harms architecture')
      assert.strictEqual(savedBlog.likes, 0)
    })

    test('blog without title is not added and returns 400 Bad Request', async () => {
      const newBlogWithNoTitle = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithNoTitle)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added and returns 400 Bad Request', async () => {
      const newBlogWithNoUrl = {
        title: 'Type wars',
        author: 'Robert C. Martin'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithNoUrl)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('creation fails with status code 401 Unauthorized if token is not provided', async () => {
      const newBlog = {
        title: 'Blog without token',
        author: 'Anonymous',
        url: 'https://no-token.com',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid and token is provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const blogChanges = {
        likes: blogToUpdate.likes + 1
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogChanges)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})