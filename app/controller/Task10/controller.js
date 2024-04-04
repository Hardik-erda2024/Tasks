const db = require('../../../connection');

const getTask10 = (req, res) => {
    res.render('Pages/Task10-CRUD');
};

const postTask10Id = (req, res) => {
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
}

const postTask10 = (req, res) => {

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
}

module.exports = {getTask10,postTask10,postTask10Id}