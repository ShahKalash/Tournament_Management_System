import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import queryString from "query-string";

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

    console.log(req.query);
    let bflag = false;
    if (req.query) {
        bflag = req.query.dup_flag;
    }

    console.log("true or not");
    console.log(bflag);
    console.log("end");

    try {
        const temp = await db.query(
            "SELECT * FROM USER_TYPE;"
        );

        let result = temp.rows;
        // console.log(result);
        // , 'bflag': bool_flag
        res.render('index.ejs', { 'result': result, 'bflag': bflag });
    }
    catch (e) {
        console.log(e);
    }
});

app.get('/form-player', async (req, res) => {
    res.render('form-player.ejs');
});
app.get('/form-tournament', async (req, res) => {
    res.render('form-tournament.ejs');
});
// app.get("/:first", async (req, res) => {

//     let bool_flag = req.params.dup_flag;
//     console.log(req.params);

//     try
//     {
//     const temp = await db.query(
//         "SELECT * FROM USER_TYPE;"
//     );

//     let result = temp.rows;
//     // console.log(result);

//     res.render('index.ejs', { 'result': result, 'bflag': bool_flag});
//     }
//     catch(e)
//     {
//         console.log(e);
//     }
// });

app.post("/add", async (req, res) => {
    let input = req.body["user_type"];
    input = input.toUpperCase();

    let temp = await db.query(
        "SELECT * FROM USER_TYPE WHERE UPPER(UT_DESC) LIKE '%" + input + "%';"
    );

    console.log("a");
    let result = temp.rows;
    console.log("b");
    console.log(result.length);
    console.log("a");

    if (result.length > 0) {
        const query = queryString.stringify({
            "dup_flag": true
        });
        res.redirect('/?' + query);
    }
    else {
        try {
            await db.query(
                "INSERT INTO USER_TYPE (ut_desc) VALUES($1)",
                [input]
            );
            res.redirect("/");
        } catch (err) {
            console.log(err);
        }
    }
    // console.log(input);


});

app.post("/edit", async (req, res) => {
    let u_id = req.body.user_id;

    // console.log(u_id);

    let temp = await db.query("SELECT * FROM USER_TYPE WHERE UT_ID = $1", [u_id]);
    let result = temp.rows;

    res.render("update.ejs", { 'result': result });

});

app.post("/update", async (req, res) => {
    const id = req.body.user_id;
    let u_type = req.body.user_type;

    // console.log(id);
    // console.log(u_type);
    u_type = u_type.toUpperCase();
    try {
        await db.query(
            "UPDATE USER_TYPE SET UT_DESC = ($1) WHERE UT_ID = $2",
            [u_type, id]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }

});

app.post("/delete", async (req, res) => {
    const id = req.body.user_id;

    // console.log(id);
    try {
        await db.query(
            "DELETE FROM USER_TYPE WHERE UT_ID = $1",
            [id]
        );
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }

});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});





