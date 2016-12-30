var builder = require('botbuilder');
var express = require('express');
var app = express();
  
// Create application/x-www-form-urlencoded parser
 

app.use(express.static('public'));
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})


// Create chat bot
var connector = new builder.ChatConnector({
    //    appId: process.env.MICROSOFT_APP_ID,
    //    appPassword: process.env.MICROSOFT_APP_PASSWORD
    appId: 'a3d7b4a7-bdc4-4d72-a6bd-7a99bab69923',
    appPassword: 'KKqnk5FSZOHmaHwnkUJ4f9C'
});
var bot = new builder.UniversalBot(connector);
app.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

 

var port = process.env.port || process.env.port;
//var server = app.listen(8081, function () {
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)

})


var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
