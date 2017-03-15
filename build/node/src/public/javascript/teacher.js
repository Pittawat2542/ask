'use strict'

$(document).ready(function() {
    // attribute
    var socket = io.connect();
    var new_questions = 0;
    var selected_questions = 0;
    var questions = [];

    socket.on('teacher', function(data) {
        console.log("Client Say"+data)
        if(data.success){
            new_questions += 1;
            $('.new-questions').text(new_questions);
        }else if(data.refresh){
            render();
        }

    });

    // function
    var render = function() {
        var list = $('.questions ul.list-group');
        list.html("");
        $.ajax({
            method: 'GET',
            url: "/question/get/ready",
        }).done(function(data) {

            questions = data
            questions.forEach(function(element) {
                list.prepend(question(element.id,element.question,element.attendee))
            }, this);

            $('.questions ul.list-group li').click(selectHandle);

            // Reset New-Question
            new_questions = 0;
            $('.new-questions').text(new_questions);

            // Reset Selected-Question
            selected_questions = 0;
            $('.selected-questions').text(selected_questions + " ข้อ");
        });
    }

    var question = function(id,data,atd){
        return "<li class=\"list-group-item question\" data-id=\""+ id +"\"><p>"+ data +"</p><div class=\"atd text-right\">ผู้ถาม: "+atd+"</div></li>";
    }

    // click trigger
    var selectHandle = function(){
        // console.log($(this).data('id'));

        if($(this).hasClass('active')){
            $(this).removeClass('active')
            selected_questions -= 1;
        }else{
            $(this).addClass('active')
            selected_questions += 1;
        }

        // Re-render Selected-Question
        $('.selected-questions').text(selected_questions + " ข้อ");
    }

    $('.update').click(function(e){
        render();
        return false;
    });

    $('.sending-questions').click(function(){
        var selected = $('.questions ul.list-group li.active');

        if(selected.length > 0){
            swal({
                title: "ตอบคำถาม ?",
                text: "อาจารย์กำลังจะตอบคำถามทั้งหมด `" + selected.length + "` ข้อ",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "ใช่, ถูกต้อง!",
                cancelButtonText: "ไม่ใช่",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function(isConfirm){
                if (isConfirm) {
                    var data = [];
                    $.each(selected, function( i, value ) {
                        data.push($(value).data('id'));
                        if(i == selected.length-1){
                            $.ajax({
                                method: 'POST',
                                url: "/question/selects",
                                data: { data : data }
                            }).done(function(data) {
                                if (data.success) {
                                    swal("คำถามขึ้นที่จอเรียบร้อยแล้วครับ!", "อาจารย์ตอบคำถามกับน้อง ๆ ได้เลยครับ : )", "success");
                                }
                            });
                        }
                    });
                }
            });
        }else{
            swal("โปรดเลือกคำถาม!", "กรุณาเลือกคำถามที่ต้องการจะตอบครับ!", "warning")
        }
    });

    // init teacher
    render();

    // end.
});
