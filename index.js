import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "TOURNAMENT_MANAGEMENT",
    password: "Kalash@2911",
    port: 5432,
});

try {
    db.connect();
}
catch (e) {
    console.log(e.tostring());
};

console.log(db.state);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {

    const temp = await db.query(
        "SELECT * FROM USER_TYPE1;"
    );

    let result = temp.rows;

    console.log(result);

    res.render('index.ejs', { 'result': result });
});

// app.post("/add", async (req, res) => {
//     let input = req.body["user_type"];
//     input = input.toUpperCase();
//     // console.log(input);
//     try {
//         await db.query(
//             "INSERT INTO USER_TYPE (ut_desc) VALUES($1)",
//             [input]
//         );
//         res.redirect("/");
//     } catch (err) {
//         console.log(err);
//     }

// });

// app.post("/edit", async (req, res) => {
//     let u_id = req.body.user_id;

//     console.log(u_id);

//     let temp = await db.query("SELECT * FROM USER_TYPE WHERE UT_ID = $1", [u_id]);
//     let result = temp.rows;

//     res.render("update.ejs", { 'result': result });

// });

// app.post("/update", async (req, res) => {
//     const id = req.body.user_id;
//     const u_type = req.body.user_type;

//     console.log(id);
//     console.log(u_type);
//     try {
//         await db.query(
//             "UPDATE USER_TYPE SET UT_DESC = ($1) WHERE UT_ID = $2",
//             [u_type, id]
//         );
//         res.redirect("/");
//     } catch (err) {
//         console.log(err);
//     }

// });

// app.post("/delete", async (req, res) => {
//     const id = req.body.user_id;

//     console.log(id);
//     try {
//         await db.query(
//             "DELETE FROM USER_TYPE WHERE UT_ID = $1",
//             [id]
//         );
//         res.redirect("/");
//     } catch (err) {
//         console.log(err);
//     }

// });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});





