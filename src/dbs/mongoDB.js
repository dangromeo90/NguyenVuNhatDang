const mongoose = require('mongoose');
class mongo {
    constructor() {
        this._connect();
    }

_connect() {
    mongoose.connect('mongodb+srv://nhatdang0915111916:nhatdang@cluster0.smqsmw7.mongodb.net/web-nhatdang' , {
        useNewUrlParser : true ,
        useUnifiedTopology : true
    })
    .then(() => {
        console.log('Database connection successful');
    }).catch( err => {
        console.error('Database connection error');
    });
}
}
module.exports = new mongo;