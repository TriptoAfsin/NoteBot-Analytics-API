require("dotenv").config();
const mySql = require('mysql')
const fs = require('fs')

//sql queries
let SQL = {
    getSubjects: "SELECT * FROM subnamedb",
    updateSubCount: ""
}

//query generators
let handleCountIncrementQuery = (subName) => {
    return `UPDATE subnamedb SET count = count + 1 WHERE sub_name = "${subName}"`
}


let apiStatus = {
    endPoints: [
        "/",
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
            console.error("🔴 Error while retrieving products")
        }
        console.log(`🟢 Subject Data fetching was successful`)
        return res.status(200).json(
            {
                NoteSubjects: result, //returns all from subnamedb
            }
        ); //this will return a json array
    })
}

//math1
let notesMath1 = (req, res) => {

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
        return res.status(401).json(
            {
                "Error": "🔴 Unauthorized Access !"
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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

    if(!req.query.adminKey || req.query.adminKey !== process.env.ADMIN_KEY){
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



    //404
    notFound: notFound,
}