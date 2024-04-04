const getHtmlTask1 = (req,res)=>{
    res.render('Pages/htmlTask1');
} 
const getHtmlTask2 = (req,res)=>{
    res.render('Pages/htmlTask2');
}
const getHtmlTask3 = (req,res)=>{
    res.render('Pages/htmlTask3');
}
module.exports = {getHtmlTask1,getHtmlTask2,getHtmlTask3}