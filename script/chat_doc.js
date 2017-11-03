    var userid;
    var baseURL = 'http://114.215.156.99:8381/backend/';
    var i = 3;
    apiready = function () {
        userid = api.pageParam.userId;
        $('.aui-title').html(api.pageParam.name);
        refresh();
    }

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
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
      refresh_recommend_dialog();
    });

    /**
     *  以下为历史聊天界面页
     **/

    //点击按钮发送input聊天内容
    $("#send_btn").bind('click', function() {
        insert();
        refresh();
    });

    function insert() {
        var content =
            `<li class="list-item">
              <p class="time">
                <span>${getNowFormatDate()}</span>
              </p>
              <div class="doc" >
                <img src="assets/images/avatar_doc.jpg"  class="avatar" width="30" height="30">
                <div class="text">${$("#input_message").val()}</div>
              </div>
              </li>`;
        $("#content_list").append(content);
        $("#input_message").val("");
        $('.aui-chat').scrollTop($('#content_list')[0].offsetHeight);


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
                console.log(data)
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
              // console.log($('.readMore'+indexHistory));
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
                if (history_html != "") {
                  var moreContentHistory =
                  `<li class="aui-list-item">
                  <div id="readMoreHistory" class="aui-list-item-inner readMore${indexHistory}">
                  查看更多
                  </div>
                  </li>`;
                  $('#content_list').prepend(moreContentHistory);
                  //将滚动条固定在底部
                  console.log($('#content_list')[0].offsetHeight);
                  $('.aui-chat').scrollTop($('#content_list')[0].offsetHeight);
                  console.log($('.aui-chat').scrollTop());

                }
            }
        });
    }

    /**
     *  以下为医嘱历史界面
     **/

    $('#send_list').click(function () {
      refresh_recommend_dialog();
    });

    $('#alert_add_send').click(function () {
      refresh_recommend_dialog();
    });

    //获取医嘱历史
    function refresh_recommend() {
      //查询医嘱历史列表
      $.ajax({
          url: baseURL + "recommendachieveController/selectAllByPage",
          type: 'POST',
          async: true,
          data: {
            page: 1,
            rows: 10,
            order: 'id',
            sort: 'desc',
            userid: userid
          },
          timeout: 5000,
          dataType: 'json',
          success: function(data) {
            $("#content_list_recommend_doc").html('');
            // console.log(JSON.stringify(data));
              for (var item of data.rows.reverse()) {
                  show_recommend(item.datetime,item.recommend,item.recommendid,item.status,item.id);
                  // console.log(item.recommend);
              }
              if (data.rows != "") {
                var moreContentRecommend =
                `<li class="aui-list-item">
                <div id="readMoreRecommend" class="aui-list-item-inner readMore${indexRecommend}">
                查看更多
                </div>
                </li>`;
                $('#content_list_recommend_doc').prepend(moreContentRecommend);
                $('.aui-chat_recommend').scrollTop(1800);
                // setTimeout(function() {
                // },1000);
              }
          },
          error: function(xhr) {
              console.log("错误");
              console.log(xhr);
          },
      })
    }

    var indexRecommend = 1;
    //点击查看更多加载
    $('#content_list_recommend_doc').on('click','li #readMoreRecommend',function readMore() {
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
              for (var item of data.rows) {
                var content =
                    `<li class="list-item">
                        <p class="time">
                            <span>${item.datetime}</span>
                        </p>
                        <div class="doc">
                            <button class="status" onclick="finish(event)">未完成</button>
                            <img src="assets/images/avatar_doc.jpg"  class="avatar" width="30" height="30">
                            <div class="text">${item.recommend}</div>
                        </div>
                    </li>`;
                $("#content_list_recommend_doc").prepend(content);
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
              $('#content_list_recommend_doc').prepend(moreContentHistory);
              var liHeight = $('#content_list_recommend_doc .list-item')[0].offsetHeight;
              var moreHeight = $('#content_list_recommend_doc .aui-list-item')[0].offsetHeight;
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

    //获取医嘱推荐列表
    function refresh_recommend_dialog() {
      $("#add_recommend_list").html('');
      $.ajax({
        url: baseURL + "adminrecommendController/select",
        type: 'POST',
        async: true,
        data:{
          adminid: 1
        },
        timeout: 5000,
        dataType:'json',
        success: function(data) {
          console.log(data);
          for (var item of data.body.reverse()) {
              show_recommend_in_dialog(item.recommend, item.id);
          }
        },
        error: function(xhr){
          console.log(xhr);
        },
      });
    }

    //将查询获取到的医嘱列表显示在医嘱历史界面
    function show_recommend(datetime,value,id,status,historyid) {
        var content =
        `<li class="list-item">
          <p class="time">
            <span>${datetime}</span>
          </p>
          <div class="doc">
            <button history-id=${historyid} data-id=${id} data-status=${status} class="status">
            未完成
            </button>
            <img src="assets/images/avatar_pat.jpg"  class="avatar" width="30" height="30">
            <div class="text">${value}</div>
          </div>
        </li>`;
        $("#content_list_recommend_doc").append(content);
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

    //将查询到的医嘱列表显示在对话框中
    function show_recommend_in_dialog(recommend, id) {
        // console.log(recommend, id);
        var content =
            `<li class="aui-list-item" data-id=${id}>
        <div class="aui-list-item-inner">
            <label>
              <input class="aui-radio" type="checkbox" name="advice4" value=${recommend}>
              <span>${recommend}</span>
            </label>
            <div style="text-align:right">
              <i edit-id=${id} class="aui-iconfont aui-icon-edit"></i>
              <i class="aui-iconfont aui-icon-trash"></i>
            </div>
        </div>
    </li>`
        // $(".recommend_list").append(content);
        $(".editInfos").append(content);
    }

    //增加和发送医嘱对话框
    //点击按钮增加
    $('.aui-icon-plus').click(function() {
        add_recommend();
        console.log("i自加之前" + i);
        i++;
        console.log("i自加之后" + i);
    });

    function add_recommend() {
        var add_content =
            `<li id="list_start" class="aui-list-item">
        <div class="aui-list-item-inner">
            <label>
              <input class="aui-radio" type="checkbox" name="advice${i}" value="医生说：1111">
              <span><input type='text' class='insert_input edit_input${i}' value='请添加医嘱'/></span>
            </label>
            <div style="text-align:right">
              <i class="aui-iconfont aui-icon-edit"></i>
              <i class="aui-iconfont aui-icon-trash"></i>
            </div>
        </div>
    </li>`;
        var newtxt = "";
        $('.editInfos').append(add_content);
        $('.editInfos').scrollTop($('#add_recommend_list')[0].scrollHeight);
        $('.edit_input' + i + '').blur(function() {
            newtxt = $(this).val();
            // console.log("赋值前"+$(this).parent().siblings().val());
            $(this).parent().siblings().val(newtxt);
            // console.log("赋值后"+$(this).parent().siblings().val());

            //发送ajax
            $.ajax({
                url: baseURL + 'adminrecommendController/insert',
                type: 'POST',
                async: true,
                data: {
                    adminid: 1,
                    recommend: newtxt
                },
                timeout: 5000,
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function(xhr) {
                    console.log(xhr);
                    console.log("错误");
                },
            })

        });
    }

    //通过checkbox值增加医嘱
    $('#submit_btn').on('click', function() {
        var chkLg = $('#editForm ul li').length;
        console.log(chkLg);

        $('#dialogBg').fadeOut(1, function() {
            $('#dialog').removeAttr('class').addClass('animated bounceOutUp');
            var items = $(":checkbox");
            for (var i = 0; i < chkLg; i++) {
                if (items[i].checked) {
                    send_recommend(items[i].value,$(items[i]).parent().parent().parent().attr('data-id'));
                }
            }
        });
    });

    //发送医嘱到医嘱历史聊天界面
    function send_recommend(value,recommendid) {
        var content =
        `<li class="list-item">
            <p class="time">
                <span>${getNowFormatDate()}</span>
            </p>
            <div class="doc">
                <button class="status" onclick="finish(event)">未完成</button>
                <img src="assets/images/avatar_doc.jpg"  class="avatar" width="30" height="30">
                <div class="text">${value}</div>
            </div>
        </li>`;
        $("#content_list_recommend_doc").append(content);
        $('.aui-chat_recommend').scrollTop(1800);

        //发送ajax
        $.ajax({
          url: baseURL + "recommendachieveController/insert",
          type: 'POST',
          async: true,
          data:{
            recommendid: recommendid,
            userid: userid,
            status: 0,
            recommend: value
          },
          dataType: 'json',
          timeout: 5000,
          success: function(data){
            console.log(data);
          },
          error: function(xhr){
            console.log(xhr);
          }
        });
        refresh_recommend();
        refresh_recommend_dialog();
    }

    //点击按钮删除
    $('.editInfos').on('click','li .aui-icon-trash',function(){

      var text_content = $(this).parent().siblings().children("span:first").text();

      //查询医嘱列表
      $.ajax({
        url: baseURL + "adminrecommendController/select",
        type: 'POST',
        async: true,
        data: {
          adminid: 1
        },
        timeout: 5000,
        dataType: 'json',
        success: function(data){
          console.log(text_content);
          for(var item of data.body){
            if (item.recommend == text_content) {
              console.log(item.id);
              devare_item(item.id);
            }
          }
        },
        error:function(xhr){
          console.log("错误");
          console.log(xhr);
        },
      })

      //删除医嘱
      function devare_item(id){
        console.log("189 "+id);
          $.ajax({
            url: baseURL + "adminrecommendController/delete",
            type: 'POST',
            async: true,
            data:{
              id: id
            },
            timeout: 5000,
            dataType: 'json',
            success: function(data){
              console.log(data);
            },
            error:function(xhr){
              console.log("错误");
              console.log(xhr);
            },
          });
        }
        $(this).parent().parent().parent().remove();
    });


    function ObjStore(id,value) {
      this.id = id;
      this.value = value;
    }
    //点击按钮编辑
    // var edit = [];
    // var id = "",
    //     value = "";

    //删除edit数组指定位置元素
    // function removeById(array,id) {
    //   for (var i = 0; i < array.length; i++) {
    //     if (array[i].id == id) {
    //       array.splice(i,1);
    //       break;
    //     }else{
    //       return;
    //     }
    //   }
    // }

    $('.editInfos').on('click', 'li .aui-icon-edit', function() {
        var that = $(this);
        var text = that.parent().siblings().children();
        var text_val = text.text();
        var input = $("<input type='text' class='insert_input' value='" + text_val + "'/>");
        text.html(input);
        input.trigger("focus");
        input.blur(function() {
            var newtxt = $(this).val();
            if (newtxt != text_val) {
                text.val(newtxt);
                id = text.parent().parent().parent().attr('data-id');
                value = newtxt;
                update_id(id,value);
                // removeById(edit,that.attr('edit-id'));
                // edit.push(new ObjStore(id,value));
            }
        });
    });

    function update_id(id, value) {
          $.ajax({
              url: baseURL + "adminrecommendController/update",
              type: 'POST',
              async: true,
              data: {
                  id: id,
                  recommend: value
              },
              timeout: 5000,
              dataType: 'json',
              success: function(data) {
                  console.log(data);
                  console.log("修改成功");
              },
              error: function(xhr) {
                  console.log(xhr);
                  console.log("错误");
              },
          })
      }

    $('#submit_btn').click(function edit_recommend() {

      $('#dialogBg_recommend').fadeOut(1, function() {
          $('#dialog_recommend').removeAttr('class').addClass('animated bounceOutUp');

      //修改医嘱
      for (var item of edit) {
        update_id(item.id,item.value);
      }

    });
    });
