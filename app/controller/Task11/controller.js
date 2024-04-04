const db = require('../../../connection');

const getResultParm = (req,res)=>{
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
        res.render('Pages/Task11-ResultTable',{'row':row,'col':col,'maxPage':maxPage,'id':page,'colName':colName});
    });
    
}

const getResult = (req,res)=>{
    res.redirect('/result/StudentId/1')
}

const getResultTableParm = (req,res)=>{
    var id = req.params.id;
    db.query(`select s.StudentId,s.FirstName,s.LastName,sb.SubjectId,sb.SubjectName,e.ExamId,e.ExamName,r.ObtainMarksTheory,r.ObtainMarksPractical,(r.ObtainMarksTheory + r.ObtainMarksPractical) as Total from StudentMaster as s  inner join Result as r on s.StudentId = r.StudentId  inner join Task3.SubjectMaster as sb on r.SubjectId = sb.SubjectId inner join Task3.ExamMaster as e on e.ExamId = r.ExamId
     where s.StudentId = ${id};`,(err,row)=>{
        if(err) throw err;
        res.render('Pages/ResultTableId',{"row":row});
     });
}

const getResultTable = (req,res)=>{
    res.redirect('/resultTable/1');
}

module.exports = {getResultParm,getResult,getResultTableParm,getResultTable}