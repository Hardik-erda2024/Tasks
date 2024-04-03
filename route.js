const express = require('express');
const router = express.Router();
const passport = require('passport');

const { strategy } = require('./app/controller/mainTask/passport');
passport.use(strategy);

const {getRegister,postRegister,getAccountActivationCode,postAccountActivationCode,getLogin,postlogin,getTaskList} = require('./app/controller/mainTask/controller');
const {getTask1,getTask2,getTask3,getTask4,getTask5,getTask6,getTask6Id, getTask7Id, getTask7, getTask8, getTask9, postTask9} = require('./app/controller/Task1-9/controller');
const { getTask10, postTask10Id, postTask10 } = require('./app/controller/Task10/controller');
const {getCandidatemaster,getEducationDetails,getLanguageTable,getPerferances,getReferanceTable,getTechnologiesTable,getWorkExprience} = require('./app/controller/Task10/dbController');

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
router.get('/db-Candidatemaster/:id',getCandidatemaster);
router.get('/db-EducationDetails/:id',getEducationDetails);
router.get('/db-WorkExprience/:id',getWorkExprience);
router.get('/db-LanguageTable/:id',getLanguageTable);
router.get('/db-TechnologiesTable/:id',getTechnologiesTable);
router.get('/db-ReferanceContact/:id',getReferanceTable);
router.get('/db-Perferances/:id',getPerferances);

module.exports = router;