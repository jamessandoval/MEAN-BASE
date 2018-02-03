module.exports = function(app) {
const index = require('../controllers/results.server.controller');
app.get('/results', index.render);
};