let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var logout = require('./routes/logout');
var post_job = require('./routes/post_job');
var apply = require('./routes/apply');
var jobs = require('./routes/jobs');
var submissions = require('./routes/submissions');
const fileUpload = require('express-fileupload');
var send_cv = require('./routes/send_cv');

var app = express();

// View Engine

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/iaProject', {useNewUrlParser: true});
var db = mongoose.connection;
// Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use('/', indexRouter);
app.use('/home', indexRouter);
app.use('/jobs', jobs);
app.use('/apply', apply);
app.use('/submissions', submissions);
app.use('/logout', logout);
app.use('/login', loginRouter);
app.use('/post_job', post_job);
app.use('/register', registerRouter);
app.use('/send_cv', send_cv);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
