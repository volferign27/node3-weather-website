const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Voltaire'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Voltaire'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Voltaire'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.location){
        return res.send({
            error: 'You must provide location'
        })
    }

    geocode(req.query.location, (error, { latitude, longitude, location } = {}) => {
        if (error){
            return res.send({error})
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({error})
            }
    
            res.send({
                forecast: forecastData,
                location,
                address: req.query.location
            })            
          })    
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Voltaire Ignacio',
        errorMessage: 'Help not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Voltaire Ignacio',
        errorMessage: 'Page not found.'
    })
})
// app.com
// app.com/help
// app.com/about

app.listen(port, () => {
    console.log('Server is up on port' + port)
})