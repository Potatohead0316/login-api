const express = require('express')
const router = express.Router()
const Book = require('../models/Books')
const { successResponse, errorResponse } = require('../helper/helper')

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

router.get('/list-books', async (req, res) => {
    try {
        const books = await Book.find()
        successResponse(res, 'Books retrieved successfully', books)
    } catch (error) {
        return errorResponse(res, 500, 'Internal server error')
    }
})

router.delete('/delete-book/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deletedBook = await Book.findByIdAndDelete(id)
        if (deletedBook) {
            return successResponse(res, 'Book deleted successfully', deletedBook)
        } else {
            return errorResponse(res, 404, 'Book not found')
        }
    } catch (error) {
        return errorResponse(res, 500, 'Book not found')
    }
})

router.put('/update-book/:id', async (req, res) => {
    const { id } = req.params
    const updateData = req.body  

    try {
        if (Object.keys(updateData).length === 0) {
            return errorResponse(res, 400, 'No fields provided for update.')
        }

        const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true })

        if (updatedBook) {
            return successResponse(res, 'Book updated successfully', updatedBook)
        } else {
            return errorResponse(res, 404, 'Book not found')
        }
    } catch (error) {
        console.error('Error updating book:', error)
        return errorResponse(res, 500, 'Internal server error')
    }
})

router.get('/find-book/:id', async (req, res) => {
    const { id } = req.params

    try {
        const book = await Book.findById(id)

        if (book) {
            return successResponse(res, 'Book retrieved successfully', book)
        } else {
            return errorResponse(res, 404, 'Book not found')
        }
    } catch (error) {
        console.error('Error finding book:', error)
        return errorResponse(res, 500, 'Internal server error')
    }
})



module.exports = router
