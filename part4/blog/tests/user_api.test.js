import { test, describe, beforeEach } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import User from '../models/user.js'

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = new User(helper.initialUsers[0])
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Mateo',
      name: 'Mateo',
      password: '123456'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('The server responds with a 400 code if the username length is less than 3', async () => {

    const usersAtStart = await helper.usersInDb()

    const newInvalidUser = {
      username: 'ed',
      name: 'Eddye',
      password: '123456'
    }

    await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('The server responds with a 400 code if the password length is less than 3', async () => {

    const usersAtStart = await helper.usersInDb()

    const newInvalidUser = {
      username: 'eddye12',
      name: 'Eddye',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('password must be at least 3 characters long'))
  })

  test('The server responds with a 400 code if the username is already taken by another user', async () => {

    const usersAtStart = await helper.usersInDb()

    const newInvalidUser = {
      username: 'caigcada',
      name: 'Carlos',
      password: '123456'
    }

    const result = await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)

  })
})