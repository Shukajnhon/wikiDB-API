const { urlencoded } = require("express");
const express = require("express");
const mongoose = require("mongoose")
const ejs = require("ejs")
const port = 3000

const app = express();
app.use(express.static("public"))
app.use(urlencoded({ extended: true }));
app.use(express.json())
app.set('view engine', 'ejs')


mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true })

const articleSchema = mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("Article", articleSchema)

app.get("/articles", (req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles)
        } else {
            res.send(err)
        }
    })
})






app.listen(port, () => {
    console.log("Server started on port 3000")
})