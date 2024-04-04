const db = require('../../../connection');
const getTask1 =(req,res)=>{
    res.render('Pages/Task1-dynemicTable');
}

const getTask2 =(req,res)=>{
    res.render('Pages/Task2-eventTable');
}

const getTask3 =(req,res)=>{
    res.render('Pages/Task3-KukuCube');
}
const getTask4 =(req,res)=>{
    res.render('Pages/Task4-TicTacToe');
}
const getTask5 =(req,res)=>{
    db.query('select * from StudentMaster order by StudentId  limit 0,10;',(err,row,fields)=>{
        if(err) throw err;
        var col = []
        for(i in fields)
        {
            col.push(fields[i].name);
        }
        res.render('Pages/Task5-Grid',{'row':row,'col':col});
    });
}

const getTask6 =(req,res)=>{
    res.redirect('/Task6/1');
}

const getTask6Id = (req,res)=>{
    var id = req.params.id;
    var numRow = 4;
    var maxPage;
    var currentPage = (id-1) * numRow;
    db.query('select count(StudentId)as sid from StudentMaster',(err,count)=>{
        if(err) throw err;
        maxPage = count[0].sid / numRow;
    });
    db.query('select * from StudentMaster LIMIT ?,?;',[currentPage,numRow],(err,row,fields)=>{
        if(err) throw err;
        var col = [];
        for(i in fields)
        {
            col.push(fields[i].name);
        }
        res.render('Pages/Task6-Pagination',{'id':id,'maxPage':maxPage,'row':row,'col':col});
    });
    
}

const getTask7 = (req,res)=>{
    res.redirect('/Task7/StudentId/1');
};

const getTask7Id =(req,res)=>{ 
    var colName = req.params.col;
    var id = req.params.id;
    var numRow = 4;
    var maxPage = 2;
    var currentPage = (id-1) * numRow;
    
    db.query('select count(StudentId)as sid from StudentMaster',(err,count)=>{
        if(err) throw err;
        maxPage = count[0].sid / numRow;
    });
    db.query('select * from StudentMaster order by ? LIMIT ?,?;',[colName,currentPage,numRow],(err,row,fields)=>{
        if(err) throw err;
        var col = [];
    for(i in fields){
        col.push(fields[i].name);
    }
    res.render('Pages/Task7-Sorting',{'id':id,'maxPage':maxPage,'row':row,'col':col,'colName':colName});
    });
}

const getTask8 = (req,res)=>{
    var id = req.params.id;
    var search = req.params.search.split(',');
    var numRow = 4;
    var maxPage = 2;
    var currentPage = (id-1) * numRow;
    
    if(search[0] == "s_id"){
        maxPage = 1
         
        db.query(`select * from StudentMaster where StudentId = ? LIMIT ?,?`,[search[1],currentPage,numRow],(err,row,fields)=>{
            if(err) throw err;
            var col = [];
        for(i in fields){
            col.push(fields[i].name);
        }
        res.render('Pages/Task8-Searching',{'id':id,'maxPage':maxPage,'row':row,'col':col,'search':search});
        });
    }
    else{
        db.query(`select count(StudentId)as sid from StudentMaster where case when (? = '') then (StudentMaster.FirstName like '') else (StudentMaster.FirstName like '?%') end ? case when (? = '') then (LastName like '') else (LastName like '?%') end ? case when (? = '') then (City like '') else (City like '?%') end`
        ,[search[0],search[0],search[1],search[2],search[2],search[1],search[3],search[3]],(err,count)=>{
            if(err) throw err;
            maxPage = Math.ceil( count[0].sid / numRow);
        });
        db.query(`select * from StudentMaster where case when (? = '') then (StudentMaster.FirstName like '') else (StudentMaster.FirstName like '?%') end ? case when (? = '') then (LastName like '') else (LastName like '?%') end ? case when (? = '') then (City like '') else (City like '?%') end LIMIT ?,?`
        ,[search[0],search[0],search[1],search[2],search[2],search[1],search[3],search[3],currentPage,numRow],(err,row,fields)=>{
            if(err) throw err;
            var col = [];
        for(i in fields){
            col.push(fields[i].name);
        }
        res.render('Pages/Task8-Searching',{'id':id,'maxPage':maxPage,'row':row,'col':col,'search':search});
        });
    }
}

const getTask9 = (req, res) => {
    res.render('Pages/Task9-SearchingWithDelimeter');
};

const postTask9 = (req, res) => {
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
    
    db.query(q, (err, row, fields) => {

        if (err) throw err;
        col = [];
        for (i in fields) {
            col.push(fields[i].name);
        }
        res.render('Pages/Task9-SearchingWithDelimeter', { 'row': row, 'col': col });
    });

}

module.exports = {getTask1,getTask2,getTask3,getTask4,getTask5,getTask6,getTask6Id,getTask7,getTask7Id,getTask8,getTask9,postTask9}