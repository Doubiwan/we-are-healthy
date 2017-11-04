    var userId;
    apiready = function() {
      userId = api.pageParam.userId;
      getDocList();
      getInfo(userId);
      $('#submit_patient_info').on('click',function () {
        api.closeWin();
      });
      $('#cancel_info').on('click',function () {
        api.closeWin();
      });
    };
    var baseUrl = 'http://114.215.156.99:8381/backend';
    var docName = {};

    function getDocList() {
      $.ajax({
        url: baseUrl + '/adminController/selectAllByPage',
        type: 'POST',
        async: true,
        data:{
          page: 1,
          rows: 100,
          order: 'id',
          sort: 'asc',
        },
        success:function(data) {
          for (var item of data.rows) {
            var docItem = `<option value=${item.id}>${item.username}</option>`;
            $('#docList').append(docItem);
            docName[item.id]=item.username;
            console.log(docName);
          }
        },
        error:function(xhr) {
          console.log(xhr);
        },
      });
    }

    function getInfo(userId) {
      $.ajax({
        url: baseUrl + '/infoController/selectByUserId',
        type: 'POST',
        async: true,
        data:{
          userid: userId
        },
        success: function(data) {

            if (data.body.userid == userId) {
              //直接写入
              $('#patientname').val(data.body.patientname);

              // $('#birthday').val(data.body.birthday);
              if (data.body.birthday != null) {
                $('#birthday').val(data.body.birthday.split(' ')[0]);
              }

              $('input[name="phone"]').val(data.body.phone);

              $('#familyname').val(data.body.familyname);

              $('input[name="familyphone"]').val(data.body.familyphone);

              $('input[name="height"]').val(data.body.height);

              $('input[name="weight"]').val(data.body.weight);

              $('#txt_area4').val(data.body.address);

              $('input[name=drink][value='+data.body.drink+']').attr('checked','true');

              //判断后写入
              if (data.body.sex == 1) {
                $('#man').attr('checked','true');
              }else{
                $('#woman').attr('checked','true');
              }

              getAdminid(data.body.adminid);

              switch (data.body.educationlevels) {
                case 0:
                  $('#middleSchool').attr('checked','true');
                  break;
                case 1:
                  $('#highSchool').attr('checked','true');
                  break;
                case 2:
                  $('#university').attr('checked','true');
                  break;
                case 3:
                  $('#gradute').attr('checked','true');
                  break;
                default:
                  $('#gradute').attr('checked','true');
              }

              if (data.body.medicationhistory != null) {
                for (var i = 0; i < data.body.medicationhistory.length; i++) {
                  if(data.body.medicationhistory[i] == 1){
                    var j = 0;
                    j = i + 1;
                    $('#medicine'+j).attr('checked','true');
                  }
                }
              }

              if (data.body.pastillness != null) {
                for (var i = 0; i < data.body.pastillness.length; i++) {
                  if (data.body.pastillness[i] == 1){
                    var l = 0;
                    l = i + 1;
                    // console.log($('input[value=1][name=illness'+l+']'));
                    $('input[value=1][name=illness'+l+']').attr('checked','true');
                  }else if (data.body.pastillness[i] == 0) {
                    var l = 0;
                    l = i + 1;
                    console.log($('input[value=1][name=illness'+l+']'));
                    $('input[value=0][name=illness'+l+']').attr('checked','true');
                  }
                }
              }

              if (data.body.tea == 0) {
                $('#teaFalse').attr('checked','true');
              }else if (data.body.tea != 0) {
                $('#teaTrue').attr('checked','true');
                $('#tea_fm').val(data.body.tea);
              }

              if (data.body.coffee == 0) {
                $('#coffeeFalse').attr('checked','true');
              }else if (data.body.coffee != 0) {
                $('#coffeeTrue').attr('checked','true');
                $('#coffee_fm').val(data.body.coffee);
              }

              if (data.body.smoke == 0) {
                $('#smokeFalse').attr('checked','true');
              }else if (data.body.smoke != 0) {
                $('#smokeTrue').attr('checked','true');
                $('#smoke_fm').val(data.body.smoke);
              }

              if (data.body.ets == 1) {
                $('#etsTrue').attr('checked','true');
              }else if (data.body.ets == 0) {
                $('#etsFalse').attr('checked','true');
              }

              switch (data.body.sport) {
                case 0:
                  $('#sport0').attr('checked','true');
                  break;
                case 1:
                  $('#sport1').attr('checked','true');
                  break;
                case 2:
                  $('#sport2').attr('checked','true');
                  break;
                default:
                  $('#sport0').attr('checked','true');
              }
          }
        },
        error:function(xhr) {
          console.log("网络错误");
          console.log(xhr);
        },
      });
    }

    function getAdminid(adminid) {
      console.log(docName);
      for (var i in docName) {
        console.log(i+"  "+adminid+"  "+docName[i]);
        if (i == adminid) {
          console.log("相等");
          $('#docList option:contains('+docName[i]+')').attr("selected", true);
        }
      }
    }

    //日期插件
    if($(".iDate.date").length>0){
      $(".iDate.date").datetimepicker({
        locale:"zh-cn",
        format:"YYYY-MM-DD",
        dayViewHeaderFormat:"YYYY年 MMMM"
      });
    }

    //点击按钮切换样式
    $('.family01').click(function() {
      $('.family01').toggleClass('aui-btn-primary');
    });
    $('.family02').click(function() {
      $('.family02').toggleClass('aui-btn-success');
    });
    $('.family03').click(function() {
      $('.family03').toggleClass('aui-btn-info');
    });
    $('.family04').click(function() {
      $('.family04').toggleClass('aui-btn-warning');
    });
    $('.family11').click(function() {
      $('.family11').toggleClass('aui-btn-primary');
    });
    $('.family12').click(function() {
      $('.family12').toggleClass('aui-btn-success');
    });
    $('.family13').click(function() {
      $('.family13').toggleClass('aui-btn-info');
    });
    $('.family14').click(function() {
      $('.family14').toggleClass('aui-btn-warning');
    });

    $('#submit_patient_info').on('click', function() {

      var adminid = $('.select_style option:selected').val();
      var patientname = $('#patientname').val();
      var birthday = $(".iDate.date input").val();
      var address = $('#txt_area4').val();
      var familyname = $('#familyname').val();
      //sex
      var sex = 0;
      if ($('#man')[0].checked) {
        sex = 1;
      }
      //coffee
      var coffee = 0;
      if ($('#coffeeTrue')[0].checked) {
        coffee = $('#coffee_fm').val();
      }
      //tea
      var tea = 0;
      if ($('#teaTrue')[0].checked) {
        tea = $('#tea_fm').val();
      }
      //smoke
      var smoke = 0;
      if ($('#smokeTrue')[0].checked) {
        smoke = $('#smoke_fm').val();
      }
      //疾病史获取值
      var illness = new Array("0","0","0","0","0");

        if ($('#illness1')[0].checked) {
          illness[0] = 1;
        }else if ($('#illness1')[0].unchecked){
          illness[0] = 0;
        }

        if ($('#illness2')[0].checked) {
          illness[1] = 1;
        }else if ($('#illness2')[0].unchecked){
          illness[1] = 0;
        }

        if ($('#illness3')[0].checked) {
          illness[2] = 1;
        }else if ($('#illness3')[0].unchecked){
          illness[2] = 0;
        }

        if ($('#illness4')[0].checked) {
          illness[3] = 1;
        }else if ($('#illness4')[0].unchecked){
          illness[3] = 0;
        }

        if ($('#illness5')[0].checked) {
          illness[4] = 1;
        }else if ($('#illness5')[0].unchecked){
          illness[4] = 0;
        }
        var pastillness = illness.join().split(",").join("");
        //特殊药物获取checkbox值
        var medicine = new Array("0","0","0","0");

          if ($('#medicine1')[0].checked) {
            medicine[0] = 1;
          }else if($('#medicine1')[0].unchecked) {
            medicine[0] = 0;
          }

          if ($('#medicine2')[0].checked) {
            medicine[1] = 1;
          }else if($('#medicine2')[0].unchecked) {
            medicine[1] = 0;
          }

          if ($('#medicine3')[0].checked) {
            medicine[2] = 1;
          }else if($('#medicine3')[0].unchecked) {
            medicine[2] = 0;
          }

          if ($('#medicine4')[0].checked) {
            medicine[3] = 1;
          }else if($('#medicine4')[0].unchecked){
            medicine[3] = 0;
          }

        var medicationHistory = medicine.join().split(",").join("");
      console.log($('form').serialize() + "&userid=" + userId + "&adminid=" + adminid + "&patientname=" + patientname
            + "&birthday=" + birthday + "&medicationHistory=" + medicationHistory + "&smoke=" + smoke
            + "&pastillness=" + pastillness + "&address=" + address + "&familyname=" + familyname
            + "&coffee=" + coffee + "&tea=" + tea + "&sex=" + sex);
        $.ajax({
            type: "POST",
            url: "http://114.215.156.99:8381/backend/infoController/insert",
            data: $('form').serialize() + "&userid=" + userId + "&adminid=" + adminid + "&patientname=" + patientname
                  + "&birthday=" + birthday + "&medicationhistory=" + medicationHistory + "&smoke=" + smoke
                  + "&pastillness=" + pastillness + "&address=" + address + "&familyname=" + familyname
                  + "&coffee=" + coffee + "&tea=" + tea + "&sex=" + sex,
            async: true,
            error: function(request) {
                alert("Connection error");
            },
            success: function(data) {
                alert("Connection Success->" + JSON.stringify(data));
            }
        });
    });
