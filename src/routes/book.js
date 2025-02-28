const express = require('express')
const router = express.Router()
const Book = require('../models/Books')
const { successResponse, errorResponse } = require('../helper/helper')

// Add a new book
router.post('/add-book', async (req, res) => {
    const { title, author, year, genre, image } = req.body

    try {
        if (!title || !author || !year || !genre || !image) {
            return errorResponse(res, 400, 'All fields are required.')
        }

        const existingBook = await Book.findOne({ title, author })
        if (existingBook) {
            return res.status(409).json({ error: 'Book already exists' })
        }

        const newBook = new Book({ title, author, year, genre, image })
        await newBook.save()

        successResponse(res, 'Book added successfully', newBook)
    } catch (error) {
        return errorResponse(res, 500, 'Internal server error')
    }
})

// Get all books
router.get('/list-books', async (req, res) => {
    try {
        const books = await Book.find()
        successResponse(res, 'Books retrieved successfully', books)
    } catch (error) {
        return errorResponse(res, 500, 'Internal server error')
    }
})

module.exports = router
