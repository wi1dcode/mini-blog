const fs = require('fs')
const slugify = require("slugify")
const file = './categories.json'

const checkCategory = (req, res, next) => {
  const { slug } = req.params

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).json('Internal server error')
    } else {
      const categories = JSON.parse(data.toString())
      const category = categories.find(category => category.slug === slug)

      if (category) {
        req.category = category
        next()
      } else {
        res.status(404).json('Category not found')
      }
    }
  })
}

const checkCategoryExists = (req, res, next) => {
  const slug = slugify(req.body.name, { lower: true })

  fs.readFile(file, (err, data) => {
    if (err) {
      res.status(500).json('Internal server error')
    } else {
      const categories = JSON.parse(data.toString())
      const category = categories.find(category => category.slug === slug)

      if (!category) {
        req.categorySlug = slug
        req.categories = categories
        next()
      } else {
        res.status(409).json('Category already exists')
      }
    }
  })
}

module.exports = {
  checkCategory,
  checkCategoryExists
}