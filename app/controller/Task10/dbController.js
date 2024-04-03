const db = require('../../../connection');
const getCandidatemaster = (req, res) => {
    let id = req.params.id
    db.query(`select FirstName, LastName, Designation as bd_Designation, Adddress1 as Address1 , Address2, City, State, ZipCode, Email, Phone, Gender,RelationshipStatus as RelationStatus,DateOfBirth as DOB from Candidatemaster where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
}

const getEducationDetails = (req, res) => {
    let id = req.params.id
    db.query(`select id as hiddenId, Bord as bord,PassingYear as year,Percentage as percentage from EducationDetails where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
}

const getWorkExprience = (req, res) => {
    let id = req.params.id
    db.query(`select WorkId as WorkhiddenId,Companyname,Designation,StartDate as dateFrom,EndDate as dateTo from WorkExprience where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
}

const getLanguageTable = (req, res) => {
    let id = req.params.id
    db.query(`select LanguageId,Languagename as Language,LanguageRead,LanguageWrite,LanguageSpeak from LanguageTable where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
}

const getTechnologiesTable = (req, res) => {
    let id = req.params.id
    db.query(`select TechnologieID,TechnoloieName,KnowlageLevel from TechnologiesTable where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
}

const getReferanceTable = (req, res) => {
    let id = req.params.id
    db.query(`select ReferanceId,Name as refName, ContactNumber as refPhone, Relation as refRelation from ReferanceContact where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
}

const getPerferances = (req, res) => {
    let id = req.params.id
    db.query(`select Location as PreferLocation, NoticePeriod as PreferNotice, Department, ExpactedCTC as PerferExCTC, CurrentCTC as PerferCuCTC  from Perferances where CandidateId=${id};`, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
}

module.exports = {getCandidatemaster,getEducationDetails,getWorkExprience,getLanguageTable,getTechnologiesTable,getReferanceTable,getPerferances}