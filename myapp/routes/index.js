var express = require('express');
var router = express.Router();
var app = express();
var session = require('express-session');
var bodyparser = require('body-parser');

// 使用 session 中间件
router.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 60 * 24, // 设置 session 的有效时间，单位毫秒
    },
}));
// 使用bodyparder中间件，
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function(req, res) {
  if(!req.session.username){
    res.redirect('/login')
  }
  res.render('home', {
      username: req.session.username
  });
  // res.render('home', { username: 'lyy' });
  // res.sendFile(__dirname + '/index.html');
});

router.get('/login',function (req,res) {
   req.session.username = '';
   res.render('login')
});

router.post('/login',function (req,res) {
    if (1/*req.body.username === '楼远洋' && req.body.pwd === '123456'*/){
      req.session.username = req.body.username;
      res.redirect('/')
    }else {
      req.session.errmsg = '用户名或密码错误';
      res.redirect('/login')
    }
});


router.get('/getAvatar',function (req,response) {
    let mysql = require('mysql');
    let connection = mysql.createConnection({
        host     : 'gz-cdb-eb8g1q0q.sql.tencentcdb.com',
        port     : '62647',
        user     : 'root',
        password : 'lkl510230',
        database : 'socket'
    });

    connection.connect();


    var modSql = 'SELECT * FROM user WHERE name = ?';
    var modSqlParams = [req.session.username];
    connection.query(modSql,modSqlParams,function (err,res) {
        let qq = '1';
        if(res.length){
            qq = res[0].qq;
        }
        response.send('http://q1.qlogo.cn/g?b=qq&nk=' + qq + '&s=640')
    });
});

module.exports = router;
