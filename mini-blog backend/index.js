const express = require("express")
const morgan = require("morgan")
const app = express()
const port = 5000
const cors = require("cors")
const articlesRoute = require("./routes/articles")
const categoriesRoute = require("./routes/categories")

app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

app.use("/categories", categoriesRoute)
app.use("/articles", articlesRoute)

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
