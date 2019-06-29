var express     = require('express');
var http        = require('http');
var ent         = require('ent');
 
var app = express();
var server      = http.createServer(app);
 
var io    = require('socket.io').listen(server);
 
var todolist    = [];
var index;           
 
app.use (express.static('views'))
// Affichage de la liste et du formulaire
.get('/todo', function(request, response)
{
    response.render('todo.ejs');
})
 
// Redirige vers la todolist si la page demand�e n'est pas trouv�e
.use(function(request, response, next)
{
    response.redirect('/todo');
});
 
 
// Echange
io.sockets.on('connection', function(socket){
    console.log('User is connected'); // Debug user
     
    // Quand l'utilisateur est connect�, envoi de la liste mise � jour
    socket.emit('majTache', todolist);
     
    // Ajout d'une t�che � la liste
    socket.on('ajoutTache', function(tache){
       tache = ent.encode(tache);
       todolist.push(tache); 
        
       index = todolist.length -1;
        
       console.log(tache); // Debug tache
       console.log(index); // Debug index
         
       // Envoi � tous les connect�s
       socket.broadcast.emit('ajoutTache', {tache:tache, index:index});
       console.log(todolist); // Debug
    });
     
    // Suppression d'une t�che
    socket.on('suppTache', function(index){
        todolist.splice(index, 1);
        io.sockets.emit('majTache', todolist);
    });
});
 
server.listen(8080);