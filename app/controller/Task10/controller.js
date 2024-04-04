const db = require('../../../connection');

const getTask10 = (req, res) => {
    res.render('Pages/Task10-CRUD');
};

const postTask10Id = (req, res) => {
    let id = req.params.id;
    db.query(`update Candidatemaster set FirstName = ?,LastName = ?,Designation=?,Adddress1=?,Address2=?,City=?,State=?,ZipCode=?,Email=?,Phone=?,Gender=?,RelationshipStatus=?,DateOfBirth=? where CandidateId=?`
    ,[req.body.FirstName,req.body.LastName,req.body.bd_Designation,req.body.Address1,req.body.Address2,req.body.City,req.body.State,req.body.ZipCode,req.body.Email,req.body.Phone,req.body.Gender,req.body.RelationStatus,req.body.DOB,id], (err) => {
        if (err) throw err;
    })
    /* update education table - Start*/
        
        for (i = 0; i < req.body.bord.length; i++) {
            if (req.body.bord[i] != '') {
                if(req.body.hiddenId[i] == ''){
                    db.query(`INSERT INTO EducationDetails (CandidateId,Bord, PassingYear, Percentage) VALUES (?,?,?,?)`,[id, req.body.bord[i], req.body.year[i], req.body.percentage[i]], (err) => {
                        if (err) throw err;
                    });
                }
                else{
                    db.query(`UPDATE EducationDetails SET Bord=?, PassingYear=?, Percentage=? where CandidateId=? AND id =?`,[req.body.bord[i],req.body.year[i],req.body.percentage[i],id,req.body.hiddenId[i]], (err) => {
                        if (err) throw err;
                    });
                }
            }
        }
    /* END */

    /* update WorkExprience table */

    for (i = 0; i < req.body.Companyname.length; i++) {
        if (req.body.Companyname[i] != '') {
            if(req.body.WorkhiddenId[i] == ''){
                db.query(`INSERT INTO exTask.WorkExprience (CandidateId, Companyname, Designation, StartDate, EndDate) VALUES (?,?,?,?,?);`
                ,[id, req.body.Companyname[i], req.body.Designation[i], req.body.dateFrom[i], req.body.dateTo[i]]
                    , (err) => {
                        if (err) throw err;
                    });
            }
            db.query(`update WorkExprience set Companyname=?, Designation=?, StartDate=?, EndDate=? where CandidateId=? and WorkId=?`
            ,[req.body.Companyname[i],req.body.Designation[i],req.body.dateFrom[i],req.body.dateTo[i],id,req.body.WorkhiddenId[i]]
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
                db.query(`update LanguageTable set Languagename=?, LanguageRead=?, LanguageWrite=?, LanguageSpeak=? where LanguageId=? `
                ,[req.body.Language[i],read,write,speak,req.body.LanguageId[i]], (err) => {
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

                db.query(`update TechnologiesTable set TechnoloieName=?, KnowlageLevel=? where TechnologieID =?`,[req.body.Technoloy[i],req.body[req.body.Technoloy[i]],req.body.TechnologieID[i]], (err) => {
                    if (err) throw err;
                });

            }
        }
    }
    /* END */
    /* update refrace table */
    for (i = 0; i < req.body.refName.length; i++) {
        if (req.body.refName[i] != '') {
            db.query(`update ReferanceContact set Name=?, ContactNumber=?, Relation=? where ReferanceId=?`
            ,[req.body.refName[i],req.body.refPhone[i],req.body.refRelation[i],req.body.ReferanceId[i]]
                , (err) => {
                    if (err) throw err;
                });

        }
    }
    /* END */
    /* prefrace table */
    db.query(`update Perferances set Location=?, NoticePeriod=?, ExpactedCTC=?, CurrentCTC=?, Department=? where CandidateId=?`
    ,[req.body.PreferLocation,req.body.PreferNotice,req.body.PerferExCTC,req.body.PerferCuCTC,req.body.Department,id], (err) => {
        if (err) throw err;
    })
    res.end('Updated');
}

const postTask10 = (req, res) => {

    idPromise = () => {
        return new Promise((resolve, reject) => {


            db.query(`INSERT INTO Candidatemaster (FirstName, LastName, Designation, Adddress1, Address2, City, State, ZipCode, Email, Phone, Gender, RelationshipStatus, DateOfBirth) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`,[req.body.FirstName, req.body.LastName, req.body.bd_Designation, req.body.Address1, req.body.Address2, req.body.City, req.body.State, req.body.ZipCode, req.body.Email, req.body.Phone, req.body.Gender, req.body.RelationStatus,req.body.DOB],
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
                db.query(`INSERT INTO EducationDetails (CandidateId,Bord, PassingYear, Percentage) VALUES (?,?,?,?)`,[id, req.body.bord[i], req.body.year[i], req.body.percentage[i]], (err) => {
                    if (err) throw err;
                });
            }
        }
        /* insert into Education table - START */

        /* insert into workExprience table - START */
        for (i = 0; i < req.body.Companyname.length; i++) {
            if (req.body.Companyname[i] != '') {
                
                db.query(`INSERT INTO exTask.WorkExprience (CandidateId, Companyname, Designation, StartDate, EndDate) VALUES (?,?,?,?,?);`,[id, req.body.Companyname[i], req.body.Designation[i], req.body.dateFrom[i], req.body.dateTo[i]]
                    , (err) => {
                        if (err) throw err;
                    });

            }
        }
        /* insert into workExprience table - END */


        /* insert into ReferanceContact table - START */
        for (i = 0; i < req.body.refName.length; i++) {
            if (req.body.refName[i] != '') {
                db.query(`INSERT INTO ReferanceContact (CandidateId, Name, ContactNumber, Relation) VALUES (?,?,?,?);`,[id, req.body.refName[i], req.body.refPhone[i], req.body.refRelation[i]]
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
                        VALUES (?,?,?,?,?);`,[id, req.body.Language[i],read, write, speak], (err) => {
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
                VALUES (?,?,?);`,[id, req.body.Technoloy[i],req.body[req.body.Technoloy[i]]], (err) => {
                        if (err) throw err;
                    });

                }
            }
        }
        /* insert into TechnologiesTable  - END */

        res.end('inserted');
    }
    sequentialQueries();
}

module.exports = {getTask10,postTask10,postTask10Id}