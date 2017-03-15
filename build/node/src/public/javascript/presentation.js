'use strict'

$(document).ready(function() {

    var socket = io.connect();
    var words = [
        {text: "ASK", weight: 13},
    ];

    socket.on('presentation', function(data) {
        var ids = data.data;
        words = new Array();
        $('#hero').removeClass('active');

        $.each(ids, function( i, id ) {
            $.ajax({
                method: 'GET',
                url: "/question/id/" + id ,
            }).done(function(data) {
                var item = {
                    text: data.question,
                    weight: Math.floor(((Math.random()*3)+10))
                };
                words.push(item);

                if(i == ids.length-1){
                    setTimeout(function(){
                        $('#hero').jQCloud('update',words);
                        console.log(words)
                        $('#hero').addClass('active');
                    },1000)
                }
            });

        });

    });

    $('#hero').jQCloud(words,{
       autoResize: true,
       fontSize: {
            from: 0.065,
            to: 0.05
        },
        colors: ["#fff", "#eee", "#ddd"],
    });

    setTimeout(function(){
        $('#hero').addClass('active');
    },1000)

});
