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
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,[req.body.FirstName,req.body.LastName,req.body.bd_Designation,req.body.Address1,req.body.Address2,req.body.City,req.body.State,req.body.ZipCode,req.body.Email,req.body.Phone,req.body.Gender, req.body.RelationStatus,req.body.DOB],
                (err, result) => {
                    if (err) return reject(err);
                    return resolve(result.insertId);
                });
        });
    }
    async function sequentialQueries() {
        const id = await idPromise();
        /* insert into Education table - START */
        let board = req.body.bord.split(',');
        let year = req.body.year.split(',');
        let percentage = req.body.percentage.split(',');
        for (i = 0; i < board.length; i++) {

            if (board[i] != '') {
                db.query(`INSERT INTO EducationDetails (CandidateId,Bord, PassingYear, Percentage) VALUES (?,?,?,?)`,[id, board[i], year[i], percentage[i]], (err) => {
                    if (err) throw err;
                });
            }
        }
        /* insert into Education table - START */

        /* insert into workExprience table - START */
        let Companyname = req.body.Companyname.split(',');
        for (i = 0; i < Companyname.length; i++) {
            let Designation = req.body.Designation.split(',');
            let dateFrom = req.body.dateFrom.split(',');
            let dateTo = req.body.dateTo.split(',');
            if (Companyname[i] != '') {

                db.query(`INSERT INTO exTask.WorkExprience (CandidateId, Companyname, Designation, StartDate, EndDate) VALUES (?,?,?,?,?);`,[id, Companyname[i], Designation[i], dateFrom[i], dateTo[i]]
                    , (err) => {
                        if (err) throw err;
                    });

            }
        }
        /* insert into workExprience table - END */


        /* insert into ReferanceContact table - START */
        let refName = req.body.refName.split(',');
        let refPhone = req.body.refPhone.split(',');
        let refRelation = req.body.refRelation.split(',');
        for (i = 0; i < refName.length; i++) {
            if (refName[i] != '') {
                db.query(`INSERT INTO ReferanceContact (CandidateId, Name, ContactNumber, Relation) VALUES (?,?,?,?);`,[id, refName[i], refPhone[i], refRelation[i]]
                    , (err) => {
                        if (err) throw err;
                    });

            }
        }
        /* insert into ReferanceContact table - END */

        /* insert into Perferances table - START */

        if (req.body.PreferLocation != '') {
            db.query(`INSERT INTO Perferances (CandidateId, Location, NoticePeriod, ExpactedCTC, CurrentCTC, Department) VALUES (?,?,?,?,?,?);`,[id, req.body.PreferLocation, req.body.PreferNotice,req.body.PerferExCTC,req.body.PerferCuCTC, req.body.Department]
                , (err) => {
                    if (err) throw err;
                });

        }

        /* insert into Perferances table - END */

        /* insert into LanguageTable  - START */
        if (req.body['Language[]'] != undefined) {
            let lang = req.body['Language[]'].split(',');
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
                        VALUES (?,?,?,?,?);`,[id, lang[i],read, write, speak], (err) => {
                        if (err) throw err;
                    });
                }

            }
        }
        /* insert into LanguageTable  - END */

        /* insert into TechnologiesTable  - START */
        if (req.body['Technoloy[]'] != undefined) {
            let techno = req.body['Technoloy[]'].split(',');
            for (i = 0; i < techno.length; i++) {
                if (techno[i] != '') {

                    db.query(`INSERT INTO TechnologiesTable (CandidateId, TechnoloieName, KnowlageLevel)
                VALUES (?,?,?);`,[id, techno[i],req.body[techno[i]]], (err) => {
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
    
    db.query(`update Candidatemaster set FirstName = ?,LastName = ?,Designation=?,Adddress1=?,Address2=?,City=?,State=?,ZipCode=?,Email=?,Phone=?,Gender=?,RelationshipStatus=?,DateOfBirth=? where CandidateId=?`,[req.body.FirstName,req.body.LastName,req.body.bd_Designation,req.body.Address1,req.body.Address2,req.body.City,req.body.State,req.body.ZipCode,req.body.Email,req.body.Phone,req.body.Gender,req.body.RelationStatus,req.body.DOB,id], (err) => {
        if (err) throw err;
    })
    /* update education table - Start*/
    let board = req.body.bord.split(',');
        let year = req.body.year.split(',');
        let percentage = req.body.percentage.split(',');
        let hiddenId =req.body.hiddenId.split(',');
    for (i = 0; i < board.length; i++) {
        if (board[i] != '') {
            if (hiddenId[i] == '') {
                db.query(`INSERT INTO EducationDetails (CandidateId,Bord, PassingYear, Percentage) VALUES (?,?,?,?)`,[id, board[i], year[i], percentage[i]], (err) => {
                    if (err) throw err;
                });
            }
            else {
                db.query(`UPDATE EducationDetails SET Bord=?, PassingYear=?, Percentage=? where CandidateId=? AND id =?`
                ,[board[i],year[i],percentage[i],id,hiddenId[i]], (err) => {
                    if (err) throw err;
                });
            }
        }
    }
    /* END */

    /* update WorkExprience table */
    let Companyname = req.body.Companyname.split(',');
    let Designation = req.body.Designation.split(',');
    let dateFrom = req.body.dateFrom.split(',');
    let dateTo = req.body.dateTo.split(',');
    let WorkhiddenId = req.body.WorkhiddenId.split(',');
    for (i = 0; i < Companyname.length; i++) {
        if (Companyname[i] != '') {
            if (WorkhiddenId[i] == '') {
                db.query(`INSERT INTO exTask.WorkExprience (CandidateId, Companyname, Designation, StartDate, EndDate) VALUES (?,?,?,?,?);`,[id, Companyname[i], Designation[i], dateFrom[i], dateTo[i]]
                    , (err) => {
                        if (err) throw err;
                    });
            }
            else{

                db.query(`update WorkExprience set Companyname=?, Designation=?, StartDate=?, EndDate=? where CandidateId=? and WorkId=?`
                ,[Companyname[i],Designation[i],dateFrom[i],dateTo[i],id,WorkhiddenId[i]], (err) => {
                    if (err) throw err;
                });
            }
        }
    }
    /* END*/
    /* update langauge table */
    let lang = req.body['Language[]'].split(',');
    let LanguageId = req.body.LanguageId.split(',');
    console.log(lang,LanguageId);
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
                
                if(LanguageId[i] != ''){
                    db.query(`update LanguageTable set Languagename=?, LanguageRead=?, LanguageWrite=?, LanguageSpeak=? where LanguageId=? `
                    ,[lang[i],read,write,speak,LanguageId[i]], (err) => {
                        if (err) throw err;
                    });
                }
                else{
                    db.query(`INSERT INTO LanguageTable (CandidateId, Languagename, LanguageRead, LanguageWrite, LanguageSpeak)
                    VALUES (?,?,?,?,?);`,[id, lang[i],read, write, speak], (err) => {
                    if (err) throw err;
                });
                }
            }

        }
    }
    /* END */
    /* update Techology table */
    let techno = req.body['Technoloy[]'].split(',');
    let TechnologieID = req.body.TechnologieID.split(',');
    if (techno != undefined) {
        for (i = 0; i < TechnologieID.length; i++) {
            

                if (techno[i] != '') {
                    
                    if(TechnologieID[i] != ''){
                        
                        db.query(`update TechnologiesTable set TechnoloieName=?, KnowlageLevel=? where TechnologieID =?`
                        ,[techno[i],req.body[techno[i]],TechnologieID[i]], (err) => {
                            if (err) throw err;
                        });
                    }
                    else if(techno[i] != undefined){
                        db.query(`INSERT INTO TechnologiesTable (CandidateId, TechnoloieName, KnowlageLevel)
                        VALUES (?,?,?);`,[id,techno[i],req.body[techno[i]]], (err) => {
                            if (err) throw err;
                        });
                    }
                }

            
        }
    }
    /* END */
    /* update refrace table */
    let refName = req.body.refName.split(',');
        let refPhone = req.body.refPhone.split(',');
        let refRelation = req.body.refRelation.split(',');
        let ReferanceId = req.body.ReferanceId.split(',');
        
    for (i = 0; i < refName.length; i++) {
        
        if (refName[i] != '') {
            if(ReferanceId[i] != ''){

                db.query(`update ReferanceContact set Name=?, ContactNumber=?, Relation=? where ReferanceId=?`
                ,[refName[i],refPhone[i],refRelation[i],ReferanceId[i]], (err) => {
                    if (err) throw err;
                });
            }
            else if(refName[i] != undefined){
                db.query(`INSERT INTO ReferanceContact (CandidateId, Name, ContactNumber, Relation) VALUES (?,?,?,?);`,[id, refName[i], refPhone[i], refRelation[i]]
                , (err) => {
                    if (err) throw err;
                });
            }

        }
    }
    /* END */
    /* prefrace table */
    if(req.body.PreferNotice != ''){
        db.query(`update Perferances set Location=?, NoticePeriod=?, ExpactedCTC=?, CurrentCTC=?, Department=? where CandidateId=?`
        ,[req.body.PreferLocation,req.body.PreferNotice,req.body.PerferExCTC,req.body.PerferCuCTC,req.body.Department,id], (err) => {
            if (err) throw err;
        })
    }
    res.end('Updated');
}


module.exports = {getDisplay,getDisplayRedirect,getUpdateParm,getTask12Add,postTask12,postUpdateParm}