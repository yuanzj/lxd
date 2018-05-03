/**
 * @author yidong.wang
 */
/**
 * 定义全局变量
 */
//账号判断变量
var account_val=false;
//密码判断变量
var pwd_val=false;
//密码确认判断变量
var pwd_confirm_val=false;
//验证码判断变量
var validCode_val=false;
//计时
var vericodeInterval;
//判断是否发送验证码成功
var sendValidCode_val='1';
//原触发验证码的按扭样式
var orign_validCode_link;
//用于是否有公告判断
var isNotice = false;
//随机生成的随机码
var randomCodeKey;


$(document).ready(function(){
    var val = judgeBrowser();
    if(val){
       	vericalAlignBody("content");
    	initFunc();        
    }
});

/**
 *初始化各类事件 
 */
function initFunc(){
    clearCookies();    
    elementPosition();
    resizeFunc();   
    //getServiceTime();
    //增加输入框提示
    $( ":input[title]" ).tooltip({
        position: {
        my: "center bottom-5",
        at: "center top",
        using: function( position, feedback ) {
                $( this ).css( position );
                $( "<div>" ).addClass( "arrow bottom" )
                .addClass( feedback.vertical )
                .addClass( feedback.horizontal )
                .appendTo( this );
            }        
        }
    });
    judgeloginAccount();
    judgeloginPwd();
    judgeRandomCode();
    getRandomCodeFunc();
    loginFunc();
    regeisterDialog();
    forgetPwdDialog();
    
    $("#login_randomCode_link").on("click",getRandomCodeFunc);
}

/**
 * 窗口变化事件 
 */
function resizeFunc(){
    $(window).resize( function(){
       elementPosition();
    });
}

/**
 * 元素位置 
 */
function elementPosition(){
     var wind_w = $(this).width();
       if(parseInt(wind_w) < 800){
           $("#login_top").css("left","0px");
           $("#login_middle").css("left","0px");
           $("#login_bottom").css("left","0px");
       }else{
           $("#login_top").css("left",(parseInt(wind_w)-800)/2+"px");
           $("#login_middle").css("left",(parseInt(wind_w)-800)/2+"px");
           $("#login_bottom").css("left",(parseInt(wind_w)-800)/2+"px");
       }
       vericalAlignBody("content");
       $("#rokyinfo-version").html(rokyinfo_version); 
}


/**
 *判断手机号码格式 
 */
function judgeloginAccount(){
    $("#login_account").on("blur",function() {
        if($(this).val().length > 0){            
            //手机号码判断
            if($(this).val().length >= 11){
                var val = phoneCheck($.trim($("#login_account").val()));
                if(val != ""){        
                    $("#login_res_account").html(val);                    
                }
               
            }else if($(this).val().length >=5 && $(this).val().length < 11){
                var is_alphabetAndNumber =isAlphabetAndNumber($(this).val());
                if(!is_alphabetAndNumber){
                   $("#login_res_account").html("用户账号格式不正确！"); 
                }
            }else{
                $("#login_res_account").html("用户账号长度不正确！");    
            }           
        }else{           
            $("#login_res_account").html("用户账号不能为空！");
        }
    });
    
    $("#login_account").on("keydown",function(){        
       $("#login_res_account").html(""); 
    });
}

/**
 *判断密码格式 
 */
function judgeloginPwd(){
    $("#login_pwd").on("blur",function(){
        if($(this).val().length >0){
            var val = pwdCheck($("#login_pwd").val());
            if(val != ""){
                $("#login_res_pwd").html(val);
            }            
        }else{
            $("#login_res_pwd").html("密码不能为空！");
        }        
    });
    
    $("#login_pwd").on("keydown",function(){        
       $("#login_res_pwd").html(""); 
    });
}

/**
 *校验码判断 
 */
function judgeRandomCode(){
    $("#login_randomCode").on("blur",function(){      
        if($(this).val().length == 0){
            $("#login_res_randomCode").html("校验码不能为空！");
        }else if($(this).val().length < 4){
            $("#login_res_randomCode").html("校验码长度不正确！");
        }
    });
    
    $("#login_randomCode").on("keydown",function(){        
       $("#login_res_randomCode").html(""); 
    });
}

/**
 *获取验证码 
 */
function getRandomCodeFunc(){
    randomCodeKey = Math.random(); 
    $.post("http://"+apiURL+"/SpiritServiceApp/getRandomCode",
        {'randomCodeKey':randomCodeKey},
        function(data){
            if(data.state == "0"){  
                $("#login-randomCode-img").attr("src",data.data.url);
            }
        },
        "json"
    );    
}

/**
 *登录操作 
 */
function loginFunc(){
    $("#login").on("click",function(){

        if($("#login_account").val().length <5){
            $("#login_res_account").html("账号长度不正确！");
            return;
        }

        if($("#login_pwd").val().length <6){
            $("#login_res_pwd").html("密码长度不正确！");
            return;
        }

        if($("#login_randomCode").val().length <4){
            $("#login_res_randomCode").html("验证码长度不正确！");
            return;
        }

        if($("#login_res_account").html() != "")return;
        if($("#login_res_pwd").html() != "")return;

        


            var username = $('#login_account').val()
            var userpwd = $('#login_pwd').val()
            // $.post('http://cjl3.rokyinfo.net:8010/auth/token ', {'username': username,'userpwd':userpwd}, function(data){// });
            $.ajax({

                url:'http://cjl3.rokyinfo.net:8010/auth/token',
                type:'POST',


                data: JSON.stringify({
                    phoneNumber: username,
                    password:userpwd
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",

                success:function(json){


                    sessionStorage.token=json.token;
                    sessionStorage.firmFlag=json.firmFlag;
                    sessionStorage.name=json.firmInfoEntityList[0].name;
					sessionStorage.flag=json.firmInfoEntityList[0].flag;
                    window.location.href="./houtai/index1.html";
                    top.window.location="./houtai/index1.html";


					
                     console.log(json.firmInfoEntityList[0].name)
					 console.log(json.firmInfoEntityList[0].flag)
					  console.log(sessionStorage.name)
					  console.log(sessionStorage.flag)


                },
                error:function(err){
                    console.log(err)
                    $.ajax({    
          url:"http://"+apiURL+"/SpiritServiceApp/auth/get_initmenu",    
          type:"POST",    
          data:{'sessionId':$.cookie("uePlate-id")},    
          timeout:30000,    
          dataType:"json",    
          success:function(data){              
                if(data.state != '0'){ 
                   $.cookie("uePlate-senior","false",{expires:date});
                   //普通用户权限
                   if(userData.role == '0'){
                        window.location.href="html/customerSpace/c_main.html";                                          
                   }else{
                        showCommonDefineDialog("系统提示","\n\n\n\n您无权进入本系统！"); 
                   }                
                }else if(data.state == '0'){
                   var isSenior;
                   if(data.data.length == 0){
                       $.cookie("uePlate-senior","false",{expires:date});
                       isSenior=false;
                   }else{
                       $.cookie("uePlate-senior","true",{expires:date});
                       isSenior=true;
                   }
                   $.cookie("uePlate-role",userData.role,{expires:date});
                   if(isSenior){                       
                       window.location.href="html/generalSpace/main.html";                       
                   }else{
                       //普通用户权限
                       if(userData.role == '0'){
                            window.location.href="html/customerSpace/c_main.html";                                              
                        }else{
                            showCommonDefineDialog("系统提示","\n\n\n\n您无权进入本系统！");   
                        }
                   }                                               
                }
          },    
          error:function(){
			   alert('用户名或密码错误');
                hideLoading();
                var cont = "<table align='center' cellpadding='0' cellspacing='0' border='0' class='common-tab offset-top-4x'>";
                cont += "<tr><td><i class='fa fa-close fa-12x red offset-right-2x'></i><font class='common-infoMsg-1'>网络异常</font></td></tr>";
                cont += "<tr height='45px'><td></td></tr>";
                cont += "<tr><td>网络连接无反应，请检查是否联网！</td></tr>";
                cont += "<tr height='45px'></tr>";
                cont += "<tr><td><button type='button' class='btn btn-sm btn-primary box-input-8x' onclick='toCloseErrorDialog()'>确定</button></td></tr>";
                cont += "</table>";
                initErrorDialog(cont);            
          }    
     });
                }

            });

            return;
      

        $.post(
            "http://"+apiURL+"/SpiritServiceApp/UserManager/web_login",
            {'account': $("#login_account").val(), 'password': $("#login_pwd").val(),'veriCode':$("#login_randomCode").val(),'randomCodeKey':randomCodeKey},
            function(data){
                if(data.state == '0'){                        
                        var date = new Date();
                        date.setTime(date.getTime() + (1 * 12 * 60 * 60 * 1000));                        
                        $.cookie("uePlate-id",data.data.sessionId,{expires:date});
                        $.cookie("uePlate-account",$("#login_account").val(),{expires:date});
                        $("#login_account").val("");
                        $("#login_pwd").val("");
                        $("#login_randomCode").val("");
                    judgeIsSenior(data.data,date);                                                     
                }else if(data.state == '1'){
                    $("#login_res_account").html(data.message);
                }else if(data.state == '2'){
                    $("#login_res_randomCode").html(data.message);
                }else{
                	$("#login_res_account").html(data.message);
                }
            },
            "json"
        );       
    });
}

/**
 * 判断是否有后台管理的权限
 * @param userData 用户信息
 * @param date 当前日期 
 */
function judgeIsSenior(userData,date){
   
}


//*******************************注册各类弹出框 *******************************************
/**
 *初始化注册弹出框
 */
function regeisterDialog(){
    $("#regeister").on("click",function(){
       //****临时公告生成*******
       if(isNotice){
            createNotice(); 
            return;
       };//****临时公告生成*******
       
          
       $("#regeister-dialog").html(createRegeisterTable());
       $("#regeister-dialog").dialog({
          autoOpen: false,
          resizable: false,
          height:560,
          width:600,
          modal: true,
          closeText:"关闭",
          close: function(ev, ui) { $("#regeister-dialog").dialog( "close" );}                   
        });        
        $("#regeister-dialog").dialog( "open" );        
    });    
}

/**
 *初始化忘记密码弹出框 
 */
function forgetPwdDialog(){
    $("#forgetPwd_link").on("click",function(){
        
       $("#forgetPwd-dialog").html(createForgetPwdTable_step1());
       $("#forgetPwd-dialog").dialog({
          autoOpen: false,
          resizable: false,
          height:320,
          width:560, 
          modal: true,
          closeText:"关闭",
          close: function(ev, ui) { $("#forgetPwd-dialog").dialog( "close" );}                   
        });  
        $("#forgetPwd-dialog").dialog( "open" );      
    });
}

/**
 *关闭信息弹出框 
 */
function close_info_dialog(){
    if(vericodeInterval != null){
        clearInterval(vericodeInterval);
    }
    $("#info_dialog").dialog("close");
}


//*******************************各类弹出框内容*******************************************
/**
 * 新用户注册界面
 */ 
function createRegeisterTable(){    
    var cont = "<input type='hidden' id='countDownTime'/>";
    cont += "<table align='center' cellpadding='0' cellspacing='0' border='0' class='login_tabInfo'>";
    cont += "<tr height='35px'>";
    cont += "<th width='100px'>手机号码：</th>";
    cont += "<td width='160px'><input type='text' id='regeister_account' class='form-control input-xs box-input-15x' onblur='judgeAccountIsExist(this)' onkeydown='judgeIsEmpty(this)' maxlength='11'/></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px'><i id='regeister_account_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='240px'><div id='regeister_account_msg' class='login_box_msg black'>请输入中国大陆手机号码</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<th>登录密码：</th>";
    cont += "<td><input type='password' id='regeister_pwd' class='form-control input-xs box-input-15x' onblur='judgePwdFormat(this)' onkeydown='judgeIsEmpty(this)' onkeyup='showPwdStrength(this)' maxlength='16'/></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px'><i id='regeister_pwd_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='240px'><div id='regeister_pwd_msg' class='login_box_msg black'>请设置新密码,密码长度6-16位</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<th>密码强度：</th>";
    cont += "<td height='27px'>";
    cont += "<div class='regeister_pwdLevel_div'>";
    cont += "<div id='regeister_pwdLevel1' class='pwdLevel1'>弱</div>";
    cont += "<div id='regeister_pwdLevel2' class='pwdLevel2'>中</div>";
    cont += "<div id='regeister_pwdLevel3' class='pwdLevel3'>强</div>";
    cont += "</div>";
    cont += "</td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px'><i id='regeister_pwdLevel_flag' class=''></i></td>";
    cont += "<td width='240px'><div id='regeister_pwdLevel_msg' class='login_box_msg black'></div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<th>再次输入：</th>";
    cont += "<td><input type='password' id='regeister_pwdConfirm' class='form-control input-xs box-input-15x' onblur='judgeTwoPwd(this)' onkeydown='judgeIsEmpty(this)' maxlength='16'/></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px'><i id='regeister_pwdConfirm_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='240px'><div id='regeister_pwdConfirm_msg' class='login_box_msg black'>再次输入新密码</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<td></td>";
    cont += "<td><div id='regeister_validCode_div'><a href='javascript:void(0);' id='regeister_validCode_link' onclick='getValidCode(this)' class='validCode_link'>点击免费获取验证码</a></div></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px'><i id='regeister_validCode_link_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='240px'><div id='regeister_validCode_link_msg' class='login_box_msg black'>每隔60秒发送一次验证码</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<th>验证码：</th>";
    cont += "<td><input type='text' id='regeister_validCode' class='form-control input-xs box-input-8x' onblur='judgeValidCodeFormat(this)' onkeydown='judgeIsEmpty(this)' maxlength='6'/></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px'><i id='regeister_validCode_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='240px'><div id='regeister_validCode_msg' class='login_box_msg black'>请输入手机收到的6位数验证码</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='188px'>";
    cont += "<th>注册协议：</th>";
    cont += "<td colspan='2' align='left'>";
    cont += "<div class='login_newRegister_protocol'>";
    cont += "<p align='center'>注册协议</p><br>";
    cont += "<p>1、规则及网址访问条件</p>";
    cont += "<p>&nbsp;&nbsp;以下规则适用于所有访问本网站的用户或浏览者，无锡锐祺物联网技术有限公司（锐祺）保留随时修改这些规则的权利。规则一旦发生变动，锐祺将在本网站公布修改内容，修改后的规则一旦在本网站公布即有效替代原来的规则。访问本网站的权利由锐祺根据下列规则条款授予。如果您不同意下列任何规则条款和/或锐祺随时对其的任何修改，请停止使用本网站；您一旦使用本网站，即视为您已了解并完全同意下列规则，包括锐祺对规则随时所做的任何修改。对于违反这些规则的行为，锐祺有权采取法律和公平的补救措施。</p><br>";
    cont += "<p>2、不承诺责任声明</p>";
    cont += "<p>&nbsp;&nbsp;本网站所载的材料和信息，包括但不限于文本、图片、数据、观点、建议、网页或链路，虽然锐祺意图在网站上提供准确的材料和信息，但锐祺并不保证这些材料和内容的准确、完整、充分和可靠性，并且明确声明不对这些材料和内容的任何错误或遗漏承担责任，也不对这些材料和内容作出任何明示或默示的、包括但不限于有关所有权担保、没有侵犯第三方权利、质量和没有计算机病毒的保证。锐祺可以在没有任何通知或提示的情况下随时对本网站上的内容进行修改而无需承担任何责任，为了得到最新版本的信息，请定时访问本网站。锐祺在本网站上所提及的任何非锐祺产品或服务仅仅是为了提供相关信息，并不构成对这些产品、服务的认可或推荐。因使用或依赖任何这些产品、服务所产生的任何损害或损失，锐祺不负任何直接或间接之责任。锐祺并不就网站上提供的任何产品、服务或信息作出任何声明、保证或认可，所有销售的产品和服务应受锐祺的销售合同和条款的约束。</p><br>";
    cont += "<p>3、著作权说明</p>";
    cont += "<p>&nbsp;&nbsp;本网站所载的所有材料或内容受版权法的保护，所有版权由锐祺拥有，但注明引用其他方的内容除外。未经锐祺或其他方事先书面许可，任何人不得将本网站上的任何内容以任何方式进行修改、复制、经销、翻印、播放、以超级链路连接或传送、以‘镜像法’载入其他服务器上、存储于信息检索系统或者其他任何商业目的的使用，但对于非商业目的的、个人使用的下载或打印（条件是不得修改，且须保留该材料中的版权说明或其他所有权的说明）除外。</p><br>";
    cont += "<p>4、商标</p>";
    cont += "<p>&nbsp;&nbsp;锐祺网站上使用和显示的所有商标、标志皆属锐祺所有，但注明属于其他方拥有的商标、标志、商号除外。锐祺网站所载的任何内容不应被视作未经锐祺或其他方书面许可，以暗示、不反对或其他形式授予使用前述任何商标、标志的许可或权利。未经锐祺或其他方事先书面许可，任何人不得以任何方式使用锐祺名称及锐祺的商标、标记。</p><br>";
    cont += "<p>5、提供的产品或服务</p>";
    cont += "<p>&nbsp;&nbsp;由于互联网的国际性或无国界性，因此通过本网站所提供的信息亦具有国际性，所以不是所有的在本网站上所提到的产品或服务在您的国家或地区都提供，请联系当地的销售代表或代理商了解在您的国家或地区所提供的产品或服务。</p><br>";
    cont += "<p>6、第三方链接</p>";
    cont += "<p>&nbsp;&nbsp;本网站可能保留有与第三方网站或网址的链接，访问这些链接将由用户自己作出决定，锐祺并不保证这些链接上所提供的任何信息、数据、观点、图片、陈述或建议的准确性、完整性、充分性和可靠性。锐祺提供这些链接仅仅在于提供方便，并不表示锐祺对这些信息的认可和推荐，也不是用于宣传或广告目的。因使用或依赖任何这些链接发布的或经由此类链接获得的任何内容、商品或服务所产生的任何损害或损失，锐祺不负任何直接或间接之责任。</p><br>";
    cont += "<p>7、个人信息的保护</p>";
    cont += "<p>&nbsp;&nbsp;锐祺充分尊重您的隐私权，并且不遗余力保护您的个人信息。通常情况下，您不需要提供任何个人信息就可以浏览锐祺的网站。为特定的目的，如果您以自愿填写的方式提供注册或订阅电子信息所需的姓名、性别、证件种类及证件号、出生年月日、国家、电子邮件信箱、电话、联系地址和邮政编码、所希望提供的服务或喜好信息、客户代码以及其他类似的个人信息，则表示您已经了解并接受您个人信息的用途，同意锐祺为实现该特定目的使用您的个人信息。锐祺承诺在任何时候、任何情况下都不会出售您的个人信息，锐祺只会在法律允许的范围内使用根据本条款获得的信息。但锐祺会在您同意让第三方共享个人信息的情况下，向第三方提供您同意提供的个人信息；锐祺可能会根据法律、政府部门的要求向这些部门提供您某些个人信息；或在锐祺有理由认为有必要这样做来保护锐祺、客户或公众时，在尽可能小的范围内公开某些个人信息，在您提供个人信息的时候应该已经预见并同意这种情况的发生。</p><br>";
    cont += "<p>8、适用法律和管辖权</p>";
    cont += "<p>&nbsp;&nbsp;通过访问本网站及使用通过本网站网址提供的设施和（或）服务，即表示您同意该访问及该实施和/或服务的提供受中华人民共和国法律的约束，且您同意受中华人民共和国法院的管辖。</p><br>";
    cont += "<p>9、一般条款</p>";
    cont += "<p>&nbsp;&nbsp;锐祺未行使或执行上述规则项下的任何权利或规定，不构成对上述规则之放弃。若上述规则之任何规定因与中华人民共和国法律抵触而无效，其他规定应继续具有完整的效力。</p><br>";
    cont += "<p>本说明之标题仅为方便而设，不具有任何法律或契约效力。</p>";
    cont += "</div>";
    cont += "</td>";
    cont += "</tr>";
    
    cont += "<tr height='30px'></tr>";
    
    cont += "<tr height='35px'>";
    cont += "<td><td>";
    cont += "<td colspan='2' align='right'>";
    cont += "<table cellpadding='0' cellspacing='0' border='0'>";
    cont += "<tr>";
    cont += "<td width='180px' align='center'>";
    cont += "<button type='button' class='btn btn-sm btn-primary box-input-16x' onclick='regeister()' autofocus>我同意并遵守以上协议</button>";
    cont += "</td>";
    cont += "<td>";
    cont += "<button type='button' class='btn btn-sm btn-info box-input-8x' onclick='close_regeister_dialog()'>退出注册</button>";
    cont += "</td>";
    cont += "</tr>";
    cont += "</table>";
    cont += "<td>";
    cont += "</tr>";
    
    cont += "<tr height='10px'></tr>";
    cont += "</table>";
    return cont;
}

/**
 *关闭注册对话框 
 */
function close_regeister_dialog(){
    if(vericodeInterval != null){
        clearInterval(vericodeInterval);
    }
    $("#regeister-dialog").dialog("close");    
}

/**
 *注册新用户 
 */
function regeister(){
    if(account_val == false){
        $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
        $("#regeister_account_msg").html("账号不符合要求！");
        return;
    }
    
    if(pwd_val == false){
        $("#regeister_pwd_flag").removeClass().addClass('fa fa-close red');
        $("#regeister_pwd_msg").html("密码不符合要求！");
        return;
    }
    
    if(pwd_confirm_val == false){
        $("#regeister_pwdConfirm_flag").removeClass().addClass('fa fa-close red');
        $("#regeister_pwdConfirm_msg").html("确认密码不符合要求！"); 
        return;
    }
    
    if(validCode_val == false){
        $("#regeister_validCode_flag").removeClass().addClass('fa fa-close red');
        $("#regeister_validCode_msg").html("验证码不符合要求！");
        return;
    }
    
    var account = $("#regeister_account").val();
    var pwd = $("#regeister_pwd").val();
    var validCode = $("#regeister_validCode").val();
    
    $.post(  
        "http://"+apiURL+"/SpiritServiceApp/UserManager/register",
        {'mobile': account,'password':pwd,'confirmpassword':pwd,'veriCode':validCode},
        function(data){
            if(data.state == '0'){
               close_regeister_dialog();
               showRegeisterSuccessResult(account);
               account_val = false;
               pwd_val = false;
               pwd_confirm_val = false;
               validCode_val = false; 
            }else if(data.state == '5'){
               $("#regeister_validCode_flag").removeClass().addClass('fa fa-close red');
               $("#regeister_validCode_msg").html("短信验证码错误！");     
               validCode_val = false;
            }else{
               close_regeister_dialog();
               showRegeisterFailureResult(); 
               account_val = false;
               pwd_val = false;
               pwd_confirm_val = false;
               validCode_val = false;
            }
        },
        "json"
    );            
}

/**
 * 显示注册对话框返回成功信息
 * @param account
 */
function showRegeisterSuccessResult(account){
    var cont = "<table align='center' cellpadding='0' cellspacing='0' border='0' class='login_tabInfo offset-top-8x'>";
    cont += "<tr><tr>";
    cont += "<tr><td><i class='fa fa-smile-o fa-2x red'></i>恭喜!&nbsp;&nbsp;&nbsp;&nbsp;您成功完成账户注册！</td></tr>";
    cont += "<tr><td>注册账号为：【<font class='font-18 red'>"+account+"</font>】</td></tr>";
    cont += "<tr><td>请用此账号登陆系统</td></tr>";
    cont += "<tr height='70px'></tr>";
    cont += "<tr><td><button type='button' class='btn btn-sm btn-primary box-input-8x' onclick='close_info_dialog()' autofocus>重新登录</button></td></tr>";
    cont += "</table>";
    
    $("#info_dialog").html(cont);
    infoDialog(300,400);   
    $("#info_dialog").dialog("open");
}

/**
 * 显示注册对话框返回失败信息
 */
function showRegeisterFailureResult(){
    var cont = "<table align='center' cellpadding='0' cellspacing='0' border='0' class='login_tabInfo offset-top-8x'>";
    cont += "<tr><tr>";
    cont += "<tr><td><i class='fa fa-thumbs-o-down fa-2x red'></i>杯催！&nbsp;&nbsp;&nbsp;&nbsp;注册失败！</td></tr>";
    cont += "<tr height='30px'><td></td></tr>";
    cont += "<tr><td>请重试，谢谢！</td></tr>";
    cont += "<tr height='40px'></tr>";
    cont += "<tr><td><button type='button' class='btn btn-sm btn-warning box-input-8x' onclick='close_info_dialog()' autofocus>退出</button></td></tr>";
    cont += "</table>";
    
    $("#info_dialog").html(cont);
    infoDialog(300,400);   
    $("#info_dialog").dialog("open");
}


/**
 * 忘记密码界面  第一步：输入账号
 */
function createForgetPwdTable_step1(){
    var cont = "<input type='hidden' id='countDownTime'/>";
    cont += "<table align='center' cellpadding='0' cellspacing='0' border='0'>";
    cont += "<tr>";
    cont += "<td width='280px' height='40px'>";
    cont += "<span class='fa-stack fa-lg'>";
    cont += "<i class='fa fa-circle fa-stack-2x red'></i>";
    cont += "<i class='fa fa-stack-1x fa-inverse white'><strong>1</strong></i>";
    cont += "</span>";
    cont += "<strong><font class='font-15 offset-left-5x red'>输入手机号码</font></strong>";
    cont += "</td>";

    cont += "<td width='280px'>";
    cont += "<span class='fa-stack fa-lg'>";
    cont += "<i class='fa fa-circle fa-stack-2x grey-black'></i>";
    cont += "<i class='fa fa-stack-1x fa-inverse white'><strong>2</strong></i>";
    cont += "</span>";
    cont += "</td>";
    cont += "</tr>";
    
    cont += "<tr>";
    cont += "<td class='bg-red' height='2px'></td>";
    cont += "<td class='bg-grey-black'></td>";
    cont += "</tr>";
    cont += "</table>";
    
    
    cont += "<table align='center' cellpadding='0' cellspacing='0' border='0' class='login_tabInfo offset-top-2x'>";
    cont += "<tr height='10px'></tr>";
    cont += "<tr height='35px'>";
    cont += "<th width='80px'>手机号码：</th>";
    cont += "<td><input type='text' id='forgetPwd_account' class='form-control input-xs box-input-15x' onblur='judgeAccountIsExist(this)' onkeydown='judgeIsEmpty(this)' maxlength='11'/></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px' align='center'><i id='forgetPwd_account_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='210px'><div id='forgetPwd_account_msg' class='login_box_msg black'>请输入中国大陆手机号码</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<td></td>";
    cont += "<td><div id='forgetPwd_validCode_div'><a href='javascript:void(0);' id='forgetPwd_validCode_link' onclick='getValidCode(this)' class='validCode_link'>点击免费获取验证</a></div></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px' align='center'><i id='forgetPwd_validCode_link_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='210px'><div id='forgetPwd_validCode_link_msg' class='login_box_msg black'>每隔60秒发送一次验证码</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<th>验证码：</th>";
    cont += "<td><input type='text' id='forgetPwd_validCode' class='form-control input-xs box-input-8x' onblur='judgeValidCodeFormat(this)' onkeydown='judgeIsEmpty(this)' maxlength='6'/></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px' align='center'><i id='forgetPwd_validCode_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='210px'><div id='forgetPwd_validCode_msg' class='login_box_msg black'>请输入手机收到的6位数验证码</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='20px'></tr>";
    
    cont += "<tr>";
    cont += "<td colspan='3'>";
    cont += "<table border='0' align='center'><tr>";
    cont += "<td>";
    cont += "<button type='button' class='btn btn-sm btn-warning box-input-8x' onclick='close_forgetPwd_dialog()'><li class='fa fa-sign-out fa-rotate-180 offset-right-1x white'></li>退出</button>";
    cont += "</td>";
    cont += "<td width='50px'></td>";
    cont += "<td>";
    cont += "<button type='button' class='btn btn-sm btn-primary box-input-8x' onclick='forgetPwd_valid()' autofocus>下一步<li class='fa fa-angle-double-right white offset-left-1x'></li></button>";
    cont += "</td>";
    cont += "</tr></table>";
    cont += "</td>";
    cont += "</tr>";
    
    cont += "</table>";
    return cont;
}

/**
 *关闭忘记密码窗口 
 */
function close_forgetPwd_dialog(){
    if(vericodeInterval != null){
        clearInterval(vericodeInterval);
    }
    $("#forgetPwd-dialog").dialog("close");
}

/**
 *验证手机收到的验证码是否一致 
 */
function forgetPwd_valid(){
    if(account_val == false){
        $("#forgetPwd_account_flag").removeClass().addClass('fa fa-close red');
        $("#forgetPwd_account_msg").html("账号不符合要求！");
        return;
    }
    
    if(validCode_val == false){
        $("#forgetPwd_validCode_flag").removeClass().addClass('fa fa-close red');
        $("#forgetPwd_validCode_msg").html("验证码不符合要求！");
        return;
    }
    
    var account = $("#forgetPwd_account").val();
    var validCode = $("#forgetPwd_validCode").val();  

    $.post(
        "http://"+apiURL+"/SpiritServiceApp/UserManager/validVeriCode",
        {'mobile': account,'veriCode':validCode,'type':"FA"},
        function(data){
            if(data.state == '0'){
                $("#forgetPwd-dialog").html(createForgetPwdTable_step2(account,validCode));
            }else{
                $("#forgetPwd_validCode_flag").removeClass().addClass('fa fa-close red');
                $("#forgetPwd_validCode_msg").html("验证码不正确，请核实！");
            }
        },
       "json"
    );    
}


/**
 * 生成忘记密码界面   第二步：重置密码
 */
function createForgetPwdTable_step2(account,validCode){
	var cont = "<input type='hidden' id='forgetPwd_step2_account' value='"+account+"'/>";
	cont += "<input type='hidden' id='forgetPwd_step2_validCode' value='"+validCode+"'/>";
	cont += "<table align='center' cellpadding='0' cellspacing='0' border='0'>";
    cont += "<tr>";
    cont += "<td width='280px' height='40px'>";
    cont += "<span class='fa-stack fa-lg'>";
    cont += "<i class='fa fa-circle fa-stack-2x grey-black'></i>";
    cont += "<i class='fa fa-stack-1x fa-inverse white'><strong>1</strong></i>";
    cont += "</span>";  
    cont += "</td>";

    cont += "<td width='280px'>";
    cont += "<span class='fa-stack fa-lg'>";
    cont += "<i class='fa fa-circle fa-stack-2x red'></i>";
    cont += "<i class='fa fa-stack-1x fa-inverse white'><strong>2</strong></i>";
    cont += "</span>";
    cont += "<strong><font class='font-15 offset-left-5x red'>修改密码</font></strong>";
    cont += "</td>";
    cont += "</tr>";
    
    cont += "<tr>";
    cont += "<td class='bg-grey-black' height='2px'></td>";
    cont += "<td class='bg-red'></td>";
    cont += "</tr>";
    cont += "</table>";
    	
	
	cont += "<table align='center' cellpadding='0' cellspacing='0' border='0' class='login_tabInfo'>";
	cont += "<tr height='10px'></tr>";
	cont += "<tr height='35px'>";
    cont += "<th>新密码：</th>";
    cont += "<td><input type='password' id='forgetPwd_pwd' class='form-control input-xs box-input-15x' onblur='judgePwdFormat(this)' onkeydown='judgeIsEmpty(this)' onkeyup='showPwdStrength(this)' maxlength='16'/></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px' align='center'><i id='forgetPwd_pwd_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='210px'><div id='forgetPwd_pwd_msg' class='login_box_msg black'>请设置新密码,密码长度6-16位</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<th>密码强度：</th>";
    cont += "<td height='27px'>";
    cont += "<div class='regeister_pwdLevel_div'>";
    cont += "<div id='forgetPwd_pwdLevel1' class='pwdLevel1'>弱</div>";
    cont += "<div id='forgetPwd_pwdLevel2' class='pwdLevel2'>中</div>";
    cont += "<div id='forgetPwd_pwdLevel3' class='pwdLevel3'>强</div>";
    cont += "</div>";
    cont += "</td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px' align='center'><i id='forgetPwd_pwdLevel_flag' class=''></i></td>";
    cont += "<td width='210px'><div id='forgetPwd_pwdLevel_msg' class='login_box_msg black'></div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
    
    cont += "<tr height='35px'>";
    cont += "<th>再次输入：</th>";
    cont += "<td><input type='password' id='forgetPwd_pwdConfirm' class='form-control input-xs box-input-15x' onblur='judgeTwoPwd(this)' onkeydown='judgeIsEmpty(this)' maxlength='16'/></td>";
    cont += "<td><table>";
    cont += "<tr>";
    cont += "<td width='20px' align='center'><i id='forgetPwd_pwdConfirm_flag' class='fa fa-exclamation-circle gold-yellow'></i></td>";
    cont += "<td width='210px'><div id='forgetPwd_pwdConfirm_msg' class='login_box_msg black'>再次输入新密码</div></td>";
    cont += "</tr>";
    cont += "</table></td>";
    cont += "</tr>";
		
	cont += "<tr height='20px'></tr>";
	
	cont += "<tr>";
    cont += "<td colspan='3'>";
    cont += "<table border='0' align='center'><tr>";
    cont += "<td>";
    cont += "<button type='button' class='btn btn-sm btn-warning box-input-8x' onclick='close_forgetPwd_dialog()'><li class='fa fa-sign-out fa-rotate-180 offset-right-1x white'></li>退出</button>";
    cont += "</td>";
    cont += "<td width='50px'></td>";
    cont += "<td>";
    cont += "<button type='button' class='btn btn-sm btn-primary box-input-8x' onclick='forgetPwd_modify()' autofocus>提交<li class='fa fa-angle-double-right white offset-left-1x'></li></button>";
    cont += "</td>";
    cont += "</tr></table>";
    cont += "</td>";
    cont += "</tr>";
	
	cont += "</table>";	
    return cont;
}

/**
 *修改密码 
 */
function forgetPwd_modify(){
    if(pwd_val == false){
        $("#forgetPwd_pwd_flag").removeClass().addClass('fa fa-close red');
        $("#forgetPwd_pwd_msg").html("密码不符合要求！");
        return;
    }
    
    if(pwd_confirm_val == false){
        $("#forgetPwd_pwdConfirm_flag").removeClass().addClass('fa fa-close red');
        $("#forgetPwd_pwdConfirm_msg").html("确认密码不符合要求！"); 
        return;
    }
    
    var account = $("#forgetPwd_step2_account").val();
    var validCode = $("#forgetPwd_step2_validCode").val();
    var pwd = $("#forgetPwd_pwd").val();
    
    $.post(
        "http://"+apiURL+"/SpiritServiceApp/UserManager/setPwd",
        {'mobile': account,'password':pwd,'confirmpassword':pwd,'veriCode':validCode,'from':"web"},
        function(data){
            if(data.state == '0'){
                close_forgetPwd_dialog();
                showModifySuccessResult(account);
            }else{
                showModifyFailureResult(account);
            }
        },
        "json"
    );
}


function showModifySuccessResult(account){
    var cont = "<table align='center' cellpadding='0' cellspacing='0' border='0' class='login_tabInfo offset-top-8x'>";
    cont += "<tr><tr>";
    cont += "<tr><td><i class='fa fa-thumbs-o-up fa-2x red'></i>恭喜!&nbsp;&nbsp;&nbsp;&nbsp;密码重置成功！</td></tr>";
    cont += "<tr><td>账号为：【<font class='font-18 red'>"+account+"</font>】的密码已改变</td></tr>";
    cont += "<tr><td>请用新密码登陆系统，谢谢！</td></tr>";
    cont += "<tr height='40px'></tr>";
    cont += "<tr><td><button type='button' class='btn btn-sm btn-primary box-input-8x regeister_cancel' onclick='close_info_dialog()' autofocus>重新登录</button></td></tr>";
    cont += "</table>";
    
    $("#info_dialog").html(cont);
    infoDialog(300,400);   
    $("#info_dialog").dialog("open");
}

function showModifyFailureResult(account){
    var cont = "<table align='center' cellpadding='0' cellspacing='0' border='0' class='login_tabInfo offset-top-8x'>";
    cont += "<tr><tr>";
    cont += "<tr><td><i class='fa fa-thumbs-o-down fa-2x red'></i>杯催!&nbsp;&nbsp;&nbsp;&nbsp;密码重置失败！</td></tr>";
    cont += "<tr height='30px'><td></td></tr>";
    cont += "<tr><td>请重试，谢谢！</td></tr>";
    cont += "<tr height='40px'></tr>";
    cont += "<tr><td><button type='button' class='btn btn-sm btn-warning box-input-8x regeister_cancel' onclick='close_info_dialog()'>退出</button></td></tr>";
    cont += "</table>";
    
    $("#info_dialog").html(cont);
    infoDialog(300,400);   
    $("#info_dialog").dialog("open");
}

/**
 * 通用重新打开登录界面
 */
function reLogin(){
	var fromValue = $("#fromPage").val();
	var fromPage = fromValue.substring(0,fromValue.length-7);
	if(fromPage == 'common'){		
		top.location='login.html';
	}else {
		top.location= fromPage+'.html';
	}
}

/**
 * 提示服务器当前时间
 */
function getServiceTime(){
	$.ajax({
		type: "post",
		dataType: "json",
		url: "login.action?method=getServiceTime",
		success:function(data){		
			var dateAry = data.split("|");
			var timeAry = dateAry[1].split(":");
			var hh = timeAry[0];
			var mm = timeAry[1];
			if(dateAry[0] == "2014-12-12" || dateAry[0] == "2014-12-13" || dateAry[0] == "2014-12-14"){
				createNotice();
				isNotice = true;				
			}else{
				isNotice = false;
			}		
		}
	});	
}

/**
 * 生成临时公告栏
 */
function createNotice(){
	var cont = "<table align='center' cellpadding='0' cellspacing='0' border='0' class='login_tabInfo'>";
	cont += "<tr height='40px'><td align='center' style='font-size:15px;'>系统公告</td></tr>";
	cont += "<tr height='10px'></tr>";
	cont += "<tr><td><div>";
	cont += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;系统将于12月12日（星期五）、12月13日（星期六）、12月14日（星期日）进行线路升级，届时将影响新注册用户无法进行正常注册，<br>12月15日开始恢复正常，为此给您造成不便，敬请谅解！<br><br><br>如有疑问请拨打客服热线：18806170721";
	cont += "</div></td></tr>";
	cont += "<tr height='10px'></tr>";	
	cont += "</table>";
	return cont;
}


//***************************************************共用方法*******************************

/**
 * 判断账号是否存在
 */
function judgeAccountIsExist(obj){
	if(obj.id == "regeister_account"){
	    if(obj.value.length >=5){
	        var is_number = isNumber(obj.value);
            var is_alphabet = isAlphabet(obj.value);
	        //管理员类判断(全数字)
	        if(obj.value.length < 6){
	            if(is_number == true && is_alphabet == false){
	                getAccountFromDB(obj.value,obj.id);	                
	            }else{
	                $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
	                $("#regeister_account_msg").html("管理员类账号应由纯数字组合！");
	                account_val = false; 
	            }	            
	        }else if(obj.value.length >= 6){
	             //用户手机号码判断 (全数字) 
	             if(obj.value.length == 11){
	                 if(is_number == true && is_alphabet == false){
	                    if(phoneCheck($.trim($("#"+obj.id).val())) != ""){
	                        $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
                            $("#regeister_account_msg").html(phoneCheck($.trim($("#"+obj.id).val())));
                            account_val = false; 
	                    }else{
	                        getAccountFromDB(obj.value,obj.id);                                                    
	                    }
                     }else{
                        $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
                        $("#regeister_account_msg").html("手机号码应由11位纯数字组合！");
                        account_val = false; 
                     }
	             }else{
	                 //用户编号(数字)
	                 if(is_number == true && is_alphabet == false){
	                     getAccountFromDB(obj.value,obj.id); 
	                 //用户昵称(字母+数字)
	                 }else if(is_number == true && is_alphabet == true){
	                     getAccountFromDB(obj.value,obj.id); 
	                 }else if(is_number == false && is_alphabet == true){
	                     $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
                         $("#regeister_account_msg").html("用户昵称账号应是由字母与数字组合！");
                         account_val = false; 
	                 }else{
	                     $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
                         $("#regeister_account_msg").html("用户编号应是由纯数字组合！");
                         account_val = false; 
	                 }    
	                 
	             }	            
	     
	        }
	    }else{
	        $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
	        $("#regeister_account_msg").html("号码长度不正确!");
	        account_val = false; 
	    }		
	}else if(obj.id == "forgetPwd_account"){
		if(phoneCheck($.trim($("#"+obj.id).val())) != ""){
            $("#forgetPwd_account_flag").removeClass().addClass('fa fa-close red');
            $("#forgetPwd_account_msg").html(phoneCheck($.trim($("#"+obj.id).val())));
            account_val = false; 
        }else{
            getAccountFromDB(obj.value,obj.id);                                    
        }
	}
}

/**
 *判断密码格式是否正确 
 */
function judgePwdFormat(obj){
    var val = pwdCheck($("#"+obj.id).val());
    if(obj.id == "regeister_pwd"){
        if(val != ""){
            $("#regeister_pwd_flag").removeClass().addClass('fa fa-close red');
            $("#regeister_pwd_msg").html(val);
            pwd_val = false;            
        }else{
            $("#regeister_pwd_flag").removeClass().addClass('fa fa-check green');
            $("#regeister_pwd_msg").html("");
            pwd_val = true;           
        }        
    }else if(obj.id == "forgetPwd_pwd"){
       if(val != ""){
            $("#forgetPwd_pwd_flag").removeClass().addClass('fa fa-close red');
            $("#forgetPwd_pwd_msg").html(val);
            pwd_val = false;            
        }else{
            $("#forgetPwd_pwd_flag").removeClass().addClass('fa fa-check green');
            $("#forgetPwd_pwd_msg").html("");
            pwd_val = true;           
        }  
    }    
}

/**
 *密码强度显示 
 */
function showPwdStrength(obj){
    var val = pwdStrengthCheck(obj.value);
    if(obj.id == "regeister_pwd"){
        if(val < 1){
            $("#regeister_pwdLevel_flag").removeClass();
            $("#regeister_pwdLevel_msg").html("");
            $("#regeister_pwdLevel1").html("弱");
            $("#regeister_pwdLevel1").removeClass().addClass('pwdLevel1');
            $("#regeister_pwdLevel2").html("中");
            $("#regeister_pwdLevel2").removeClass().addClass('pwdLevel2');            
            $("#regeister_pwdLevel3").html("强");
            $("#regeister_pwdLevel3").removeClass().addClass('pwdLevel3'); 
        }else {
            $("#regeister_pwdLevel_flag").removeClass().addClass('fa fa-check green');
            if(val == 1){
                $("#regeister_pwdLevel2").html("");
                $("#regeister_pwdLevel2").removeClass().addClass('pwdLevel2');
                $("#regeister_pwdLevel3").html("");
                $("#regeister_pwdLevel3").removeClass().addClass('pwdLevel3');            
                $("#regeister_pwdLevel1").html("弱");
                $("#regeister_pwdLevel1").removeClass().addClass('pwdLevel1 bg-green white');
                $("#regeister_pwdLevel_msg").html("简单密码");      
            }else if(val == 2){
                $("#regeister_pwdLevel1").html("");
                $("#regeister_pwdLevel3").html("");
                $("#regeister_pwdLevel3").removeClass().addClass('pwdLevel3');
                $("#regeister_pwdLevel1").removeClass().addClass('pwdLevel1 bg-orange');
                $("#regeister_pwdLevel2").html("中");
                $("#regeister_pwdLevel2").removeClass().addClass('pwdLevel2 bg-orange white');
                $("#regeister_pwdLevel_msg").html("普通密码"); 
            }else if(val == 3){
                $("#regeister_pwdLevel1").html("");
                $("#regeister_pwdLevel2").html("");
                $("#regeister_pwdLevel1").removeClass().addClass('pwdLevel1 bg-red');
                $("#regeister_pwdLevel2").removeClass().addClass('pwdLevel2 bg-red');
                $("#regeister_pwdLevel3").html("强");
                $("#regeister_pwdLevel3").removeClass().addClass('pwdLevel3 bg-red white');
                $("#regeister_pwdLevel_msg").html("天才密码"); 
            }
        }
       
    }else if(obj.id == "forgetPwd_pwd"){
        if(val < 1){
            $("#forgetPwd_pwdLevel_flag").removeClass();
            $("#forgetPwd_pwdLevel_msg").html(""); 
        }else {
            $("#forgetPwd_pwdLevel_flag").removeClass().addClass('fa fa-check green');
            if(val == 1){
                $("#forgetPwd_pwdLevel2").html("");
                $("#forgetPwd_pwdLevel2").removeClass().addClass('pwdLevel2');
                $("#forgetPwd_pwdLevel3").html("");
                $("#forgetPwd_pwdLevel3").removeClass().addClass('pwdLevel3');            
                $("#forgetPwd_pwdLevel1").html("弱");
                $("#forgetPwd_pwdLevel1").removeClass().addClass('pwdLevel1 bg-green white');
                $("#forgetPwd_pwdLevel_msg").html("简单密码");      
            }else if(val == 2){
                $("#forgetPwd_pwdLevel1").html("");
                $("#forgetPwd_pwdLevel3").html("");
                $("#forgetPwd_pwdLevel3").removeClass().addClass('pwdLevel3');
                $("#forgetPwd_pwdLevel1").removeClass().addClass('pwdLevel1 bg-orange');
                $("#forgetPwd_pwdLevel2").html("中");
                $("#forgetPwd_pwdLevel2").removeClass().addClass('pwdLevel2 bg-orange white');
                $("#forgetPwd_pwdLevel_msg").html("普通密码"); 
            }else if(val == 3){
                $("#forgetPwd_pwdLevel1").html("");
                $("#forgetPwd_pwdLevel2").html("");
                $("#forgetPwd_pwdLevel1").removeClass().addClass('pwdLevel1 bg-red');
                $("#forgetPwd_pwdLevel2").removeClass().addClass('pwdLevel2 bg-red');
                $("#forgetPwd_pwdLevel3").html("强");
                $("#forgetPwd_pwdLevel3").removeClass().addClass('pwdLevel3 bg-red white');
                $("#forgetPwd_pwdLevel_msg").html("天才密码"); 
            }
        }
    }
}

/**
 * 两次密码一致性判断
 */
function judgeTwoPwd(obj){
    var val_pwdConfirm;
    var val_pwd;
    if(obj.id == "regeister_pwdConfirm"){
       val_pwd = pwdCheck($("#regeister_pwd").val());
       if(val_pwd != ""){
           $("#regeister_pwd_flag").removeClass().addClass('fa fa-close red');
           $("#regeister_pwd_msg").html(val_pwd);
           pwd_confirm_val = false; 
       }else{
           val_pwdConfirm = pwdCheck($("#regeister_pwdConfirm").val());
           if(val_pwdConfirm != ""){
               $("#regeister_pwdConfirm_flag").removeClass().addClass('fa fa-close red');
               $("#regeister_pwdConfirm_msg").html(val_pwdConfirm);
               pwd_confirm_val = false; 
           }else{
               if($("#"+obj.id).val() == $("#regeister_pwd").val()){
                   $("#regeister_pwdConfirm_flag").removeClass().addClass('fa fa-check green');
                   $("#regeister_pwdConfirm_msg").html("");
                   pwd_confirm_val = true;
               }else{
                   $("#regeister_pwdConfirm_flag").removeClass().addClass('fa fa-close red');
                   $("#regeister_pwdConfirm_msg").html("两次密码不一致！");
                   pwd_confirm_val = false; 
               }
           }
       }       
    }else if(obj.id == "forgetPwd_pwdConfirm"){
       val_pwd = pwdCheck($("#forgetPwd_pwd").val());
       if(val_pwd != ""){
           $("#forgetPwd_pwd_flag").removeClass().addClass('fa fa-close red');
           $("#forgetPwd_pwd_msg").html(val_pwd);
           pwd_confirm_val = false; 
       }else{
           val_pwdConfirm = pwdCheck($("#forgetPwd_pwdConfirm").val());
           if(val_pwdConfirm != ""){
               $("#forgetPwd_pwdConfirm_flag").removeClass().addClass('fa fa-close red');
               $("#forgetPwd_pwdConfirm_msg").html(val_pwdConfirm);
               pwd_confirm_val = false; 
           }else{
               if($("#"+obj.id).val() == $("#forgetPwd_pwd").val()){
                   $("#forgetPwd_pwdConfirm_flag").removeClass().addClass('fa fa-check green');
                   $("#forgetPwd_pwdConfirm_msg").html("");
                   pwd_confirm_val = true;
               }else{
                   $("#forgetPwd_pwdConfirm_flag").removeClass().addClass('fa fa-close red');
                   $("#forgetPwd_pwdConfirm_msg").html("两次密码不一致！");
                   pwd_confirm_val = false; 
               }
           }
       } 
    }
}

/**
 *判断验证码格式是否正确 
 */
function judgeValidCodeFormat(obj){
    var val = validCodeCheck(obj.id);
    if(obj.id == "regeister_validCode"){
        if(val != ""){
            $("#regeister_validCode_flag").removeClass().addClass('fa fa-close red');
            $("#regeister_validCode_msg").html(val);
            validCode_val = false;
        }else{
            $("#regeister_validCode_flag").removeClass().addClass('fa fa-check green');
            $("#regeister_validCode_msg").html("");
            validCode_val = true;
        }
    }else if(obj.id == "forgetPwd_validCode"){
        if(val != ""){
            $("#forgetPwd_validCode_flag").removeClass().addClass('fa fa-close red');
            $("#forgetPwd_validCode_msg").html(val);
            validCode_val = false;
        }else{
            $("#forgetPwd_validCode_flag").removeClass().addClass('fa fa-check green');
            $("#forgetPwd_validCode_msg").html("");
            validCode_val = true;
        }
    }
}

/**
 * 判断输入框是否为空
 * @param obj
 */
function judgeIsEmpty(obj){
    if(obj.id == "regeister_account"){
        if(obj.value != ""){
            $("#regeister_account_flag").removeClass();
            $("#regeister_account_msg").html(""); 
        }
    }else if(obj.id == "regeister_pwd"){
        if(obj.value != ""){
            $("#regeister_pwd_flag").removeClass();
            $("#regeister_pwd_msg").html("");           
        }
    }else if(obj.id == "regeister_pwdConfirm"){
        if(obj.value != ""){
            $("#regeister_pwdConfirm_flag").removeClass();
            $("#regeister_pwdConfirm_msg").html("");
        }
    }else if(obj.id == "regeister_validCode"){
        if(obj.value != ""){
            $("#regeister_validCode_flag").removeClass();
            $("#regeister_validCode_msg").html("");
        }
    }else if(obj.id == "forgetPwd_account"){
        if(obj.value != ""){
            $("#forgetPwd_account_flag").removeClass();
            $("#forgetPwd_account_msg").html(""); 
        }
    }else if(obj.id == "forgetPwd_validCode"){
        if(obj.value != ""){
            $("#forgetPwd_validCode_flag").removeClass();
            $("#forgetPwd_validCode_msg").html("");
        }
    }else if(obj.id == "forgetPwd_pwd"){
        if(obj.value != ""){
            $("#forgetPwd_pwd_flag").removeClass();
            $("#forgetPwd_pwd_msg").html("");           
        }
    }else if(obj.id == "forgetPwd_pwdConfirm"){
        if(obj.value != ""){
            $("#forgetPwd_pwdConfirm_flag").removeClass();
            $("#forgetPwd_pwdConfirm_msg").html("");
        }
    }
}

/**
 * 通过后台获取验证码
 */
function getValidCode(obj){
    var account_num;
    if(obj.id == "regeister_validCode_link"){
        $("#regeister_validCode_link_flag").removeClass().addClass('fa fa-exclamation-circle gold-yellow');
        $("#regeister_validCode_link_msg").html("每隔60秒发送一次验证码");
        
        account_num = phoneCheck($.trim($("#regeister_account").val()));
        if(account_num != ""){
            $("#regeister_validCode_link_flag").removeClass().addClass('fa fa-close red');
            $("#regeister_validCode_link_msg").html(account_num);
        }else{
            if(account_val == true){
                orign_validCode_link = $("#regeister_validCode_div").html();
                getValidCodeFromDB("regeister_account","regeister_validCode_div","regeister_validCode_link_flag","regeister_validCode_link_msg","RA");                
            }
        }
    }else if(obj.id == "forgetPwd_validCode_link"){
        $("#forgetPwd_validCode_link_flag").removeClass().addClass('fa fa-exclamation-circle gold-yellow');
        $("#forgetPwd_validCode_link_msg").html("每隔60秒发送一次验证码");
        
        account_num = phoneCheck($.trim($("#forgetPwd_account").val()));
        if(account_num != ""){
            $("#forgetPwd_validCode_link_flag").removeClass().addClass('fa fa-close red');
            $("#forgetPwd_validCode_link_msg").html(account_num);
        }else{
            if(account_val == true){
                orign_validCode_link = $("#forgetPwd_validCode_div").html();
                getValidCodeFromDB("forgetPwd_account","forgetPwd_validCode_div","forgetPwd_validCode_link_flag","forgetPwd_validCode_link_msg","FA");                
            }
        }
    }   
}

/**
 *通过后台查询账号是否存在
 * @param account 用户账号
 */
function getAccountFromDB(account,id){
    $.ajax({
        type: "get",
        dataType: "json",
        url: "http://"+apiURL+"/SpiritServiceApp/UserManager/checkAccount",
        data:{'mobile': account},
        success:function(data){
            if(id == "forgetPwd_account"){
                if(data.state == "0"){
                    $("#forgetPwd_account_flag").removeClass().addClass('fa fa-check green');
                    $("#forgetPwd_account_msg").html(""); 
                    account_val = true; 
                }else if(data.state == "1"){
                    $("#forgetPwd_account_flag").removeClass().addClass('fa fa-close red');
                    $("#forgetPwd_account_msg").html("账号不存在，请先注册！");
                    account_val = false; 
                }else if(data.state == "2"){
                    $("#forgetPwd_account_flag").removeClass().addClass('fa fa-close red');
                    $("#forgetPwd_account_msg").html("不合法的手机号！");
                    account_val = false; 
                }else{
                    $("#forgetPwd_account_flag").removeClass().addClass('fa fa-close red');
                    $("#forgetPwd_account_msg").html("服务器出现异常，请稍候再试！");
                    account_val = false; 
                }  
            }else if(id == "regeister_account"){
                if(data.state == "0"){
                    $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
                    $("#regeister_account_msg").html("账号已存在，不可以注册！");
                    account_val = false; 
                }else if(data.state == "1"){
                    $("#regeister_account_flag").removeClass().addClass('fa fa-check green');
                    $("#regeister_account_msg").html("账号不存在，可以注册！");
                    account_val = true; 
                }else if(data.state == "2"){
                    $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
                    $("#regeister_account_msg").html("不合法的手机号！");
                    account_val = false; 
                }else{
                    $("#regeister_account_flag").removeClass().addClass('fa fa-close red');
                    $("#regeister_account_msg").html("服务器出现异常，请稍候再试！");
                    account_val = false;
                }
            }

                        
        }
    });
}

/**
 * 验证码触发请求
 * @param curtElementID_for_phone 当前输入手机号码的容器ID
 * @param curtElementID_for_calcuateTime 当前显示倒计时的容器ID
 * @param curtElementID_for_receive_flag 返回当前结果的图标容器ID
 * @param curtElementID_for_receive_msg 返回当前结果的容器ID
 * @param useType 用途
 */
function getValidCodeFromDB(curtElementID_for_phone,curtElementID_for_calcuateTime,curtElementID_for_receive_flag,curtElementID_for_receive_msg,useType){ 
    var phone = $.trim($("#"+curtElementID_for_phone).val()); 
    $("#"+curtElementID_for_calcuateTime).html("60秒后可重新发送");
    vericodeInterval = setInterval(function() {
 
        var time = parseInt($("#countDownTime").val());
        if (isNaN(time)) {
            time = 60;
            $("#"+curtElementID_for_calcuateTime).html(time + "秒后可重新发送");
            $("#countDownTime").val("60");            
        } else if (time > 1) {            
            time = time - 1;
            $("#"+curtElementID_for_calcuateTime).html(time + "秒后可重新发送");
            $("#countDownTime").val(time);
        } else {            
            clearInterval(vericodeInterval);
            $("#countDownTime").val("61");
            $("#"+curtElementID_for_calcuateTime).html(orign_validCode_link);
            if(sendValidCode_val == '1'){                
                $("#"+curtElementID_for_receive_flag).removeClass().addClass('fa fa-check green');
                $("#"+curtElementID_for_receive_msg).html("验证码发送成功！");  
            }else{
                $("#"+curtElementID_for_receive_flag).removeClass().addClass('fa fa-close red');
                $("#"+curtElementID_for_receive_msg).html("验证码发送失败，请稍候再试！");     
            }
                       
        } 
    }, 1000);
    
   
    $.ajax({
        type: "get",
        dataType: "json",
        url: "http://"+apiURL+"/SpiritServiceApp/UserManager/getVeriCode",
        data:{'mobile': phone,'type':useType},
        success:function(data){
            if(data.state != "0"){
                clearInterval(vericodeInterval);
                $("#"+curtElementID_for_receive_flag).removeClass().addClass('fa fa-close red');
                $("#"+curtElementID_for_receive_msg).html("验证码发送失败，请稍候再试！");
            }
        }
    });   
}


/**
 * 验证码长度判断
 * @param curtElementID 当前验证码输入的容器ID 
 */
function validCodeCheck(curtElementID){
    if ($("#"+curtElementID).val().length < 6 || $("#"+curtElementID).val().length > 6) {
        return "验证码长度不对";
    }else{
        return "";
    }
}


/**
 * 判断键盘按键事件
 */
function judgeKey(obj){
	var keyCode = window.event.keyCode;
	var val;
	if(keyCode == 13){
		if(obj.id == "login_phone"){		
			if(obj.value != "" && obj.value != null){
				val = phoneCheck($.trim($("#"+obj.id).val()));
				if(val == ""){
					$("#login_pwd")[0].focus();
				}
			}
		}else if(obj.id == "login_pwd"){
			val = pwdCheck($("#"+obj.id).val());
			if(val == ""){
				$("#login_validCode")[0].focus();
			}
		}else if(obj.id == "login_validCode"){
			val = validCodeCheck(obj.id);
			if(val == ""){
				submitLogin();
			}
		}
	}
}