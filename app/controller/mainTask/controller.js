const db = require('../../../connection');
const saltedMd5 = require('salted-md5');
var jwt = require('jsonwebtoken');


const getRegister = (req, res) => {
    res.render('Pages/index');
}
const postRegister = (req, res) => {
    db.query(`INSERT INTO users (activationCode, firstName, lastName, email, salt, gender) VALUES (SUBSTRING(MD5(RAND()) FROM 1 FOR 6), ?,?,?, SUBSTRING(MD5(RAND()) FROM 1 FOR 6), ?);`,[req.body.firstname, req.body.lastname, req.body.email,req.body.Gender], (err, row) => {
        if (err) throw err;
        db.query(`select activationCode from users where userId=?`,[row.insertId], (err, data) => {
            if (err) throw err;
            res.render('Pages/AccountActivation', { 'code': data[0].activationCode });
        })
    });
}

const getAccountActivationCode = (req, res) => {
    var code = req.params.code;
    db.query(`select createAt from users where activationCode = ?`,[code],(err,row)=>{
        if(err) throw err;
        
        var cur = new Date().toTimeString();
        var tim = new Date(new Date(row[0].createAt).getTime() + 5 * 60000).toTimeString();
        if (cur < tim){
            
            res.render('Pages/createPSW');
        }
        else{
            res.end('link is exp.');
        }
    });
}

const postAccountActivationCode = (req, res) => {
    var code = req.params.code;
    db.query(`select salt from users where activationCode=?`,[code], (err, row) => {
        if (err) throw err;

        db.query(`update users set password = ?,userStatus="Active" where activationCode=?;`,[saltedMd5(req.body.password, row[0].salt),code], (err) => {
            if (err) throw err;
            res.end('Account is activated go to login');
        })
    });
}

const getLogin = (req, res) => {
    res.render('Pages/login');
}

const postlogin =(req, res) => {
    var flag = false;
    db.query(`select salt from users`, (err, row) => {
        if (err) throw err;
        Object.keys(row).forEach((item) => {

            db.query(`select count(*) as count from users where email=? and password=? `,[req.body.email,saltedMd5(req.body.password, row[item].salt)], (err, data) => {
                if (err) throw err;
                
                if (data[0].count == 1) {
                    flag = true;
                    var payload = {email: req.body.email};
                    var token = jwt.sign(payload, process.env.JWT_SECRET);
                    res.cookie('jwt',token);
                    res.redirect('/taskList');
                }
                else if (item == row.length - 1 && flag == false) {
                    res.end('login unsucessful');
                }

            });
        });

    });
}

const getTaskList = (req,res)=>{
    res.render('Pages/taskList');
}

module.exports = {
    getRegister,
    postRegister,
    getAccountActivationCode,
    postAccountActivationCode,
    getLogin,
    postlogin,
    getTaskList
};