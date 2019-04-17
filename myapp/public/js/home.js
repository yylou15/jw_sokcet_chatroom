$(document).ready(function () {
    let colorList = [
        '#68ff57','#47ccff','#ff6d78','#8382ff','#6e9cff','#ff835c',
        '#ffe234','#ff6d78','#e9e9e9','#4b72ff','#93c1d5','#93c1d5'
    ];

    var socket = io();
    let scrollText = $("#scroll-text");
    let user = $('#username').text();
    let barrageScreen = $('#barrager-screen');
    let msg_button = $('.send-msg-button');
    let height = parseInt($('.msg-panel').css('height'));
    let input = $('.send-msg-input')[0];
    let avatarUrl = '';
    $.ajax({
        url: '/getAvatar',
        success:function (res) {
            avatarUrl = res;
        }
    });

    socket.emit('someone connected', user + '加入了房间');
    scrollText.append($('<div class="someone-enter-item">').text(user + '加入了房间'));
    socket.on('other connected', function(msg){
        scrollText.append($('<div class="someone-enter-item">').text(msg));
        scrollText.scrollTop(9999999999999999999);
    });

    socket.on('other msg',function (msg) {
        // let msgJson = JSON.parse(msg);

        scrollText.append($('<div class="barrage-item">').text(msg.msg));
        scrollText.scrollTop(9999999999999999999);

        barrageScreen.barrager({
            img:msg.avatarUrl, //图片
            info:msg.msg, //文字
            // close:true, //显示关闭按钮
            speed:15, //延迟,单位秒,默认6
            bottom: parseInt(Math.random() * (barrageScreen.height() - 40)), //距离底部高度,单位px,默认随机
            color:colorList[parseInt(Math.random() * 11)], //颜色,默认白色
            old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
        });

    });


    msg_button.click(function () {
        if (!input.value)
            return;
        socket.emit('someone msg',{
                    username : user,
                    value: input.value
            });
        scrollText.append($('<div class="barrage-item">').text(user + "： " +input.value));
        scrollText.scrollTop(9999999999999999999);

        $('#barrager-screen').barrager({
            img:avatarUrl, //图片
            info:user + "： " +input.value, //文字
            // close:true, //显示关闭按钮
            speed:15, //延迟,单位秒,默认6
            bottom: parseInt(Math.random() * (barrageScreen.height() - 40)), //距离底部高度,单位px,默认随机
            color:colorList[parseInt(Math.random() * 11)], //颜色,默认白色
            old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色
        });


        input.value = '';
        input.disabled = true;
        input.placeholder = '3s内不能重复发送';
        setTimeout(function () {
            input.placeholder = '2s内不能重复发送'
        },1000);
        setTimeout(function () {
            input.placeholder = '1s内不能重复发送'
        },2000);
        setTimeout(function () {
            input.disabled = false;
            input.placeholder = '输入内容，最长不超过20字...'
        },3000)
    });




    // console
    if(window.innerWidth >= 1092){
        scrollText.css('height',(height - 105) + 'px')
    }else {
        scrollText.css('height',(height - 125) + 'px')
    }
});

$(window).resize(function () {

    let height = parseInt($('.msg-panel').css('height'));

    // console
    if(window.innerWidth >= 1092){
        $("#scroll-text").css('height',(height - 105) + 'px')
    }else {
        $("#scroll-text").css('height',(height - 125) + 'px')
    }
});

