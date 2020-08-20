function changeImage1() {
                var image = document.getElementById('bulb1');
                if (image.src.match("bulbon")) {
                    image.src = "css/images/pic_bulboff.gif";
                }
                else
                {
                    image.src = "css/images/pic_bulbon.gif";
                }
            }
            function changeImage2() {
                var image = document.getElementById('bulb2');
                if (image.src.match("bulbon")) {
                    image.src = "css/images/pic_bulboff.gif";
                }
                else
                {
                    image.src = "css/images/pic_bulbon.gif";
                }
            }
            function changeImage3() {
                var image = document.getElementById('bulb3');
                if (image.src.match("bulbon")) {
                    image.src = "css/images/pic_bulboff.gif";
                }
                else
                {
                    image.src = "css/images/pic_bulbon.gif";
                }
            }

            $(function () {
                'use strict';
                $('#on').on('click', function () {
                    $('button').removeClass('active');
                    $('#on').addClass('active');
                    //$('.f-head').addClass('rotate');
                    $('.ff-head').removeClass('stop').removeClass('speed1-event').removeClass('speed2-event').removeClass('speed3-event').removeClass('speed4-event').removeClass('speed5-event').addClass('play');
                });
                $('#off').on("click", function () {
                    $('button').removeClass('active');
                    $("#off").addClass('active');
                    //$('.f-head').removeClass('rotate');
                    $('.ff-head').removeClass('play').addClass('stop');
                });
                $('#btn1').on('click', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.ff-head').removeClass('play').removeClass('speed2-event').removeClass('speed3-event').removeClass('speed4-event').removeClass('speed5-event').addClass('speed1-event');
                });
                $('#btn2').on('click', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.ff-head').removeClass('play').removeClass('speed3-event').removeClass('speed4-event').removeClass('speed5-event').addClass('speed1-event').addClass('speed2-event');
                });
                $('#btn3').on('click', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.ff-head').removeClass('play').removeClass('speed1-event').removeClass('speed2-event').removeClass('speed4-event').removeClass('speed5-event').addClass('speed3-event');
                });
                $('#btn4').on('click', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.ff-head').removeClass('play').removeClass('speed1-event').removeClass('speed2-event').removeClass('speed3-event').removeClass('speed5-event').addClass('speed4-event');
                });
                $('#btn5').on('click', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.ff-head').removeClass('play').removeClass('speed1-event').removeClass('speed2-event').removeClass('speed3-event').removeClass('speed4-event').removeClass('stop').addClass('speed5-event');
                });
            });