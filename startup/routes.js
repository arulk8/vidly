const genresRoute = require('../routes/genres');
const customersRoute = require('../routes/customers');
const moviesRoute = require('../routes/movies');
const rentalsRoute = require('../routes/rentals');
const usersRoute = require('../routes/users');
const loginRoute = require('../routes/login');
const homeRoute = require('../routes/home');
const routes = (app) => {
    app.use('/api/genres', genresRoute);
    app.use('/api/customers', customersRoute);
    app.use('/api/movies', moviesRoute);
    app.use('/api/rentals', rentalsRoute);
    app.use('/api/users', usersRoute);
    app.use('/api/login', loginRoute);
    app.use('/', homeRoute);
}

module.exports = routes;