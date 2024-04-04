const express = require('express');
const router = express.Router();
const passport = require('passport');

const { strategy } = require('./app/controller/mainTask/passport');
passport.use(strategy);

const {getRegister,postRegister,getAccountActivationCode,postAccountActivationCode,getLogin,postlogin,getTaskList} = require('./app/controller/mainTask/controller');
const {getTask1,getTask2,getTask3,getTask4,getTask5,getTask6,getTask6Id, getTask7Id, getTask7, getTask8, getTask9, postTask9} = require('./app/controller/Task1-9/controller');
const { getTask10, postTask10Id, postTask10 } = require('./app/controller/Task10/controller');
const {getCandidatemaster,getEducationDetails,getLanguageTable,getPerferances,getReferanceTable,getTechnologiesTable,getWorkExprience, getCandidatemasterAll} = require('./app/controller/Task10/dbController');
const {getResult,getResultParm,getResultTable,getResultTableParm} = require('./app/controller/Task11/controller');
const {getDisplay,getDisplayRedirect,getTask12Add,getUpdateParm,postTask12,postUpdateParm} = require('./app/controller/Task12/controller');
const { getHtmlTask1, getHtmlTask2, getHtmlTask3 } = require('./app/controller/htmlTask/controller');

router.get('/',getRegister);
router.post('/',postRegister);
router.get('/AccountActivation/:code',getAccountActivationCode);
router.post('/AccountActivation/:code',postAccountActivationCode);
router.get('/login',getLogin);
router.post('/login',postlogin);
router.get('/taskList',passport.authenticate('jwt', { session: false }),getTaskList);
router.get('/task1',passport.authenticate('jwt', { session: false }),getTask1);
router.get('/task2',passport.authenticate('jwt', { session: false }),getTask2);
router.get('/task3',passport.authenticate('jwt', { session: false }),getTask3);
router.get('/task4',passport.authenticate('jwt', { session: false }),getTask4);
router.get('/task5',passport.authenticate('jwt', { session: false }),getTask5);
router.get('/task6',passport.authenticate('jwt', { session: false }),getTask6);
router.get('/task6/:id',passport.authenticate('jwt', { session: false }),getTask6Id);
router.get('/task7',passport.authenticate('jwt', { session: false }),getTask7);
router.get('/task7/:col/:id',passport.authenticate('jwt', { session: false }),getTask7Id);
router.get('/task8/:id/:search',passport.authenticate('jwt', { session: false }),getTask8);
router.get('/task9',passport.authenticate('jwt', { session: false }),getTask9);
router.post('/task9',passport.authenticate('jwt', { session: false }),postTask9);
router.get('/task10',passport.authenticate('jwt', { session: false }),getTask10);
router.get('/task10/:id',passport.authenticate('jwt', { session: false }),getTask10);
router.post('/task10/:id',passport.authenticate('jwt', { session: false }),postTask10Id);
router.post('/task10',passport.authenticate('jwt', { session: false }),postTask10);
router.get('/db-Candidatemaster/:id',passport.authenticate('jwt',{session:false}),getCandidatemaster);
router.get('/db-Candidatemaster',passport.authenticate('jwt',{session:false}),getCandidatemasterAll);
router.get('/db-EducationDetails/:id',passport.authenticate('jwt',{session:false}),getEducationDetails);
router.get('/db-WorkExprience/:id',passport.authenticate('jwt',{session:false}),getWorkExprience);
router.get('/db-LanguageTable/:id',passport.authenticate('jwt',{session:false}),getLanguageTable);
router.get('/db-TechnologiesTable/:id',passport.authenticate('jwt',{session:false}),getTechnologiesTable);
router.get('/db-ReferanceContact/:id',passport.authenticate('jwt',{session:false}),getReferanceTable);
router.get('/db-Perferances/:id',passport.authenticate('jwt',{session:false}),getPerferances);
router.get('/resultTable',passport.authenticate('jwt',{session:false}),getResultTable);
router.get('/resultTable/:id',passport.authenticate('jwt',{session:false}),getResultTableParm);
router.get('/result',passport.authenticate('jwt',{session:false}),getResult);
router.get('/result/:colName/:page',passport.authenticate('jwt',{session:false}),getResultParm);
router.get('/Task12',passport.authenticate('jwt',{session:false}),getDisplayRedirect);
router.get('/Task12/add',passport.authenticate('jwt',{session:false}),getTask12Add);
router.post('/Task12',passport.authenticate('jwt',{session:false}),postTask12);
router.get('/Task12/display',passport.authenticate('jwt',{session:false}),getDisplay);
router.get('/Task12/update/:id',passport.authenticate('jwt',{session:false}),getUpdateParm);
router.post('/Task12/update/:id',passport.authenticate('jwt',{session:false}),postUpdateParm);
router.get('/htmlTask1',passport.authenticate('jwt',{session:false}),getHtmlTask1);
router.get('/htmlTask2',passport.authenticate('jwt',{session:false}),getHtmlTask2);
router.get('/htmlTask3',passport.authenticate('jwt',{session:false}),getHtmlTask3);

module.exports = router;