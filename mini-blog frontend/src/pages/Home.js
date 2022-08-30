import { useEffect, useState } from "react"

const Home = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const request = await fetch("http://localhost:5000/categories")
    const response = await request.json()
    setCategories(response)
  }

  return (
    <main className="flex flex-wrap">
     
    </main>
  )
}

export default Home