const db = require('../../../connection');

const getDisplayRedirect =(req, res) => {
    res.redirect('/Task12/display');
}

const  getTask12Add =(req, res) => {
    res.render('Pages/Task12-CRUDwithAjax');
}

const postTask12 = (req, res) => {
    
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
}

const getDisplay =(req, res) => {
    res.render('Pages/display');
}

const getUpdateParm = (req, res) => {
    res.render('Pages/Task12-CRUDwithAjax');
}

const postUpdateParm = (req, res) => {
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

        for (i = 0; i < LanguageId.length; i++) {
            if(LanguageId[i] != ''){
                if(lang[i] == ''){
                    db.query(`DELETE FROM LanguageTable WHERE LanguageId=${LanguageId[i]}`,(err)=>{
                        if(err) throw err;
                    });
                }
            }
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
                
                if(LanguageId[i] != ''){
                    db.query(`update LanguageTable set Languagename='${lang[i]}', LanguageRead='${read}', LanguageWrite='${write}', LanguageSpeak='${speak}' where LanguageId=${LanguageId[i]} `, (err) => {
                        if (err) throw err;
                    });
                }
                else{
                    db.query(`INSERT INTO LanguageTable (CandidateId, Languagename, LanguageRead, LanguageWrite, LanguageSpeak)
                    VALUES ('${id}', '${lang[i]}','${read}', '${write}', '${speak}');`, (err) => {
                    if (err) throw err;
                });
                }
            }

        }
    }
    /* END */
    /* update Techology table */
    var techno = req.body['Technoloy[]'].split(',');
    var TechnologieID = req.body.TechnologieID.split(',');
    if (techno != undefined) {
        for (i = 0; i < TechnologieID.length; i++) {
            if(TechnologieID[i] != ''){
                if(techno[i] == undefined){
                    db.query(`DELETE FROM TechnologiesTable WHERE TechnologieID =${TechnologieID[i]}`,(err)=>{
                        if(err) throw err;
                    });
                }
            }
            else{

                if (techno[i] != '') {
                    
                    if(TechnologieID[i] != ''){
                        
                        db.query(`update TechnologiesTable set TechnoloieName='${techno[i]}', KnowlageLevel='${req.body[techno[i]]}' where TechnologieID =${TechnologieID[i]}`, (err) => {
                            if (err) throw err;
                        });
                    }
                    else if(techno[i] != undefined){
                        db.query(`INSERT INTO TechnologiesTable (CandidateId, TechnoloieName, KnowlageLevel)
                        VALUES ('${id}', '${techno[i]}','${req.body[techno[i]]}');`, (err) => {
                            if (err) throw err;
                        });
                    }
                }

            }
        }
    }
    /* END */
    /* update refrace table */
    var refName = req.body.refName.split(',');
        var refPhone = req.body.refPhone.split(',');
        var refRelation = req.body.refRelation.split(',');
        var ReferanceId = req.body.ReferanceId.split(',');
        
    for (i = 0; i < ReferanceId.length; i++) {
        
        if(ReferanceId[i] != ''){
            if(refName[i] == ''){
                db.query(`DELETE FROM TechnologiesTable WHERE TechnologieID =${TechnologieID[i]}`,(err)=>{
                    if(err) throw err;
                });
            }
        }
        if (refName[i] != '') {
            if(ReferanceId[i] != ''){

                db.query(`update ReferanceContact set Name='${refName[i]}', ContactNumber='${refPhone[i]}', Relation='${refRelation[i]}' where ReferanceId=${ReferanceId[i]}`
                , (err) => {
                    if (err) throw err;
                });
            }
            else if(refName[i] != undefined){
                db.query(`INSERT INTO ReferanceContact (CandidateId, Name, ContactNumber, Relation) VALUES ('${id}', '${refName[i]}', '${refPhone[i]}', '${refRelation[i]}');`
                , (err) => {
                    if (err) throw err;
                });
            }

        }
    }
    /* END */
    /* prefrace table */
    if(req.body.PreferNotice != ''){
        db.query(`update Perferances set Location='${req.body.PreferLocation}', NoticePeriod='${req.body.PreferNotice}', ExpactedCTC='${req.body.PerferExCTC}', CurrentCTC='${req.body.PerferCuCTC}', Department='${req.body.Department}' where CandidateId=${id}`, (err) => {
            if (err) throw err;
        })
    }
    res.end('Updated');
}


module.exports = {getDisplay,getDisplayRedirect,getUpdateParm,getTask12Add,postTask12,postUpdateParm}