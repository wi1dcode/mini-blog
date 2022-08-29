const categoriesTable = require("../categories.json")

const checkCategory = (req, res, next) => {
  const category = categoriesTable.find(
    (category) => category.slug === req.params.slug
  )

  if (category) {
    req.category = category
    next()
  } else {
    res.status(404).json("Category doesn't exists")
  }
}

module.exports = { checkCategory }
