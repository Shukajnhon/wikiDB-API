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

////////////////////// Request Targeting all Articles///////////////

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send("No articles matching that title was found.")
            }
        })
    })

    .post((req, res) => {
        const title = req.body.title
        const content = req.body.content
        console.log(title, content)

        const newArticle = new Article({
            title: title,
            content: content
        })
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.")
            } else {
                res.send(err)
            }
        })

    })

    .delete((req, res) => {
        // Delete all
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully delete all articles.")
            } else {
                res.send(err)
            }
        })
    });


////////////////////// Request Targeting A Specific Article ///////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        const articleTitle = req.params.articleTitle
        Article.findOne({ title: articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No articles matching that title was found.")
            };
        })
    })

    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle }, // condition
            {
                $set: {
                    title: req.body.title,      // Update Title
                    content: req.body.content   // Update Content
                }
            },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfully update article.")
                } else {
                    res.send(err)
                }
            }

        )
    })

    .delete((req, res) => {

        Article.deleteOne(
            {
                title: req.params.articleTitle
            },
            function (err) {
                if (!err) {
                    res.send("Successfully deleted a article.")
                } else {
                    res.send(err)
                }
            }
        )
    });








app.listen(port, () => {
    console.log("Server started on port 3000")
})