let express = require('express'); //express is now a variable 
let app = express(); //this line executed a function and the object is stored in app

//telling the server what to respond
// app.get('/',(request, response)=>{
//     response.send("hello")
// })

//when the client makes a get request for this route, execute this function
//express.static searches for a folder called public, then serves all the static content in that folder
app.use('/',express.static('public'));

app.get('/about',(request, response) =>{
    response.send("this is an about page")
})

//tell the server where to listen
app.listen(3000,()=>{
    console.log("app is listening");
})
