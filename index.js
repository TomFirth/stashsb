const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const path = require('path')
const timedCache = require('timed-cache')
const cache = new timedCache({ defaultTtl: 900 * 1000 })

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'pug')
app.locals.basedir = path.join(__dirname, '/')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json({
  extended: true
}))

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`${port} belongs to us`)
})

app.get('/', (req, res) => {
  try {
    res.render('index', {
      'cache': false,
      'stash': false
      })
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

app.post('/stash', async (req, res) => {
  try {
    let hash = Math.random().toString(36).substring(7)
    await cache.put(hash, req.body.stash)
    res.render('index', {
      'cache': false,
      'stash': hash
      })
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

app.post('/cache', async (req, res) => {
  try {
    const cacheGet = await cache.get(req.body.cache)
    res.render('index', {
      'cache': cacheGet,
      'stash': false
      })
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})
