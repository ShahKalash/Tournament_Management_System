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
    password: "12345",
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

        const tournament_data = await db.query(
            "SELECT * FROM tournament_tb;"
        );

        let result_tournament = tournament_data.rows;
        console.log(`images/${result_tournament[0].t_logo}`);

        

        // console.log(result);
        // , 'bflag': bool_flag
        
        res.render('index.ejs', { 'result': result, 'bflag': bflag, 't_data': result_tournament });
    }
    catch (e) {
        console.log(e);
    }
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

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/city', async (req, res) => {

    try {
        const temp_state = await db.query(
            "SELECT * FROM state;"
        );

        let result_state = temp_state.rows;
        
        console.log(result_state);
        // , 'bflag': bool_flag
        res.render("city.ejs", {'state_temp' : result_state});
    }
    catch (e) {
        console.log(e);
    }    
});

app.post("/add_city", async (req, res) => {
    let city = req.body["city-name"];
    let state_temp = req.body["state"];
    
    city = city.toUpperCase();

    // let temp = await db.query(
    //     // "SELECT * FROM USER_TYPE WHERE UPPER(UT_DESC) LIKE '%" + city_name + "%';"
    // );

    // console.log("a");
    // let result = temp.rows;
    // console.log("b");
    // console.log(result.length);
    // console.log("a");

    // if (result.length > 0) {
    //     const query = queryString.stringify({
    //         "dup_flag": true
    //     });
    //     res.redirect('/?' + query);
    // }
    // else {
        try {
            await db.query(
                "INSERT INTO city (city_name, state_id) VALUES($1, $2)",
                [city, state_temp]
            );
            res.redirect("/city");
        } catch (err) {
            console.log(err);
        }
    // }
    // console.log(input);


});
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/form-tournament', async (req, res) => {


    try {
        const temp_tty = await db.query(
            "SELECT * FROM tournament_type;"
        );

        let result_tty = temp_tty.rows;

        const temp_city = await db.query(
            "SELECT * FROM city;"
        );

        let result_city = temp_city.rows;

        console.log(result_tty);
        console.log(result_city);

        // , 'bflag': bool_flag
        res.render('form-tournament.ejs', {'tournament_type' : result_tty, 'city_temp' : result_city});
    }
    catch (e) {
        console.log(e);
    }    
});

app.post("/add_tournament", async (req, res) => {
    let tournament_name = req.body["t-name"];
    let tournament_type = req.body["t-type"];
    let tournament_start = req.body["t-start"];
    let tournament_end = req.body["t-end"];
    let tournament_city = req.body["t-city"];
    let tournament_no_of_teams = req.body["t-teams"];
    let tournament_logo = req.body["tournament-logo"];
    let tournament_description = req.body["tournament-description"];
    // input = input.toUpperCase();

    console.log(tournament_name);
    console.log(tournament_type);
    console.log(tournament_start);
    console.log(tournament_end);
    console.log(tournament_city);
    console.log(tournament_no_of_teams);
    console.log(tournament_logo);
    console.log(tournament_description);

    tournament_name = tournament_name.toUpperCase();

    // let temp = await db.query(
    //     "SELECT * FROM USER_TYPE WHERE UPPER(UT_DESC) LIKE '%" + input + "%';"
    // );

    // console.log("a");
    // let result = temp.rows;
    // console.log("b");
    // console.log(result.length);
    // console.log("a");

    // if (result.length > 0) {
    //     const query = queryString.stringify({
    //         "dup_flag": true
    //     });
    //     res.redirect('/?' + query);
    // }
    // else {
        try {
            await db.query(
                "INSERT INTO tournament_tb (tty_id, t_title, t_startdate, t_enddate, t_city, t_logo, t_teams, t_desc) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
                [tournament_type, tournament_name, tournament_start, tournament_end, tournament_city, tournament_logo, tournament_no_of_teams, tournament_description]
            );
            
            res.redirect("/");
        } catch (err) {
            console.log(err);
        }
    // }
    // console.log(input);


});

app.get('/form-player', async (req, res) => {
    res.render('form-player.ejs');
});

app.get('/tournament',async (req, res) => {
    res.render('tournament.ejs');
});

app.get('/match-form',async (req, res) => {
    const temp_stadium = await db.query(
        "SELECT * FROM stadium_tb;"
    );

    let result_stadium = temp_stadium.rows;
    res.render('match-form.ejs', {'stadium_data' : result_stadium});
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});





