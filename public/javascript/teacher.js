'use strict'

$(document).ready(function() {
    // attribute
    var socket = io.connect();
    var new_questions = 0;
    var selected_questions = 0;
    var questions = [];

    socket.on('teacher', function(data) {
        if(data.success){
            new_questions += 1;
            $('.new-questions').text(new_questions);
        }else if(data.refresh){
            render();
        }

    });

    socket.on('ans', function (data) {
        //TODO Add ID to list under Question that Active
    });

    $('.start-round').click(function () {
        socket.emit('start', 1);
    })

    $('.end-round').click(function () {
        socket.emit('start', 0);
    })

    var question = function(id,data,atd){
        return "<li class=\"list-group-item question\" data-id=\""+ id +"\"><p>"+ data +
              "</p><div class=\"atd text-right\">ID: "+atd+
              "</div><div class=\"delete-btn\"><i class=\"fa fa-trash\"></i></div></li>";
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

    var deleteAction = function(e){
      var _id = $(this).closest('li').data('id');
      swal({
        title: "แน่ใจแล้วนะครับ?",
        text: "คุณกำลังจะลบคำถามว่า `" + $(this).closest('li').find('p').text() + "`",
        showCancelButton: true,
        type: "warning",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ไม่ใช่",
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
      }, function(isConfirm) {
        if(isConfirm){
          var data = {
            id: _id
          };
          // ajax
          $.ajax({
              method: 'post',
              url: "/question/delete",
              data: data,
          }).done(function(msg) {
            if (msg.success) {
                swal({
                    title: "ลบคำถามเรียบร้อยแล้วครับ!",
                    text: "เชิญต่อเลยครับที่ปรึกษา.",
                    type: "success",
                });
            } else {
                swal({
                    title: "เกิดปัญหากับการส่ง!",
                    text: "กรุณาติดต่อเจ้าหน้าที่",
                    type: "warning",
                });
            }
          });
        }
      });

    }

    $('.update').click(function(e){
        render();
        return false;
    });

    $('.sending-questions').click(function(){
        var selected = $('.questions ul.questions-list li.active');

        if(selected.length > 0){
            swal({
                title: "ตอบคำถาม ?",
                text: "ที่ปรึกษากำลังจะตอบคำถามทั้งหมด `" + selected.length + "` ข้อ",
                showCancelButton: true,
                confirmButtonColor: "#37bc9b",
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
                                    swal("คำถามขึ้นที่จอเรียบร้อยแล้วครับ!", "ที่ปรึกษาตอบคำถามกับผู้ฟังได้เลยครับ : )", "success");
                                }
                            });
                        }
                    });

                    socket.emit('ans',[]);
                }
            });
        }else{
            swal("โปรดเลือกคำถาม!", "กรุณาเลือกคำถามที่ต้องการจะตอบครับ!", "warning")
        }
    });

    // function
    var render = function() {
      var list = $('.questions ul.questions-list');
      list.html("");
      $.ajax({
          method: 'GET',
          url: "/question/get/ready",
      }).done(function(data) {

          questions = data
          questions.forEach(function(element) {
              list.prepend(question(element.id,element.question,element.attendee))
          }, this);

          $('.questions ul.questions-list li').click(selectHandle);
          $('.delete-btn').click(deleteAction);

          // Reset New-Question
          new_questions = 0;
          $('.new-questions').text(new_questions);

          // Reset Selected-Question
          selected_questions = 0;
          $('.selected-questions').text(selected_questions + " ข้อ");
      });

      var selected_list = $('.questions ul.done');
      selected_list.html("");
      $.ajax({
          method: 'GET',
          url: "/question/get/completed",
      }).done(function(data) {
          questions = data
          questions.forEach(function(element) {
              selected_list.prepend(question(element.id,element.question,element.attendee))
          }, this);

      });
    }

    // init teacher
    render();

    // end.

});
