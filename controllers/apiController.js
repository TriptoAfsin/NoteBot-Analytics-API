require("dotenv").config();
const mySql = require('mysql')
const fs = require('fs')
let validate = require('is-it-dash')

//sql queries
let SQL = {
    getSubjects: "SELECT * FROM subnamedb",
    updateSubCount: "",
    createTable: "CREATE TABLE game_hof(id int AUTO_INCREMENT, date VARCHAR(255), score BIGINT,email VARCHAR(30),PRIMARY KEY (id))",
    alterTable: "ALTER TABLE app_users ADD role varchar(255)"
}

//query generators
let handleCountIncrementQuery = (subName) => {
    return `UPDATE subnamedb SET count = count + 1 WHERE sub_name = "${subName}"`
}

let handleCountIncrementQueryLabs = (subName) => {
    return `UPDATE labsdb SET count = count + 1 WHERE lab_name = "${subName}"`
}

let handleMissedWordsEntryQuery = (word) => {
    return `INSERT INTO missed_words_table VALUES(DEFAULT, '${word}')`
}

let handleNewUserInfoQuery = (email, uni_id, batch, dept, role) => {
    return `INSERT INTO app_users VALUES(DEFAULT, '${email}', '${uni_id}', '${batch}', '${dept}', '${role}')`
}

let handleErrorQuery = (date, log, os, email) => {
    return `INSERT INTO app_err_logs VALUES(DEFAULT, '${date}', '${log}', '${os}', '${email}')`
}

let handleGameScore = (date, score, email, user_name) => {
    return `INSERT INTO game_hof VALUES(DEFAULT, '${date}', '${score}', '${email}', '${user_name}')`
}


let getTopNoteBirdScore = (limit) => {
    return `SELECT * FROM game_hof ORDER BY score DESC limit ${limit}`
}

let showAllFromTable = (tableName) => {
    return `SELECT * FROM ${tableName}`
}

let handleUserIncrementQuery = () => {
    return `UPDATE new_user SET user_count = user_count + 1 WHERE id = 1`
}


let apiStatus = {
    endPoints: [
        "/",
        "/users",
        "/missed",
        "/notes",
        "/games/notebird"
      ],
    DB_Connection_Status: false
}

//API Intro Page
let apiIntro = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    return res.status(200).json(apiStatus);
}

//connecting to db
let dbConfig = {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASS,
    database: process.env.DB_NAME
}

let db = mySql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        return console.error("🔴 Error occurred while connecting to DB")
    }
    apiStatus.DB_Connection_Status = true
    console.log("🟢 Connected to DB")
});


//all
let noteSubjects = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    db.query(SQL.getSubjects,(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while retrieving note subjects")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                NoteSubjects: result, //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//all - lab
let labSubjects = (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    db.query(showAllFromTable("labsdb"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while retrieving products")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Labs Data fetching was successful`)
        return res.status(200).json(
            {
                NoteSubjects: result, //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//math1
let notesMath1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("math1"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}


//math2
let notesMath2 = (req, res) => {
    if(!req.query.adminKey){
        return res.status(401).json(
            {
                "query": req.query,
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    else if(req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "query": req.query,
                "Error": "🔴 Invalid Key"
            }
        ) 
    }
    

    db.query(handleCountIncrementQuery("math2"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//phy1
let notesPhy1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("phy1"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//phy2
let notesPhy2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("phy2"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}


//chem1
let notesChem1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("chem1"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//chem2
let notesChem2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("chem2"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//pse
let notesPse = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("pse"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//cp
let notesCp = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("cp"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ntf
let notesNtf = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("ntf"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//em
let notesEm = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("em"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//bce
let notesBce = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("em"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//am1
let notesAm1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("am1"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}


//am2
let notesAm2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("am2"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ym1
let notesYm1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("ym1"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ym2
let notesYm2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("ym2"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//fm1
let notesFm1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("fm1"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//fm2
let notesFm2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("fm2"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//wp1
let notesWp1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("wp1"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//wp2
let notesWp2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("wp2"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//stat
let notesStat = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("stat"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//feee
let notesFeee = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("feee"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//marketing
let notesMarket = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("marketing"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ttqc
let notesTtqc = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("ttqc"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//tp
let notesTp = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("tp"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}


//mp
let notesMp = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("mp"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//mmtf
let notesMmtf = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("mmtf"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//acm
let notesAcm = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("acm"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//tqm
let notesTqm = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("tqm"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//fsd
let notesFsd = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("fsd"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ace
let notesAce = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("ace"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//mic
let notesMic = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("mic"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//sss1
let notesSss1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("sss1"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//sss2
let notesSss2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("sss2"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//wpp
let notesWpp = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("wpp"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//econo
let notesEcono = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQuery("econo"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//missed
let missedWords = (req, res) => {
    db.query(showAllFromTable("missed_words_table"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while fetching missed words")
            return res.status(500).json({status: "🔴 Error while fetching missed words"})
        }
        console.log(`🟢 Missed words fetching was successful`)
        return res.status(200).json(
            {
                missed_words: result, 
            }
        ); //this will return a json array
    })
}

//post missed words function
let postMissedWords = (req, res) => {
    console.log(req.body)

    db.query(handleMissedWordsEntryQuery(req.body.word),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Word insertion was successful`)
        return res.status(200).json(
            {
                word: req.body.word,
                status: "🟢 Word insertion was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//new user info insertion
let postNewAppUsersInfo = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    if(!req.body || !req.body.email || !req.body.uni_id || !req.body.batch || !req.body.dept || !req.body.role){
        console.log(req.body)
        return res.status(400).json({status: "🔴 Bad Request"})
    }

    if(!validate.isEmail(req.body.email)){
        return res.status(400).json({status: "🔴 Bad Request, Invalid Email"})
    }

    let {email, uni_id, batch, dept, role} = req.body

    db.query(handleNewUserInfoQuery(email, uni_id, batch, dept, role),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while inserting new user info")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(req.body)
        console.log(`🟢 New user info insertion was successful`)
        return res.status(200).json(
            {
                user: {
                    email: email,
                    uni_id: uni_id,
                    batch: batch,
                    dept: dept,
                    role: role
                },
                status: "🟢 New user info insertion was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//users
let getAllUsers = (req, res) => {
    db.query(showAllFromTable("new_user"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while fetching all users")
            return res.status(500).json({status: "🔴 Error while fetching all users"})
        }
        console.log(`🟢 All users fetching was successful`)
        return res.status(200).json(
            {
                users: result, 
            }
        ); //this will return a json array
    })
}

let incrementUserCount = (req, res) => {
    db.query(handleUserIncrementQuery(),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while incrementing user count")
            return res.status(500).json({status: "🔴 Error while incrementing user count"})
        }
        console.log(`🟢 Incrementing user count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Incrementing user count was successful", 
            }
        ); //this will return a json array
    })
}


//err logging
let postNewErrors = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    if(!req.body || !req.body.email || !req.body.log || !req.body.os){
        console.log(req.body)
        return res.status(400).json({status: "🔴 Bad Request"})
    }

    if(!validate.isEmail(req.body.email)){
        return res.status(400).json({status: "🔴 Bad Request, Invalid Email"})
    }

    let {date, log, os, email} = req.body

    db.query(handleErrorQuery(date, log, os, email),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while posting error")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(req.body)
        console.log(`🟢 New err log insertion was successful`)
        return res.status(200).json(
            {
                errorInfo: {
                    date: date,
                    email: email,
                    os: os,
                    log: log
                },
                status: "🟢 New Error log insertion was successful", 
            }
        ); //this will return a json array
    })
}

//game data posting 
let postNoteBirdScore = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    if(!req.body || !req.body.email || !req.body.score || !req.body.date){
        console.log(req.body)
        return res.status(400).json({status: "🔴 Bad Request"})
    }

    if(!validate.isEmail(req.body.email)){
        return res.status(400).json({status: "🔴 Bad Request, Invalid Email"})
    }

    let {date, score, email, user_name} = req.body

    db.query(handleGameScore(date, score, email, user_name),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while posting game score")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(req.body)
        console.log(`🟢 Game score insertion was successful`)
        return res.status(200).json(
            {
                gameScoreInfo: {
                    date: date,
                    email: email,
                    user_name: user_name,
                    score: score,
                },
                status: "🟢 Game score insertion insertion was successful", 
            }
        ); //this will return a json array
    })
}

//game data getting
let getNoteBirdHof = (req, res) => {
    db.query(getTopNoteBirdScore(10),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while fetching hof")
            return res.status(500).json({status: "🔴 Error while fetching hof"})
        }
        console.log(`🟢 HoF fetching was successful`)
        return res.status(200).json(
            {
                hof: result, 
            }
        ); //this will return a json array
    })
}




//labs
//phy1
let labsPhy1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("phy1Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//phy2
let labsPhy2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("phy2Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//chem1
let labsChem1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("chem1Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//chem2
let labsChem2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("chem2Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//cp
let labsCP = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("cpLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//msp
let labsMsp = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("mspLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//am1
let labsAm1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("am1Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//am2
let labsAm2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("am2Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ym1
let labsYm1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("ym1Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ym2
let labsYm2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("ym2Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}


//wp1
let labsWp1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("wp1Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//wp2
let labsWp2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("wp2Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//fm1
let labsFm1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("fm1Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//fm2
let labsFm2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("fm2Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//feee
let labsFeee = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("feeeLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//fme
let labsFme = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("fmeLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ttqc
let labsTtqc = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("ttqcLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ap1
let labsAp1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("ap1Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//ap2
let labsAp2 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("ap2Lab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//mp
let labsMp = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("mpLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//bce
let labsBce = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("bceLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//fsd
let labsFsd = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("fsdLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//lss
let labsLss = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
            }
        ) 
    }

    db.query(handleCountIncrementQueryLabs("lssLab"),(err, result)=> {
        if(err){
            console.log(err)
            console.error("🔴 Error while updating count")
            return res.status(500).json({status: "🔴 Operation was unsuccessful!"})
        }
        console.log(`🟢 Incrementing count was successful`)
        return res.status(200).json(
            {
                status: "🟢 Operation was successful", //returns all from subnamedb
            }
        ); //this will return a json array
    })
}



//404 Route
let notFound = (req, res) => {
    return res.status(404).json(
        {
            "Error": `404 Not Found`,
            "Valid Endpoints": apiStatus.endPoints  
        }
    ) 
}


module.exports = {
    apiStatus: apiStatus,
    apiIntro: apiIntro,

    noteSubjects: noteSubjects,
    notesMath1: notesMath1,
    notesMath2: notesMath2,
    notesPhy1: notesPhy1,
    notesPhy2: notesPhy2,
    notesChem1: notesChem1,
    notesChem2 : notesChem2,
    notesPse: notesPse,
    notesCp: notesCp,
    notesNtf: notesNtf,
    notesEm: notesEm,
    notesBce: notesBce,

    notesAm1: notesAm1,
    notesAm2: notesAm2,
    notesYm1: notesYm1,
    notesYm2: notesYm2,
    notesFm1: notesFm1,
    notesFm2: notesFm2,
    notesWp1: notesWp1,
    notesWp2: notesWp2,
    notesStat: notesStat,
    notesFeee: notesFeee,
    notesMarket: notesMarket,
    notesTtqc: notesTtqc,
    notesTp: notesTp,
    notesMp: notesMp,
    notesMmtf: notesMmtf,

    notesAcm: notesAcm,
    notesTqm: notesTqm,
    notesFsd: notesFsd,
    notesAce: notesAce,
    notesMic: notesMic,
    notesSss1: notesSss1,
    notesSss2: notesSss2,
    notesWpp: notesWpp,
    notesEcono: notesEcono,

    missedWords: missedWords,
    postMissedWords: postMissedWords,

    getAllUsers: getAllUsers,
    incrementUserCount: incrementUserCount,

    //labs
    labSubjects: labSubjects,
    labsPhy1: labsPhy1,
    labsPhy2: labsPhy2,
    labsChem1: labsChem1,
    labsChem2: labsChem2,
    labsCP: labsCP,
    labsMsp: labsMsp,
    labsBce: labsBce,
    
    labsAm1: labsAm1,
    labsAm2: labsAm2,
    labsYm1: labsYm1,
    labsYm2: labsYm2,
    labsWp1: labsWp1,
    labsWp2: labsWp2,
    labsFm1: labsFm1,
    labsFm2: labsFm2,
    labsFeee: labsFeee,
    labsFme: labsFme,
    labsTtqc: labsTtqc,
    labsAp1: labsAp1,
    labsAp2: labsAp2,
    labsMp: labsMp,
    labsFsd: labsFsd,
    labsLss: labsLss,

    //new user info
    postNewAppUsersInfo: postNewAppUsersInfo,

    //game score posting
    postNoteBirdScore: postNoteBirdScore,
    getNoteBirdHof: getNoteBirdHof,


    //err logging
    postNewErrors: postNewErrors,



    //404
    notFound: notFound,
}