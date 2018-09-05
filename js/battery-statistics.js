/**
 *
 * @file 电池统计JS文件
 *
 */

var $table = $('#table');
var dataResult;
var source = null;

var url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/rent-statistics-summary?ueType=4";

var parentStoreId = ''
var currentCategory = -1
var currentStatisticsTab = 0

// 40：直营租赁
var type = '40'
// your custom ajax request here
function ajaxRequest(params) {
    if (source != null) {
        source.cancel('Operation canceled by the user.');
        source = null
    }

    var CancelToken = axios.CancelToken;
    source = CancelToken.source();

    axios.get(params.url,{
        cancelToken: source.token,
        headers:{
            "Content-Type": "application/json;charset=UTF-8",
            "firm": JSON.parse(sessionStorage.name)[sessionStorage.Vname].flag,
            "Authorization": sessionStorage.token
        },
        params:params.data
    })
        .then(function(response){
            params.success(response.data)

        })
        .catch(function(error){
            console.log(error)
        });
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
    console.log(res);
}

function getHeight() {
    var mainNavHeight = Number(sessionStorage.mainNavHeight)
    if (currentCategory === -1 || currentCategory === 1 || currentCategory === 2) {
        return $(window).height() - mainNavHeight - 100 - 16 - 16;
    } else {
        return $(window).height() - mainNavHeight - 50 - 16 - 16;
    }
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
                field: 'code',
                title: '编号',
                align: 'center',
                valign: 'middle'

            },
            {
                field: 'province',
                title: '省',
                align: 'center',
                valign: 'middle'

            },
            {
                field: 'city',
                title: '市',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'name',
                title: '仓库',
                align: 'center',
                valign: 'middle'
            },

            {

                field: 'k',
                title: '分站',
                align: 'center',
                valign: 'middle',
                // events: operateEvents,
                formatter: jxsFormatter

            },
            {

                field: 'dealer',
                title: '分站',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'm',
                title: '驿站',
                align: 'center',
                valign: 'middle',
                formatter: mendianFormatter
            }, {
                field: 'l',
                title: '类型',
                align: 'center',
                valign: 'middle',
                formatter: lxFormatter
            },

            {
                field: 'depositAmount',
                title: '保证金',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'balance',
                title: '余额',
                align: 'center',
                valign: 'middle'

            },
            {
                field: 'income',
                title: '总收益',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'batteryTotalCount',
                title: '总电池数',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: totalbattFormatter
            },
            {

                field: 'batteryRentedCount',
                title: '已租赁数',
                align: 'center',
                valign: 'middle'

            },

            {
                field: 'batteryUnusedCount',
                title: '待租赁数',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'zhandian',
                title: '站点',
                align: 'center',
                valign: 'middle',
                formatter: zhandianFormatter

            },
            {
                field: 'specification',
                title: '产品型号',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'zongshu',
                title: '总电池数',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: zongshuFormatter

            },
            {
                field: 'yizu',
                title: '已租赁数',
                align: 'center',
                valign: 'middle',
                formatter: yizuFormatter

            },
            {
                field: 'daizu',
                title: '待租赁数',
                align: 'center',
                valign: 'middle',
                formatter: daizuFormatter

            },
            {
                field: 'undistributedCount',
                title: '待分配数',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'zulinlv',
                title: '租赁率',
                align: 'center',
                valign: 'middle',
                formatter: zulinlvFormatter
            },
            {
                field: 'rentPercent',
                title: '租赁率',
                align: 'center',
                valign: 'middle',
                formatter: zulinlvFormatter
            },
            {
                field: 'forbidden',
                title: '禁用电池数',
                align: 'center',
                valign: 'middle',
                formatter: forbiddenFormatter
            },
            {
                field: 'offline',
                title: '离线电池数',
                align: 'center',
                valign: 'middle',
                formatter: offlineFormatter
            },
            {
                field: 'undervoltage',
                title: '欠压电池数',
                align: 'center',
                valign: 'middle',
                formatter: undervoltageFormatter
            },
            {
                field: 'overdue',
                title: '逾期电池数',
                align: 'center',
                valign: 'middle',
                formatter: overdueFormatter
            },

            {
                field: 'afterSaleTotalCount',
                title: '售后',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'storageTotalCount',
                title: '仓库',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'loseTotalCount',
                title: '丢失',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'trialTotalCount',
                title: '试用',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'scrapTotalCount',
                title: '报废',
                align: 'center',
                valign: 'middle'
            }
        ]
    });
    // sometimes footer render error.
}

function zhandianFormatter(value, row, index) {
    var inner = row.storeCategoryName;

    return [
        '<span>' + inner + '</span>'
    ].join('');
}//站点
function zongshuFormatter(value, row, index) {
    if (row.storeCategoryName == null) {
        return [
            '<div class="nowwrp">',
            // '<a class="batterytotal" href="#" title="统计详情">',
            row.batteryTotalCount + "",
            // '</a>',
            '</div>'
        ].join('')
    }  else {
        return [
            '<div class="nowwrp">',
            '<a class="batterytotal" href="#" title="统计详情">',
            row.batteryTotalCount + "",
            '</a>',
            '</div>'
        ].join("")
    }

}//总电池数
function yizuFormatter(value, row, index) {

    if (row.rentPercent < 0) {
        var inner = '-'

        return [
            '<span>' + inner + '</span>'
        ].join('');
    } else {
        var inner = row.batteryRentedCount;

        return [
            '<span>' + inner + '</span>'
        ].join('');
    }

}//已租赁数
function daizuFormatter(value, row, index) {
    if (row.rentPercent < 0) {
        var inner = '-'

        return [
            '<span>' + inner + '</span>'
        ].join('');
    } else {
        var inner = row.batteryUnusedCount;
        return [
            '<span>' + inner + '</span>'
        ].join('');
    }

}//待租赁数
function zulinlvFormatter(value, row, index) {

    if (row.rentPercent == null || row.rentPercent < 0) {
        var inner = '-'

        return [
            '<span>' + inner + '</span>'
        ].join('');
    } else {
        var inner = row.rentPercent + "%";

        return [
            '<span>' + inner + '</span>'
        ].join('');
    }


}//租赁率
function jxsFormatter(value, row, index) {
    var inner = row.name;

    return [
        // '<a class="station" href="javascript:void(0)" title="station">',
        '<span >' + inner + '</span>',
        // '</a>',
    ].join('');
}
function forbiddenFormatter(value, row, index) {

    if (row.forbiddenCount < 0) {
        var inner = '-'

        return [
            '<span>' + inner + '</span>'
        ].join('');
    } else {
        var inner = row.forbiddenCount;

        return [
            '<span>' + inner + '</span>'
        ].join('');
    }

}
function undervoltageFormatter(value, row, index) {

    if (row.undervoltageCount < 0) {
        var inner = '-'

        return [
            '<span>' + inner + '</span>'
        ].join('');
    } else {
        var inner = row.undervoltageCount;

        return [
            '<span>' + inner + '</span>'
        ].join('');
    }

}

function offlineFormatter(value, row, index) {

    if (row.offlineCount < 0) {
        var inner = '-'

        return [
            '<span>' + inner + '</span>'
        ].join('');
    } else {
        var inner = row.offlineCount;

        return [
            '<span>' + inner + '</span>'
        ].join('');
    }

}

function overdueFormatter(value, row, index) {

    if (row.overdueCount < 0) {
        var inner = '-'

        return [
            '<span>' + inner + '</span>'
        ].join('');
    } else {
        var inner = row.overdueCount;

        return [
            '<span>' + inner + '</span>'
        ].join('');
    }

}
//k分站
function lxFormatter(value, row, index) {
    var inner;
    if (row.type == 40) {
        inner = "直营"
    } else if (row.type == 70) {
        inner = "代理"
    } else if (row.type == 80) {
        inn = "其他"
    } else {
        inner = ""
    }

    return [
        '<span>' + inner + '</span>'
    ].join('');
}//类型
function mendianFormatter(value, row, index) {
    var inner = row.name;

    return [
        '<span>' + inner + '</span>'
    ].join('');
}//驿站
function totalbattFormatter(value, row, index) {

    var batteryTotalCount = row.batteryTotalCount
    if (batteryTotalCount == null) {
        batteryTotalCount = '0'
    }

    if (currentCategory === -1 || ((currentCategory === 1 || currentCategory === 2) && (currentStatisticsTab === 2  || currentStatisticsTab === 3 ))) {
        return [
            '<div class="nowwrp">',
            '<a class="batterytotal" href="#" title="电池详情">',
            batteryTotalCount + "",
            '</a>',
            '</div>'
        ].join("")
    } else {
        return [
            '<div class="nowwrp">',
            // '<a class="batterytotal" href="#" title="电池详情">',
            batteryTotalCount + "",
            // '</a>',
            '</div>'
        ].join("")
    }

}//总电池数

function queryParams(params) {
    var param = {
        limit: this.pageSize, // 页面大小
        page: this.pageNumber
    };

    return param;
}

var operateEvents = {
    'click .batterytotal': function (e, value, row, index) {

        console.log( 'on click batterytotal')

        if (currentCategory === -1) {

            $.ajax({
                url: "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/rent-statistics-by-category?category=" + row.category + (row.type > 0 ? ('&type=' + row.type) : '') + '&ueType=4',
                method: "get",
                contentType: "application/json; charset=utf-8",
                cache: false,
                beforeSend: function (xhr) {
                    /* Authorization header */
                    xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                    xhr.setRequestHeader("Authorization", sessionStorage.token);
                },
                success: function (data) {
                    render(data)

                    function render(list) {
                        $("#tbMain").empty()
                        for (var i = 0; i < list.length; i++) {
                            var tr = document.createElement('tr')
                            tr.innerHTML = '<td>' + list[i].specification + '</td><td>' + list[i].batteryTotalCount + '</td><td>' + list[i].batteryRentedCount + '</td><td>' + list[i].batteryUnusedCount + '</td><td>' + list[i].rentPercent + '%' + '</td>'
                            document.getElementById('tbMain').appendChild(tr)
                        }
                    }


                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("失败");
                    console.log(jqXHR);
                }
            });

            $("#alert-dialog").modal('show')

        } else if ((currentCategory === 1 || currentCategory === 2) && (currentStatisticsTab === 2  || currentStatisticsTab === 3 )){

            $.ajax({
                url: "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/rent-statistics?storeId=" + row.id + '&ueType=4',
                method: "get",
                contentType: "application/json; charset=utf-8",
                cache: false,
                beforeSend: function (xhr) {
                    /* Authorization header */
                    xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                    xhr.setRequestHeader("Authorization", sessionStorage.token);
                },
                success: function (data) {
                    render(data)

                    function render(list) {
                        $("#tbMain").empty()
                        for (var i = 0; i < list.length; i++) {
                            var tr = document.createElement('tr')
                            tr.innerHTML = '<td>' + list[i].specification + '</td><td>' + list[i].batteryTotalCount + '</td><td>' + list[i].batteryRentedCount + '</td><td>' + list[i].batteryUnusedCount + '</td><td>' + list[i].rentPercent + '%' + '</td>'
                            document.getElementById('tbMain').appendChild(tr)
                        }
                    }


                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("失败");
                    console.log(jqXHR);
                }
            });

            $("#alert-dialog").modal('show')

        }


    }//总电池数
};

$(".btn-search").on("click", function () {
    var url;
    var province = $(".select-province").val();
    var city = $(".select-city").val();

    var storeId = parentStoreId;

    url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=' + currentCategory + '&showFlag=0&sort=code,asc&model=list' + '&ueType=4';
    if (province === '') {
        if (storeId !== '') {
            url = url + "&parentId=" + storeId
        }
    } else {
        if (city === '') {
            if (storeId === '') {
                url = url + "&province=" + province
            } else {
                url = url + "&province=" + province + "&parentId=" + storeId
            }
        } else {
            if (storeId === '') {
                url = url = url + "&province=" + province + "&city=" + city
            } else {
                url = url = url + "&province=" + province + "&city=" + city + "&parentId=" + storeId
            }
        }
    }
    console.log(url)
    $("#table").bootstrapTable('refresh', {'url': url});

});

$(function () {

    $("#station-toolbar li").click(function () {
        $(this).siblings('li').removeClass('active');          // 删除其他兄弟元素的样式
        $(this).addClass('active');                            // 添加当前元素的样式
        $(".item").each(function (index, element) {
            if ($(this).hasClass("active")) {

                var text = $(this).text()
                console.log(text)
                if (text == '省统计') {

                    document.getElementById("table1").style.visibility = "hidden";
                    currentStatisticsTab = 0
                    url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/statistics-with-area?area=province&type=' + type;

                    initTable();

                    $table.bootstrapTable("hideColumn", "code");
                    $table.bootstrapTable("hideColumn", "city");
                    $table.bootstrapTable("hideColumn", "k");
                    $table.bootstrapTable("hideColumn", "l");
                    $table.bootstrapTable("hideColumn", "depositAmount");

                    $table.bootstrapTable("hideColumn", "zhandian");
                    $table.bootstrapTable("hideColumn", "zongshu");
                    $table.bootstrapTable("hideColumn", "yizu");
                    $table.bootstrapTable("hideColumn", "daizu");
                    $table.bootstrapTable("hideColumn", "zulinlv");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "name");
                    $table.bootstrapTable("hideColumn", "dealer");
                    $table.bootstrapTable("hideColumn", "county");

                    $table.bootstrapTable("hideColumn", "specification");
                    // $table.bootstrapTable("hideColumn", "undistributedCount");
                    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
                    $table.bootstrapTable("hideColumn", "storageTotalCount");
                    $table.bootstrapTable("hideColumn", "loseTotalCount");
                    $table.bootstrapTable("hideColumn", "trialTotalCount");
                    $table.bootstrapTable("hideColumn", "scrapTotalCount");
                } else if (text == '市统计') {

                    document.getElementById("table1").style.visibility = "hidden";
                    currentStatisticsTab = 1
                    url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/statistics-with-area?area=city&type=' + type;

                    initTable();

                    $table.bootstrapTable("hideColumn", "code");
                    $table.bootstrapTable("hideColumn", "province");
                    $table.bootstrapTable("hideColumn", "k");
                    $table.bootstrapTable("hideColumn", "l");
                    $table.bootstrapTable("hideColumn", "depositAmount");

                    $table.bootstrapTable("hideColumn", "zhandian");
                    $table.bootstrapTable("hideColumn", "zongshu");
                    $table.bootstrapTable("hideColumn", "yizu");
                    $table.bootstrapTable("hideColumn", "daizu");
                    $table.bootstrapTable("hideColumn", "zulinlv");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "name");
                    $table.bootstrapTable("hideColumn", "dealer");
                    $table.bootstrapTable("hideColumn", "county");


                    $table.bootstrapTable("hideColumn", "specification");
                    // $table.bootstrapTable("hideColumn", "undistributedCount");
                    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
                    $table.bootstrapTable("hideColumn", "storageTotalCount");
                    $table.bootstrapTable("hideColumn", "loseTotalCount");
                    $table.bootstrapTable("hideColumn", "trialTotalCount");
                    $table.bootstrapTable("hideColumn", "scrapTotalCount");

                } else if (text == '分站统计') {

                    document.getElementById("table1").style.visibility = "visible";
                    currentCategory = 1
                    currentStatisticsTab = 2
                    url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=' + currentCategory + '&showFlag=0&sort=code,asc&model=list&type=' + type + '&ueType=4';

                    initTable();
                    $table.bootstrapTable("hideColumn", "zhandian");
                    $table.bootstrapTable("hideColumn", "zongshu");
                    $table.bootstrapTable("hideColumn", "yizu");
                    $table.bootstrapTable("hideColumn", "daizu");
                    $table.bootstrapTable("hideColumn", "zulinlv");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "name");
                    $table.bootstrapTable("hideColumn", "dealer");
                    $table.bootstrapTable("hideColumn", "county");


                    $table.bootstrapTable("hideColumn", "specification");
                    // $table.bootstrapTable("hideColumn", "undistributedCount");
                    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
                    $table.bootstrapTable("hideColumn", "storageTotalCount");
                    $table.bootstrapTable("hideColumn", "loseTotalCount");
                    $table.bootstrapTable("hideColumn", "trialTotalCount");
                    $table.bootstrapTable("hideColumn", "scrapTotalCount");

                } else if (text == '驿站统计') {

                    document.getElementById("table1").style.visibility = "visible";
                    currentCategory = 2
                    currentStatisticsTab = 3
                    url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=' + currentCategory + '&showFlag=0&sort=code,asc&model=list&type=' + type + '&ueType=4';

                    initTable();
                    $table.bootstrapTable("hideColumn", "zhandian");
                    $table.bootstrapTable("hideColumn", "zongshu");
                    $table.bootstrapTable("hideColumn", "yizu");
                    $table.bootstrapTable("hideColumn", "daizu");
                    $table.bootstrapTable("hideColumn", "zulinlv");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "name");
                    $table.bootstrapTable("hideColumn", "dealer");
                    $table.bootstrapTable("hideColumn", "county");


                    $table.bootstrapTable("hideColumn", "specification");
                    // $table.bootstrapTable("hideColumn", "undistributedCount");
                    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
                    $table.bootstrapTable("hideColumn", "storageTotalCount");
                    $table.bootstrapTable("hideColumn", "loseTotalCount");
                    $table.bootstrapTable("hideColumn", "trialTotalCount");
                    $table.bootstrapTable("hideColumn", "scrapTotalCount");

                }

            }
        });

    });

    $("#statistics-tab li").click(function () {
        $(this).siblings('li').removeClass('active');          // 删除其他兄弟元素的样式
        $(this).addClass('active');                            // 添加当前元素的样式
        $(".item").each(function (index, element) {
            if ($(this).hasClass("active")) {

                var text = $(this).text()
                if (text == '租赁统计') {

                    url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/rent-statistics-summary?ueType=4";
                    initTable();
                    $table.bootstrapTable("hideColumn", "code");
                    $table.bootstrapTable("hideColumn", "province");
                    $table.bootstrapTable("hideColumn", "city");
                    $table.bootstrapTable("hideColumn", "county");
                    $table.bootstrapTable("hideColumn", "name");
                    $table.bootstrapTable("hideColumn", "k");
                    $table.bootstrapTable("hideColumn", "l");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "depositAmount");
                    $table.bootstrapTable("hideColumn", "balance");
                    $table.bootstrapTable("hideColumn", "income");
                    $table.bootstrapTable("hideColumn", "batteryRentedCount");
                    $table.bootstrapTable("hideColumn", "batteryUnusedCount");
                    $table.bootstrapTable("hideColumn", "batteryTotalCount");
                    $table.bootstrapTable("hideColumn", "rentPercent");
                    $table.bootstrapTable("hideColumn", "dealer");

                    $table.bootstrapTable("hideColumn", "specification");
                    // $table.bootstrapTable("hideColumn", "undistributedCount");
                    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
                    $table.bootstrapTable("hideColumn", "storageTotalCount");
                    $table.bootstrapTable("hideColumn", "loseTotalCount");
                    $table.bootstrapTable("hideColumn", "trialTotalCount");
                    $table.bootstrapTable("hideColumn", "scrapTotalCount");

                } else if (text == '型号统计') {

                    url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/rent-statistics-with-specification?ueType=4";
                    initTable();
                    $table.bootstrapTable("hideColumn", "code");
                    $table.bootstrapTable("hideColumn", "province");
                    $table.bootstrapTable("hideColumn", "city");
                    $table.bootstrapTable("hideColumn", "county");
                    $table.bootstrapTable("hideColumn", "name");
                    $table.bootstrapTable("hideColumn", "k");
                    $table.bootstrapTable("hideColumn", "l");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "depositAmount");
                    $table.bootstrapTable("hideColumn", "balance");
                    $table.bootstrapTable("hideColumn", "income");
                    $table.bootstrapTable("hideColumn", "batteryRentedCount");
                    $table.bootstrapTable("hideColumn", "batteryUnusedCount");
                    $table.bootstrapTable("hideColumn", "batteryTotalCount");
                    $table.bootstrapTable("hideColumn", "rentPercent");
                    $table.bootstrapTable("hideColumn", "dealer");
                    $table.bootstrapTable("hideColumn", "zhandian");

                    $table.bootstrapTable("hideColumn", "forbidden");
                    $table.bootstrapTable("hideColumn", "undervoltage");
                    $table.bootstrapTable("hideColumn", "offline");
                    $table.bootstrapTable("hideColumn", "overdue");
                }

            }
        });

    });


    $("#mytabs li").click(function () {
        $(this).siblings('li').removeClass('active');  // 删除其他兄弟元素的样式

        $(this).addClass('active');                            // 添加当前元素的样式
        $(".item").each(function (index, element) {
            if ($(this).hasClass("active")) {

                var text = $(this).text()
                if (text == '仓库' || text == '售后' || text == '丢失' || text == '试用' || text == '测试' || text == '报废') {

                    document.getElementById("statistics-toolbar").style.display = "none";
                    document.getElementById("station-toolbar").style.display = "none";
                    document.getElementById("table1").style.visibility = "hidden";

                    switch (text) {
                        case '仓库':
                            currentCategory = 0
                            break
                        case '售后':
                            currentCategory = 3
                            break
                        case '丢失':
                            currentCategory = 4
                            break
                        case '试用':
                            currentCategory = 5
                            break
                        case '测试':
                            currentCategory = 6
                            break
                        case '报废':
                            currentCategory = 7
                            break
                        default:
                            currentCategory = 0
                            break
                    }

                    url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=' + currentCategory + '&showFlag=0&sort=code,asc&model=list' + '&ueType=4';

                    initTable();
                    $table.bootstrapTable("hideColumn", "zhandian");
                    $table.bootstrapTable("hideColumn", "zongshu");
                    $table.bootstrapTable("hideColumn", "yizu");
                    $table.bootstrapTable("hideColumn", "daizu");
                    $table.bootstrapTable("hideColumn", "zulinlv");
                    $table.bootstrapTable("hideColumn", "k");
                    $table.bootstrapTable("hideColumn", "l");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "depositAmount");
                    $table.bootstrapTable("hideColumn", "balance");
                    $table.bootstrapTable("hideColumn", "income");
                    $table.bootstrapTable("hideColumn", "batteryRentedCount");
                    $table.bootstrapTable("hideColumn", "batteryUnusedCount");
                    $table.bootstrapTable("hideColumn", "rentPercent");
                    $table.bootstrapTable("hideColumn", "dealer");
                    $table.bootstrapTable("hideColumn", "county");

                    $table.bootstrapTable("hideColumn", "forbidden");
                    $table.bootstrapTable("hideColumn", "undervoltage");
                    $table.bootstrapTable("hideColumn", "offline");
                    $table.bootstrapTable("hideColumn", "overdue");

                    $table.bootstrapTable("hideColumn", "specification");
                    $table.bootstrapTable("hideColumn", "undistributedCount");
                    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
                    $table.bootstrapTable("hideColumn", "storageTotalCount");
                    $table.bootstrapTable("hideColumn", "loseTotalCount");
                    $table.bootstrapTable("hideColumn", "trialTotalCount");
                    $table.bootstrapTable("hideColumn", "scrapTotalCount");

                } else if (text == '直营租赁' || text == '加盟租赁' || text == '集团租赁') {

                    document.getElementById("statistics-toolbar").style.display = "none";
                    if (text == '集团租赁') {
                        document.getElementById("station-toolbar").style.display = "none";
                        document.getElementById("table1").style.visibility = "visible";
                    } else {
                        document.getElementById("station-toolbar").style.display = "block";
                        document.getElementById("table1").style.visibility = "hidden";
                    }
                    $('#station-toolbar a:first').tab('show');

                    currentCategory = 1
                    currentStatisticsTab = 0

                    switch (text) {
                        case '直营租赁':
                            type = '40'
                            url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/statistics-with-area?area=province&type=' + type;
                            break
                        case '加盟租赁':
                            type = '70'
                            url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/statistics-with-area?area=province&type=' + type;
                            break
                        case '集团租赁':
                            type = '80'
                            url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=1&showFlag=0&sort=code,asc&model=list&type=' + type + '&ueType=4';
                            break
                        default:
                            type = '40'
                            url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/statistics-with-area?area=province&type=' + type;
                            break
                    }

                    initTable();

                    if (type !== '80') {
                        $table.bootstrapTable("hideColumn", "code");
                        $table.bootstrapTable("hideColumn", "city");
                        $table.bootstrapTable("hideColumn", "k");
                        $table.bootstrapTable("hideColumn", "l");
                        $table.bootstrapTable("hideColumn", "depositAmount");
                    }

                    $table.bootstrapTable("hideColumn", "zhandian");
                    $table.bootstrapTable("hideColumn", "zongshu");
                    $table.bootstrapTable("hideColumn", "yizu");
                    $table.bootstrapTable("hideColumn", "daizu");
                    $table.bootstrapTable("hideColumn", "zulinlv");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "name");
                    $table.bootstrapTable("hideColumn", "dealer");
                    $table.bootstrapTable("hideColumn", "county");

                    $table.bootstrapTable("hideColumn", "specification");
                    // $table.bootstrapTable("hideColumn", "undistributedCount");
                    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
                    $table.bootstrapTable("hideColumn", "storageTotalCount");
                    $table.bootstrapTable("hideColumn", "loseTotalCount");
                    $table.bootstrapTable("hideColumn", "trialTotalCount");
                    $table.bootstrapTable("hideColumn", "scrapTotalCount");

                } else if (text == '统计') {

                    document.getElementById("statistics-toolbar").style.display = "block";
                    document.getElementById("station-toolbar").style.display = "none";
                    document.getElementById("table1").style.visibility = "hidden";
                    $('#statistics-toolbar a:first').tab('show');

                    currentCategory = -1
                    url = "http://cjl3.rokyinfo.net:7200/api-ebike/v3.1/ebikes/rent-statistics-summary?ueType=4";

                    initTable();
                    $table.bootstrapTable("hideColumn", "code");
                    $table.bootstrapTable("hideColumn", "province");
                    $table.bootstrapTable("hideColumn", "city");
                    $table.bootstrapTable("hideColumn", "county");
                    $table.bootstrapTable("hideColumn", "name");
                    $table.bootstrapTable("hideColumn", "k");
                    $table.bootstrapTable("hideColumn", "l");
                    $table.bootstrapTable("hideColumn", "m");
                    $table.bootstrapTable("hideColumn", "depositAmount");
                    $table.bootstrapTable("hideColumn", "balance");
                    $table.bootstrapTable("hideColumn", "income");
                    $table.bootstrapTable("hideColumn", "batteryRentedCount");
                    $table.bootstrapTable("hideColumn", "batteryUnusedCount");
                    $table.bootstrapTable("hideColumn", "batteryTotalCount");
                    $table.bootstrapTable("hideColumn", "rentPercent");
                    $table.bootstrapTable("hideColumn", "dealer");

                    $table.bootstrapTable("hideColumn", "specification");
                    // $table.bootstrapTable("hideColumn", "undistributedCount");
                    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
                    $table.bootstrapTable("hideColumn", "storageTotalCount");
                    $table.bootstrapTable("hideColumn", "loseTotalCount");
                    $table.bootstrapTable("hideColumn", "trialTotalCount");
                    $table.bootstrapTable("hideColumn", "scrapTotalCount");
                }
                console.log(url)

            }
        });


    });

});

$(function () {
    resizeLayout()

    $table.bootstrapTable("hideColumn", "code");
    $table.bootstrapTable("hideColumn", "province");
    $table.bootstrapTable("hideColumn", "city");
    $table.bootstrapTable("hideColumn", "county");
    $table.bootstrapTable("hideColumn", "name");
    $table.bootstrapTable("hideColumn", "k");
    $table.bootstrapTable("hideColumn", "l");
    $table.bootstrapTable("hideColumn", "m");
    $table.bootstrapTable("hideColumn", "depositAmount");
    $table.bootstrapTable("hideColumn", "balance");
    $table.bootstrapTable("hideColumn", "income");
    $table.bootstrapTable("hideColumn", "batteryRentedCount");
    $table.bootstrapTable("hideColumn", "batteryUnusedCount");
    $table.bootstrapTable("hideColumn", "batteryTotalCount");
    $table.bootstrapTable("hideColumn", "rentPercent");
    $table.bootstrapTable("hideColumn", "dealer");

    $table.bootstrapTable("hideColumn", "specification");
    // $table.bootstrapTable("hideColumn", "undistributedCount");
    $table.bootstrapTable("hideColumn", "afterSaleTotalCount");
    $table.bootstrapTable("hideColumn", "storageTotalCount");
    $table.bootstrapTable("hideColumn", "loseTotalCount");
    $table.bootstrapTable("hideColumn", "trialTotalCount");
    $table.bootstrapTable("hideColumn", "scrapTotalCount");
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

initTable();