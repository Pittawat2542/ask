'use strict'

$(document).ready(function () {
    window.attendee;

    // Socket Zone

    var socket = io.connect();
    var active;

    socket.on('start', function (data) {
        active = data;
    });
    
    socket.on('ans', function () {
        swal({
            title: 'คุณต้องการจองคิวในการตอบหรือไม่!?',
            text: 'หน้าต่างนี้จะปิดเองภายใน 5 วินาที',
            timer: 5000,
            showCancelButton: true,
            confirmButtonColor: "#37bc9b",
            confirmButtonText: "จองคิว",
            cancelButtonText: "ยกเลิก",
            closeOnConfirm: false,
        }, function (isConfirm) {
            if () {
                //TODO Add condition to check if queue < 5
                // init data
                var data = {
                    attendee: window.attendee.name
                };
                // ajax
                $.ajax({
                    method: 'POST',
                    url: "/question",
                    data: data,
                }).done(function (msg) {
                    if (msg.success) {
                        swal({
                            title: "จองคิวเรียบร้อยแล้วครับ!",
                            type: "success",
                        });
                    } else {
                        swal({
                            title: "เกิดปัญหากับการส่ง!",
                            text: "กรุณาติดต่อเจ้าหน้าที่",
                            type: "warning",
                        });
                    }
            } else {
                swal({
                    title: 'ผิดพลาด!!!',
                    text: 'จำนวนคนจองคิวมากเกินไป',
                    showCancelButton: true,
                    cancelButtonText: "ปิด",
                });
            }
        });
    });

    socket.on('asker', function (data) {
        if (data.name == attendee.name) {
            swal({
                title: "ที่ปรึกษากำลังตอบคำถามของคุณอยู่!",
                text: "หน้าต่างนี้จะปิดเองภายใน 10 วินาที.",
                timer: 10000,
                showConfirmButton: false,
                type: "success",
            });
        }
    });

    if (localStorage.getItem('attendee') != null) {
        window.attendee = JSON.parse(localStorage.getItem('attendee'));
        $('.login').addClass('inactive');
        setTimeout(function () {
            $('.main').addClass('active');
            $('.logout').addClass('active');
        }, 500);

        $('.main .name span').text('รหัสนักศึกษา ' + window.attendee.name);
    }

    // login
    $('.login-btn').click(function () {
        if ($('.username input').val() != '' && $('.school input').val() != '') {

            window.attendee = {
                name: $('.name input').val(),
                // position: $('.position input').val()
            };

            localStorage.setItem('attendee', JSON.stringify(attendee));
            $('.login').addClass('inactive');
            setTimeout(function () {
                $('.main').addClass('active');
                $('.logout').addClass('active');
            }, 500);

            socket.emit('attendee', window.attendee);
            $('.main .name span').text(' คุณ' + window.attendee.name);
        }
    });

    // logout
    $('.logout').click(function () {
        localStorage.clear();

        $('.main').removeClass('active');
        $('.logout').removeClass('active');
        setTimeout(function () {
            $('.login').removeClass('inactive');
        }, 500);
    });


    function Sender() {
        if ($('.sender-area').val().length >= 4 && active == 1) {
            swal({
                title: "แน่ใจแล้วนะครับ?",
                text: "คุณกำลังจะส่งคำถามว่า `" + $('.sender-area').val() + "`",
                showCancelButton: true,
                confirmButtonColor: "#37bc9b",
                confirmButtonText: "ใช่, ถูกต้อง!",
                cancelButtonText: "ไม่ใช่",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function (isConfirm) {
                if (isConfirm) {
                    // init data
                    var data = {
                        content: $('.sender-area').val(),
                        attendee: window.attendee.name
                    };
                    // ajax
                    $.ajax({
                        method: 'POST',
                        url: "/question",
                        data: data,
                    }).done(function (msg) {
                        if (msg.success) {
                            swal({
                                title: "ส่งเรียบร้อยแล้วครับ!",
                                text: "นั่งรอฟังคำตอบจากที่ปรึกษาได้เลยครับ.",
                                type: "success",
                            });
                        } else {
                            swal({
                                title: "เกิดปัญหากับการส่ง!",
                                text: "กรุณาติดต่อเจ้าหน้าที่",
                                type: "warning",
                            });
                        }
                        // clear textarea
                        $('.sender-area').val('');
                    });
                }
            });
        } else {
            swal({
                title: "ยังส่งไม่ได้นะ!",
                text: "เงื่อนไขการส่งยังผิดอยู่ครับผม กรุณาใส่คำถามที่ยาวกว่านี้นะครับ",
                type: "warning",
            });
        }
    }

    // Main function
    $('.sender-button').click(function () {
        Sender();
    });

    $('.help').click(function () {
        swal({
            text: "I will close in 2 seconds.",
            timer: 2000,
            showConfirmButton: false
        });
    });

});
