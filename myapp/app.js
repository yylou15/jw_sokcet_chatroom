var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var favicon = require('serve-favicon');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var debug = require('debug')('my-application'); // debug模块
app.set('port', process.env.PORT || 3000); // 设定监听端口

//启动监听
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});


// var http = require('http').Server(app);
var io = require('socket.io')(server);

let mysql = require('mysql');
let connection = mysql.createConnection({
    host     : 'gz-cdb-eb8g1q0q.sql.tencentcdb.com',
    port     : '62647',
    user     : 'root',
    password : 'lkl510230',
    database : 'socket'
});

connection.connect();
//注册连接事件，第二个参数就是socket连接对象，可以继续注册事件，事件名是随意的，但是要和前端传过来的对应
io.on('connection', function(socket){
    socket.on('someone connected', function(msg){
        socket.broadcast.emit('other connected',msg)
    });

    socket.on('someone msg',function (msg) {

        var modSql = 'SELECT * FROM user WHERE name = ?';
        var modSqlParams = [msg.username];

        // socket.broadcast.emit('other msg',msg)
        connection.query(modSql,modSqlParams,function (err,res) {
            let qq = '1';
            if(res.length){
                qq = res[0].qq;
            }
            socket.broadcast.emit('other msg',{
                msg : msg.username + '：' + msg.value,
                avatarUrl : 'http://q1.qlogo.cn/g?b=qq&nk=' + qq + '&s=640'
            })
        });
    });



    // socket.on('chat message', function(msg){
    //     console.log('message: ' + msg);
    //     socket.emit('test', '收到了你的消息！' + msg,{ for: 'everyone' });
    //     socket.broadcast.emit('test','有人发了消息！'+ msg)
    // });
});

// module.exports = app;
