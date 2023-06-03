const app = require('./src/app');
const user = require('./src/user');
user.init().then(() => app.listen(3001));
