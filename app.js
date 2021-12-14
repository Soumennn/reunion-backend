if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;


//configuration: setting up the template engine and path for 'views' folder:
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/Views'));

//serving static files via middleware:
// app.use(express.static(path.join(__dirname,'Public')));

// enabling parser for req.body (form data)
app.use(express.urlencoded({ extended: true }))
// enable parser for req.body ( jason parser)
app.use(express.json());


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
    // useFindAndModify: false,
    // useCreateIndex: true
})
.then(() => 
    console.log("Database is connected now")
).catch((err) => 
    console.log(err.message)
);




const authRoutes = require('./routes/authRoutes');
const postsRoutes = require('./routes/postsRoutes');
const profileRoutes = require('./routes/profileRoutes');


app.get('/', (req,res) => {
    res.send("Hello from Reunion-Backend, ");
})

app.use(authRoutes);
app.use(postsRoutes);
app.use(profileRoutes);



app.listen(process.env.PORT || port, () => {
    console.log("App listening on port"+port);
})
