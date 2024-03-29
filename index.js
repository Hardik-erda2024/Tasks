const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv').config();
const saltedMd5 = require('salted-md5');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'exTask',
    dateStrings: true
})

const app = express();
app.set('view engine', 'ejs');
app.use('/JS', express.static('public/JS'));
app.use('/CSS', express.static('public/CSS'));
app.use('/ref', express.static('public/ref'));
app.use(express.urlencoded({ extended: true }));

var jwt = require('jsonwebtoken');

var passport = require('passport');
var passportJWT = require("passport-jwt");
var cookieParser = require('cookie-parser');
var JwtStrategy = passportJWT.Strategy;


var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies.jwt;
    }
    return token;
  };
  // strategy for using web token authentication
  var jwtOptions = {}
  jwtOptions.jwtFromRequest = cookieExtractor;
  
  jwtOptions.secretOrKey = process.env.JWT_SECRET;
  
  var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    
      db.query(`select email from users where email='${jwt_payload.email}'`,(err,row)=>{
        if(err) throw err;
        if (row[0].email) {
              next(null, row[0].email);
          } else {
              next(null, false);
          }
      });
  });
  passport.use(strategy);

  app.use(cookieParser())
  app.use(passport.initialize());

app.get('/', (req, res) => {
    res.render('Pages/index');
});

app.post('/', (req, res) => {
    db.query(`INSERT INTO users (activationCode, firstName, lastName, email, salt, gender) VALUES (SUBSTRING(MD5(RAND()) FROM 1 FOR 6), '${req.body.firstname}', '${req.body.lastname}', '${req.body.email}', SUBSTRING(MD5(RAND()) FROM 1 FOR 6), '${req.body.Gender}');`, (err, row) => {
        if (err) throw err;
        db.query(`select activationCode from users where userId=${row.insertId}`, (err, data) => {
            if (err) throw err;
            res.render('Pages/AccountActivation', { 'code': data[0].activationCode });
        })
    });
})

app.get('/AccountActivation/:code', (req, res) => {
    var code = req.params.code;
    db.query(`select createAt from users where activationCode = '${code}'`,(err,row)=>{
        if(err) throw err;
        
        var cur = new Date().toTimeString();
        var tim = new Date(new Date(row[0].createAt).getTime() + 5 * 60000).toTimeString();
        if (cur < tim) {
            
            res.render('Pages/createPSW');
        }
        else
        {
            res.end('link is exp.');
        }
    });
});

app.post('/AccountActivation/:code', (req, res) => {
    var code = req.params.code;
    db.query(`select salt from users where activationCode='${code}'`, (err, row) => {
        if (err) throw err;

        db.query(`update users set password = '${saltedMd5(req.body.password, row[0].salt)}',userStatus="Active" where activationCode='${code}';`, (err) => {
            if (err) throw err;
            res.end('Account is activated go to login');
        })
    });
});

app.get('/login', (req, res) => {
    res.render('Pages/login');
});

app.post('/login', (req, res) => {
    var flag = false;
    db.query(`select salt from users`, (err, row) => {
        if (err) throw err;
        Object.keys(row).forEach((item) => {

            db.query(`select count(*) as count from users where email='${req.body.email}' and password='${saltedMd5(req.body.password, row[item].salt)}' `, (err, data) => {
                if (err) throw err;
                
                if (data[0].count == 1) {
                    flag = true;
                    var payload = {email: req.body.email};
                    var token = jwt.sign(payload, jwtOptions.secretOrKey);
                    res.cookie('jwt',token);
                    res.redirect('/taskList');
                }
                else if (item == row.length - 1 && flag == false) {
                    res.end('login unsucessful');
                }

            });
        });

    });
});

app.get('/taskList', passport.authenticate('jwt', { session: false }),(req,res)=>{
    res.render('Pages/taskList');
});

/* task-1 Dynemic table ---START*/
app.get('/task1', passport.authenticate('jwt', { session: false }),(req,res)=>
{
    res.render('Pages/Task1');
});
/* task-1 Dynemic table ---END*/

/* task-2 All event table ---START*/
app.get('/task2', passport.authenticate('jwt', { session: false }),(req,res)=>
{
    res.render('Pages/Task2');
});
/* task-2 all event table ---END*/

/* task-3 kuku cube ---START*/
app.get('/task3', passport.authenticate('jwt', { session: false }),(req,res)=>
{
    res.render('Pages/Task3');
});
/* task-3 kuku cube ---END*/

/* task-4 TicTacToe ---START*/
app.get('/task4', passport.authenticate('jwt', { session: false }),(req,res)=>
{
    res.render('Pages/Task4');
});
/* task-4 TicTacToe ---END*/

/* task-5 grid ---START*/
app.get('/task5', passport.authenticate('jwt', { session: false }),(req,res)=>{
    db.query('select * from StudentMaster order by StudentId  limit 0,10;',(err,row,fields)=>{
        if(err) throw err;
        var col = []
        for(i in fields)
        {
            col.push(fields[i].name);
        }
        res.render('Pages/Task5',{'row':row,'col':col});
    });
});
/* task-5 grid ---END*/

/* task-6 pagination ---START */
app.get('/Task6', passport.authenticate('jwt', { session: false }),(req,res)=>{
    res.redirect('/Task6/1');
});


app.get('/Task6/:id', passport.authenticate('jwt', { session: false }),(req,res)=>{
    var id = req.params.id;
    var numRow = 4;
    var maxPage;
    var currentPage = (id-1) * numRow;
    db.query('select count(StudentId)as sid from StudentMaster',(err,count)=>{
        if(err) throw err;
        maxPage = count[0].sid / numRow;
    });
    db.query('select * from StudentMaster LIMIT '+currentPage+','+numRow+';',(err,row,fields)=>{
        if(err) throw err;
        var col = [];
        for(i in fields)
        {
            col.push(fields[i].name);
        }
        res.render('Pages/Task6',{'id':id,'maxPage':maxPage,'row':row,'col':col});
    });
    
});
/* task-6 pagination ---END */

/* task-7 Sorting  ---START*/
app.get('/Task7', passport.authenticate('jwt', { session: false }),(req,res)=>{
    res.redirect('/Task7/StudentId/1');
});

app.get('/Task7/:col/:id', passport.authenticate('jwt', { session: false }),(req,res)=>{ 
        var colName = req.params.col;
        var id = req.params.id;
        var numRow = 4;
        var maxPage = 2;
        var currentPage = (id-1) * numRow;
        // console.log(currentPage);
        db.query('select count(StudentId)as sid from StudentMaster',(err,count)=>{
            if(err) throw err;
            maxPage = count[0].sid / numRow;
        });
        db.query('select * from StudentMaster order by '+colName+' LIMIT '+currentPage+','+numRow+';',(err,row,fields)=>{
            if(err) throw err;
            var col = [];
        for(i in fields)
        {
            col.push(fields[i].name);
        }
        res.render('Pages/Task7',{'id':id,'maxPage':maxPage,'row':row,'col':col,'colName':colName});
        });
});
/* task-7 Sorting  ---END*/

/* task-8 Searching ---START */
app.get('/Task8/:id/:search', passport.authenticate('jwt', { session: false }),(req,res)=>{
    var id = req.params.id;
    var search = req.params.search.split(',');

    // console.log(search);
    var numRow = 4;
    var maxPage = 2;
    var currentPage = (id-1) * numRow;
    // console.log(currentPage);
    if(search[0] == "s_id")
    {
        maxPage = 1
         
        db.query(`select * from StudentMaster where StudentId = '${search[1]}' LIMIT ${currentPage},${numRow}`,(err,row,fields)=>{
            if(err) throw err;
            var col = [];
        for(i in fields)
        {
            col.push(fields[i].name);
        }
        res.render('Pages/Task8',{'id':id,'maxPage':maxPage,'row':row,'col':col,'search':search});
        });
    }
    else{
        db.query(`select count(StudentId)as sid from StudentMaster where case when ('${search[0]}' = '') then (StudentMaster.FirstName like '') else (StudentMaster.FirstName like '${search[0]}%') end ${search[1]} case when ('${search[2]}' = '') then (LastName like '') else (LastName like '${search[2]}%') end ${search[1]} case when ('${search[3]}' = '') then (City like '') else (City like '${search[3]}%') end`,(err,count)=>{
            if(err) throw err;
            maxPage = Math.ceil( count[0].sid / numRow);
            console.log(`select count(StudentId)as sid from StudentMaster where FirstName like'${search[0]}%' ${search[1]} LastName like'${search[2]}%' ${search[1]} City like'${search[3]}%'`);
            
        });
        db.query(`select * from StudentMaster where case when ('${search[0]}' = '') then (StudentMaster.FirstName like '') else (StudentMaster.FirstName like '${search[0]}%') end ${search[1]} case when ('${search[2]}' = '') then (LastName like '') else (LastName like '${search[2]}%') end ${search[1]} case when ('${search[3]}' = '') then (City like '') else (City like '${search[3]}%') end LIMIT ${currentPage},${numRow}`,(err,row,fields)=>{
            if(err) throw err;
            var col = [];
        for(i in fields)
        {
            col.push(fields[i].name);
        }
        res.render('Pages/Task8',{'id':id,'maxPage':maxPage,'row':row,'col':col,'search':search});
        });
    }
});

/* task-8 Searching ---END */

/* task-9 Searching with delimeter ---START */
app.get('/Task9', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('Pages/Task9');
});

app.post('/Task9', passport.authenticate('jwt', { session: false }), (req, res) => {
    var str = req.body.str;
    var deli = ['_', '^', '$', '}', '{', ':'];
    var min = [];
    var val = [];
    var q = '';
    for (i = 0; i < str.length; i++) {
        for (j in deli) {

            if (str[i].includes(deli[j])) {

                min.push(i);
            }
        }
    }
    for (i = 0; i < min.length; i++) {
        val.push(str.slice(min[i], min[i + 1]) + '\n');
    }
    val.sort()
    var q = 'select * from StudentMaster where ';
    var flag = false;
    for (i = 0; i < val.length - 1; i++) {
        if (val[i][0] == val[i + 1][0]) {
            q += '(';
            for (j = i; j < i + 2; j++) {

                switch (val[j][0]) {
                    case '_': q += "FirstName like'" + val[j].slice(1).trimEnd() + "%'";
                        break;
                    case '^': q += "LastName like'" + val[j].slice(1).trimEnd() + "%'";
                        break;
                    case '$': q += "Email like'" + val[j].slice(1).trimEnd() + "%'";
                        break;
                    case '}': q += "MidName like'" + val[j].slice(1).trimEnd() + "%'";
                        break;
                    case '{': q += "Phone like'" + val[j].slice(1).trimEnd() + "%'";
                        break;
                    case ':': q += "City like'" + val[j].slice(1).trimEnd() + "%'";
                        break;
                }
                q += ' OR ';
            }
            q += ') AND ';
            flag = true;
        }
        else {
            if (flag == false) {

                switch (val[i][0]) {
                    case '_': q += "FirstName like'" + val[i].slice(1).trimEnd() + "%'";
                        break;
                    case '^': q += "LastName like'" + val[i].slice(1).trimEnd() + "%'";
                        break;
                    case '$': q += "Email like'" + val[i].slice(1).trimEnd() + "%'";
                        break;
                    case '}': q += "MidName like'" + val[i].slice(1).trimEnd() + "%'";
                        break;
                    case '{': q += "Phone like'" + val[i].slice(1).trimEnd() + "%'";
                        break;
                    case ':': q += "City like'" + val[i].slice(1).trimEnd() + "%'";
                        break;
                }
                q += ' AND ';
            }
            flag = false;
        }
    }
    if (flag == false) {

        switch (val[val.length - 1][0]) {
            case '_': q += "FirstName like'" + val[i].slice(1).trimEnd() + "%'";
                break;
            case '^': q += "LastName like'" + val[i].slice(1).trimEnd() + "%'";
                break;
            case '$': q += "Email like'" + val[i].slice(1).trimEnd() + "%'";
                break;
            case '}': q += "MidName like'" + val[i].slice(1).trimEnd() + "%'";
                break;
            case '{': q += "Phone like'" + val[i].slice(1).trimEnd() + "%'";
                break;
            case ':': q += "City like'" + val[i].slice(1).trimEnd() + "%'";
                break;
        }
    }
    else {
        q = q.replaceAll(" OR )", ")");
        q = q.slice(0, -4)
    }
    console.log(q);
    db.query(q, (err, row, fields) => {

        if (err) throw err;
        col = [];
        for (i in fields) {
            col.push(fields[i].name);
        }
        res.render('Pages/Task9', { 'row': row, 'col': col });
    });

});

/* task-9 Searching with delimeter ---END */

/* task-10 CRUD ---START*/
app.get('/Task10', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('Pages/Task10');
});

app.get('/Task10/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('Pages/Task10');
});

app.post('/Task10/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.params.id;
    db.query(`update Candidatemaster set FirstName = '${req.body.FirstName}',LastName = '${req.body.LastName}',Designation='${req.body.bd_Designation}',Adddress1='${req.body.Address1}',Address2='${req.body.Address2}',City='${req.body.City}',State='${req.body.State}',ZipCode='${req.body.ZipCode}',Email='${req.body.Email}',Phone='${req.body.Phone}',Gender='${req.body.Gender}',RelationshipStatus='${req.body.RelationStatus}',DateOfBirth='${req.body.DOB}' where CandidateId=${id}`, (err) => {
        if (err) throw err;
    })
    /* update education table - Start*/
        
        for (i = 0; i < req.body.bord.length; i++) {
            if (req.body.bord[i] != '') {
                if(req.body.hiddenId[i] == '')
                {
                    db.query(`INSERT INTO EducationDetails (CandidateId,Bord, PassingYear, Percentage) VALUES ('${id}', '${req.body.bord[i]}', '${req.body.year[i]}', '${req.body.percentage[i]}')`, (err) => {
                        if (err) throw err;
                    });
                }
                else{
                    db.query(`UPDATE EducationDetails SET Bord='${req.body.bord[i]}', PassingYear='${req.body.year[i]}', Percentage='${req.body.percentage[i]}' where CandidateId=${id} AND id =${req.body.hiddenId[i]}`, (err) => {
                        if (err) throw err;
                    });
                }
            }
        }
    /* END */

    /* update WorkExprience table */

    for (i = 0; i < req.body.Companyname.length; i++) {
        if (req.body.Companyname[i] != '') {
            if(req.body.WorkhiddenId[i] == '')
            {
                db.query(`INSERT INTO exTask.WorkExprience (CandidateId, Companyname, Designation, StartDate, EndDate) VALUES ('${id}', '${req.body.Companyname[i]}', '${req.body.Designation[i]}', '${req.body.dateFrom[i]}', '${req.body.dateTo[i]}');`
                    , (err) => {
                        if (err) throw err;
                    });
            }
            db.query(`update WorkExprience set Companyname='${req.body.Companyname[i]}', Designation='${req.body.Designation[i]}', StartDate='${req.body.dateFrom[i]}', EndDate='${req.body.dateTo[i]}' where CandidateId=${id} and WorkId=${req.body.WorkhiddenId[i]}`
                , (err) => {
                    if (err) throw err;
                });

        }
    }
    /* END*/
    /* update langauge table */

    if (req.body.Language != undefined) {

        for (i = 0; i < req.body.Language.length; i++) {
            if (req.body.Language[i] != '') {
                let read = req.body[req.body.Language[i] + "_read"];
                let write = req.body[req.body.Language[i] + "_write"];
                let speak = req.body[req.body.Language[i] + "_speak"];
                if (read == undefined) {
                    read = 0;
                }
                if (write == undefined) {
                    write = 0;
                }
                if (speak == undefined) {
                    speak = 0;
                }
                db.query(`update LanguageTable set Languagename='${req.body.Language[i]}', LanguageRead='${read}', LanguageWrite='${write}', LanguageSpeak='${speak}' where LanguageId=${req.body.LanguageId[i]} `, (err) => {
                    if (err) throw err;
                });
            }

        }
    }
    /* END */
    /* update Techology table */
    if (req.body.Technoloy != undefined) {
        for (i = 0; i < req.body.Technoloy.length; i++) {
            if (req.body.Technoloy[i] != '') {

                db.query(`update TechnologiesTable set TechnoloieName='${req.body.Technoloy[i]}', KnowlageLevel='${req.body[req.body.Technoloy[i]]}' where TechnologieID =${req.body.TechnologieID[i]}`, (err) => {
                    if (err) throw err;
                });

            }
        }
    }
    /* END */
    /* update refrace table */
    for (i = 0; i < req.body.refName.length; i++) {
        if (req.body.refName[i] != '') {
            db.query(`update ReferanceContact set Name='${req.body.refName[i]}', ContactNumber='${req.body.refPhone[i]}', Relation='${req.body.refRelation[i]}' where ReferanceId=${req.body.ReferanceId[i]}`
                , (err) => {
                    if (err) throw err;
                });

        }
    }
    /* END */
    /* prefrace table */
    db.query(`update Perferances set Location='${req.body.PreferLocation}', NoticePeriod='${req.body.PreferNotice}', ExpactedCTC='${req.body.PerferExCTC}', CurrentCTC='${req.body.PerferCuCTC}', Department='${req.body.Department}' where CandidateId=${id}`, (err) => {
        if (err) throw err;
    })
    res.end('Updated');
});

app.post('/Task10', (req, res) => {

    idPromise = () => {
        return new Promise((resolve, reject) => {


            db.query(`INSERT INTO Candidatemaster (FirstName, LastName, Designation, Adddress1, Address2, City, State, ZipCode, Email, Phone, Gender, RelationshipStatus, DateOfBirth) 
    VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${req.body.bd_Designation}', '${req.body.Address1}', '${req.body.Address2}', '${req.body.City}', '${req.body.State}', '${req.body.ZipCode}', '${req.body.Email}', '${req.body.Phone}', '${req.body.Gender}', '${req.body.RelationStatus}','${req.body.DOB}');`,
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.insertId);

                });
        });
    }
    async function sequentialQueries() {
        const id = await idPromise();
        /* insert into Education table - START */
        for (i = 0; i < req.body.bord.length; i++) {
            if (req.body.bord[i] != '') {
                db.query(`INSERT INTO EducationDetails (CandidateId,Bord, PassingYear, Percentage) VALUES ('${id}', '${req.body.bord[i]}', '${req.body.year[i]}', '${req.body.percentage[i]}')`, (err) => {
                    if (err) throw err;
                });
            }
        }
        /* insert into Education table - START */

        /* insert into workExprience table - START */
        for (i = 0; i < req.body.Companyname.length; i++) {
            if (req.body.Companyname[i] != '') {
                console.log("inside of work");
                db.query(`INSERT INTO exTask.WorkExprience (CandidateId, Companyname, Designation, StartDate, EndDate) VALUES ('${id}', '${req.body.Companyname[i]}', '${req.body.Designation[i]}', '${req.body.dateFrom[i]}', '${req.body.dateTo[i]}');`
                    , (err) => {
                        if (err) throw err;
                    });

            }
        }
        /* insert into workExprience table - END */


        /* insert into ReferanceContact table - START */
        for (i = 0; i < req.body.refName.length; i++) {
            if (req.body.refName[i] != '') {
                db.query(`INSERT INTO ReferanceContact (CandidateId, Name, ContactNumber, Relation) VALUES ('${id}', '${req.body.refName[i]}', '${req.body.refPhone[i]}', '${req.body.refRelation[i]}');`
                    , (err) => {
                        if (err) throw err;
                    });

            }
        }
        /* insert into ReferanceContact table - END */

        /* insert into Perferances table - START */

        if (req.body.PreferLocation != '') {
            db.query(`INSERT INTO Perferances (CandidateId, Location, NoticePeriod, ExpactedCTC, CurrentCTC, Department) VALUES ('${id}', '${req.body.PreferLocation}', '${req.body.PreferNotice}','${req.body.PerferExCTC}','${req.body.PerferCuCTC}', '${req.body.Department}');`
                , (err) => {
                    if (err) throw err;
                });

        }

        /* insert into Perferances table - END */

        /* insert into LanguageTable  - START */
        if (req.body.Language != undefined) {

            for (i = 0; i < req.body.Language.length; i++) {
                if (req.body.Language[i] != '') {
                    let read = req.body[req.body.Language[i] + "_read"];
                    let write = req.body[req.body.Language[i] + "_write"];
                    let speak = req.body[req.body.Language[i] + "_speak"];
                    if (read == undefined) {
                        read = 0;
                    }
                    if (write == undefined) {
                        write = 0;
                    }
                    if (speak == undefined) {
                        speak = 0;
                    }
                    db.query(`INSERT INTO LanguageTable (CandidateId, Languagename, LanguageRead, LanguageWrite, LanguageSpeak)
                        VALUES ('${id}', '${req.body.Language[i]}','${read}', '${write}', '${speak}');`, (err) => {
                        if (err) throw err;
                    });
                }

            }
        }
        /* insert into LanguageTable  - END */

        /* insert into TechnologiesTable  - START */
        if (req.body.Language != undefined) {
            for (i = 0; i < req.body.Technoloy.length; i++) {
                if (req.body.Technoloy[i] != '') {

                    db.query(`INSERT INTO TechnologiesTable (CandidateId, TechnoloieName, KnowlageLevel)
                VALUES ('${id}', '${req.body.Technoloy[i]}','${req.body[req.body.Technoloy[i]]}');`, (err) => {
                        if (err) throw err;
                    });

                }
            }
        }
        /* insert into TechnologiesTable  - END */

        res.end('inserted');
    }
    sequentialQueries();
});

app.get('/db-Candidatemaster/:id', (req, res) => {
    let id = req.params.id
    db.query(`select FirstName, LastName, Designation as bd_Designation, Adddress1 as Address1 , Address2, City, State, ZipCode, Email, Phone, Gender,RelationshipStatus as RelationStatus,DateOfBirth as DOB from Candidatemaster where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});

app.get('/db-EducationDetails/:id', (req, res) => {
    let id = req.params.id
    db.query(`select id as hiddenId, Bord as bord,PassingYear as year,Percentage as percentage from EducationDetails where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});

app.get('/db-WorkExprience/:id', (req, res) => {
    let id = req.params.id
    db.query(`select WorkId as WorkhiddenId,Companyname,Designation,StartDate as dateFrom,EndDate as dateTo from WorkExprience where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});

app.get('/db-LanguageTable/:id', (req, res) => {
    let id = req.params.id
    db.query(`select LanguageId,Languagename as Language,LanguageRead,LanguageWrite,LanguageSpeak from LanguageTable where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});

app.get('/db-TechnologiesTable/:id', (req, res) => {
    let id = req.params.id
    db.query(`select TechnologieID,TechnoloieName,KnowlageLevel from TechnologiesTable where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});

app.get('/db-ReferanceContact/:id', (req, res) => {
    let id = req.params.id
    db.query(`select ReferanceId,Name as refName, ContactNumber as refPhone, Relation as refRelation from ReferanceContact where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});

app.get('/db-Perferances/:id', (req, res) => {
    let id = req.params.id
    db.query(`select Location as PreferLocation, NoticePeriod as PreferNotice, Department, ExpactedCTC as PerferExCTC, CurrentCTC as PerferCuCTC  from Perferances where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});
app.get('/db', (req, res) => {
    // let id = req.params.id
    db.query(`select id from EducationDetails where candidateId =1;`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});
/* task-10 CRUD ---END*/

/* task-11 Result table ---START */

app.get('/result/:colName/:page', passport.authenticate('jwt', { session: false }),(req,res)=>{
    var page = req.params.page;
    var colName = req.params.colName;
    var numRow = 10;
    var maxPage = Math.ceil(200/numRow);
    var currentPage = (page-1) * numRow;
    db.query(`select s.StudentId,s.FirstName,s.Lastname,sum(case when r.Examid=1 then r.ObtainMarksTheory end)as Exam1_Theory,sum(case when r.Examid=1 then r.ObtainMarksPractical end)as Exam1_Practical
    ,sum(case when r.Examid=2 then r.ObtainMarksTheory end)as Exam2_Theory,sum(case when r.Examid=2 then r.ObtainMarksPractical end)as Exam2_Practical
    ,sum(case when r.Examid=3 then r.ObtainMarksTheory end)as Exam3_Theory,sum(case when r.Examid=3 then r.ObtainMarksPractical end)as Exam3_Practical,(sum(r.TotalMarksPractical)+sum(r.TotalMarksTheory))as TotalMarks,(sum(r.ObtainMarksPractical)+sum(r.ObtainMarksTheory))as ObtainMarks from exTask.Result as r inner join exTask.StudentMaster as s on r.StudentId = s.StudentId group by r.StudentId order by s.${colName}
    LIMIT ${currentPage},${numRow}`,(err,row,fields)=>{
        if(err) throw err;
        var col = [];
        for(i in fields)
        {
            col.push(fields[i].name);
        }
        res.render('Pages/Task11',{'row':row,'col':col,'maxPage':maxPage,'id':page,'colName':colName});
    });
    
});

app.get('/result', passport.authenticate('jwt', { session: false }),(req,res)=>{
    res.redirect('/result/StudentId/1')
});

app.get('/resultTable/:id', passport.authenticate('jwt', { session: false }),(req,res)=>{
    var id = req.params.id;
    db.query(`select s.StudentId,s.FirstName,s.LastName,sb.SubjectId,sb.SubjectName,e.ExamId,e.ExamName,r.ObtainMarksTheory,r.ObtainMarksPractical,(r.ObtainMarksTheory + r.ObtainMarksPractical) as Total from StudentMaster as s  inner join Result as r on s.StudentId = r.StudentId  inner join Task3.SubjectMaster as sb on r.SubjectId = sb.SubjectId inner join Task3.ExamMaster as e on e.ExamId = r.ExamId
     where s.StudentId = ${id};`,(err,row)=>{
        if(err) throw err;
        res.render('Pages/ResultTableId',{"row":row});
     });
});

app.get('/resultTable', passport.authenticate('jwt', { session: false }),(req,res)=>{
    res.redirect('/resultTable/1')
});

/* task-11 Result table ---END */

/* task-12 job application with ajax ---START */

app.get('/Task12', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.redirect('/Task12/display');
});
app.post('/Task12', passport.authenticate('jwt', { session: false }), (req, res) => {

    idPromise = () => {
        return new Promise((resolve, reject) => {


            db.query(`INSERT INTO Candidatemaster (FirstName, LastName, Designation, Adddress1, Address2, City, State, ZipCode, Email, Phone, Gender, RelationshipStatus, DateOfBirth) 
    VALUES ('${req.body.FirstName}', '${req.body.LastName}', '${req.body.bd_Designation}', '${req.body.Address1}', '${req.body.Address2}', '${req.body.City}', '${req.body.State}', '${req.body.ZipCode}', '${req.body.Email}', '${req.body.Phone}', '${req.body.Gender}', '${req.body.RelationStatus}','${req.body.DOB}');`,
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.insertId);

                });
        });
    }
    async function sequentialQueries() {
        const id = await idPromise();
        /* insert into Education table - START */
        var board = req.body.bord.split(',');
        var year = req.body.year.split(',');
        var percentage = req.body.percentage.split(',');
        for (i = 0; i < board.length; i++) {

            if (board[i] != '') {
                db.query(`INSERT INTO EducationDetails (CandidateId,Bord, PassingYear, Percentage) VALUES ('${id}', '${board[i]}', '${year[i]}', '${percentage[i]}')`, (err) => {
                    if (err) throw err;
                });
            }
        }
        /* insert into Education table - START */

        /* insert into workExprience table - START */
        var Companyname = req.body.Companyname.split(',');
        for (i = 0; i < Companyname.length; i++) {
            var Designation = req.body.Designation.split(',');
            var dateFrom = req.body.dateFrom.split(',');
            var dateTo = req.body.dateTo.split(',');
            if (Companyname[i] != '') {

                db.query(`INSERT INTO exTask.WorkExprience (CandidateId, Companyname, Designation, StartDate, EndDate) VALUES ('${id}', '${Companyname[i]}', '${Designation[i]}', '${dateFrom[i]}', '${dateTo[i]}');`
                    , (err) => {
                        if (err) throw err;
                    });

            }
        }
        /* insert into workExprience table - END */


        /* insert into ReferanceContact table - START */
        var refName = req.body.refName.split(',');
        var refPhone = req.body.refPhone.split(',');
        var refRelation = req.body.refRelation.split(',');
        for (i = 0; i < refName.length; i++) {
            if (refName[i] != '') {
                db.query(`INSERT INTO ReferanceContact (CandidateId, Name, ContactNumber, Relation) VALUES ('${id}', '${refName[i]}', '${refPhone[i]}', '${refRelation[i]}');`
                    , (err) => {
                        if (err) throw err;
                    });

            }
        }
        /* insert into ReferanceContact table - END */

        /* insert into Perferances table - START */

        if (req.body.PreferLocation != '') {
            db.query(`INSERT INTO Perferances (CandidateId, Location, NoticePeriod, ExpactedCTC, CurrentCTC, Department) VALUES ('${id}', '${req.body.PreferLocation}', '${req.body.PreferNotice}','${req.body.PerferExCTC}','${req.body.PerferCuCTC}', '${req.body.Department}');`
                , (err) => {
                    if (err) throw err;
                });

        }

        /* insert into Perferances table - END */

        /* insert into LanguageTable  - START */
        if (req.body['Language[]'] != undefined) {
            var lang = req.body['Language[]'].split(',');
            for (i = 0; i < lang.length; i++) {
                if (lang[i] != '') {
                    let read = req.body[lang[i] + "_read"];
                    let write = req.body[lang[i] + "_write"];
                    let speak = req.body[lang[i] + "_speak"];
                    if (read == undefined) {
                        read = 0;
                    }
                    if (write == undefined) {
                        write = 0;
                    }
                    if (speak == undefined) {
                        speak = 0;
                    }
                    db.query(`INSERT INTO LanguageTable (CandidateId, Languagename, LanguageRead, LanguageWrite, LanguageSpeak)
                        VALUES ('${id}', '${lang[i]}','${read}', '${write}', '${speak}');`, (err) => {
                        if (err) throw err;
                    });
                }

            }
        }
        /* insert into LanguageTable  - END */

        /* insert into TechnologiesTable  - START */
        if (req.body['Technoloy[]'] != undefined) {
            var techno = req.body['Technoloy[]'].split(',');
            for (i = 0; i < techno.length; i++) {
                if (techno[i] != '') {

                    db.query(`INSERT INTO TechnologiesTable (CandidateId, TechnoloieName, KnowlageLevel)
                VALUES ('${id}', '${techno[i]}','${req.body[techno[i]]}');`, (err) => {
                        if (err) throw err;
                    });

                }
            }
        }
        /* insert into TechnologiesTable  - END */

        res.end('inserted');
    }
    sequentialQueries();
    // res.send(req.body['Language[]']);
});
app.get('/Task12/display', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('Pages/display');
});
app.get('/Task12/update/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('Pages/Task12');
});
app.post('/Task12/update/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let id = req.params.id;
    db.query(`update Candidatemaster set FirstName = '${req.body.FirstName}',LastName = '${req.body.LastName}',Designation='${req.body.bd_Designation}',Adddress1='${req.body.Address1}',Address2='${req.body.Address2}',City='${req.body.City}',State='${req.body.State}',ZipCode='${req.body.ZipCode}',Email='${req.body.Email}',Phone='${req.body.Phone}',Gender='${req.body.Gender}',RelationshipStatus='${req.body.RelationStatus}',DateOfBirth='${req.body.DOB}' where CandidateId=${id}`, (err) => {
        if (err) throw err;
    })
    /* update education table - Start*/
    var board = req.body.bord.split(',');
        var year = req.body.year.split(',');
        var percentage = req.body.percentage.split(',');
        var hiddenId =req.body.hiddenId.split(',');
    for (i = 0; i < board.length; i++) {
        if (board[i] != '') {
            if (hiddenId[i] == '') {
                db.query(`INSERT INTO EducationDetails (CandidateId,Bord, PassingYear, Percentage) VALUES ('${id}', '${board[i]}', '${year[i]}', '${percentage[i]}')`, (err) => {
                    if (err) throw err;
                });
            }
            else {
                db.query(`UPDATE EducationDetails SET Bord='${board[i]}', PassingYear='${year[i]}', Percentage='${percentage[i]}' where CandidateId=${id} AND id =${hiddenId[i]}`, (err) => {
                    if (err) throw err;
                });
            }
        }
    }
    /* END */

    /* update WorkExprience table */
    var Companyname = req.body.Companyname.split(',');
    var Designation = req.body.Designation.split(',');
    var dateFrom = req.body.dateFrom.split(',');
    var dateTo = req.body.dateTo.split(',');
    var WorkhiddenId = req.body.WorkhiddenId.split(',');
    for (i = 0; i < Companyname.length; i++) {
        if (Companyname[i] != '') {
            if (WorkhiddenId[i] == '') {
                db.query(`INSERT INTO exTask.WorkExprience (CandidateId, Companyname, Designation, StartDate, EndDate) VALUES ('${id}', '${Companyname[i]}', '${Designation[i]}', '${dateFrom[i]}', '${dateTo[i]}');`
                    , (err) => {
                        if (err) throw err;
                    });
            }
            else{

                db.query(`update WorkExprience set Companyname='${Companyname[i]}', Designation='${Designation[i]}', StartDate='${dateFrom[i]}', EndDate='${dateTo[i]}' where CandidateId=${id} and WorkId=${WorkhiddenId[i]}`
                , (err) => {
                    if (err) throw err;
                });
            }
        }
    }
    /* END*/
    /* update langauge table */
    var lang = req.body['Language[]'].split(',');
    var LanguageId = req.body.LanguageId.split(',');
    if (lang != undefined) {

        for (i = 0; i < lang.length; i++) {
            if (lang[i] != '') {
                let read = req.body[lang[i] + "_read"];
                let write = req.body[lang[i] + "_write"];
                let speak = req.body[lang[i] + "_speak"];
                if (read == undefined) {
                    read = 0;
                }
                if (write == undefined) {
                    write = 0;
                }
                if (speak == undefined) {
                    speak = 0;
                }
                db.query(`update LanguageTable set Languagename='${lang[i]}', LanguageRead='${read}', LanguageWrite='${write}', LanguageSpeak='${speak}' where LanguageId=${LanguageId[i]} `, (err) => {
                    if (err) throw err;
                });
            }

        }
    }
    /* END */
    /* update Techology table */
    var techno = req.body['Technoloy[]'].split(',');
    var TechnologieID = req.body.TechnologieID.split(',');
    if (techno != undefined) {
        for (i = 0; i < techno.length; i++) {
            if (techno[i] != '') {

                db.query(`update TechnologiesTable set TechnoloieName='${techno[i]}', KnowlageLevel='${req.body[techno[i]]}' where TechnologieID =${TechnologieID[i]}`, (err) => {
                    if (err) throw err;
                });

            }
        }
    }
    /* END */
    /* update refrace table */
    var refName = req.body.refName.split(',');
        var refPhone = req.body.refPhone.split(',');
        var refRelation = req.body.refRelation.split(',');
        var ReferanceId = req.body.ReferanceId.split(',');
    for (i = 0; i < refName.length; i++) {
        if (refName[i] != '') {
            db.query(`update ReferanceContact set Name='${refName[i]}', ContactNumber='${refPhone[i]}', Relation='${refRelation[i]}' where ReferanceId=${ReferanceId[i]}`
                , (err) => {
                    if (err) throw err;
                });

        }
    }
    /* END */
    /* prefrace table */
    db.query(`update Perferances set Location='${req.body.PreferLocation}', NoticePeriod='${req.body.PreferNotice}', ExpactedCTC='${req.body.PerferExCTC}', CurrentCTC='${req.body.PerferCuCTC}', Department='${req.body.Department}' where CandidateId=${id}`, (err) => {
        if (err) throw err;
    })
    res.end('Updated');
});
app.get('/db-Candidatemaster', (req, res) => {

    db.query(`select CandidateId as id,FirstName, LastName, Email, Phone from Candidatemaster`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});

/* task-12 job application with ajax ---END */


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`SERVER - http://localhost:${PORT}/`);
});