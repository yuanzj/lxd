/**
 *
 * @file 电池列表JS文件
 *
 */

var $table = $('#table');
var dataResult;
var rr = 1;
var orFault;
var orOnLine;
var cc = 0;
var timer2 = 0;

var currentCategory = null
var currentFilterType = 1
url = 'http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&categories=1,2&filterType=' + currentFilterType + '&sort=ue.end_time,desc'

$(function () {
    $("#mytabs li").click(function () {
        $(this).siblings('li').removeClass('active');  // 删除其他兄弟元素的样式

        $(this).addClass('active');                            // 添加当前元素的样式
        $(".item").each(function (index, element) {
            if ($(this).hasClass("active")) {

                var text = $(this).text()

                if (text == '已租赁电池' || text == '逾期租赁电池' || text == '待租赁电池') {
                    switch (text) {
                        case '已租赁电池':
                            currentFilterType = 1
                            break
                        case '逾期租赁电池':
                            currentFilterType = 2
                            break
                        case '待租赁电池':
                            currentFilterType = 3
                            break
                        default:
                            currentFilterType = 1
                            break
                    }

                    resetFilterBarSelected()
                    url = 'http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&categories=1,2&filterType=' + currentFilterType + '&sort=ue.end_time,desc'
                    $(function () {
                        initTable();
                        $table.bootstrapTable("hideColumn", "w");
                        $table.bootstrapTable("hideColumn", "re");
                        $table.bootstrapTable("hideColumn", "afterSaleReason");
                    });

                    $("#select-type").css("display",'inline')
                    $("#erjise").css("display",'inline')
                    getStation()

                } else if (text == '仓库电池' || text == '丢失电池' || text == '试用电池' || text == '售后电池' || text == '报废电池') {

                    switch (text) {
                        case '仓库电池':
                            currentCategory = 0
                            break
                        case '售后电池':
                            currentCategory = 3
                            break
                        case '丢失电池':
                            currentCategory = 4
                            break
                        case '试用电池':
                            currentCategory = 5
                            break
                        case '测试电池':
                            currentCategory = 6
                            break
                        case '报废电池':
                            currentCategory = 7
                            break
                        default:
                            currentCategory = 0
                            break
                    }

                    resetFilterBarSelected()
                    url = 'http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&category=' + currentCategory  + '&sort=ue.store_code,asc'
                    $(function () {
                        initTable();
                        $table.bootstrapTable("hideColumn", "w");
                        $table.bootstrapTable("hideColumn", "re");
                        $table.bootstrapTable("hideColumn", "afterSaleReason");
                    });
                    $("#select-type").css("display",'none')
                    $("#erjise").css("display",'none')
                    getStoreWithCategory()
                } else if (text == "欠压电池" || text == "离线电池") {
                    resetFilterBarSelected()
                    if (text == "欠压电池") {
                        url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&categories=1,2&exceptionFlag=1&bmsExceptionReason=1&sort=ue.end_time,desc";
                    } else if (text == "离线电池"){
                        url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&categories=1,2&exceptionFlag=1&bmsExceptionReason=0&sort=ebike.report_time,asc";
                    } else {
                        url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&categories=1,2&exceptionFlag=1&bmsExceptionReason=0&sort=ue.end_time,desc";
                    }

                    initTable();
                    $table.bootstrapTable("hideColumn", "afterSaleReason");

                    $("#select-type").css("display",'inline')
                    $("#erjise").css("display",'inline')
                    getStation()
                } else if (text == "禁用电池") {
                    resetFilterBarSelected()
                    url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&categories=1,2&afterSaleFlag=1&sort=ue.end_time,desc";
                    $(function () {
                        initTable();
                        $table.bootstrapTable("hideColumn", "w");
                    });

                    $("#select-type").css("display",'inline')
                    $("#erjise").css("display",'inline')
                    getStation()
                }
                console.log(url)
            }
        });


    });
});

var source = null;

// your custom ajax request here
function ajaxRequest(params) {
    if (source != null) {
        source.cancel('Operation canceled by the user.');
        source = null
    }

    var CancelToken = axios.CancelToken;
    source = CancelToken.source();

    axios.get(params.url, {
        cancelToken: source.token,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "firm": JSON.parse(sessionStorage.name)[sessionStorage.Vname].flag,
            "Authorization": sessionStorage.token
        },
        params: params.data
    })
        .then(function (response) {
            params.success(response.data)

        })
        .catch(function (error) {
            console.log(error)
        });
}

function initTable() {
    $table.bootstrapTable("destroy");
    $table.bootstrapTable({
        height: getHeight(),
        url: url,
        method: 'GET',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        cache: false,
        striped: true,                              //是否显示行间隔色
        onLoadError: function (data) {
            $table.bootstrapTable("refresh", {silent: true});
        },
        ajaxOptions: {
            headers: {
                "firm": JSON.parse(sessionStorage.name)[sessionStorage.Vname].flag,
                "Authorization": sessionStorage.token
            }
        },
        queryParams: queryParams,
        minimumCountColumns: 2,
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 100,                       //每页的记录行数（*）
        pageList: [10, 20, 100],        //可供选择的每页的行数（*）
        columns: [

            {
                field: '',
                title: '',
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    /*console.log((dataResult.pageSize * (dataResult.currPage - 1)) + index + 1)*/
                    return (dataResult.pageSize * (dataResult.currPage - 1)) + index + 1;
                }
            },


            {
                field: 'stand',
                title: '规格',
                align: 'center',
                valign: 'middle',
                formatter: standFormatter

            },
            {
                field: 'ccuSn',
                title: '序列号',
                align: 'center',
                valign: 'middle',
                events: operateEvents, //22
                formatter: snFormatter
            },
            {
                field: 'a',
                title: '省',
                align: 'center',
                valign: 'middle',
                formatter: function provinceFormatter(value, row, index) {
                    var inner = ''
                    if (row.ebikeStoreEntity != null) {
                        if (row.ebikeStoreEntity.province == null || row.ebikeStoreEntity.province == "null") {
                            inner = ""
                        } else {
                            inner = row.ebikeStoreEntity ? row.ebikeStoreEntity.province : ""
                        }
                    } else if (row.dealerEbikeStoreEntity != null) {
                        if (row.dealerEbikeStoreEntity.province == null || row.dealerEbikeStoreEntity.province == "null") {
                            inner = ""
                        } else {
                            inner = row.dealerEbikeStoreEntity ? row.dealerEbikeStoreEntity.province : ""
                        }
                    } else {
                        inner = ""
                    }
                    var color = 'nowwrp'
                    return [

                        '<span class=' + color + '>' + inner + '</span>'


                    ].join("")
                }

            },
            {
                field: 'b',
                title: '市',
                align: 'center',
                valign: 'middle',
                formatter: function cityFormatter(value, row, index) {
                    var inner = ""
                    if (row.ebikeStoreEntity != null) {
                        if (row.ebikeStoreEntity.city == null || row.ebikeStoreEntity.city == "null") {
                            inner = ""
                        } else {
                            inner = row.ebikeStoreEntity ? row.ebikeStoreEntity.city : ""
                        }
                    } else if (row.dealerEbikeStoreEntity != null) {
                        if (row.dealerEbikeStoreEntity.city == null || row.dealerEbikeStoreEntity.city == "null") {
                            inner = ""
                        } else {
                            inner = row.dealerEbikeStoreEntity ? row.dealerEbikeStoreEntity.city : ""
                        }
                    } else {
                        inner = ""
                    }
                    var color = 'nowwrp'
                    return [

                        '<span class=' + color + '>' + inner + '</span>'


                    ].join("")
                }

            },
            {
                field: 'dealerStoreName',
                title: '分站',
                align: 'center',
                valign: 'middle',
                formatter: dealerFormatter
            },
            {
                field: 'storeName',
                title: '驿站',
                align: 'center',
                valign: 'middle',
                formatter: lineFormatter
            },
            {

                field: 'realname',
                title: '用户姓名',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: realFormatter

            },
            {

                field: 'link',
                title: '联系方式',
                align: 'center',
                valign: 'middle',
                formatter: linkFormatter

            }, {
                field: 'deposit',
                title: '押金',
                align: 'center',
                valign: 'middle',
                formatter: yajin1Formatter
            },
            {
                field: 'usedDays',
                title: '租期',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'surplusTime',
                title: '有效期',
                align: 'center',
                valign: 'middle',
                formatter: youxFormatter

            },
            {
                field: 'jinyong',
                title: '电池输出',
                align: 'center',
                valign: 'middle',
                formatter: jinyongFormatter
            },
            {
                field: 'status',
                title: '状态',
                align: 'center',
                valign: 'middle',
                formatter: zhuangtFormatter
            },
            {

                field: 'voltageString',
                title: '电压(V)',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: volFormatter

            },

            {
                field: 'bmsSoc',
                title: '电量',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: bmcFormatter
            },

            {
                field: 'odo',
                title: '里程',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: odoFormatter
            },
            {
                field: 'dayOdo',
                title: '今日里程',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: dayodoFormatter
            },
            {
                field: 'address',
                title: '位置',
                align: 'left',
                valign: 'middle',
                events: operateEvents,
                formatter: addressFormatter
            },
            {
                field: 'reportTime',
                title: '更新时间',
                align: 'center',
                valign: 'middle',
                formatter: reportTimeFormatter
            },
            {
                field: 'w',
                title: '异常原因',
                align: 'center',
                valign: 'middle',
                formatter: reasonFormatter
            },
            {
                field: 'afterSaleReason',
                title: '禁用原因',
                align: 'left',
                valign: 'middle'
            },
            {
                field: 're',
                title: '编辑',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: removeFormatter
            }
        ]
    });
    // sometimes footer render error.
}

function queryParams(params) {
    var province = $(".selpr").val();
    var city = $(".selci").val();
    var district = ''

    var selectType = document.getElementById("select-type");
    var typeIndex = selectType.selectedIndex;
    var type = selectType.options[typeIndex].value;

    var myselect3 = document.getElementById("erjise");
    var index3 = myselect3.selectedIndex;
    var subStoreId = myselect3.options[index3].value;

    var myselect2 = document.getElementById("guigese");
    var index2 = myselect2.selectedIndex;
    var specification = myselect2.options[index2].value;

    var param = {
        limit: this.pageSize, // 页面大小
        page: this.pageNumber,
        onLine: orOnLine,
        fault: orFault
    };
    if (province == "") {
        param = param
    } else {

        var key = "province";
        var value = province
        param[key] = value;
    }
    if (city == "") {
        param = param
    } else {
        var key = "city";
        var value = city;
        param[key] = value;
    }

    if (storeId == "0") {
        param = param
    } else {
        var key = "dealerId";
        var value = storeId
        param[key] = value;
    }
    if (subStoreId == "0") {
        param = param
    } else {
        var key = "storeId";
        var value = subStoreId;
        param[key] = value;
    }
    if (specification == "0") {
        param = param
    } else {
        var key = "productId";
        var value = specification
        param[key] = value;
    }
    if (type == "0") {
        param = param
    } else {
        var key = "storeType";
        var value = type
        param[key] = value;
    }

    return param;
}

function responseHandler(res) {
    dataResult = res;
    if (res) {
        return {
            "rows": res.list,
            "total": res.totalCount
        };
    } else {
        return {
            "rows": 10,
            "total": 20
        };
    }
    console.log('responseHandler：' + res);
}

function snFormatter(value, row, index) {
    var inner;
    $(".item").each(function (index, element) {
        if ($(this).hasClass("active")) {
            inner = '<a id="like2" class="like2" href="#" title="车辆远程操控">' + row.ccuSn + '</a>';
            return inner;
        }
        return inner
    });
    return [
        '<span>' + inner + '</span>'
    ].join("")

}//序列号
function volFormatter(value, row, index) {
    return [
        '<div class="nowwrp">',
        '<a class="like4" href="#" title="点击查看电压趋势">',
        row.voltageString,
        '</a>',
        '</div>'
    ].join("")

}//电压
function standFormatter(value, row, index) {
    var inner;
    if (row.productEntity != null && row.productEntity != "null") {
        if (row.productEntity.name != null && row.productEntity.name != "null") {
            inner = row.productEntity.name;
        }
        else {
            inner = "-";
        }
    }
    else {
        inner = "-";
    }
    return [
        '<span>' + inner + '</span>'
    ].join('');
}//规格
function dealerFormatter(value, row, index) {
    var color = 'nowwrp';
    if (row.dealerStoreName == null) {
        inner = "";
        return [
            '<span class=' + color + '>' + inner + '</span>'
        ].join("")
    }
    else {

        inner = row.dealerStoreName;
        return [
            '<span class=' + color + '>' + inner + '</span>'
        ].join("")
    }
}//分站
function lineFormatter(value, row, index) {
    var color = 'nowwrp';
    if (row.storeName == null) {
        inner = "";
        return [
            '<span class=' + color + '>' + inner + '</span>'
        ].join("")
    }
    else {

        inner = row.storeName;
        return [
            '<span class=' + color + '>' + inner + '</span>'
        ].join("")
    }
}//网点
function realFormatter(value, row, index) {
    var inner;
    if (row.owner == null || row.owner == "null") {
        inner = ""
    }
    else {
        if (row.owner.realname == null) {
            inner = ""
        }
        else {
            inner = row.owner.realname
        }
    }
    var color = 'nowwrp';
    return [
        '<a class="like9" href="#" title="点击查看里程变化">',
        '<span class=' + color + '>' + inner + '</span>',
        '</a>'
    ].join('');
}//用户姓名
function linkFormatter(value, row, index) {
    if (row.owner == null || row.owner == "null") {
        inner = ""
    }
    else {
        var inner = row.owner.phoneNumber
    }
    var color = 'nowwrp'
    return [
        '<span class=' + color + '>' + inner + '</span>'
    ].join('');
}//联系方式
function yajin1Formatter(value, row, index) {
    if (row.orderEntity != null && row.orderEntity != "null") {
        var inner = row.orderEntity.deposit;
    } else {
        var inner = "-"
    }
    return [
        '<span>' + inner + '</span>'
    ].join("")
}//押金
function jinyongFormatter(value, row, index) {
    var inner;
    var gear = row.gear;
    if (gear == 17) {
        inner = "禁用"
    }
    else if (gear == 34) {
        inner = "启用"
    }
    else {
        inner = "-"
    }
    return [
        '<span>' + inner + '</span>'
    ].join('');
}//输出状态
function zhuangtFormatter(value, row, index) {
    var inner;
    if (row.status == 3) {
        inner = "移动"
    }
    else {
        inner = "静止"
    }
    return [
        '<span>' + inner + '</span>'
    ].join('');

}//状态
function youxFormatter(value, row, index) {
    var color = 'nowwrp'
    var inner = row.surplusTime
    return [
        '<span class=' + color + '>' + inner + '</span>'
    ].join('');

}	//有效期
function odoFormatter(value, row, index) {

    if (row.odo == null) {
        inner = "0km"
    }

    else {
        var inner = row.odo + "km"
    }
    return [
        '<a class="like5" href="#" title="点击查看里程变化">',
        '<span>' + inner + '</span>',
        '</a>'
    ].join('');
}//里程
function dayodoFormatter(value, row, index) {
    if (row.dayOdo == null) {
        inner = "0km"
    }
    else {
        var inner = row.dayOdo + "km"
    }
    return [
        '<a class="like6" href="#" title="当日轨迹">',
        '<span>' + inner + '</span>',
        '</a>'
    ].join('');
}//今日里程
function bmcFormatter(value, row, index) {
    if (row.bmsSoc > 100) {
        var inner = row.bmsSoc ? row.bmsSoc - 100 + "格" : ""
        var color = row.bmsSoc - 100 == 2 ? "yellow" : row.bmsSoc - 100 == 1 ? "orange" : ""
    }
    else if (row.bmsSoc == 0) {
        if (row.bmsSoh > 100) {
            inner = "0格"
            color = "red"
        }
        else {
            inner = "0%"
            color = "red"
        }


    }
    else if (row.bmsSoc == null) {
        inner = "-"
    }
    else {
        var inner = row.bmsSoc + "%"
    }

    return [
        '<a class="like10" href="#" title="点击查看电量趋势">',
        '<span class=' + color + '>' + inner + '</span>',
        '</a>'
    ].join('');

}  //电量
function addressFormatter(value, row, index) {
    if (row.address == null) {
        return [
            '<a class="like7" href="#" title="查看当前定位">',
            '<i class="glyphicon glyphicon-map-marker">',
            '</i>',
            '</a>'
        ].join('');
    } else {
        return [
            '<a class="like7" href="#" title="查看当前定位">',
            row.address,
            '</a>'
        ].join('');
    }

}  //地址
function reasonFormatter(value, row, index) {
    var inner;
    if (row.bmsExceptionReason == 0) {
        inner = "离线"
    }
    else if (row.bmsExceptionReason == 1) {
        inner = "欠压"
    } else if (row.bmsExceptionReason == 2) {
        inner = "异动"
    } else {
        inner = "-"
    }
    return [
        '<span>' + inner + '</span>'
    ].join('');

}// 故障原因
function reportTimeFormatter(value, row, index) {
    var inner;
    if (row.reportTime == null || row.reportTime == "null") {
        inner = "";
        return [
            '<span>' + inner + '</span>'
        ].join('');
    } else {
        var date1 = row.reportTime;  //开始时间
        var date2 = new Date();    //结束时间
        var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数
        var xiaps = Math.floor(date3 / (3600 * 1000));
        if (Math.abs(xiaps) > 0) {
            var color = "red";
            inner = row.reportTime;
            return [
                '<span class=' + color + '>' + inner + '</span>'
            ].join('');
        }
        else if (Math.abs(xiaps) < 0 || xiaps == 0) {
            inner = row.reportTime;
            return [
                '<span>' + inner + '</span>'
            ].join('');
        }
        else {
            return [
                '<span>' + inner + '</span>'
            ].join('');
        }
    }
}//更新时间
function removeFormatter(value, row, index) {
    return [
        '<div class="nowwrp">',
        '<a class="like8" href="#" title="移除">',
        '<i class="glyphicon glyphicon-edit">',
        '</i>',
        '</a>',
        '</div>'
    ].join("")
}//移除故障

function resetFilterBarSelected() {
    $("#select-type").get(0).selectedIndex = 0;
    $(".selpr").get(0).selectedIndex = 0;
    $(".selci").get(0).selectedIndex = 0;
    $(".selco").get(0).selectedIndex = 0;
    $("#sectionName-s").get(0).selectedIndex = 0;
    $("#erjise").get(0).selectedIndex = 0;
    $("#guigese").get(0).selectedIndex = 0;
}

var ueId;
var storeId;

var operateEvents = {
    'click .like': function (e, value, row, index) {
        console.log("e:" + e + "value:" + value + "row:" + row + "index:" + index)
        var ALL = row
        var A = ALL
        console.log("当前车 :" + ALL.orderId)
        var a = ALL.orderEntity ? ALL.orderEntity.orderUserBean.nikeName : ""
        var b = ALL.ccuSn ? ALL.ccuSn : ""
        var c = ALL.orderEntity ? ALL.orderEntity.orderUserBean.realName : ""
        var d = ALL.orderEntity ? ALL.orderEntity.orderUserBean.phoneNumber : ""
        var e = ALL.orderEntity ? ALL.orderEntity.startTime : ""
        var f = ALL.orderEntity ? ALL.orderEntity.endTime : ""
        var g = ALL.orderEntity ? ALL.orderEntity.accountEntity.securityMoney : ""
        var h = ALL.orderEntity ? ALL.orderEntity.accountEntity.availableBalance : ""
        var i = ALL.orderEntity ? ALL.orderEntity.accountEntity.cost : ""
        var j = ALL.orderEntity ? ALL.orderEntity.orderUserBean.identityNumber : ""
        $("#btn-change").unbind('click').on("click", function () {
            console.log("http://cjl3.rokyinfo.net:7200/api-order/v3.1/orders/" + ALL.orderId + "/replace/" + $("#wrap-stay .change").val())
            ajax("http://cjl3.rokyinfo.net:7200/api-order/v3.1/orders/" + ALL.orderId + "/replace/" + $("#wrap-stay .change").val(), "put", function (dara) {
                $table.bootstrapTable("refresh", {silent: true})
                $("#wrap-stay").hide()
                console.log("成功")
            }, function (err) {
                console.log(err)
            })
        })

        $("#wrap-stay .change").val("请输入要更换的车辆序列号")
        if (ALL.ebikeStatus !== 0) {
            if (ALL.ebikeStatus == 100) {
                $("#wrap-stay .sendAll").html("结束租车")
                $("#wrap-stay .carmanName").attr("readonly", "true")
                $("#wrap-stay .carmanPhone").attr("readonly", "true")
                $("#wrap-stay .startTime").attr("readonly", "true")
                $("#wrap-stay .endTime").attr("readonly", "true")
                $("#wrap-stay .remainday").attr("readonly", "true")
                $("#wrap-stay .money").attr("readonly", "true")
                $("#wrap-stay .balance").attr("readonly", "true")
                $("#wrap-stay .cost").attr("readonly", "true")
            } else {
                $("#wrap-stay .sendAll").html("开始租车")
                $("#wrap-stay .alert-p").html("应用这些设置?")
                $("#wrap-stay .carmanName").removeAttr("readonly")
                $("#wrap-stay .carmanPhone").removeAttr("readonly")
                $("#wrap-stay .startTime").removeAttr("readonly")
                $("#wrap-stay .endTime").removeAttr("readonly")
                $("#wrap-stay .remainday").removeAttr("readonly")
                $("#wrap-stay .money").removeAttr("readonly")
                $("#wrap-stay .balance").removeAttr("dreadonly")
                $("#wrap-stay .cost").removeAttr("readonly")
                $("#wrap-stay .remainday").click(function () {
                    clearInterval(timer2)
                    timer2 = setInterval(function () {
                        if ($(".startTime").val() !== null) {
                            var arr = $(".startTime").val().split(" ")[0].split("-")//年月日数组
                            var a = [1, 3, 5, 7, 8, 10, 12]
                            var day = parseInt($(".remainday").val()) + parseInt(arr[2]);
                            /*  console.log(arr)*/
                            var maxday;
                            for (var i = 0; i < a.length; i++) {
                                if (a[i] == parseInt(arr[1])) {
                                    maxday = 31
                                    break
                                }
                                else {
                                    maxday = 30
                                }
                            }
                            if (arr[0] == 2017) {
                                var month = parseInt(day / maxday) + parseInt(arr[1])
                                if (day > maxday) {
                                    day = parseInt(day - maxday)
                                }
                                var years = parseInt(month / 12) + parseInt(arr[0])
                                $(".endTime").val(years + "-" + month + "-" + day + " " + $(".startTime").val().split(" ")[1])
                                /*    console.log("years:"+years+"month:"+month+"day:"+day)*/
                            }
                        }
                    }, 10)
                })

            }
            console.log(i)
            $("#wrap-stay .wxName").html(a)
            $("#wrap-stay .carNumber").html(b)
            $("#wrap-stay .carmanName").val(c)
            $("#wrap-stay .carmanPhone").val(d)
            $("#wrap-stay .startTime").val(e)
            $("#wrap-stay .endTime").val(f)
            $("#wrap-stay .money").html(g)
            $("#wrap-stay .balance").html(h)
            $("#wrap-stay .cost").html(i)
            $("#wrap-stay .idNum").html(j)
            $("#wrap-stay").css("z-index", "99")
            $("#wrap-stay").show()
            $("#wrap-stay  .calloff").click(function () {
                $("#wrap-stay").hide()
            })
            $("#sendAll").unbind('click').click(function () {
                clearTimeout(cc)
                cc = setTimeout(function () {
                    rr--
                    if (rr == 0) {
                        var orderId = A.orderId;
                        var startTime = $(".startTime").val() == "请输入信息 " ? alert("请输入开始时间 ") : $(".startTime").val();
                        var endTime = $(".endTime").val() == "请输入信息 " ? alert("请输入结束时间 ") : $(".endTime").val();
                        var phoneNumber = $(".carmanPhone").val()
                        var realName = $(".carmanName").val()
                        var parameter = "startTime=" + startTime + "&endTime=" + endTime + "&phoneNumber=" + phoneNumber
                            + "&realName=" + realName;
                        console.log(encodeURI("http://cjl3.rokyinfo.net:7200/api-order/v3.1/orders/" + orderId + "/start?" + parameter))
                        if (A.ebikeStatus == 101) {
                            $.ajax({
                                url: encodeURI("http://cjl3.rokyinfo.net:7200/api-order/v3.1/orders/" + orderId + "/start?" + parameter),
                                method: "put",
                                contentType: "application/json; charset=utf-8",
                                cache: false,
                                beforeSend: function (xhr) {
                                    /* Authorization header */
                                    xhr.setRequestHeader("firm", sessionStorage.flag);
                                    xhr.setRequestHeader("Authorization", sessionStorage.token);
                                },
                                success: function (data) {
                                    window.location.reload()
                                    console.log("成功");
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.log("失败")
                                    console.log(jqXHR);
                                }
                            });
                        }  //红车发送数据
                        if (A.ebikeStatus == 100) {
                            console.log("http://cjl3.rokyinfo.net:7200/api-order/v3.1/orders/" + orderId + "/end")
                            if (confirm('您确定要结束租车吗?')) {
                                $.ajax({
                                    url: "http://cjl3.rokyinfo.net:7200/api-order/v3.1/orders/" + orderId + "/end",
                                    method: "PUT",
                                    contentType: "application/json; charset=utf-8",
                                    cache: false,
                                    beforeSend: function (xhr) {
                                        /* Authorization header */
                                        xhr.setRequestHeader("firm", sessionStorage.flag);
                                        xhr.setRequestHeader("Authorization", sessionStorage.token);

                                    },
                                    success: function (data) {
                                        window.location.reload();
                                        console.log("成功");
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        console.log(jqXHR);
                                    }
                                });
                            } else {
                                $("#wrap-stay").hide()
                                rr = 1
                                console.log("1")

                            }
                        }//蓝车结束数据
                    }
                }, 10)

            })  //发送数据

            $("#wrap-stay .endTime").focus(function () {
                clearInterval(timer2)
            });
            $(" #wrap-stay .endTime").blur(function () {
                clearInterval(timer2)
                console.log($('#datetimepicker2').datetimepicker())
            });

        }
    },
    'click .like1': function (e, value, row, index) {
        ueId = row.ueId;
        $(".carNumber").html(row.ccuSn);
        $("#wrap").show()
    },
    'click .like2': function (e, value, row, index) {
        $(".item").each(function (index, element) {
            console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/clean-exception-flag");
            if ($(this).hasClass("active")) {

                $(".carNumber").html(row.ccuSn);
                $("#alert-dialog-operation").modal('show');
                $("#btn-1").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/power-on", "get", function (data) {
                        alert("上电成功")
                        console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/power-on", "get")
                    }, function (err) {
                        alert("上电失败")
                        console.log(err)
                    })
                    return false
                });
                $("#btn-2").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/power-off", "get", function (data) {
                        alert("断电成功");
                        console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/power-on", "get")
                    }, function (err) {
                        alert("断电失败");
                        console.log(err)
                    })
                });
                $("#btn-3").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/search", "get", function (data) {
                        alert("寻车成功");
                        console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/power-on", "get")
                    }, function (err) {
                        alert("寻车失败");
                        console.log(err)
                    })
                });
                $("#btn-4").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/open-box", "get", function (data) {
                        alert("开座桶成功");
                        console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/power-on", "get")
                    }, function (err) {
                        alert("开座桶失败");
                        console.log(err)
                    })
                });
                $("#btn-5").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/restart", "get", function (data) {
                        alert("重启成功");
                        console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/power-on", "get")
                    }, function (err) {
                        alert("重启失败");
                        console.log(err)
                    })
                });
                $("#btn-6").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update-use-status?ccuSn=" + row.ccuSn + "&useStatus=1", "put", function (data) {
                        alert("冻结电池成功")
                        $table.bootstrapTable("refresh", {silent: true})
                        console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update-use-status?ccuSn=" + row.ccuSn + "&useStatus=1", "get")
                    }, function (err) {
                        alert("冻结电池失败")
                        console.log(err)
                    })
                })
                $("#btn-7").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update-use-status?ccuSn=" + row.ccuSn + "&useStatus=0", "put", function (data) {
                        alert("取消冻结成功")
                        $table.bootstrapTable("refresh", {silent: true})
                        console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update-use-status?ccuSn=" + row.ccuSn + "&useStatus=0", "get")
                    }, function (err) {
                        alert("取消冻结失败")
                        console.log(err)
                    })
                })
                $("#btn-tz").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-order/v3.1/rent-orders/force-finish-order?ccuSn=" + row.ccuSn, "put", function (data) {
                        alert("退租成功")
                        $table.bootstrapTable("refresh", {silent: true})
                        console.log("http://cjl3.rokyinfo.net:7200/api-order/v3.1/rent-orders/force-finish-order?ccuSn=" + row.ccuSn)
                    }, function (err) {
                        alert("退租失败")
                        console.log(err)
                    })
                })

                $("#btn-dialog-disable").unbind('click').on("click", function () {
                    ajax('http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update-after-sale-flag?ccuSn=' +  row.ccuSn + '&afterSaleFlag=1&afterSaleReason=' + '', "put", function (data) {
                        alert("禁用成功");
                    }, function (err) {
                        alert("禁用失败");
                        console.log(err)
                    });
                });

                $("#btn-dialog-delete-disable").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update-after-sale-flag?ccuSn=" +  row.ccuSn + "&afterSaleFlag=0", "put", function (data) {
                        alert("解除禁用成功");
                    }, function (err) {
                        alert("解除禁用失败");
                        console.log(err)
                    });
                });

                $("#btn-dialog-cancel-model-limit").unbind('click').on("click", function () {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/remove-run-model-limit?ccuSn=" + row.ccuSn, "put", function (data) {
                        alert("取消充电模式限制成功");
                    }, function (err) {
                        alert("取消充电模式限制失败");
                        console.log(err)
                    });
                });

            }
        });


    },
    'click .like3': function (e, value, row, index) {
        $(".carNumber").html(row.ccuSn)
        $(".miaoshu").html(row.faultDetail)
        $(".jianyi").html(row.faultAnalyze)
        $("#wrap2").show()
        $("#666").on("click", function () {
            $("#wrap2").hide()
        })
    },
    'click .like4': function (e, value, row, index) {

        $(".carNumber").html(row.ccuSn);
        $("#chart1").show();

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据

        myChart.setOption({

            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            legend: {
                data: ['电压']
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [{
                name: '电压',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    }
                },

                data: []
            }]
        });
        // 基于准备好的dom，初始化echarts实例


        var names = [];    //类别数组（实际用来盛放X轴坐标值）
        var nums = [];    //销量数组（实际用来盛放Y坐标值）
        myChart.showLoading();
        var cstartTime = $(".chartstartTime").val();
        var cendTime = $(".chartendTime").val();
        var ccusn1 = $(".carNumber").html();
        $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-analyze/v3.1/ebikereports?ccSn=" + ccusn1 + "&startTime=" + cstartTime + "&endTime=" + cendTime,
            method: "get",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("firm", sessionStorage.flag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {

                names = [];    //类别数组
                nums = [];    //
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        names.push(data[i].reportTime);    //挨个取出类别并填入类别数组
                    }
                    for (var i = 0; i < data.length; i++) {
                        nums.push(data[i].fVoltage);    //挨个取出销量并填入销量数组
                    }

                    function getMaximin(arr, maximin) {
                        if (maximin == "max") {
                            return Math.max.apply(Math, arr);
                        }
                        else if (maximin == "min") {
                            return Math.min.apply(Math, arr);
                        }
                    };
                    var ymax = getMaximin(nums, "max");
                    var ymin = getMaximin(nums, "min");
                    myChart.hideLoading();    //隐藏加载动画
                    myChart.setOption({        //加载数据图表
                        xAxis: {
                            data: names
                        },
                        yAxis: {
                            min: 48,
                            max: ymax + 10
                        },
                        series: [{
                            // 根据名字对应到相应的系列
                            name: '电压',
                            data: nums

                        }]
                    });

                }
//                myChart.setOption(myChart.option,true);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("失败");
                console.log(jqXHR);
            }
        });

        $.get('data.json').done(function (data) {

            // 填入数据
            myChart.setOption({
                xAxis: {
                    data: data.categories
                },

                series: [{
                    // 根据名字对应到相应的系列
                    name: '电压',
                    data: data.data
                }]
            });
            myChart.setOption(myChart.option, true);
        });


        // 使用刚指定的配置项和数据显示图表。

        $("#chartSearch").on("click", function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            // 指定图表的配置项和数据

            myChart.setOption({

                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                legend: {
                    data: ['电压']
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    start: 0,
                    end: 10,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                series: [{
                    name: '电压',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(255, 70, 131)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    },

                    data: []
                }]
            });
            // 基于准备好的dom，初始化echarts实例

            var names = [];    //类别数组（实际用来盛放X轴坐标值）
            var nums = [];    //销量数组（实际用来盛放Y坐标值）
            myChart.showLoading();
            var cstartTime = $(".chartstartTime").val();
            var cendTime = $(".chartendTime").val();
            var ccusn1 = $(".carNumber").html();
            $.ajax({
                url: "http://cjl3.rokyinfo.net:7200/api-analyze/v3.1/ebikereports?ccSn=" + ccusn1 + "&startTime=" + cstartTime + "&endTime=" + cendTime,
                method: "get",
                contentType: "application/json; charset=utf-8",
                cache: false,
                beforeSend: function (xhr) {
                    /* Authorization header */
                    xhr.setRequestHeader("firm", sessionStorage.flag);
                    xhr.setRequestHeader("Authorization", sessionStorage.token);
                },
                success: function (data) {


                    names = [];    //类别数组（实际用来盛放X轴坐标值）
                    nums = [];    //销量数组（实际用来盛放Y坐标值）
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            names.push(data[i].reportTime);    //挨个取出类别并填入类别数组
                        }
                        for (var i = 0; i < data.length; i++) {
                            nums.push(data[i].fVoltage);    //挨个取出销量并填入销量数组
                        }

                        function getMaximin(arr, maximin) {
                            if (maximin == "max") {
                                return Math.max.apply(Math, arr);
                            }
                            else if (maximin == "min") {
                                return Math.min.apply(Math, arr);
                            }
                        };
                        var ymax = getMaximin(nums, "max");
                        var ymin = getMaximin(nums, "min");
                        myChart.hideLoading();    //隐藏加载动画
                        myChart.setOption({        //加载数据图表
                            xAxis: {
                                data: names
                            },
                            yAxis: {
                                min: 48,
                                max: ymax + 10
                            },
                            series: [{
                                // 根据名字对应到相应的系列
                                name: '电压',
                                data: nums

                            }]
                        });

                    }


                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("失败");
                    console.log(jqXHR);
                }
            });

            $.get('data.json').done(function (data) {
                myChart.setOption(myChart.option, true);
                // 填入数据
                myChart.setOption({
                    xAxis: {
                        data: data.categories
                    },

                    series: [{
                        // 根据名字对应到相应的系列
                        name: '电压',
                        data: data.data
                    }]
                });
            });


            // 使用刚指定的配置项和数据显示图表。
        });

        $("#dyclose").on("click", function () {
            $("#chart1").hide()
        })
    },
    'click .like5': function (e, value, row, index) {
        $(".carNumber").html(row.ccuSn);
        $("#chart2").show();

        // 基于准备好的dom，初始化echarts实例
        var myChart2 = echarts.init(document.getElementById('main2'));

        // 指定图表的配置项和数据

        myChart2.setOption({

            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                data: ['里程']
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '里程',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }
            ]
        });


        var names = [];    //类别数组（实际用来盛放X轴坐标值）
        var nums = [];    //销量数组（实际用来盛放Y坐标值）
        myChart2.showLoading();

        var ccusn2 = $(".carNumber").html();
        $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-analyze/v3.1/statistics/day/mileage/" + ccusn2,
            method: "get",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("firm", sessionStorage.flag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {

                names = [];    //类别数组（实际用来盛放X轴坐标值）
                nums = [];    //销量数组（实际用来盛放Y坐标值）
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        names.push(data[i].time);    //挨个取出类别并填入类别数组
                    }
                    for (var i = 0; i < data.length; i++) {
                        nums.push(data[i].miles);    //挨个取出销量并填入销量数组
                    }

                    function getMaximin(arr, maximin) {
                        if (maximin == "max") {
                            return Math.max.apply(Math, arr);
                        }
                        else if (maximin == "min") {
                            return Math.min.apply(Math, arr);
                        }
                    };
                    var ymax = getMaximin(nums, "max");
                    var ymin = getMaximin(nums, "min");
                    myChart2.hideLoading();    //隐藏加载动画
                    myChart2.setOption({        //加载数据图表
                        xAxis: {
                            data: names
                        },
                        yAxis: {
                            min: ymin,
                            max: ymax + 10
                        },
                        series: [{
                            // 根据名字对应到相应的系列
                            name: '里程',
                            data: nums

                        }]
                    });

                }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("失败");
                console.log(jqXHR);
            }
        });

        $.get('data.json').done(function (data) {

            // 填入数据
            myChart2.setOption({
                xAxis: {
                    data: data.categories
                },

                series: [{
                    // 根据名字对应到相应的系列
                    name: '里程',
                    data: data.data
                }]
            });
        });


        // 使用刚指定的配置项和数据显示图表。
        $("#chartSearch2").on("click", function () {
            var names = [];    //类别数组（实际用来盛放X轴坐标值）
            var nums = [];    //销量数组（实际用来盛放Y坐标值）
            myChart2.showLoading();

            var ccusn2 = $(".carNumber").html();
            $.ajax({
                url: "http://cjl3.rokyinfo.net:7200/api-analyze/v3.1/statistics/day/mileage/" + ccusn2,
                method: "get",
                contentType: "application/json; charset=utf-8",
                cache: false,
                beforeSend: function (xhr) {
                    /* Authorization header */
                    xhr.setRequestHeader("firm", sessionStorage.flag);
                    xhr.setRequestHeader("Authorization", sessionStorage.token);
                },
                success: function (data) {

                    names = [];    //类别数组（实际用来盛放X轴坐标值）
                    nums = [];    //销量数组（实际用来盛放Y坐标值）
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            names.push(data[i].time);    //挨个取出类别并填入类别数组
                        }
                        for (var i = 0; i < data.length; i++) {
                            nums.push(data[i].miles);    //挨个取出销量并填入销量数组
                        }

                        function getMaximin(arr, maximin) {
                            if (maximin == "max") {
                                return Math.max.apply(Math, arr);
                            }
                            else if (maximin == "min") {
                                return Math.min.apply(Math, arr);
                            }
                        };
                        var ymax = getMaximin(nums, "max");
                        var ymin = getMaximin(nums, "min");
                        myChart2.hideLoading();    //隐藏加载动画
                        myChart2.setOption({        //加载数据图表
                            xAxis: {
                                data: names
                            },
                            yAxis: {
                                min: ymin,
                                max: ymax + 10
                            },
                            series: [{
                                // 根据名字对应到相应的系列
                                name: '里程',
                                data: nums

                            }]
                        });

                    }


                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("失败");
                    console.log(jqXHR);
                }
            });

            $.get('data.json').done(function (data) {

                // 填入数据
                myChart2.setOption({
                    xAxis: {
                        data: data.categories
                    },

                    series: [{
                        // 根据名字对应到相应的系列
                        name: '里程',
                        data: data.data
                    }]
                });
            });


            // 使用刚指定的配置项和数据显示图表。
        });

        $("#lcclose").on("click", function () {
            $("#chart2").hide()
        })
    },
    'click .like9': function (e, value, row, index) {
        console.log('===============>' + row.owner.id)
        $(".userRealName").html(row.owner.realname);
        $("#chart3").show();

        // 基于准备好的dom，初始化echarts实例
        var myChart2 = echarts.init(document.getElementById('main3'));

        // 指定图表的配置项和数据

        myChart2.setOption({

            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                data: ['里程']
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '里程',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }
            ]
        });


        var names = [];    //类别数组（实际用来盛放X轴坐标值）
        var nums = [];    //销量数组（实际用来盛放Y坐标值）
        myChart2.showLoading();

        var ownerId = row.owner.id;
        $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-analyze/v3.1/ebikusermiless?sort=mile_date,asc&userId=" + ownerId,
            method: "get",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("firm", sessionStorage.flag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (result) {

                names = [];    //类别数组（实际用来盛放X轴坐标值）
                nums = [];    //销量数组（实际用来盛放Y坐标值）
                var data = result.list;
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        names.push(data[i].mileDate.split(' ')[0]);    //挨个取出类别并填入类别数组
                    }
                    for (var i = 0; i < data.length; i++) {
                        nums.push(data[i].miles);    //挨个取出销量并填入销量数组
                    }

                    function getMaximin(arr, maximin) {
                        if (maximin == "max") {
                            return Math.max.apply(Math, arr);
                        }
                        else if (maximin == "min") {
                            return Math.min.apply(Math, arr);
                        }
                    };
                    var ymax = getMaximin(nums, "max");
                    var ymin = getMaximin(nums, "min");
                    myChart2.hideLoading();    //隐藏加载动画
                    myChart2.setOption({        //加载数据图表
                        xAxis: {
                            data: names
                        },
                        yAxis: {
                            min: 0,
                            max: ymax + 10
                        },
                        series: [{
                            // 根据名字对应到相应的系列
                            name: '里程',
                            data: nums

                        }]
                    });

                }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("失败");
                console.log(jqXHR);
            }
        });

        $.get('data.json').done(function (data) {

            // 填入数据
            myChart2.setOption({
                xAxis: {
                    data: data.categories
                },

                series: [{
                    // 根据名字对应到相应的系列
                    name: '里程',
                    data: data.data
                }]
            });
        });

        $("#userMileage").on("click", function () {
            $("#chart3").hide()
        })
    },
    'click .like6': function (e, value, row, index) {
        var sn = row.ccuSn;
        var date = new Date();
        var date2 = new Date(date.getTime() - 1 * 3600 * 1000);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date2.getMonth() + 1;
        var strDate = date2.getDate();
        var strhour = date2.getHours();
        var strminu = date2.getMinutes();
        var strseco = date2.getSeconds();

        var month1 = date.getMonth() + 1;
        var strDate1 = date.getDate();
        var strhour1 = date.getHours();
        var strminu1 = date.getMinutes();
        var strseco1 = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strhour >= 0 && strDate <= 9) {
            strhour = "0" + strhour;
        }
        if (strminu >= 0 && strminu <= 9) {
            strminu = "0" + strminu;
        }
        if (strseco >= 0 && strseco <= 9) {
            strseco = "0" + strseco;
        }

        if (month1 >= 1 && month1 <= 9) {
            month1 = "0" + month1;
        }
        if (strDate1 >= 0 && strDate1 <= 9) {
            strDate1 = "0" + strDate1;
        }
        if (strhour1 >= 0 && strDate1 <= 9) {
            strhour1 = "0" + strhour1;
        }
        if (strminu1 >= 0 && strminu1 <= 9) {
            strminu1 = "0" + strminu1;
        }
        if (strseco1 >= 0 && strseco1 <= 9) {
            strseco1 = "0" + strseco1;
        }
        var currentdate2 = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + "%20" + "0" + seperator2 + "0"
            + seperator2 + "00";
        var currentdate1 = date.getFullYear() + seperator1 + month1 + seperator1 + strDate1
            + "%20" + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-analyze/v3.1/ebikereports?ccSn=" + sn + "&startTime=" + currentdate2 + "&endTime=" + currentdate1,
            method: "get",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("firm", sessionStorage.flag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {
//                        console.log(data);
                var data1 = [];
                var listdata = data;
                var leng = data.length;
                console.log(leng);
                var pois = [];

                function translateOne(pointArr) {
                    convertor.translate(pointArr, 1, 5, function (data) {
                        var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                            strokeWeight: '2'//设置线宽
                        });
                        var icons = new BMap.IconSequence(sy, '10', '30');
                        if (data.status === 0) {
                            for (var i = 0; i < data.points.length; i++) {
                                pois.push(data.points[i]);
                            }
                            var polyline = new BMap.Polyline(pois, {
                                strokeColor: "#0C8816",
                                strokeWeight: 3,
                                setStrokeStyle: "dashed",
                                strokeOpacity: 1
                            });
                            map.addOverlay(polyline);          //增加折线
                            map.centerAndZoom(pois[0], 10);

                            var labelStyle = {
                                color: "#fff",
                                fontFamily: "微软雅黑",
                                border: "none",
                                background: "transparent",
                                fontWeight: "bold",
                                fontSize: "12px"
                            };
                            var label = new BMap.Label("起", {
                                offset: new BMap.Size(3, 1)
                            });
                            label.setStyle(labelStyle);
                            var marker = new BMap.Marker(pois[0]);
                            marker.setLabel(label);
                            map.addOverlay(marker);


                        }
                    });
                }

                var shu = listdata.length;
                if (shu > 200) {

                    for (var i = listdata.length - 200; i < listdata.length; i++) {
                        var point = new BMap.Point(listdata[i]['lon'], listdata[i]['lat']);
                        var convertor = new BMap.Convertor();
                        var pointArr = [];
                        pointArr.push(point);
                        translateOne(pointArr);

                    }
                } else {
                    for (var i = 0; i < listdata.length; i++) {
                        var point = new BMap.Point(listdata[i]['lon'], listdata[i]['lat']);
                        var convertor = new BMap.Convertor();
                        var pointArr = [];
                        pointArr.push(point);
                        translateOne(pointArr);

                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("失败");
                console.log(jqXHR);
            }
        });

        // 百度地图API功能
        var map = new BMap.Map("allmap", {
            minZoom: 5,
            maxZoom: 19
        });// 创建Map实例
        map.centerAndZoom(new BMap.Point(90.404, 34.915), 5);
        map.enableScrollWheelZoom();
        map.enableInertialDragging();

        map.enableContinuousZoom();

        function ZoomControl() {
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 25);
        }

        // 通过JavaScript的prototype属性继承于BMap.Control
        ZoomControl.prototype = new BMap.Control();

        var myZoomCtrl = new ZoomControl();
        // 添加到地图当中
        map.addControl(myZoomCtrl);
        var size = new BMap.Size(50, 25);
        map.addControl(new BMap.CityListControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: size

        }));


        $("#guiji").show();
        $("#gjclose").on("click", function () {
            $("#guiji").hide()
        })
    },
    'click .like7': function (e, value, row, index) {
        var sn = row.ccuSn;
        var url;
        $(".item").each(function (index, element) {
            if ($(this).hasClass("active")) {

                if ($(this).text() == "仓库电池") {
                    url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&category=0&ccuSn=" + sn
                }
                else {
                    url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/list?type=4&ccuSn=" + sn
                }


            }
        });
        console.log(url)
        $.ajax({
            url: url,
            method: "get",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("firm", sessionStorage.flag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {
                var x = data.list[0].lon;
                var y = data.list[0].lat;
                var pointwz = new BMap.Point(x, y);
                var bm = new BMap.Map("allmap2");
                bm.centerAndZoom(pointwz, 15);
                bm.enableScrollWheelZoom(true);
                bm.addControl(new BMap.NavigationControl());
                translateCallback = function (data) {
                    if (data.status === 0) {
                        var marker = new BMap.Marker(data.points[0]);
                        bm.addOverlay(marker);
                        bm.setCenter(data.points[0]);
                    }
                };

                setTimeout(function () {
                    var convertor = new BMap.Convertor();
                    var pointArr = [];
                    pointArr.push(pointwz);
                    convertor.translate(pointArr, 1, 5, translateCallback)
                }, 1000);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("失败");
                console.log(jqXHR);
            }
        });

        // 百度地图API功能
        var map = new BMap.Map("allmap");    // 创建Map实例
        map.centerAndZoom(new BMap.Point(108.953365, 34.348461), 5);
        map.enableScrollWheelZoom();
        map.enableInertialDragging();

        map.enableContinuousZoom();

        function ZoomControl() {
            // 默认停靠位置和偏移量
            this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
            this.defaultOffset = new BMap.Size(10, 25);
        }

        // 通过JavaScript的prototype属性继承于BMap.Control
        ZoomControl.prototype = new BMap.Control();

        var myZoomCtrl = new ZoomControl();
        // 添加到地图当中
        map.addControl(myZoomCtrl);
        var size = new BMap.Size(50, 25);
        map.addControl(new BMap.CityListControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: size

        }));
//            var mapdata=poins(JSON.parse(sessionStorage.mapData));
//
//            setTimeout(function(){
//
//                var convertor = new BMap.Convertor();
//                for(var i=0;i<mapdata.length;i++){
//                    convertor.translate(mapdata[i], 1, 5, translateCallback);
//
//                }
//            }, 100);
//            var pois =[];
//            translateCallback = function (data){
//                var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
//
//                    strokeWeight: '2'//设置线宽
//                });
//                var icons = new BMap.IconSequence(sy, '10', '30');
//// 创建polyline对象
//                if(data.status === 0) {
//
//                    for (var i = 0; i < data.points.length; i++) {
////                        pois.push(data.points[i].lon['lon'],data.points[i].lat['lat']);
//
//                        pois.push(data.points[i]);
//
//
//
//                    }
////                    console.log(pois);
//
//                    var polyline =new BMap.Polyline(pois, {
//                        enableEditing: false,//是否启用线编辑，默认为false
//                        enableClicking: true,//是否响应点击事件，默认为true
//                        strokeWeight:'5',//折线的宽度，以像素为单位
//                        strokeOpacity: 0.4,//折线的透明度，取值范围0 - 1
//                        strokeColor:"#ff0000" //折线颜色
//                    });
//
//                    map.addOverlay(polyline);          //增加折线
//
//                }
//            };


        $("#weizhi").show();
        $("#wzclose").on("click", function () {
            $("#weizhi").hide()
        })
    },
    'click .like8': function (e, value, row, index) {
        $(".item").each(function (index, element) {
            console.log("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/clean-exception-flag");
            if ($(this).hasClass("active")) {

                var text = $(this).text()
                if (text == "欠压电池" || text == "离线电池") {
                    ajax("http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/" + row.ccuSn + "/clean-exception-flag", "get", function (data) {
                        $("#table").bootstrapTable('refresh');
                    }, function (err) {
                        alert("移除失败");
                        console.log(err)
                    });
                }
                else if (text == "禁用电池") {


                    $("#title-sn").text(row.ccuSn)
                    $("#content-reason").val(row.afterSaleReason)
                    $("#alert-dialog").modal('show')

                }

            }
        });

    },
    'click .like10': function (e, value, row, index) {

        console.log('like10')

        $(".carNumber").html(row.ccuSn);
        $("#chart1").show();

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据

        myChart.setOption({

            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            legend: {
                data: ['电量']
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [{
                name: '电量',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    }
                },

                data: []
            }]
        });
        // 基于准备好的dom，初始化echarts实例


        var names = [];    //类别数组（实际用来盛放X轴坐标值）
        var nums = [];    //销量数组（实际用来盛放Y坐标值）
        myChart.showLoading();
        var cstartTime = $(".chartstartTime").val();
        var cendTime = $(".chartendTime").val();
        var ccusn1 = $(".carNumber").html();
        $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-analyze/v3.1/ebikereports?ccSn=" + ccusn1 + "&startTime=" + cstartTime + "&endTime=" + cendTime,
            method: "get",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("firm", sessionStorage.flag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {

                names = [];    //类别数组
                nums = [];    //
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        names.push(data[i].reportTime);    //挨个取出类别并填入类别数组
                    }
                    for (var i = 0; i < data.length; i++) {
                        nums.push(data[i].bmsSoc);    //挨个取出销量并填入销量数组
                    }

                    function getMaximin(arr, maximin) {
                        if (maximin == "max") {
                            return Math.max.apply(Math, arr);
                        }
                        else if (maximin == "min") {
                            return Math.min.apply(Math, arr);
                        }
                    };
                    var ymax = getMaximin(nums, "max");
                    var ymin = getMaximin(nums, "min");
                    myChart.hideLoading();    //隐藏加载动画
                    myChart.setOption({        //加载数据图表
                        xAxis: {
                            data: names
                        },
                        yAxis: {
                            min: 0,
                            max: 110
                        },
                        series: [{
                            // 根据名字对应到相应的系列
                            name: '电量',
                            data: nums

                        }]
                    });

                }
//                myChart.setOption(myChart.option,true);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("失败");
                console.log(jqXHR);
            }
        });

        $.get('data.json').done(function (data) {

            // 填入数据
            myChart.setOption({
                xAxis: {
                    data: data.categories
                },

                series: [{
                    // 根据名字对应到相应的系列
                    name: '电量',
                    data: data.data
                }]
            });
            myChart.setOption(myChart.option, true);
        });


        // 使用刚指定的配置项和数据显示图表。

        $("#chartSearch").on("click", function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            // 指定图表的配置项和数据

            myChart.setOption({

                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                toolbox: {
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                legend: {
                    data: ['电量']
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    start: 0,
                    end: 10,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }],
                series: [{
                    name: '电量',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(255, 70, 131)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    },

                    data: []
                }]
            });
            // 基于准备好的dom，初始化echarts实例

            var names = [];    //类别数组（实际用来盛放X轴坐标值）
            var nums = [];    //销量数组（实际用来盛放Y坐标值）
            myChart.showLoading();
            var cstartTime = $(".chartstartTime").val();
            var cendTime = $(".chartendTime").val();
            var ccusn1 = $(".carNumber").html();
            $.ajax({
                url: "http://cjl3.rokyinfo.net:7200/api-analyze/v3.1/ebikereports?ccSn=" + ccusn1 + "&startTime=" + cstartTime + "&endTime=" + cendTime,
                method: "get",
                contentType: "application/json; charset=utf-8",
                cache: false,
                beforeSend: function (xhr) {
                    /* Authorization header */
                    xhr.setRequestHeader("firm", sessionStorage.flag);
                    xhr.setRequestHeader("Authorization", sessionStorage.token);
                },
                success: function (data) {


                    names = [];    //类别数组（实际用来盛放X轴坐标值）
                    nums = [];    //销量数组（实际用来盛放Y坐标值）
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            names.push(data[i].reportTime);    //挨个取出类别并填入类别数组
                        }
                        for (var i = 0; i < data.length; i++) {
                            nums.push(data[i].bmsSoc);    //挨个取出销量并填入销量数组
                        }

                        function getMaximin(arr, maximin) {
                            if (maximin == "max") {
                                return Math.max.apply(Math, arr);
                            }
                            else if (maximin == "min") {
                                return Math.min.apply(Math, arr);
                            }
                        };
                        var ymax = getMaximin(nums, "max");
                        var ymin = getMaximin(nums, "min");
                        myChart.hideLoading();    //隐藏加载动画
                        myChart.setOption({        //加载数据图表
                            xAxis: {
                                data: names
                            },
                            yAxis: {
                                min: 0,
                                max: 110
                            },
                            series: [{
                                // 根据名字对应到相应的系列
                                name: '电量',
                                data: nums

                            }]
                        });

                    }


                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("失败");
                    console.log(jqXHR);
                }
            });

            $.get('data.json').done(function (data) {
                myChart.setOption(myChart.option, true);
                // 填入数据
                myChart.setOption({
                    xAxis: {
                        data: data.categories
                    },

                    series: [{
                        // 根据名字对应到相应的系列
                        name: '电量',
                        data: data.data
                    }]
                });
            });


            // 使用刚指定的配置项和数据显示图表。
        });

        $("#dyclose").on("click", function () {
            $("#chart1").hide()
        })
    }
};

$("#btn-dialog-affirm").on("click", function () {

    if ($("#content-reason").val() == '') {
        alert("请填写售后原因");
        return
    }

    ajax('http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update-after-sale-flag?ccuSn=' +  $("#title-sn").text() + '&afterSaleFlag=1&afterSaleReason=' +  $("#content-reason").val(), "put", function (data) {
        $("#table").bootstrapTable('refresh');
    }, function (err) {
        alert("更新失败");
        console.log(err)
    });
});

function ajax(url, method, success, err) {
    $.ajax({
        url: url,
        method: method,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("firm", sessionStorage.flag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        },
        success: success,
        error: err
    });
}  //ajax 封装

function getHeight() {
    var mainNavHeight = Number(sessionStorage.mainNavHeight)
    return $(window).height() - $('.fixed-table-toolbar').outerHeight(true)  - mainNavHeight - 16 - 16;
}

$("#wrap-btn-on").on("click", function () {
    console.log("cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update_storeId?storeId=" + storeId + "&ueId=" + ueId);
    console.log("已发送");
    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ues/update_storeId?storeId=" + storeId + "&ueId=" + ueId,
        method: "put",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("firm", sessionStorage.flag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        }, success: function (data) {
            console.log("成功");
            $table.bootstrapTable("refresh", {silent: true});
            $("#wrap").hide()
        },
        error: function (err) {
            console.log(err)
        }
    })
});
$("#wrap-btn-off").on("click", function () {
    $("#wrap").hide()
});
$(".searchCcu").on("click", function () {
    $("#table").bootstrapTable('refresh', {'url': (url + '&ccuSn=' + $(".searchResult").val())});
});

$(".searchDQ").on("click", function () {

    var selectType = document.getElementById("select-type");
    var typeIndex = selectType.selectedIndex;
    var type = selectType.options[typeIndex].value;

    var myselect = document.getElementById("sectionName-s");
    var index = myselect.selectedIndex;
    var idstore1 = myselect.options[index].value;

    var province = $(".selpr").val();
    var city = $(".selci").val();
    var county = $(".selco").val();

    var myselect = document.getElementById("sectionName-s");
    var index = myselect.selectedIndex;
    var idstore1 = myselect.options[index].value;

    var myselect3 = document.getElementById("erjise");
    var index3 = myselect3.selectedIndex;
    var idstore2 = myselect3.options[index3].value;

    var myselect2 = document.getElementById("guigese");
    var index2 = myselect2.selectedIndex;
    var idpro = myselect2.options[index2].value;


    if (url.indexOf('ue.end_time,desc') > 0) {
        url = url.substring(0, url.indexOf('ue.end_time,desc')) + 'ue.end_time,desc'
    } else if (url.indexOf('ue.store_code,asc') > 0){
        url = url.substring(0, url.indexOf('ue.store_code,asc')) + 'ue.store_code,asc'
    }

    console.log('url:' + url)
    console.log('idstore1:' + idstore1 + ' idstore2:' + idstore2)


    console.log('1:' + url)
    if (province != '') {
        url = url + "&province=" + province
    }
    if (city != '') {
        url = url + "&city=" + city
    }
    if (county != '') {
        url = url + "&county=" + county
    }
    if (idstore1 != 0) {
        if (idstore2 != 0) {
            url = url + "&storeId=" + idstore2
        } else {
            url = url + "&dealerId=" + idstore1
        }
    }
    if (idpro != 0) {
        url = url + "&productId=" + idpro
    }

    if (type != 0) {
        url = url + "&storeType=" + type
    }

    console.log('2:' + url)
    $("#table").bootstrapTable('refresh', {'url': url});

});

function onStationChange() {
    var myselect2 = document.getElementById("erjise");
    var myselect = document.getElementById("sectionName-s");
    var index = myselect.selectedIndex;
    var parentId = myselect.options[index].value;
    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=2&parentId=" + parentId + "&showFlag=0&sort=code,asc&limit=100&page=1",
        method: "get",
        contentType: "application/json; charset=utf-8",
        processData: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        },
        success: function (data) {
            var len = data.list.length;
            myselect2.length = 1;
            for (i = 0; i < len; i++) {
                $("#erjise").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            onStationChange()
        }
    })
}

function getStation() {

    var selectType = document.getElementById("select-type");
    var typeIndex = selectType.selectedIndex;
    var type = selectType.options[typeIndex].value;

    var province = $(".selpr").val();
    var city = $(".selci").val();

    var currentUrl = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=1&showFlag=0&sort=code,asc&limit=100&page=1'

    if (province != '' && province != null) {
        currentUrl = currentUrl + "&province=" + province
    }
    if (city != '' && city != null) {
        currentUrl = currentUrl + "&city=" + city
    }

    if (type != 0) {
        currentUrl = currentUrl + "&type=" + type
    }

    console.log('getStation:url:' + currentUrl)

    var myselect = document.getElementById("sectionName-s");
    $.ajax({
            url: currentUrl,
            method: "get",
            contentType: "application/json; charset=utf-8",
            processData: false,
            cache: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {
                var len = data.list.length;
                myselect.length = 1;
                for (i = 0; i < len; i++) {
                    $("#sectionName-s").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                getStation()
            }
        }
    );
}

function getStoreWithCategory() {
    var myselect = document.getElementById("sectionName-s");
    $.ajax({
            url: ('http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=' + currentCategory +'&showFlag=0&sort=code,asc&limit=100&page=1'),
            method: "get",
            contentType: "application/json; charset=utf-8",
            processData: false,
            cache: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {
                var len = data.list.length;
                myselect.length = 1;
                for (i = 0; i < len; i++) {
                    $("#sectionName-s").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                getStoreWithCategory()
            }
        }
    );
}

function getSpecifications() {
    $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-order/v3.1/specifications?sort=id,asc&categoryIds=1",
            method: "get",
            contentType: "application/json; charset=utf-8",
            processData: false,
            cache: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {
                var len = data.list.length;
                $('#guigese').attr("length", '0');
                for (i = 0; i < len; i++) {
                    $("#guigese").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                getSpecifications()
            }
        }
    );
}

function getNowFormatDate() {
    var date = new Date();
    var date2 = new Date(date.getTime() - 7 * 24 * 3600 * 1000);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date2.getMonth() + 1;
    var strDate = date2.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date2.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + '00' + seperator2 + '00'
        + seperator2 + '00';
    return currentdate;
}

function getNowFormatDate2() {
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

function getNowFormatDate3() {
    var date = new Date();
    var date2 = new Date(date.getTime() - 30 * 24 * 3600 * 1000);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date2.getMonth() + 1;
    var strDate = date2.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date2.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + '00' + seperator2 + '00'
        + seperator2 + '00';
    return currentdate;
}

$(function () {
    $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });
    $('#datetimepicker2').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });
    $('#datetimepicker3').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultDate: getNowFormatDate()
    });
    $('#datetimepicker4').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultDate: getNowFormatDate2()
    });
    $('#datetimepicker5').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultDate: getNowFormatDate3()
    });
    $('#datetimepicker6').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss',
        defaultDate: getNowFormatDate2()
    });

    resizeLayout()
    getStation();
    getSpecifications();

    initTable();
    $table.bootstrapTable("hideColumn", "w");
    $table.bootstrapTable("hideColumn", "re");
    $table.bootstrapTable("hideColumn", "afterSaleReason");
});

function resizeLayout() {

    var mainNavHeight = Number(sessionStorage.mainNavHeight)

    $(".ui-content").css('padding-top', (mainNavHeight + 16) + 'px');

}

$(window).resize(function () {
    resizeLayout()
    $table.bootstrapTable('resetView', {
        height: getHeight()
    });
});