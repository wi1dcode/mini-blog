const express = require("express")
const fs = require('fs')
const app = express()
const slugify = require("slugify")
const file = "./articles.json"
const { checkCategory } = require("../middlewares/checkCategory")
const { checkIfExists, checkIfNotExist, checkIfCategoryIsValid } = require("../middlewares/checkArticle")
const moment = require('moment') 
const { body, validationResult } = require('express-validator')



app.get('/', (req, res) => {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).json('Internal server error')
    } else {
      const articles = JSON.parse(data.toString())
      res.json(articles)
    }
  })
})

app.get('/:slug', checkIfExists, (req, res) => {
  res.json(req.article)
})

app.post(
  '/',
  body('title')
    .isLength({ min: 2, max: 60 })
    .withMessage('Title must be between 2 and 60 chars'),
  body('author').isString().withMessage('Invalid author name'),
  body('description')
    .isString()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 chars'),
  checkIfNotExist,
  checkIfCategoryIsValid,
  (req, res) => {
    const { errors } = validationResult(req)

    console.log(errors)

    if (errors.length > 0) {
      res.status(400).json(errors)
      return
    }

    fs.readFile(file, (err, data) => {
      if (err) {
        res.status(500).json('Internal server error')
      } else {
        const articles = JSON.parse(data.toString())

        const article = {
          ...req.body,
          slug: req.slug,
          date: moment().format()
        }

        articles.push(article)

        fs.writeFile(file, JSON.stringify(articles), err => {
          if (err) {
            res.status(500).json('Internal server error')
          } else {
            res.json(article)
          }
        })
      }
    })
  }
)

module.exports = app
