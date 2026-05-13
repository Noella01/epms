const express = require ("express");
const mysql = require ("mysql2");
const cors = require ("cors");
const session = require ("express-session");
const bcrypt = require ("bcryptjs");

const app = express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(session({
    secret:"EPMS",
    resave:false,
    saveUninitialized:false
}));

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
      port: 3306,
    password:"root",
    database:"EPMS"
});
db.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Database connected");
    }
});

function isAuth (req,res,next){
    if (req.session.user){
        next()
    }else{
        res.status(401).json({ success: false, message: "please first login" });
    }
}

app.get("/profile",isAuth,(req,res)=>{
   res.json(req.session.user);
});

app.get("/logout",(req,res)=>{
     req.session.destroy();
     res.json({ success: true, message: "logged out" });
});

app.post("/register",async(req,res)=>{
    const{username,password} = req.body;
    const hash = await bcrypt.hash(password,10);
    db.query("INSERT INTO user(username,password) VALUE (?,?)",[username,hash],
        (err)=>{
            if(err){
                res.json({ success: false, message: "Registration failed" });
            }else{
                res.json({ success: true, message: "Registered" });
            }
        }
    )
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM user WHERE username = ?", [username],
         async (err, result) => {
        if (err) {
            return res.json({ success: false, message: "Login failed" });
        }
        // USER NOT FOUND
        if (result.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }
        const user = result[0];
        // COMPARE PASSWORDS
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            res.json({ success: false, message: "Wrong password" });
        }else{
            req.session.user = user;
            res.json({ success: true, message: "Login successful" });
        }
    });
});

app.post("/employee",isAuth,async(req,res)=>{
    const{firstName,lastName,position,address,telephone,gender,hiredDate,department} = req.body;
    db.query(
        "INSERT INTO employee(firstName,lastName,position,address,telephone,gender,hiredDate,department) VALUE (?,?,?,?,?,?,?,?)",
        [firstName,lastName,position,address,telephone,gender,hiredDate,department],
        (err)=>{
            if(err){
                 res.json({ success: false, message: err.sqlMessage || "failed" });
            }else{
                res.json({ success: true, message: "Added" });
            }
        }
    ); 
});

app.post("/department",isAuth,async(req,res)=>{
    const{departmentCode,departmentName,grossSalary} = req.body;
    db.query(
        "INSERT INTO department(departmentCode,departmentName,grossSalary) VALUE (?,?,?)",
        [departmentCode,departmentName,grossSalary],
        (err)=>{
            if(err){
                res.json({ success: false, message: err.sqlMessage || "failed" });
            }else{
                res.json({ success: true, message: "Added" });
            }
        }
    ); 
});

app.get("/department",isAuth,async(req,res)=>{
    db.query("SELECT departmentCode, departmentName FROM department",
        (err,result)=>{
            if(err){
                res.json({ success: false, message: err.sqlMessage || "failed" });
            }else{
                res.send(result);
            }
        }
    )
});

app.post("/salary",isAuth,async(req,res)=>{
    const{grossSalary,totalDeduction,netSalary,month} = req.body;
    db.query(
        "INSERT INTO salary(grossSalary,totalDeduction,netSalary,month) VALUE (?,?,?,?)",
        [grossSalary,totalDeduction,netSalary,month],
        (err)=>{
            if(err){
                res.json({ success: false, message: err.sqlMessage || "failed" });
            }else{
                res.json({ success: true, message: "Added" });
            }
        }
    ); 
});


app.get("/salary",isAuth,async(req,res)=>{
     db.query("SELECT * FROM salary ORDER BY id DESC",
        (err,result)=>{
            if(err){
                res.json({ success: false, message: err.sqlMessage || "failed" });
            }else{
                res.send(result);
            }
        } 
      );
});

app.get("/payroll-report",isAuth,async(req,res)=>{
    const sql = `
        SELECT
            e.firstName,
            e.lastName,
            e.position,
            e.department AS departmentCode,
            s.netSalary
        FROM employee e
        LEFT JOIN (
            SELECT netSalary FROM salary ORDER BY id DESC LIMIT 1
        ) s ON true
        ORDER BY e.firstName, e.lastName
    `;

    db.query(sql,
        (err,result)=>{
            if(err){
                res.json({ success: false, message: err.sqlMessage || "failed" });
            }else{
                res.send(result);
            }
        }
    );
});


 app.delete("/salary/:id",isAuth,async(req,res)=>{
    db.query("DELETE FROM salary WHERE id=?", [req.params.id],
        (err) => {
            if(err){
                res.json({ success: false, message: err.sqlMessage || "failed" });
            }else{
                res.json({ success: true, message: "Deleted" });
            }
        }
    )
});

app.put("/salary/:id",isAuth,async(req,res)=>{
    const{grossSalary,totalDeduction,netSalary,month} = req.body;
    db.query("UPDATE salary SET grossSalary=?, totalDeduction=?, netSalary=?, month=? WHERE id=?",[grossSalary,totalDeduction,netSalary,month,req.params.id],
        (err)=>{
            if(err){
                res.json({ success: false, message: err.sqlMessage || "failed" });
            }else{
                res.json({ success: true, message: "updated" });
            }
        }
    ) 
});

app.listen(500,()=>{
   console.log("server is running on port http://localhost:5000");
});
