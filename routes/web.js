const express = require('express');

const apiController = require('../controllers/apiController');

//body parser
var bodyParser = require('body-parser')

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// create application/json parser
var jsonParser = bodyParser.json()



let router = express.Router();

let initWebRoutes = (app) => {

    //get routes
    router.get("/", apiController.apiIntro);

    //all notes
    router.get("/notes", apiController.noteSubjects);
    //math1
    router.get("/notes/math1", apiController.notesMath1);
    //math2
    router.get("/notes/math2", apiController.notesMath2);
    //phy1
    router.get("/notes/phy1", apiController.notesPhy1);
    //phy2
    router.get("/notes/phy2", apiController.notesPhy2);
    //chem1
    router.get("/notes/chem1", apiController.notesChem1);
    //chem2
    router.get("/notes/chem2", apiController.notesChem2);
    //pse
    router.get("/notes/pse", apiController.notesPse);
    //cp
    router.get("/notes/cp", apiController.notesCp);
    //ntf
    router.get("/notes/ntf", apiController.notesNtf);
    //bce
    router.get("/notes/bce", apiController.notesBce);
    //em
    router.get("/notes/em", apiController.notesEm);
    //am1
    router.get("/notes/am1", apiController.notesAm1);
    //am2
    router.get("/notes/am2", apiController.notesAm2);
    //ym1
    router.get("/notes/ym1", apiController.notesYm1);
    //ym2
    router.get("/notes/ym2", apiController.notesYm2);
    //fm1
    router.get("/notes/fm1", apiController.notesFm1);
    //fm2
    router.get("/notes/fm2", apiController.notesFm2);
    //wp1
    router.get("/notes/wp1", apiController.notesWp1);
    //wp2
    router.get("/notes/wp2", apiController.notesWp2);
    //stat
    router.get("/notes/stat", apiController.notesStat);
    //market
    router.get("/notes/market", apiController.notesMarket);
    //feee
    router.get("/notes/feee", apiController.notesFeee);
    //ttqc
    router.get("/notes/ttqc", apiController.notesTtqc);
    //tp
    router.get("/notes/tp", apiController.notesTp);
    //mp
    router.get("/notes/mp", apiController.notesMp);
    //mmtf
    router.get("/notes/mmtf", apiController.notesMmtf);

    //acm
    router.get("/notes/acm", apiController.notesAcm);
    //tqm
    router.get("/notes/tqm", apiController.notesTqm);
    //fsd
    router.get("/notes/fsd", apiController.notesFsd);
    //ace
    router.get("/notes/ace", apiController.notesAce);
    //mic
    router.get("/notes/mic", apiController.notesMic);
    //sss1
    router.get("/notes/sss1", apiController.notesSss1);
    //sss2
    router.get("/notes/sss2", apiController.notesSss2);
    //wpp
    router.get("/notes/wpp", apiController.notesWpp);
    //econo
    router.get("/notes/econo", apiController.notesEcono);
    

    //missed_words
    router.get("/missed", apiController.missedWords);
    router.post("/missed",jsonParser,apiController.postMissedWords);


    //users
    router.get("/users", apiController.getAllUsers);
    //users
    router.post("/users", apiController.incrementUserCount);

    //404 route
    router.get("*", apiController.notFound);

    return app.use("/", router);
}


module.exports = initWebRoutes;