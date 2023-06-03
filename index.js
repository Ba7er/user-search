const app = require('./src/app');
const db = require('./src/database');
db.init().then(() => app.listen(3001));
