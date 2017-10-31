    var userid;
    var baseURL = 'http://114.215.156.99:8381/backend/';
    var i = 3;
    apiready = function () {
        userid = api.pageParam.userId;
        $('.aui-title').html(api.pageParam.name);
        refresh();
    }
    //将title固定在顶部
    var elm = $('.title');
    var startPos = elm.offset().top;
    $.event.add(window, "scroll", function () {
      var p = $(window).scrollTop();
      $(elm).css('position', ((p) > startPos) ? 'fixed' : 'static');
      $(elm).css('top', ((p) > startPos) ? '0px' : '');
    });

    //初始化页面
    $('#chat_view').click(function (){
      $('.send_message_real').removeClass('aui-hide').addClass('aui-active');
      $('.recommend_btn_real').removeClass('aui-active').addClass('aui-hide');
      refresh();
    });
    $('#commend_view').click(function (){
      $('.recommend_btn_real').removeClass('aui-hide').addClass('aui-active');
      $('.send_message_real').removeClass('aui-active').addClass('aui-hide');
      console.log("已点击医嘱历史");
      refresh_recommend();
    });

    /**
     *  以下为历史聊天界面页
     **/
    //点击按钮发送input聊天内容
    $("#send_btn").bind('click', function() {
        insert();
    });

    function insert() {
        var content =
            `<li>
      <p class="time">
        <span>2017-09-27 16:17:51</span>
      </p>
      <div class="pat">
        <img src="../../image/liulangnan.png"  class="avatar" width="30" height="30">
        <div class="text">${$("#input_message").val()}</div>
      </div>
    </li>`;
        $("#content_list").append(content);
        $("#input_message").val("");


        $.ajax({
            url: baseURL + 'historyController/insert',
            type: 'POST', //GET
            async: true, //或false,是否异步
            data: {
                adminid: '1',
                userid: userid,
                history: content
            },
            timeout: 5000, //超时时间
            dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
            success: function(data, textStatus, jqXHR) {
                console.log(unescapeHTML(data.body.history))
                console.log(textStatus)
                console.log(jqXHR)
            },
            error: function(xhr, textStatus) {
                console.log('错误')
                console.log(xhr)
                console.log(textStatus)
            },
        })
    }

    //获取历史聊天记录
    $('#refresh_btn').bind('click', function() {
        refresh();
    });

    var indexHistory = 1;
    //点击查看更多加载
    $('#content_list').on('click','li #readMoreHistory',function readMore() {
      console.log("自加前index="+indexHistory);
      $.ajax({
          url: baseURL + 'historyController/selectAllByPage',
          type: 'POST',
          async: true,
          data: {
              page: indexHistory+1,
              rows: '10',
              order: 'id',
              sort: 'desc',
              adminid: '1',
              userid: userid
          },
          timeout: 5000,
          dataType: 'json',
          success: function(data) {
              var history_html = "";
              var iterateIndex = 0;
              for (var item of data.rows.reverse()) {
                  history_html += unescapeHTML(item.history);
                  // console.log(history_html);
                  iterateIndex++;
              }
              $("#content_list").prepend(history_html);
              console.log($('.readMore'+indexHistory));
              $('.readMore'+indexHistory).hide();
              indexHistory++;
              var moreContentHistory =
              `<li class="aui-list-item">
                  <div id="readMoreHistory" class="aui-list-item-inner readMore${indexHistory}">
                      查看更多
                  </div>
              </li>`;
              console.log($('#refresh_section')[0].scrollTop);
              $('#content_list').prepend(moreContentHistory);
              console.log("自加后index="+indexHistory);
              //点击查看更多滚动条保持位置不变
              console.log(iterateIndex);
              var liHeight = $('#content_list .list-item')[0].offsetHeight;
              var moreHeight = $('#content_list .aui-list-item')[0].offsetHeight;
              if (iterateIndex < 10) {
                //当所有数据请求结束后，查看更多消失
                $('.readMore'+indexHistory).hide();
                //若请求结束，将查看更多隐藏
                $('.aui-chat')[0].scrollTop = iterateIndex * liHeight - moreHeight;
              }else{
                setTimeout(function() {
                  $('.aui-chat')[0].scrollTop = iterateIndex * liHeight ;
                },1);
              }
          }
      });
    });

    function unescapeHTML(html) {
        html += "";
        return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    }

    function refresh() {
      $("#content_list").html(" ");
        $.ajax({
            url: baseURL + 'historyController/selectAllByPage',
            type: 'POST',
            async: true,
            data: {
                page: '1',
                rows: '10',
                order: 'id',
                sort: 'desc',
                adminid: '1',
                userid: userid
            },
            timeout: 5000,
            dataType: 'json',
            success: function(data) {
              $("#content_list").html('');
              var history_html = ""
              for (var item of data.rows.reverse()) {
                  history_html += unescapeHTML(item.history);
              }
              $("#content_list").html(history_html);
              console.log(history_html);
              if (history_html != "") {
                var moreContentHistory =
                `<li class="aui-list-item">
                <div id="readMoreHistory" class="aui-list-item-inner readMore${indexHistory}">
                查看更多
                </div>
                </li>`;
                $('#content_list').prepend(moreContentHistory);
                //将滚动条固定在底部
                console.log($('#refresh_section')[0].offsetHeight);
                $('.aui-chat').scrollTop($('#content_list')[0].offsetHeight);
              }
            }
        })
    }

    /**
     *  以下为医嘱聊天界面页
     **/
     function refresh_recommend(){
       //获取医嘱内容和对应的recommendid
       $.ajax({
         url: baseURL + 'recommendachieveController/selectAllByPage',
         type: 'POST', //GET
         async: true, //或false,是否异步
         data: {
           page: 1,
           rows: 10,
           order: 'id',
           sort: 'desc',
           userid: userid
         },
         timeout: 5000, //超时时间
         dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
         success: function(data) {
           $("#content_list_recommend").html('');
           // console.log(JSON.stringify(data));
             for (var item of data.rows.reverse()) {
                 show_recommend(item.recommend,item.recommendid,item.status,item.id);
             }
             if (data.rows != "") {
               var moreContentRecommend =
               `<li class="aui-list-item">
               <div id="readMoreRecommend" class="aui-list-item-inner readMore${indexRecommend}">
               查看更多
               </div>
               </li>`;
               $('#content_list_recommend').prepend(moreContentRecommend);
               console.log($('.aui-chat_recommend')[0].offsetHeight);
               console.log($('#content_list_recommend')[0].offsetHeight);
               $('.aui-chat_recommend').scrollTop(1800);
              //  setTimeout(function() {
              //  },2000);
               console.log($('.aui-chat_recommend')[0].offsetHeight);
               // console.log(JSON.stringify(window.getComputedStyle($('#content_list_recommend')[0])));
             }
         },
         error: function(xhr) {
             console.log("错误");
             console.log(xhr);
         },
       })


       //将获取到的医嘱列表发送到聊天列表中
       function show_recommend(value,id,status,historyid) {
         var content =
         `<li class="list-item">
           <p class="time">
             <span>2017-09-27 16:17:51</span>
           </p>
           <div class="doc">
             <img src="../../image/liulangnan.png"  class="avatar" width="30" height="30">
             <div class="text">${value}</div>
             <button history-id=${historyid} data-id=${id} data-status=${status} class="status" onclick="finish(event)">
              未完成
             </button>
           </div>
         </li>`;
         $("#content_list_recommend").append(content);

         selectStatusStyle(historyid,status);
       }

       //根据status状态显示状态
       function selectStatusStyle(historyid,status){
        //  console.log($('.doc button[data-id='+id+']'));
         if (status == 1) {
           $('.doc button[history-id='+historyid+']').addClass('done');
          //  $('.doc button[data-id='+id+']').children().text("已完成");
         }else if (status == 0) {
           $('.doc button[history-id='+historyid+']').removeClass('done');
          //  $('.doc button[data-id='+id+']').children().text("未完成");
         }
       }

       var indexRecommend = 1;
       //点击查看更多加载
       $('#content_list_recommend').on('click','li #readMoreRecommend',function readMore() {
         console.log("自加前index="+indexRecommend);
         $.ajax({
             url: baseURL + 'recommendachieveController/selectAllByPage',
             type: 'POST',
             async: true,
             data: {
               page: indexRecommend+1,
               rows: 10,
               order: 'id',
               sort: 'desc',
               userid: userid
             },
             timeout: 5000,
             dataType: 'json',
             success: function(data) {
                 var iterateIndex = 0;
                 for (var item of data.rows.reverse()) {
                   var content =
                       `<li class="list-item">
                           <p class="time">
                               <span>2017-09-27 16:17:51</span>
                           </p>
                           <div class="doc">
                               <img src="../../image/liulangnan.png"  class="avatar" width="30" height="30">
                               <div class="text">${item.recommend}</div>
                               <button class="status" onclick="finish(event)">未完成</button>
                           </div>
                       </li>`;
                   $("#content_list_recommend").prepend(content);
                   iterateIndex++;
                 }
                 $('.readMore'+indexRecommend).hide();
                 indexRecommend++;
                 var moreContentHistory =
                 `<li class="aui-list-item">
                     <div id="readMoreRecommend" class="aui-list-item-inner readMore${indexRecommend}">
                         查看更多
                     </div>
                 </li>`;
                 // console.log($('#refresh_section')[0].scrollTop);
                 $('#content_list_recommend').prepend(moreContentHistory);
                 var liHeight = $('#content_list_recommend .list-item')[0].offsetHeight;
                 var moreHeight = $('#content_list_recommend .aui-list-item')[0].offsetHeight;
                 if (iterateIndex < 10) {
                   //当所有数据请求结束后，查看更多消失
                   $('.readMore'+indexRecommend).hide();
                   //若请求结束，将查看更多隐藏
                   $('.aui-chat_recommend')[0].scrollTop = iterateIndex * liHeight - moreHeight;
                 }else{
                   setTimeout(function() {
                     $('.aui-chat_recommend')[0].scrollTop = iterateIndex * liHeight ;
                   },1);
                 }
             }
         });
       });

     }



     //点击切换样式内容
     window.finish = function (event){
       console.log(event.target);
       $(`li button[history-id=${$(event.target).attr("history-id")}]`).toggleClass('done');
      //切换点击元素的status状态
       if ($(event.target).attr("data-status") === '0') {
         $(event.target).attr("data-status",1);
       }else{
         $(event.target).attr("data-status",0);
       }

       //更新医嘱完成状态
       $.ajax({
         url: baseURL + "recommendachieveController/insert",
         type: 'POST',
         async: true,
         data:{
           id:$(event.target).attr("history-id"),
           recommendid: $(event.target).attr("data-id"),
           userid: userid,
           status: Number($(event.target).attr("data-status")),
           recommend: $(event.target).prev().text()
         },
         timeout: 5000,
         dataType:'json',
         success:function(data){
           console.log("修改医嘱状态成功");
         },
         error:function (xhr) {
           console.log("失败了！！！");
         },
       });
     }
