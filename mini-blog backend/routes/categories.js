const express = require("express")
const fs = require("fs")
const app = express()
const { checkCategory } = require("../middlewares/checkCategory")
const categoriesList = require("../categories.json")
const slugify = require("slugify")
const { body, validationResult } = require("express-validator")

app.get("/", (req, res) => {
  fs.readFile("./categories.json", (err, data) => {
    if (err) {
      res.json(err)
      return
    }

    const dataString = data.toString()
    const dataJson = JSON.parse(dataString)
    res.json(dataJson)
  })
})

app.post(
  "/",
  body("name")
    .exists()
    .withMessage("Enter name")
    .custom((value) => {
      const slugified = slugify(value, { lower: true })
      const checkCategory = categoriesList.find(
        (category) => category.slug === slugified
      )
      return !checkCategory
    })
    .withMessage("Name already exists"),
  body("description")
    .exists()
    .withMessage("Enter description")
    .isLength({ min: 5 })
    .withMessage("Enter min 5 symboles"),
  (req, res) => {
    const { errors } = validationResult(req)

    if (errors.length > 0) {
      res.status(400).json(errors)
    } else {
      const category = {
        ...req.body,
        slug: slugify(req.body.name, { lower: true }),
      }

      fs.readFile("./categories.json", (err, data) => {
        if (err) {
          res.json(err)
          return
        }

        const categories = JSON.parse(data.toString())
        categories.push(category)

        fs.writeFile("./categories.json", JSON.stringify(categories), (err) => {
          res.json(err)
        })
      })
    }
    res.json("New category added")
  }
)

module.exports = app
