require("dotenv").config();
const mySql = require("mysql");
const fs = require("fs");
let validate = require("is-it-dash");

//sql queries
let SQL = {
  getSubjects: "SELECT * FROM subnamedb",
  updateSubCount: "",
  createTable:
    "CREATE TABLE game_hof_noteDino(id int AUTO_INCREMENT, date VARCHAR(255), score BIGINT,email VARCHAR(50), user_name VARCHAR(100),PRIMARY KEY (id))",
  alterTable: "ALTER TABLE app_users ADD imgUrl varchar(1000)",
  countAppUsers: "SELECT COUNT(*) FROM app_users;",
  getUsersByBatchAndDept:
    "SELECT * FROM `app_users` WHERE `batch` = 44 AND `dept` LIKE 'IPE' ORDER BY `batch` DESC",
};

//query generators
let handleCountIncrementQuery = subName => {
  return `UPDATE subnamedb SET count = count + 1 WHERE sub_name = "${subName}"`;
};

let handleCountIncrementQueryLabs = subName => {
  return `UPDATE labsdb SET count = count + 1 WHERE lab_name = "${subName}"`;
};

let handleMissedWordsEntryQuery = word => {
  return `INSERT INTO missed_words_table VALUES(DEFAULT, '${word}')`;
};

let handleNewUserInfoQuery = (
  email,
  uni_id,
  batch,
  dept,
  role,
  imgUrl = "false"
) => {
  return `INSERT INTO app_users VALUES(DEFAULT, '${email}', '${uni_id}', '${batch}', '${dept}', '${role}', '${imgUrl}')`;
};

let getAllThesisTransactions = () => {
  return `SELECT * FROM transactions_table_thesis`;
};

let getAllProducts = () => {
  return `SELECT * FROM products_thesis ORDER BY products_thesis.product_id DESC`;
};

let getProductsById = prodId => {
  return `SELECT * FROM products_thesis WHERE product_id = ${prodId}`;
};

let getCellInfo = cellId => {
  return `SELECT * FROM transactions_table_thesis WHERE cell_id = ${cellId}`;
};

let getProdCells = prodId => {
  return `SELECT * FROM transactions_table_thesis WHERE product_id = ${prodId}`;
};

let searchProducts = data => {
  let cleanObj = JSON.parse(JSON.stringify(data));

  const isLastkey = (key, obj) => {
    if (key === Object.keys(obj).slice(-1)[0]) {
      return true;
    } else {
      return false;
    }
  };
  return `SELECT * FROM products_thesis WHERE ${
    data?.name
      ? `name REGEXP '${data?.name}'${
          !isLastkey("name", cleanObj) ? "AND" : ""
        }`
      : ""
  } ${
    data?.color
      ? `color REGEXP '${data?.color}'${
          !isLastkey("color", cleanObj) ? "AND" : ""
        }`
      : ""
  } ${
    data?.type
      ? `type LIKE '${data?.type}'${!isLastkey("type", cleanObj) ? "AND" : ""}`
      : ""
  } ${
    data?.style
      ? `style REGEXP '${data?.style}'${
          !isLastkey("style", cleanObj) ? "AND" : ""
        }`
      : ""
  } ${
    data?.po
      ? `po LIKE '${data?.po}'${!isLastkey("po", cleanObj) ? "AND" : ""}`
      : ""
  }`;
};

let getThesisTransactionById = (transactionId = 1) => {
  return `SELECT * FROM transactions_table_thesis  WHERE transaction_id = ${transactionId}`;
};

let getRacksInfo = () => {
  return `SELECT * FROM single_rack_thesis`;
};

let insertNewThesisProduct = (
  name,
  color,
  type = "Raw Materials",
  style,
  total_qty,
  po,
  other_info = ""
) => {
  return `INSERT INTO products_thesis (product_id, name, color, type, total_qty, style, po, other_info) VALUES (NULL, '${name}', '${color}', '${type}', '${total_qty}', '${style}', '${po}', '${other_info}')`;
};

let insertNewThesisTransaction = (
  cell_id,
  product_id,
  qty,
  action_type = "add",
  timestamp = `${new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")}.000000`
) => {
  return `INSERT INTO transactions_table_thesis (transaction_id, cell_id, product_id, qty, action_type, timestamp) VALUES (NULL, ${cell_id}, ${product_id}, ${qty}, '${action_type}', '${timestamp}')`;
};

let handleErrorQuery = (date, log, os, email) => {
  return `INSERT INTO app_err_logs VALUES(DEFAULT, '${date}', '${log}', '${os}', '${email}')`;
};

let handleGameScore = (db_name, date, score, email, user_name) => {
  return `INSERT INTO ${db_name} VALUES(DEFAULT, '${date}', '${score}', '${email}', '${user_name}')`;
};

let getTopScoreFromTable = (db_name, limit) => {
  return `SELECT * FROM ${db_name} ORDER BY score DESC limit ${limit}`;
};

let getTopDataFromTable = (table, field, limit) => {
  return `SELECT * FROM ${table} ORDER BY ${field} DESC limit ${limit}`;
};

let showAllFromTable = tableName => {
  return `SELECT * FROM ${tableName}`;
};

let updateProductById = (id, data) => {
  let cleanObj = JSON.parse(JSON.stringify(data));

  const isLastkey = (key, obj) => {
    if (key === Object.keys(obj).slice(-1)[0]) {
      return true;
    } else {
      return false;
    }
  };

  return `UPDATE products_thesis SET ${
    cleanObj?.style
      ? `style = '${cleanObj?.style}'${
          !isLastkey("style", cleanObj) ? "," : ""
        }`
      : ""
  }${
    cleanObj?.total_qty
      ? `total_qty = '${cleanObj?.total_qty}'${
          !isLastkey("total_qty", cleanObj) ? "," : ""
        }`
      : ""
  }${
    cleanObj?.type
      ? `type = '${cleanObj?.type}'${!isLastkey("type", cleanObj) ? "," : ""}`
      : ""
  }${
    cleanObj?.color
      ? `color = '${cleanObj?.color}'${
          !isLastkey("color", cleanObj) ? "," : ""
        }`
      : ""
  }${
    cleanObj?.name
      ? `name = '${cleanObj?.name}'${!isLastkey("name", cleanObj) ? "," : ""}`
      : ""
  }${
    cleanObj?.po
      ? `po = '${cleanObj?.po}'${!isLastkey("po", cleanObj) ? "," : ""}`
      : ""
  }${
    cleanObj?.other_info
      ? `other_info = '${cleanObj?.other_info}'${
          !isLastkey("other_info", cleanObj) ? "," : ""
        }`
      : ""
  } WHERE products_thesis.product_id = ${id}`;
};

// let updateTransactionById = (id, data) => {
//   return `UPDATE transactions_table_thesis SET cell_id = '${
//     data?.cell_id
//   }',product_id = '${data?.product_id}', qty = '${data?.qty}', action_type = '${
//     data?.action_type
//   }', timestamp = '${new Date()
//     .toISOString()
//     .slice(0, 19)
//     .replace(
//       "T",
//       " "
//     )}.000000}' WHERE transactions_table_thesis.transaction_id = ${id}`;
// };

let updateTransactionById = (id, data) => {
  let cleanObj = JSON.parse(JSON.stringify(data));

  const isLastkey = (key, obj) => {
    if (key === Object.keys(obj).slice(-1)[0]) {
      return true;
    } else {
      return false;
    }
  };

  return `UPDATE transactions_table_thesis SET ${
    cleanObj?.cell_id
      ? `cell_id = '${cleanObj?.cell_id}'${
          !isLastkey("cell_id", cleanObj) ? "," : ""
        }`
      : ""
  }${
    cleanObj?.product_id
      ? `product_id = '${cleanObj?.product_id}'${
          !isLastkey("product_id", cleanObj) ? "," : ""
        }`
      : ""
  }${
    cleanObj?.qty
      ? `qty = '${cleanObj?.qty}'${!isLastkey("qty", cleanObj) ? "," : ""}`
      : ""
  }${
    cleanObj?.action_type
      ? `action_type = '${cleanObj?.action_type}'${
          !isLastkey("action_type", cleanObj) ? "," : ""
        }`
      : ""
  }${
    cleanObj?.timestamp
      ? `timestamp = '${cleanObj?.timestamp}'${
          !isLastkey("timestamp", cleanObj) ? "," : ""
        }`
      : ""
  } WHERE transactions_table_thesis.transaction_id = ${id}`;
};

let handleUserIncrementQuery = () => {
  return `UPDATE new_user SET user_count = user_count + 1 WHERE id = 1`;
};

let apiStatus = {
  endPoints: [
    "/",
    "/users",
    "/missed",
    "/notes",
    "/games/notebird",
    "/games/notedino",
  ],
  DB_Connection_Status: false,
  mode: "develop",
};

//API Intro Page
let apiIntro = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  return res.status(200).json(apiStatus);
};

//connecting to db
let dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASS,
  database: process.env.DB_NAME,
};

let db = mySql.createConnection(dbConfig);

db.connect(err => {
  if (err) {
    return console.error("🔴 Error occurred while connecting to DB");
  }
  apiStatus.DB_Connection_Status = true;
  console.log("🟢 Connected to DB");
});

//all
let noteSubjects = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(SQL.getSubjects, (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving note subjects");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      NoteSubjects: result, //returns all from subnamedb
    }); //this will return a json array
  });
};

//get rack info
let racksInfo = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(getRacksInfo(), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving racks");
      return res.status(500).json({ status: "🔴 Internal Server Error" });
    }
    console.log(`🟢 racks data fetching was successful`);
    return res.status(200).json({
      racks: result, //returns all from subnamedb
    }); //this will return a json array
  });
};

//get all transaction
let transactionsThesis = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(getAllThesisTransactions(), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving transactions");
      return res.status(500).json({ status: "🔴 Internal Server Error" });
    }
    console.log(`🟢 transactions data fetching was successful`);
    return res.status(200).json({
      transactions: result, //returns all from subnamedb
    }); //this will return a json array
  });
};

let transactionById = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ status: "bad request, no or invalid id" });
  }
  db.query(getThesisTransactionById(parseInt(id)), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving transaction");
      return res.status(500).json({ status: "🔴 Internal Server Error" });
    }
    console.log(`🟢 transaction data fetching was successful`);
    return res.status(200).json({
      transaction: result, //returns all from subnamedb
    }); //this will return a json array
  });
};

//get all products
let productsThesis = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(getAllProducts(), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving products");
      return res.status(500).json({ status: "🔴 Internal Server Error" });
    }
    console.log(`🟢 products data fetching was successful`);
    return res.status(200).json({
      products: result, //returns all from subnamedb
    }); //this will return a json array
  });
};

let productById = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ status: "bad request, missing id" });
  }
  db.query(getProductsById(parseInt(id)), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving product");
      return res.status(500).json({ status: "🔴 Internal Server Error" });
    }
    console.log(`🟢 product data fetching was successful`);
    return res.status(200).json({
      product: result, //returns all from subnamedb
    }); //this will return a json array
  });
};

let cellById = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ status: "bad request, missing id" });
  }
  db.query(getCellInfo(parseInt(id)), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving cell info");
      return res.status(500).json({ status: "🔴 Internal Server Error" });
    }
    console.log(`🟢 cell data fetching was successful`);
    return res.status(200).json({
      cellInfo: {
        cellId: id,
        transactions: result,
      }, //returns all from subnamedb
    }); //this will return a json array
  });
};

let findProdCells = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ status: "bad request, missing id" });
  }
  db.query(getProdCells(parseInt(id)), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving cell info");
      return res
        .status(500)
        .json({ status: "🔴 Internal Server Error", msg: err });
    }
    console.log(`🟢 prod data fetching was successful`);
    return res.status(200).json({
      availableIn: [...new Set(result?.map(cell => cell?.cell_id))], //[...new Set(result?.map(cell => cell?.cell_id))]
    }); //this will return a json array
  });
};

let productsSearch = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { name, color, type, style, po } = req.body;
  db.query(
    searchProducts({
      name: name ? name : undefined,
      color: color ? color : undefined,
      type: type ? type : undefined,
      style: style ? style : undefined,
      po: po ? po : undefined,
    }),
    (err, result) => {
      if (err) {
        console.log(err);
        console.error("🔴 Error while retrieving product");
        return res.status(500).json({ status: "🔴 Internal Server Error", err:  err});
      }
      console.log(`🟢 product data fetching was successful`);
      return res.status(200).json({
        products: result,
        sql: searchProducts({
          name: name ? name : undefined,
          color: color ? color : undefined,
          type: type ? type : undefined,
          style: style ? style : undefined,
          po: po ? po : undefined,
        }), //returns all from subnamedb
      }); //this will return a json array
    }
  );
};

let postTransaction = (req, res) => {
  console.log(req.body);
  let { cell_id, product_id, qty, action_type } = req.body;
  if (!cell_id) {
    return res.status(400).json({ status: "bad request, missing cell_id" });
  }
  if (!product_id) {
    return res.status(400).json({ status: "bad request, missing product_id" });
  }
  if (!qty) {
    return res.status(400).json({ status: "bad request, missing qty" });
  }
  if (!action_type) {
    return res.status(400).json({ status: "bad request, missing action_type" });
  }

  db.query(
    insertNewThesisTransaction(cell_id, product_id, qty, action_type),
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status: "🔴 Internal server error", msg: err });
      }
      console.log(`🟢 Transaction insertion was successful`);
      return res.status(200).json({
        transaction: result,
        status: "🟢 Transaction insertion was successful", //returns all from subnamedb
      }); //this will return a json array
    }
  );
};

let putTransaction = (req, res) => {
  console.log(req.body);
  let { id } = req.params;
  let { cell_id, product_id, qty, action_type } = req.body;
  if (!id) {
    return res.status(400).json({ status: "bad request, missing id" });
  }

  db.query(
    updateTransactionById(parseInt(id), {
      cell_id: cell_id ? cell_id : undefined,
      product_id: product_id ? product_id : undefined,
      qty: qty ? qty : undefined,
      action_type: action_type ? action_type : undefined,
      timestamp: `${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}.000000}`,
    }),
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status: "🔴 Internal server error", msg: err });
      }
      console.log(`🟢 Transaction update was successful`);
      return res.status(200).json({
        transaction: result,
        status: "🟢 Transaction update was successful", //returns all from subnamedb
      }); //this will return a json array
    }
  );
};

let postProductThesis = (req, res) => {
  console.log(req.body);
  let { name, color, type, style, total_qty, po, other_info } = req.body;
  if (!name) {
    return res.status(400).json({ status: "bad request, missing name" });
  }
  if (!color) {
    return res.status(400).json({ status: "bad request, missing color" });
  }
  if (!type) {
    return res.status(400).json({ status: "bad request, missing type" });
  }
  if (!style) {
    return res.status(400).json({ status: "bad request, missing style" });
  }
  if (!total_qty) {
    return res.status(400).json({ status: "bad request, missing total_qty" });
  }
  if (!po) {
    return res.status(400).json({ status: "bad request, missing po" });
  }

  db.query(
    insertNewThesisProduct(
      name,
      color,
      type,
      style,
      total_qty,
      po,
      other_info ? other_info : ""
    ),
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status: "🔴 Internal server error", msg: err });
      }
      console.log(`🟢 Product insertion was successful`);
      return res.status(200).json({
        product: result,
        status: "🟢 Product insertion was successful", //returns all from subnamedb
      }); //this will return a json array
    }
  );
};

let putProduct = (req, res) => {
  console.log(req.body);
  let { style, total_qty, type, color, name, po, other_info, id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ status: "bad request, missing or invalid id" });
  }

  db.query(
    updateProductById(parseInt(id), {
      style: style ? style : undefined,
      total_qty: total_qty ? total_qty : undefined,
      type: type ? type : undefined,
      color: color ? color : undefined,
      name: name ? name : undefined,
      po: po ? po : undefined,
      other_info: other_info ? other_info : undefined,
    }),
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status: "🔴 Internal server error", msg: err });
      }
      console.log(`🟢 Product update was successful`);
      return res.status(200).json({
        transaction: result,
        status: "🟢 Product update was successful", //returns all from subnamedb
      }); //this will return a json array
    }
  );
};

//notes top 5
let topNoteSubjects = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(getTopDataFromTable("subnamedb", "count", "5"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving top note subjects");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Top Note Subject Data fetching was successful`);
    return res.status(200).json({
      topNoteSubjects: result,
    }); //this will return a json array
  });
};

//all - lab
let labSubjects = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(showAllFromTable("labsdb"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving products");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Labs Data fetching was successful`);
    return res.status(200).json({
      LabSubjects: result, //returns all from labsdb
    }); //this will return a json array
  });
};

//labs top 5
let topLabSubjects = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  db.query(getTopDataFromTable("labsdb", "count", "5"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving top lab subjects");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Top Lab Subject Data fetching was successful`);
    return res.status(200).json({
      topLabSubjects: result,
    }); //this will return a json array
  });
};

//math1
let notesMath1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("math1"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//math2
let notesMath2 = (req, res) => {
  if (!req.query.adminKey) {
    return res.status(401).json({
      query: req.query,
      Error: "🔴 Unauthorized Access !",
    });
  } else if (req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      query: req.query,
      Error: "🔴 Invalid Key",
    });
  }

  db.query(handleCountIncrementQuery("math2"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//phy1
let notesPhy1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("phy1"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//phy2
let notesPhy2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("phy2"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//chem1
let notesChem1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("chem1"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//chem2
let notesChem2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("chem2"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//pse
let notesPse = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("pse"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//cp
let notesCp = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("cp"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ntf
let notesNtf = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("ntf"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//em
let notesEm = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("em"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//bce
let notesBce = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("em"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//am1
let notesAm1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("am1"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//am2
let notesAm2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("am2"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ym1
let notesYm1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("ym1"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ym2
let notesYm2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("ym2"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//fm1
let notesFm1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("fm1"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//fm2
let notesFm2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("fm2"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//wp1
let notesWp1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("wp1"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//wp2
let notesWp2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("wp2"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//stat
let notesStat = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("stat"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//feee
let notesFeee = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("feee"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//marketing
let notesMarket = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("marketing"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ttqc
let notesTtqc = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("ttqc"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//tp
let notesTp = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("tp"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//mp
let notesMp = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("mp"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//mmtf
let notesMmtf = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("mmtf"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//acm
let notesAcm = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("acm"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//tqm
let notesTqm = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("tqm"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//fsd
let notesFsd = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("fsd"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ace
let notesAce = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("ace"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//mic
let notesMic = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("mic"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//sss1
let notesSss1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("sss1"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//sss2
let notesSss2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("sss2"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//wpp
let notesWpp = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("wpp"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//econo
let notesEcono = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQuery("econo"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Subject Data fetching was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//missed
let missedWords = (req, res) => {
  db.query(showAllFromTable("missed_words_table"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching missed words");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching missed words" });
    }
    console.log(`🟢 Missed words fetching was successful`);
    return res.status(200).json({
      missed_words: result,
    }); //this will return a json array
  });
};

//post missed words function
let postMissedWords = (req, res) => {
  console.log(req.body);

  db.query(handleMissedWordsEntryQuery(req.body.word), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Word insertion was successful`);
    return res.status(200).json({
      word: req.body.word,
      status: "🟢 Word insertion was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//new user info insertion
let postNewAppUsersInfo = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  let imgUrl;

  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (
    !req.body ||
    !req.body.email ||
    !req.body.uni_id ||
    !req.body.batch ||
    !req.body.dept ||
    !req.body.role
  ) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  if (!req.body.imgUrl) {
    imgUrl = "not given";
  } else {
    imgUrl = req.body.imgUrl;
  }

  if (!validate.isEmail(req.body.email)) {
    return res.status(400).json({ status: "🔴 Bad Request, Invalid Email" });
  }

  let { email, uni_id, batch, dept, role } = req.body;

  db.query(
    handleNewUserInfoQuery(email, uni_id, batch, dept, role, imgUrl),
    (err, result) => {
      if (err) {
        console.log(err);
        console.error("🔴 Error while inserting new user info");
        return res
          .status(500)
          .json({ status: "🔴 Operation was unsuccessful!" });
      }
      console.log(req.body);
      console.log(`🟢 New user info insertion was successful`);
      return res.status(200).json({
        user: {
          email: email,
          uni_id: uni_id,
          batch: batch,
          dept: dept,
          role: role,
        },
        status: "🟢 New user info insertion was successful", //returns all from subnamedb
      }); //this will return a json array
    }
  );
};

//users
let getAllUsers = (req, res) => {
  db.query(showAllFromTable("new_user"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching all users");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching all users" });
    }
    console.log(`🟢 All users fetching was successful`);
    return res.status(200).json({
      users: result,
    }); //this will return a json array
  });
};

//users
let getAppUserCount = (req, res) => {
  db.query(SQL.countAppUsers, (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching app user count");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching app user count" });
    }
    console.log(`🟢 All users fetching was successful`);
    return res.status(200).json({
      app_users_count: result[0],
    }); //this will return a json array
  });
};

let getAppUsersInfo = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }
  db.query(showAllFromTable("app_users"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching app users");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching app users" });
    }
    console.log(`🟢 All users fetching was successful`);
    return res.status(200).json({
      app_users: result,
    }); //this will return a json array
  });
};

//user filtering - email
let getAppUsersByEmail = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.email) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  let { email } = req.body;

  let searchSQL = `SELECT * FROM app_users WHERE email LIKE '${email}'`;

  db.query(searchSQL, (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching app users");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching app users" });
    }
    console.log(`🟢 All users fetching was successful`);
    return res.status(200).json({
      searched_users: result,
    }); //this will return a json array
  });
};

//user filtering - id
let getAppUsersById = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.id) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  let { id } = req.body;

  let searchSQL = `SELECT * FROM app_users WHERE uni_id LIKE '${id}'`;

  db.query(searchSQL, (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching app users");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching app users" });
    }
    console.log(`🟢 All users fetching was successful`);
    return res.status(200).json({
      searched_users: result,
    }); //this will return a json array
  });
};

//user filtering - dept
let getAppUsersByDept = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.dept) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  let { dept } = req.body;

  let searchSQL = `SELECT * FROM app_users WHERE dept LIKE '${dept}'`;

  db.query(searchSQL, (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching app users");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching app users" });
    }
    console.log(`🟢 All users fetching was successful`);
    return res.status(200).json({
      searched_users: result,
    }); //this will return a json array
  });
};

//user filtering - batch
let getAppUsersByBatch = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.batch) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  let { batch } = req.body;

  let searchSQL = `SELECT * FROM app_users WHERE batch LIKE '${batch}'`;

  db.query(searchSQL, (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching app users");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching app users" });
    }
    console.log(`🟢 All users fetching was successful`);
    return res.status(200).json({
      searched_users: result,
    }); //this will return a json array
  });
};

//user filtering - batch & dept
let getAppUsersByDeptAndBatch = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.dept || !req.body.batch) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  let { batch, dept } = req.body;

  let searchSQL = `SELECT * FROM app_users WHERE batch = ${batch} AND dept LIKE '${dept}' ORDER BY batch DESC `;

  db.query(searchSQL, (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching app users");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching app users" });
    }
    console.log(`🟢Filtered users fetching was successful`);
    return res.status(200).json({
      searched_users: result,
    }); //this will return a json array
  });
};

let incrementUserCount = (req, res) => {
  db.query(handleUserIncrementQuery(), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while incrementing user count");
      return res
        .status(500)
        .json({ status: "🔴 Error while incrementing user count" });
    }
    console.log(`🟢 Incrementing user count was successful`);
    return res.status(200).json({
      status: "🟢 Incrementing user count was successful",
    }); //this will return a json array
  });
};

//err logging
let postNewErrors = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.email || !req.body.log || !req.body.os) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  if (!validate.isEmail(req.body.email)) {
    return res.status(400).json({ status: "🔴 Bad Request, Invalid Email" });
  }

  let { date, log, os, email } = req.body;

  db.query(handleErrorQuery(date, log, os, email), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while posting error");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(req.body);
    console.log(`🟢 New err log insertion was successful`);
    return res.status(200).json({
      errorInfo: {
        date: date,
        email: email,
        os: os,
        log: log,
      },
      status: "🟢 New Error log insertion was successful",
    }); //this will return a json array
  });
};

//show error logs
let getErrorLogs = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }
  db.query(showAllFromTable("app_err_logs"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while retrieving logs");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Logs Data fetching was successful`);
    return res.status(200).json({
      errorLogs: result,
    }); //this will return a json array
  });
};

//errors by email
let getErrorsByEmail = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.email) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  let { email } = req.body;

  let searchSQL = `SELECT * FROM app_err_logs WHERE email LIKE '${email}'`;

  db.query(searchSQL, (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching logs by email");
      return res
        .status(500)
        .json({ status: "🔴 Error while fetching logs by email" });
    }
    console.log(`🟢 Logs fetching was successful`);
    return res.status(200).json({
      searched_logs: result,
    }); //this will return a json array
  });
};

//game data posting (notebird)
let postNoteBirdScore = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.email || !req.body.score || !req.body.date) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  if (!validate.isEmail(req.body.email)) {
    return res.status(400).json({ status: "🔴 Bad Request, Invalid Email" });
  }

  let { date, score, email, user_name } = req.body;

  db.query(
    handleGameScore("game_hof", date, score, email, user_name),
    (err, result) => {
      if (err) {
        console.log(err);
        console.error("🔴 Error while posting game score");
        return res
          .status(500)
          .json({ status: "🔴 Operation was unsuccessful!" });
      }
      console.log(req.body);
      console.log(`🟢 Game score insertion was successful`);
      return res.status(200).json({
        gameScoreInfo: {
          date: date,
          email: email,
          user_name: user_name,
          score: score,
        },
        status: "🟢 Game score insertion insertion was successful",
      }); //this will return a json array
    }
  );
};

//game data getting(notebird)
let getNoteBirdHof = (req, res) => {
  db.query(getTopScoreFromTable("game_hof", 10), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching hof");
      return res.status(500).json({ status: "🔴 Error while fetching hof" });
    }
    console.log(`🟢 HoF fetching was successful`);
    return res.status(200).json({
      hof: result,
    }); //this will return a json array
  });
};

//game data posting (notedino)
let postNoteDinoScores = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  if (!req.body || !req.body.email || !req.body.score || !req.body.date) {
    console.log(req.body);
    return res.status(400).json({ status: "🔴 Bad Request" });
  }

  if (!validate.isEmail(req.body.email)) {
    return res.status(400).json({ status: "🔴 Bad Request, Invalid Email" });
  }

  let { date, score, email, user_name } = req.body;

  db.query(
    handleGameScore("game_hof_noteDino", date, score, email, user_name),
    (err, result) => {
      if (err) {
        console.log(err);
        console.error("🔴 Error while posting game score");
        return res.status(500).json({
          status: "🔴 Operation was unsuccessful!",
        });
      }
      console.log(req.body);
      console.log(`🟢 Game score insertion was successful`);
      return res.status(200).json({
        gameScoreInfo: {
          date: date,
          email: email,
          user_name: user_name,
          score: score,
        },
        status: "🟢 Game score insertion insertion was successful",
      }); //this will return a json array
    }
  );
};

//game data getting(notedino)
let getNoteDinoHof = (req, res) => {
  db.query(getTopScoreFromTable("game_hof_noteDino", 10), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while fetching hof");
      return res.status(500).json({ status: "🔴 Error while fetching hof" });
    }
    console.log(`🟢 HoF fetching was successful`);
    return res.status(200).json({
      hof: result,
    }); //this will return a json array
  });
};

//labs
//phy1
let labsPhy1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("phy1Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//phy2
let labsPhy2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("phy2Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//chem1
let labsChem1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("chem1Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//chem2
let labsChem2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("chem2Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//cp
let labsCP = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("cpLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//msp
let labsMsp = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("mspLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//am1
let labsAm1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("am1Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//am2
let labsAm2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("am2Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ym1
let labsYm1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("ym1Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ym2
let labsYm2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("ym2Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//wp1
let labsWp1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("wp1Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//wp2
let labsWp2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("wp2Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//fm1
let labsFm1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("fm1Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//fm2
let labsFm2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("fm2Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//feee
let labsFeee = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("feeeLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//fme
let labsFme = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("fmeLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ttqc
let labsTtqc = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("ttqcLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ap1
let labsAp1 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("ap1Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//ap2
let labsAp2 = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("ap2Lab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//mp
let labsMp = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("mpLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//bce
let labsBce = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("bceLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//fsd
let labsFsd = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("fsdLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//lss
let labsLss = (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== process.env.AUTH_KEY) {
    return res.status(401).json({
      Error: "🔴 Unauthorized Access !",
    });
  }

  db.query(handleCountIncrementQueryLabs("lssLab"), (err, result) => {
    if (err) {
      console.log(err);
      console.error("🔴 Error while updating count");
      return res.status(500).json({ status: "🔴 Operation was unsuccessful!" });
    }
    console.log(`🟢 Incrementing count was successful`);
    return res.status(200).json({
      status: "🟢 Operation was successful", //returns all from subnamedb
    }); //this will return a json array
  });
};

//404 Route
let notFound = (req, res) => {
  return res.status(404).json({
    Error: `404 Not Found`,
    "Valid Endpoints": apiStatus.endPoints,
  });
};

module.exports = {
  apiStatus: apiStatus,
  apiIntro: apiIntro,

  noteSubjects: noteSubjects,
  topNoteSubjects: topNoteSubjects,

  notesMath1: notesMath1,
  notesMath2: notesMath2,
  notesPhy1: notesPhy1,
  notesPhy2: notesPhy2,
  notesChem1: notesChem1,
  notesChem2: notesChem2,
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
  //top labs
  topLabSubjects: topLabSubjects,
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
  //get all app users info
  getAppUsersInfo: getAppUsersInfo,
  //user filtering
  getAppUsersByEmail: getAppUsersByEmail,
  getAppUsersById: getAppUsersById,
  getAppUsersByDept: getAppUsersByDept,
  getAppUsersByBatch: getAppUsersByBatch,
  getAppUsersByDeptAndBatch: getAppUsersByDeptAndBatch,

  //game score posting
  postNoteBirdScore: postNoteBirdScore,
  getNoteBirdHof: getNoteBirdHof,

  postNoteDinoScores: postNoteDinoScores,
  getNoteDinoHof: getNoteDinoHof,

  //err logging
  postNewErrors: postNewErrors,
  getErrorLogs: getErrorLogs,
  getErrorsByEmail: getErrorsByEmail,

  //app user count
  getAppUserCount: getAppUserCount,

  //thesis
  postTransaction: postTransaction,
  transactionsThesis: transactionsThesis,
  racksInfo: racksInfo,
  transactionById: transactionById,
  productsThesis: productsThesis,
  productById: productById,
  productsSearch: productsSearch,
  postProductThesis: postProductThesis,
  putProduct: putProduct,
  putTransaction: putTransaction,
  cellById: cellById,
  findProdCells: findProdCells,

  //404
  notFound: notFound,
};
