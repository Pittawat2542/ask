// API.js -- POST AND GET
var express = require('express');
var config = require('../config');
var app = express.Router();

// Database
var knex = require('knex')(config.db);


// Question Status
// status = [0 => pending, 1 => selected, 2 => deleted]
//

// # GENERAL API #
// --------------------

app.get('/question/get/:command',function(req,res){
  var command = req.params.command;

  if(command == 'all'){
    // get All Question
    knex('questions')
    .select('*')
    .then(function(data){
      res.json(data);
    });

  }else if(command == 'ready'){
    knex('questions')
    .where({
      status: 0
    })
    .select('*')
    .then(function(data){
      res.json(data);
    });

  }else if(command == 'completed'){
    knex('questions')
    .where({
      status: 1
    })
    .select('*')
    .then(function(data){
      res.json(data);
    });

  }
});

app.get('/question/id/:id/',function(req,res){
  // get Question by ID
  knex('questions')
    .where({
      id: req.params.id
    })
    .select('*')
    .then(function(data){
      res.json(data[0]);
    });
});

// app.get('/question/std/:std/',function(req,res){
//   // get Question by ID
//   knex('questions')
//     .where({
//       std_id: req.params.std
//     })
//     .select('*')
//     .then(function(data){
//       res.json(data);
//     });

// });

// # ATTENDEES API #
// --------------------

// app.post('/login',function(req,res){
//   var id = req.body.std_id;
//   console.log(id);

//   knex('attendees').where('stdID', id).then(function(data){
//     console.log('query',data)
//     res.json(data);
//   });
// });

app.post('/question/',function(req,res){
  // Send Question

  knex('questions')
    .returning('id')
    .insert(
      {
        question: req.body.content,
        attendee: req.body.attendee,
      })
    .then(function(data){
      console.log("[Sended Question] : ",data);
      req.app.io.emit('teacher',{success: true});
      setTimeout(function(){
        res.json({ success: true, response: data});
      },1000);
    });

});

// # TEACHER API #
// --------------------

app.post('/question/selects',function(req,res){
  // .. ส่งคำถามขึ้นหน้าจอ
  var data = req.body.data;

  data.forEach(function(element, index){
    var x = knex('questions')
    .where({
      id: element
    })
    .update({
      status: 1
    }).then(function(data){
      knex('questions').where({id: element}).select('std_id').then(function(data){
        req.app.io.emit('asker',{ std_id : data[0].std_id });
      })
    });

    if(index == data.length-1){
      res.json({ success: true, response: data});
      req.app.io.emit('teacher',{ refresh : true});
      req.app.io.emit('presentation',{ data : data });
    }
  });
});

app.post('/question/delete',function(req,res){
  // .. ส่งคำถามขึ้นหน้าจอ
  var data = req.body.data;

  data.forEach(function(element, index){
    var x = knex('questions')
    .where({
      id: element
    })
    .update({
      status: 2
    }).then(function(data){
      knex('questions').where({id: element}).select('std_id').then(function(data){
        req.app.io.emit('asker',{ std_id : data[0].std_id });
      })
    });

    if(index == data.length-1){
      res.json({ success: true, response: data});
      req.app.io.emit('teacher',{ refresh : true});
      req.app.io.emit('presentation',{ data : data });
    }
  });
});

// # PRESENTATION API #
// --------------------


module.exports = app;
