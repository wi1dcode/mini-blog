const express = require("express")
const fs = require("fs")
const app = express()
const file = './categories.json'
const { checkCategory, checkCategoryExists } = require("../middlewares/checkCategory")
const { body, validationResult } = require("express-validator")

app.get('/', (req, res) => {
  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).json('Internal server error')
    } else {
      const categories = JSON.parse(data.toString())
      res.json(categories)
    }
  })
})


app.get('/:slug', checkCategory, (req, res) => {
  const category = {
    name: req.category.name,
    slug: req.category.slug,
    description: req.category.description,
    image: req.category.image,
    articles: []
  }
 

  fs.readFile('./articles.json', (err, data) => {
    if (err) {
      res.status(500).json('Internal server error')
    } else {
      const articles = JSON.parse(data.toString())
      const filteredArticles = articles.filter(
        article => article.category === category.slug
      )
      category.articles = filteredArticles

      res.json(category)
    }
  })
})


app.post(
  '/',
  body('name').isLength({ min: 4 }).withMessage('Category name must be 4 chars minimum'),
  body('description').isLength({ min: 20 }).withMessage('Category description must be 20 chars minimum'), 
  body('image').exists().withMessage('image is required').isURL().withMessage('image URL is required'), checkCategoryExists,
  (req, res) => {
    const { errors } = validationResult(req)
    console.log(errors)

    if (errors) {
      res.status(400).json(errors)
      return
    }

    const category = {
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      slug: req.categorySlug
    }

    console.log(categories)
    const categories = [...req.categories, category]
    console.log(categories)

    fs.writeFile(file, JSON.stringify(categories), err => {
      if (err) {
        res.status(500).json('Internal server error')
      } else {
        res.json(category)
      }
    })
  }
)

module.exports = app