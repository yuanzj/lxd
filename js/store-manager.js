/**
 *
 * @file 网点管理JS文件
 *
 */


let currentSelectedCategory = 1
var eruval;
var $table = $('#table');
var dataResult;

$("#tab-storage").on("click", function () {
    currentSelectedCategory = 0

    getMissiveType()
    document.getElementById("toolbar-tab-storage").style.display = "block";
    document.getElementById("toolbar-tab-station").style.display = "none";
    document.getElementById("toolbar-filter").style.display = "none";
    document.getElementById("toolbar-tab-sub-station").style.display = "none";
});
$("#tab-station").on("click", function () {
    currentSelectedCategory = 1

    getMissiveType1()
    document.getElementById("toolbar-tab-storage").style.display = "none";
    document.getElementById("toolbar-tab-station").style.display = "block";
    document.getElementById("toolbar-filter").style.display = "none";
    document.getElementById("toolbar-tab-sub-station").style.display = "none";
});
$("#tab-sub-station").on("click", function () {
    currentSelectedCategory = 2

    getMissiveType2()
    document.getElementById("toolbar-tab-storage").style.display = "none";
    document.getElementById("toolbar-tab-station").style.display = "none";
    document.getElementById("toolbar-filter").style.display = "none";
    document.getElementById("toolbar-tab-sub-station").style.display = "block";
});
$("#tab-after-sale").on("click", function () {
    currentSelectedCategory = 3

    getCurrentSelectedTabTypes()
    document.getElementById("toolbar-tab-storage").style.display = "none";
    document.getElementById("toolbar-tab-station").style.display = "none";
    document.getElementById("toolbar-filter").style.display = "block";
    document.getElementById("toolbar-tab-sub-station").style.display = "none";
});
$("#tab-lose").on("click", function () {
    currentSelectedCategory = 4

    getCurrentSelectedTabTypes()
    document.getElementById("toolbar-tab-storage").style.display = "none";
    document.getElementById("toolbar-tab-station").style.display = "none";
    document.getElementById("toolbar-filter").style.display = "block";
    document.getElementById("toolbar-tab-sub-station").style.display = "none";
});
$("#tab-try-out").on("click", function () {
    currentSelectedCategory = 5

    getCurrentSelectedTabTypes()
    document.getElementById("toolbar-tab-storage").style.display = "none";
    document.getElementById("toolbar-tab-station").style.display = "none";
    document.getElementById("toolbar-filter").style.display = "block";
    document.getElementById("toolbar-tab-sub-station").style.display = "none";
});
$("#tab-test").on("click", function () {
    currentSelectedCategory = 6

    getCurrentSelectedTabTypes()
    document.getElementById("toolbar-tab-storage").style.display = "none";
    document.getElementById("toolbar-tab-station").style.display = "none";
    document.getElementById("toolbar-filter").style.display = "block";
    document.getElementById("toolbar-tab-sub-station").style.display = "none";
});
$("#tab-scrap").on("click", function () {
    currentSelectedCategory = 7

    getCurrentSelectedTabTypes()
    document.getElementById("toolbar-tab-storage").style.display = "none";
    document.getElementById("toolbar-tab-station").style.display = "none";
    document.getElementById("toolbar-filter").style.display = "block";
    document.getElementById("toolbar-tab-sub-station").style.display = "none";
});

var url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=1&showFlag=0&sort=code,asc";
$(function () {

    $("#mytabs li").click(function () {
        $(this).siblings('li').removeClass('active');  // 删除集团兄弟元素的样式

        $(this).addClass('active');                            // 添加当前元素的样式
        $(".item").each(function (index, element) {
            if ($(this).hasClass("active")) {

                var text = $(this).text()
                if (text === '仓库站点') {
                    url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=0&showFlag=0&sort=code,asc";
                    $(function () {
                        initTable();
                        $table.bootstrapTable("hideColumn", "s");
                        $table.bootstrapTable("hideColumn", "c");
                        $table.bootstrapTable("hideColumn", "d");
                        $table.bootstrapTable("hideColumn", "e");
                        $table.bootstrapTable("hideColumn", "address");
                        $table.bootstrapTable("hideColumn", "lon");
                        $table.bootstrapTable("hideColumn", "lat");
                        $table.bootstrapTable("hideColumn", "l");
                        $table.bootstrapTable("hideColumn", "m");
                        $table.bootstrapTable("hideColumn", "dealer");
                        $table.bootstrapTable("hideColumn", "county");
                    });

                } else if (text === '分站站点') {
                    url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=1&showFlag=0&sort=code,asc";
                    $(function () {
                        initTable();
                        $table.bootstrapTable("hideColumn", "a");
                        $table.bootstrapTable("hideColumn", "d");
                        $table.bootstrapTable("hideColumn", "e");
                        $table.bootstrapTable("hideColumn", "address");
                        $table.bootstrapTable("hideColumn", "lon");
                        $table.bootstrapTable("hideColumn", "lat");
                        $table.bootstrapTable("hideColumn", "dealer");
                        $table.bootstrapTable("hideColumn", "county");
                    });
                } else if (text === '驿站站点') {
                    url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=2&showFlag=0&sort=code,asc";
                    $(function () {
                        initTable();
                        $table.bootstrapTable("hideColumn", "a");
                        $table.bootstrapTable("hideColumn", "c");
                        $table.bootstrapTable("hideColumn", "l");
                        $table.bootstrapTable("hideColumn", "s");
                        $table.bootstrapTable("hideColumn", "m");
                    });
                } else if (text === '售后站点' || text === '丢失站点' || text === '试用站点' || text === '测试站点' || text === '报废站点') {

                    switch (text) {
                        case '售后站点':
                            currentSelectedCategory = 3
                            break
                        case '丢失站点':
                            currentSelectedCategory = 4
                            break
                        case '试用站点':
                            currentSelectedCategory = 5
                            break
                        case '测试站点':
                            currentSelectedCategory = 6
                            break
                        case '报废站点':
                            currentSelectedCategory = 7
                            break
                    }

                    url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=' + currentSelectedCategory + '&showFlag=0&sort=code,asc'
                    $(function () {
                        initTable();
                        $table.bootstrapTable("hideColumn", "s");
                        $table.bootstrapTable("hideColumn", "c");
                        $table.bootstrapTable("hideColumn", "d");
                        $table.bootstrapTable("hideColumn", "e");
                        $table.bootstrapTable("hideColumn", "address");
                        $table.bootstrapTable("hideColumn", "lon");
                        $table.bootstrapTable("hideColumn", "lat");
                        $table.bootstrapTable("hideColumn", "l");
                        $table.bootstrapTable("hideColumn", "m");
                        $table.bootstrapTable("hideColumn", "dealer");
                        $table.bootstrapTable("hideColumn", "county");
                    });

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
                events: operateEvents,
                formatter: function (value, row, index) {

                    return '<input type="checkbox"' + ' id=storeId:' + row.id  +'>'

                }
            },


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
                valign: 'middle',
                formatter: provinceFormatter

            },
            {
                field: 'city',
                title: '市',
                align: 'center',
                valign: 'middle',
                formatter: cityFormatter

            },
            {
                field: 'a',
                title: '仓库名称',
                align: 'center',
                valign: 'middle',
                formatter: cknameFormatter

            },
            {
                field: 's',
                title: '分站名称',
                align: 'center',
                valign: 'middle',
                formatter: cknameFormatter
            },
            {
                field: 'dealer',
                title: '分站名称',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'c',
                title: '分站类型',
                align: 'center',
                valign: 'middle',
                formatter: jxstypeFormatter

            },
            {
                field: 'd',
                title: '驿站名称',
                align: 'center',
                valign: 'middle',
                formatter: cknameFormatter
            },
            {
                field: 'e',
                title: '驿站类型',
                align: 'center',
                valign: 'middle',
                formatter: jxstypeFormatter
            },
            {
                field: 'address',
                title: '详细地址',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'lon',
                title: '经度',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'lat',
                title: '纬度',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'linkman',
                title: '联系人',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'contact',
                title: '联系方式',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'l',
                title: '产品配置',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: peizhiFormatter
            },
            {
                field: 'm',
                title: '邀请码配置',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: inviteFormatter
            },
            {
                field: 'z',
                title: '编辑',
                align: 'center',
                valign: 'middle',
                events: operateEvents,
                formatter: editFormatter
            }

        ]
    });
    // sometimes footer render error.
}

function cknameFormatter(value, row, index) {
    var inner = row.name;
    return [
        '<span>' + inner + '</span>'
    ].join("")
}
function jxstypeFormatter(value, row, index) {
    var inner;
    if (row.type == 40) {
        inner = "直营"
    } else if (row.type == 70) {
        inner = "代理"
    } else {
        inner = "集团"
    }
    return [
        '<span>' + inner + '</span>'
    ].join("")


}//分站类型
function editFormatter(value, row, index) {

    return [
        '<div>',
        '<a class="edit1" href="#">',
        '<i class="glyphicon glyphicon-edit" title="编辑网点信息">',
        '</i>',
        '</a>',

        '</div>'
    ].join("")


}//网点
function peizhiFormatter(value, row, index) {

    return [
        '<div>',
        '<a class="peizhi2" href="#">',
        '<i class="glyphicon glyphicon-cog" title="编辑网点信息">',
        '</i>',
        '</a>',

        '</div>'
    ].join("")


}//产品配置
function inviteFormatter(value, row, index) {

    return [
        '<div>',
        '<a class="peizhi" href="#">',
        '<i class="glyphicon glyphicon-cog" title="邀请码配置">',
        '</i>',
        '</a>',

        '</div>'
    ].join("")


}//邀请码配置
function provinceFormatter(value, row, index) {
    var color = 'nowwrp'
    if (row.province == "null" || row.province == "undefined") {
        inner = "-"
    }
    else {
        inner = row.province
    }

    return [
        '<span class=' + color + '>' + inner + '</span>'
    ].join("")
}//省
function cityFormatter(value, row, index) {
    var color = 'nowwrp'
    if (row.city == "null" || row.city == "undefined") {
        inner = "-"
    }
    else {
        inner = row.city
    }

    return [
        '<span class=' + color + '>' + inner + '</span>'
    ].join("")
}//市

function queryParams(params) {
    var param = {
        limit: this.pageSize, // 页面大小
        page: this.pageNumber,
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
    console.log(res);
}

function ajax(url, method, success, err) {
    $.ajax({
        url: url,
        method: method,
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        },
        success: success,
        error: err
    });
}  //ajax 封装

var earningsconfigs = null
var selected4EarningsDealerId = 0
var operateEvents = {
    'click .edit1': function (e, value, row, index) {
        $(".item").each(function (index, element) {
            if ($(this).hasClass("active")) {
                sessionStorage.id = row.id;
                let text = $(this).text()
                if (text == '仓库站点') {

                    $("#editstorehouse  .eckname").val(row.name)
                    $("#distpicker4").distpicker('destroy');
                    $("#distpicker4").distpicker({
                        province: row.province,
                        city: row.city,
                        district: row.county,
                        autoSelect: true,
                        placeholder: false

                    });

                    $("#editstorehouse  .ecksheng").val(row.province);
                    $("#editstorehouse  .eckshi").val(row.city);
                    $("#editstorehouse  .eckcontact").val(row.contact);
                    $("#editstorehouse  .eckcode").val(row.code);
                    $("#editstorehouse  .ecklinkman").val(row.linkman);
                    $("#editstorehouse").modal('show');
                    $("#cledstorehouse").unbind("click").on("click", function () {
                        $("#editstorehouse").modal('hide')
                        $("input").val("");
                    })

                } else if (text == '分站站点') {
                    var m = row.type;
                    console.log(m)
                    var ss = document.getElementById('ss1');
                    if (m == 40) {
                        ss[0].selected = true;
                    }
                    else if (m == 70) {
                        ss[1].selected = true;
                    }
                    else {
                        ss[2].selected = true;
                    }


                    $("#distpicker5").distpicker('destroy');
                    $("#distpicker5").distpicker({
                        province: row.province,
                        city: row.city,
                        district: row.county,
                        autoSelect: true,
                        placeholder: false

                    });
                    $("#editdealer  .ejxname").val(row.name);
                    $("#editdealer  .ejxsheng").val(row.province);
                    $("#editdealer  .ejxshi").val(row.city);
                    $("#editdealer  .ejxcontact").val(row.contact);
                    $("#editdealer  .ejxcode").val(row.code);
                    $("#editdealer  .ejxlinkman").val(row.linkman);
                    $("#editdealer").modal('show');
                    $("#cleddealer").on("click", function () {
                        $("#editdealer").modal('hide');
                        $("input").val("");
                    })
                } else if (text == '驿站站点') {
                    var n = row.type;
                    console.log(n)
                    var ss1 = document.getElementById('ss2');
                    if (n == 40) {
                        ss1[0].selected = true;
                    }
                    else if (n == 70) {
                        ss1[1].selected = true;
                    }
                    else {
                        ss1[2].selected = true;
                    }
                    sessionStorage.id = row.id;
                    $("#distpicker6").distpicker('destroy');
                    $("#distpicker6").distpicker({
                        province: row.province,
                        city: row.city,
                        district: row.county,
                        autoSelect: true,
                        placeholder: false

                    });
                    $("#editstore  .emdname").val(row.name);
                    $("#editstore  .emdsheng").val(row.province);
                    $("#editstore  .emdshi").val(row.city);
                    $("#editstore  .emdqu").val(row.county);
                    $("#editstore  .emdcontact").val(row.contact);
                    $("#editstore  .emdcode").val(row.code);
                    $("#editstore  .emdlinkman").val(row.linkman);
                    $("#editstore  .emdaddress").val(row.address);
                    $("#editstore  .emddealer").val(row.dealer);
                    $("#editstore  .emdlon").val(row.lon);
                    $("#editstore  .emdlat").val(row.lat);
                    $("#editstore").css("display", "block");
                    $("#cledstore").on("click", function () {
                        $("#editstore").hide()
                        $("input").val("");
                    })
                } else if (text == '售后站点' || text == '丢失站点' || text == '试用站点' || text == '测试站点' || text == '报废站点') {

                    $("#alert-view-edit  .edit-name").val(row.name)
                    $("#distpicker-edit").distpicker('destroy');
                    $("#distpicker-edit").distpicker({
                        province: row.province,
                        city: row.city,
                        district: row.county,
                        autoSelect: true,
                        placeholder: false

                    });

                    $("#alert-view-edit  .edit-province").val(row.province);
                    $("#alert-view-edit  .edit-city").val(row.city);
                    $("#alert-view-edit  .edit-contact").val(row.contact);
                    $("#alert-view-edit  .edit-code").val(row.code);
                    $("#alert-view-edit  .edit-linkman").val(row.linkman);
                    $("#alert-view-edit").modal('show');
                    $("#btn-edit-cancel-after-sale").on("click", function () {
                        $("#alert-view-edit").modal('hide');
                        $("input").val("");
                    })

                }
                console.log(url)

            }
        });

    },
    'click .peizhi2': function (e, value, row, index) {

        $("#dianchishu").modal('show');
        selected4EarningsDealerId = row.id
        refreshEarningsConfigs()

    },
    'click .peizhi': function (e, value, row, index) {
        $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-order/v3.1/earningsconfigs?dealerId=" + row.id,
            method: "get",
            contentType: "application/json; charset=utf-8",
            cache: false,
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {
                render(data.list);

                function render(list) {
                    for (var i = 0; i < list.length; i++) {
                        var tr = document.createElement('tr')
                        tr.innerHTML = '<td>' + list[i].specificationName + '</td><td>' + '<input style="width: 70%" type="text" ' +
                            'value=' + list[i].inviterFee + ' id=' + list[i].id + ' /></td><td>' + '<input style="width: 70%" type="text" ' +
                            'id=' + '2' + list[i].id + ' value=' + list[i].userFee + ' /></td>' + '<td style="width: 50px"><button class="btn-small btn-primary" ' +
                            'onclick="Eventyq(this)">修改</button></td>'
                        document.getElementById('tbMaininvite').appendChild(tr)


                    }
                }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("失败");
                console.log(jqXHR);
            }
        });
        $("#invite-wrap").show();
        $("#inviteClose").on("click", function () {
            $("#tbMaininvite  tr").empty("");
            $("#invite-wrap").hide()
        })
    }
};

function refreshEarningsConfigs() {
    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-order/v3.1/earningsconfigs?sort=product_code,asc&dealerId=" + selected4EarningsDealerId,
        method: "get",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        },
        success: function (data) {
            render(data.list);


            function render(list) {
                earningsconfigs = list
                $('#tbMain').empty()
                for (var i = 0; i < list.length; i++) {
                    var data =  list[i]
                    var tr = document.createElement('tr')

                    tr.innerHTML =
                        '<td>' + '<input style="margin-top: -4px" type="checkbox"' + ' id=checkbox:' + i  +'>' + '</td>' +
                        '<td>' + data.productCode + '</td>' +
                        '<td>' + data.productName + '</td>' +
                        '<td>' + (data.specificationName === null ? '' : data.specificationName) + '</td>' +
                        '<td>' + data.days + '</td>' +
                        '<td>' + data.price + '</td>' +
                        '<td>' + data.dealerRate + '</td>' +
                        '<td>' + data.storeRate + '</td>' +
                        '<td>' + data.localDeposit + '</td>' +
                        '<td>' + data.nonlocalDeposit + '</td>' +

                        '<td><span style="color: #0c86e0" class="glyphicon glyphicon-edit" id=' + i + ' onclick="modifyProduct(this.id)"></span></td>'
                    document.getElementById('tbMain').appendChild(tr)
                }
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("失败");
            console.log(jqXHR);
        }
    });
}

function modifyProduct(index) {
    var data = earningsconfigs[index];
    console.log(earningsconfigs[index])
    $("#edit-product").modal('show')
    $('#guigese').attr("disabled",true);
    $('#category').attr("disabled",true);
    $('#products').attr("disabled",true);
    $('#inputName').attr("disabled",true);
    $('#inputDescription').attr("disabled",true);
    getGuiGe(data.specificationCode)
    getCategoryList(data.productCategoryId)
    getProducts(data.productCode)

    $("#inputName").val(data.productName)
    $("#inputDescription").val(data.productDescription)


    $("#inputZQ").val(data.days)
    $("#inputZJ").val(data.price)
    $("#inputFZSY").val(data.dealerRate)
    $("#inputYZSY").val(data.storeRate)
    $("#inputBDYJ").val(data.localDeposit)
    $("#inputYDYJ").val(data.nonlocalDeposit)


    $("#btn-edit-product").unbind('click').on("click", function () {
        var peizhijson = {
            id: data.id,
            days: $("#inputZQ").val(),
            price:  $("#inputZJ").val(),
            dealerRate: $("#inputFZSY").val(),
            storeRate: $("#inputYZSY").val(),
            localDeposit: $("#inputBDYJ").val(),
            nonlocalDeposit: $("#inputYDYJ").val()
        };
        $.ajax({
            url: " http://cjl3.rokyinfo.net:7200/api-order/v3.1/earningsconfigs/" + data.id,
            contentType: "application/json; charset=utf-8",
            method: "put",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                xhr.setRequestHeader("Authorization", sessionStorage.token)
            },
            data: JSON.stringify(peizhijson),
            success: function (res) {
                console.log("成功")
                $("#edit-product").modal('hide')
                refreshEarningsConfigs()
            },
            error: function (err) {
            }
        });
    })

}

Eventyq = function (node) {
    var parents = node.parentNode.parentNode;
    var child = parents.children;
    var input_obj = child[1];
    console.log(input_obj)
    var activ_id = input_obj.innerHTML;
    console.log(activ_id)
    var id = activ_id.substring(activ_id.indexOf('id="') + 4, activ_id.lastIndexOf('"'));
    console.log(id)
    var a = $("#" + id).val();
    var b = $("#2" + id).val();


    var peizhijson = {
        id: id,
        inviterFee: a,
        userFee: b

    };
    $.ajax({
        url: " http://cjl3.rokyinfo.net:7200/api-order/v3.1/earningsconfigs/" + id,
        contentType: "application/json; charset=utf-8",
        method: "put",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },
        data: JSON.stringify(peizhijson),
        success: function (res) {
            console.log("成功")
            $table.bootstrapTable("refresh", {silent: true})
        },
        error: function (err) {
        }
    });
};

function getHeight() {
    var mainNavHeight = Number(sessionStorage.mainNavHeight)
    return $(window).height() - $('.fixed-table-toolbar').outerHeight(true)  - mainNavHeight - 16 - 16;
}

function showMap() {
    $("#pickmap").show();
    $("#sqclose").on("click", function () {
        $("#pickmap").hide()
    })
}

function search() {
    var myAddress = document.getElementById('searchValue').value;

    var myGeo = new BMap.Geocoder();
    myGeo.getPoint(myAddress, function (point) {
        if (point) {

            $("#eatTheWorld  .etb").val(point.lng);
            $("#eatTheWorld  .etc").val(point.lat);

        }
    }, "上海市"); //必须设置城市

}

function search2() {
    var myAddress2 = document.getElementById('searchValue2').value;

    var myGeo2 = new BMap.Geocoder();
    myGeo2.getPoint(myAddress2, function (point) {
        if (point) {

            $("#eatTheWorld2  .tb").val(point.lng);
            $("#eatTheWorld2  .tc").val(point.lat);

        }
    }, "上海市"); //必须设置城市

}

function getCurrentSelectedTabTypes() {

    var province = $(".select-province").val();
    var city = $(".select-city").val();

    var url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?categories=' + currentSelectedCategory + '&showFlag=0&sort=code,asc&limit=100&page=1'
    if (province == "") {
        url = url
    } else {
        url = url + "&province=" + province
    }
    if (city == "") {
        url = url
    } else {
        url = url + "&city=" + city
    }

    $.ajax({
            url: url,
            method: "get",
            contentType: "application/json; charset=utf-8",
            processData: false,
            cache: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {
                let sectionNameCategories = $('#section-name-categories')
                var len = data.list.length;
                let first = sectionNameCategories.children("option:first")
                sectionNameCategories.children("option").remove()
                sectionNameCategories.append(first)
                for (i = 0; i < len; i++) {
                    sectionNameCategories.append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }

        }
    );
}

function onGuiGeSelected() {
    var currentSelectedValue = $("#guigese").val();

    var specifications = null
    if (currentSpecifications !== null) {
        for (var i = 0 ; i < currentSpecifications.length; i++) {
            if (currentSpecifications[i].code === currentSelectedValue) {
                specifications = currentSpecifications[i]
                break
            }
        }
    }
    if (specifications != null) {
        $("#inputName").val(specifications.name)
        $("#inputDescription").val(specifications.description)
    } else {
        $("#inputName").val('')
        $("#inputDescription").val('')
    }

}

function onProductSelected() {
    var products = document.getElementById("products");
    var index = products.selectedIndex;
    var productCode = products.options[index].value;

    var product = null


    if (currentProducts !== null) {
        for (var i = 0 ; i < currentProducts.length; i++) {
            if (currentProducts[i].productCode === productCode) {
                product = currentProducts[i]
                break
            }
        }
    }

    if (product !== null) {
        $("#inputName").val(product.productName)
        $("#inputDescription").val(product.productDescription)
        $("#inputName").attr("disabled","disabled");
        $("#inputDescription").attr("disabled","disabled");

        $("#category").val(product.productCategoryId);
        $("#category").attr("disabled","disabled");

        if (product.specificationCode !== null) {
            $("#guigese").val(product.specificationCode);
            $("#guigese").attr("disabled","disabled");
        }

    } else {
        $("#inputName").val('')
        $("#inputDescription").val('')
        $("#inputName").removeAttr("disabled");
        $("#inputDescription").removeAttr("disabled");

        $("#category").removeAttr("disabled");
        $("#category").val("0");

        $("#guigese").removeAttr("disabled");
        $("#guigese").val("0");

    }

    console.log(product)

}

function getMissiveType() {

    var province = $(".selpr").val();
    var city = $(".selci").val();

    var url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?categories=0&showFlag=0&sort=code,asc&limit=100&page=1"
    if (province == "") {
        url = url
    } else {
        url = url + "&province=" + province
    }
    if (city == "") {
        url = url
    } else {
        url = url + "&city=" + city
    }

    $.ajax({
            url: url,
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
                document.getElementById("sectionName-s").length = 1;
                for (i = 0; i < len; i++) {
                    $("#sectionName-s").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                getMissiveType()
            }

        }
    );
}

function getStation() {

    $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?categories=1&showFlag=0&sort=code,asc&limit=100&page=1",
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

                $('#channel-1').attr("length", '0');
                $('#channel-1').empty();

                for (i = 0; i < len; i++) {

                    $("#channel-1").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                getStation()
            }
        }
    );
}

function getMissiveType1() {

    var province = $(".selpr2").val();
    var city = $(".selci2").val();

    var url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?categories=1&showFlag=0&sort=code,asc&limit=100&page=1"
    if (province == "") {
        url = url
    } else {
        url = url + "&province=" + province
    }
    if (city == "") {
        url = url
    } else {
        url = url + "&city=" + city
    }

    $.ajax({
            url: url,
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

                document.getElementById("sectionName-s2").length = 1;
                for (i = 0; i < len; i++) {

                    $("#sectionName-s2").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                getMissiveType1()
            }
        }
    );
}

function getMissiveType2() {

    var province = $(".selpr3").val();
    var city = $(".selci3").val();

    var url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?categories=1&showFlag=0&sort=code,asc&limit=100&page=1"
    if (province == "") {
        url = url
    } else {
        url = url + "&province=" + province
    }
    if (city == "") {
        url = url
    } else {
        url = url + "&city=" + city
    }

    $.ajax({
            url: url,
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

                document.getElementById("sectionName-s3").length = 1;
                for (i = 0; i < len; i++) {
                    $("#sectionName-s3").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                getMissiveType2()
            }
        }
    );
}

function move() {
    var s1 = document.getElementById("s1");
    var s2 = document.getElementById("s2");
    <!-- 获取一级和二级的属性-->
    var add;
    if (s1.value == "SC") {
        add = new Array("美团", "饿了么", "集团");
        <!--比对value值，实现对应二级text值的动态生成-->
    } else if (s1.value == "BJ") {
        add = new Array("合作维修网点");
        <!--比对value值，实现对应二级text值的动态生成-->
    } else if (s1.value == "SB") {
        add = new Array("电池仓库");
        <!--比对value值，实现对应二级text值的动态生成-->
    } else if (s1.value == "ZY") {
        add = new Array("直营租赁网点");
        <!--比对value值，实现对应二级text值的动态生成-->
    }
    else if (s1.value == "CS") {
        add = new Array("研发测试");
        <!--比对value值，实现对应二级text值的动态生成-->
    }
    else {
        add = null;
        <!--若没有就为空，当然不可能出现的-->
    }

    s2.length = 0;
    for (var i = 0; i < add.length; i++) {
        var ss = new Option();
        ss.text = add[i].split()[0];

        s2.add(ss);
        <!--把text值添加到二级select中，显示出来-->
    }

}

function confirmSelect() {
    var selectLocation = {};
    var gpsAddr = document.getElementById('cklon');
    var location = $("#pointInput").val();
    str = location;
    arr = str.split(",");
    $("#mdlon").val(arr[0]);
    $("#mdlat").val(arr[1]);
    $("#emdlon").val(arr[0]);
    $("#emdlat").val(arr[1]);
    $("#pickmap").hide();
}

var currentSpecifications = null

function getGuiGe(selectedName) {
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
                currentSpecifications = data.list
                var len = data.list.length;
                document.getElementById("guigese").length = 1;
                for (i = 0; i < len; i++) {
                    if (selectedName === data.list[i].code) {
                        $("#guigese").append($('<option selected="selected" value=' + data.list[i].code + '>' + data.list[i].name + '</option>'));
                    } else {
                        $("#guigese").append($('<option value=' + data.list[i].code + '>' + data.list[i].name + '</option>'));
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        }
    );
}

function getCategoryList(selectedName) {
    $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-order/v3.1/product-categories?categoryLevel=2",
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
                document.getElementById("category").length = 1;
                for (i = 0; i < len; i++) {
                    if (selectedName === data.list[i].id) {
                        $("#category").append($('<option selected="selected" value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
                    } else {
                        $("#category").append($('<option value=' + data.list[i].id + '>' + data.list[i].name + '</option>'));
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        }
    );
}

var currentProducts = null

function getProducts(selectedName) {
    $.ajax({
            url: "http://cjl3.rokyinfo.net:7200/api-order/v3.1/earningsconfigs/products?dealerId=" + selected4EarningsDealerId,
            method: "get",
            contentType: "application/json; charset=utf-8",
            processData: false,
            cache: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                xhr.setRequestHeader("Authorization", sessionStorage.token);
            },
            success: function (data) {
                currentProducts = data
                var len = data.length;
                document.getElementById("products").length = 1;
                for (i = 0; i < len; i++) {
                    if (selectedName === data[i].productCode) {
                        $("#products").append($('<option selected="selected" value=' + data[i].productCode + '>' + data[i].productName + ' (' + data[i].productCode + ')</option>'));
                    } else {
                        $("#products").append($('<option value=' + data[i].productCode + '>' + data[i].productName + ' (' +data[i].productCode + ')</option>'));
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        }
    );
}

$("#btn-delete").on('click', function () {
    $("#my-del-modal").modal('show')
})
$("#btn-delete-1").on('click', function () {
    $("#my-del-modal").modal('show')
})
$("#btn-delete-2").on('click', function () {
    $("#my-del-modal").modal('show')
})
$("#btn-delete-3").on('click', function () {
    $("#my-del-modal").modal('show')
})

$("#btn-del-store").on('click', function () {
    $('input:checkbox:checked').each(function (index, item) {
        console.log(item.id)
        if (item.id.indexOf('storeId:') != -1) {

            var storeId = item.id.substring('storeId:'.length)
            if (storeId.length > 0) {
                $.ajax({
                    url: 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/' + storeId + '/update-show-flag?showFlag=1',
                    contentType: "application/json; charset=utf-8",
                    method: "put",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                        xhr.setRequestHeader("Authorization", sessionStorage.token)
                    },
                    success: function (res) {
                        $table.bootstrapTable("refresh", {silent: true});
                    },
                    error: function (err) {
                    }
                });
            }
        }
    });
}) // 逻辑删除站点

// 新增仓库
$("#btn-addstation").on("click", function () {
    $("#addstorehouse").modal('show');
    $("#clstorehouse").on("click", function () {
        $("#addstorehouse").modal('hide');
        $("input").val("");
    })
});
// 新增分站
$("#btn-addstation2").on("click", function () {
    $("#adddealer").modal('show');
    $("#cldealer").on("click", function () {
        $("#adddealer").modal('hide')
        $("input").val("");
    })
});
// 新增驿站
$("#btn-addstation3").on("click", function () {
    getMissiveType1()
    $("#addstore").css("display", "block");
    $("#clstore").on("click", function () {
        $("#addstore").hide();
        $("input").val("");
    })
});
// 新增售后站点、丢失站点、试用站点、测试站点
$("#btn-add-station").on("click", function () {
    $('#alert-view-add').modal('show')
    $("#btn-cancel-add").on("click", function () {
        $('#alert-view-add').modal('hide')
        $("input").val("");
    })
});

$("#add5").on("click", function () {

    var a = $("#addstore  .mdname").val();
    var b = $("#addstore  .mdtype").val();
    var c = $("#addstore  .mdlinkman").val();
    var d = $("#addstore  .mdcontact").val();
    var e = $("#addstore  .mdsheng").val();
    var f = $("#addstore  .mdshi").val();
    var g = $("#addstore  .mdqu").val();
    var h = $("#addstore  .mdpassword").val();
    var i = $("#addstore  .mddealer").val();
    var j = $("#addstore  .mdlon").val();
    var k = $("#addstore  .mdlat").val();
    var l = $("#addstore  .mdaddress").val();
    if (b == "直营") {
        b = 40
    } else if (b == "代理") {
        b = 70
    } else if (b == "集团") {
        b = 80
    }

    var myselect = document.getElementById("channel-1");
    var index = myselect.selectedIndex;
    var parentId = myselect.options[index].value;

    var form = new FormData();
    form.append("category", "2");
    form.append("name", a);
    form.append("province", e);
    form.append("city", f);
    form.append("county", g);
    form.append("contact", d);
    form.append("linkman", c);
    form.append("defaultPsw", h);
    form.append("type", b);
    form.append("address", l);
    form.append("lon", j);
    form.append("lat", k);
    form.append("parentId", parentId);
    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/",
        method: "post",
        data: form,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },

        success: function (res) {
            console.log("成功");
            alert("新增网点成功");
            $table.bootstrapTable("refresh", {silent: true});
            $("#addstorehouse").hide();
            $("input").val("");
        },
        error: function (err) {
            if (err.status == 403) alert("您没有权限执行此操作");
            if (err.status == 500) alert("内部服务器错误");
            console.log(err)
        }
    });
});//新增驿站
$("#add4").on("click", function () {

    var a = $("#adddealer  .jxname").val();
    var b = $("#adddealer  .jxtype").val();
    var c = $("#adddealer  .jxlinkman").val();
    var d = $("#adddealer  .jxcontact").val();
    var e = $("#adddealer  .jxsheng").val();
    var f = $("#adddealer  .jxshi").val();
    var h = $("#adddealer  .jxpassword").val();
    if (b == "直营") {
        b = 40
    } else if (b == "代理") {
        b = 70
    } else if (b == "集团") {
        b = 80
    }


    var form = new FormData();
    form.append("category", "1");
    form.append("name", a);
    form.append("province", e);
    form.append("city", f);
    form.append("contact", d);
    form.append("linkman", c);
    form.append("defaultPsw", h);
    form.append("type", b);
    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/",
        method: "post",
        data: form,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },

        success: function (res) {
            console.log("成功");
            alert("新增网点成功");
            $table.bootstrapTable("refresh", {silent: true});
            $("#adddealer").hide();
            $("input").val("");
        },
        error: function (err) {
            if (err.status == 403) alert("您没有权限执行此操作");
            if (err.status == 500) alert("内部服务器错误");
            console.log(err)
        }
    });
});//新增分站
$("#add3").on("click", function () {

    var a = $("#addstorehouse  .ckname").val();
    var b = $("#addstorehouse  .ckpassword").val();
    var c = $("#addstorehouse  .cklinkman").val();
    var d = $("#addstorehouse  .ckcontact").val();
    var e = $("#addstorehouse  .cksheng").val();
    var f = $("#addstorehouse  .ckshi").val();


    var form = new FormData();
    form.append("category", "0");
    form.append("type", "40");
    form.append("name", a);
    form.append("province", e);
    form.append("city", f);
    form.append("contact", d);
    form.append("linkman", c);
    form.append("defaultPsw", b);
    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/",
        method: "post",
        data: form,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },

        success: function (res) {
            console.log("成功");
            alert("新增网点成功");
            $table.bootstrapTable("refresh", {silent: true});
            $("#addstore").hide();
            $("input").val("");
        },
        error: function (err) {
            if (err.status == 403) alert("您没有权限执行此操作");
            if (err.status == 500) alert("内部服务器错误");
            console.log(err)
        }
    });
});//新增仓库
$("#btn-affirm-add").on("click", function () {

    var a = $("#alert-view-add  .add-name").val();
    var b = $("#alert-view-add  .add-password").val();
    var c = $("#alert-view-add  .add-linkman").val();
    var d = $("#alert-view-add  .add-contact").val();
    var e = $("#alert-view-add  .add-province").val();
    var f = $("#alert-view-add  .add-city").val();


    var form = new FormData();
    form.append("category", currentSelectedCategory);
    form.append("type", "40");
    form.append("name", a);
    form.append("province", e);
    form.append("city", f);
    form.append("contact", d);
    form.append("linkman", c);
    form.append("defaultPsw", b);
    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/",
        method: "post",
        data: form,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },

        success: function (res) {
            console.log("成功");
            alert("新增网点成功");
            $table.bootstrapTable("refresh", {silent: true});
            $('#alert-view-add').modal('hide')
            $("input").val("");
        },
        error: function (err) {
            if (err.status == 403) alert("您没有权限执行此操作");
            if (err.status == 500) alert("内部服务器错误");
            console.log(err)
        }
    });
});//新增售后

$("#edit3").on("click", function (value, row, index) {
    var a = $("#editstorehouse  .eckname").val();
    var c = $("#editstorehouse  .ecklinkman").val();
    var d = $("#editstorehouse  .eckcontact").val();
    var e = $("#editstorehouse  .ecksheng").val();
    var f = $("#editstorehouse  .eckshi").val();
    var i = sessionStorage.id;


    var form = new FormData();
    form.append("name", a);
    form.append("province", e);
    form.append("city", f);
    form.append("contact", d);
    form.append("linkman", c);
    form.append("id", i);

    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/update",
        method: "post",
        data: form,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },

        success: function (res) {
            eruval = $(".eru").val();
            console.log("成功" + res);
            alert("信息修改成功");
            $("#editstorehouse").modal('hide')
            $("input").val("");
            $table.bootstrapTable("refresh", {silent: true});
        },
        error: function (err) {
            if (err.status == 403) alert("您没有权限执行此操作");
            if (err.status == 500) alert("内部服务器错误");
            console.log(err)
        }
    });

});//编辑仓库
$("#edit4").on("click", function (value, row, index) {
    var a = $("#editdealer  .ejxname").val();
    var b = $("#editdealer  .ejxtype").val();
    var c = $("#editdealer  .ejxlinkman").val();
    var d = $("#editdealer  .ejxcontact").val();
    var e = $("#editdealer  .ejxsheng").val();
    var f = $("#editdealer  .ejxshi").val();

    var i = sessionStorage.id;
    if (b == "直营") {
        b = 40
    } else if (b == "代理") {
        b = 70
    } else if (b == "集团") {
        b = 80
    }


    var form = new FormData();
    form.append("name", a);
    form.append("province", e);
    form.append("city", f);
    form.append("contact", d);
    form.append("linkman", c);
    form.append("type", b);
    form.append("id", i);

    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/update",
        method: "post",
        data: form,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },

        success: function (res) {
            eruval = $(".eru").val();
            console.log("成功" + res);
            alert("信息修改成功");
            $("#editdealer").modal('hide');
            $("input").val("");
            $table.bootstrapTable("refresh", {silent: true});
        },
        error: function (err) {
            if (err.status == 403) alert("您没有权限执行此操作");
            if (err.status == 500) alert("内部服务器错误");
            console.log(err)
        }
    });

});//编辑分站
$("#edit5").on("click", function (value, row, index) {
    var a = $("#editstore  .emdname").val();
    var b = $("#editstore  .emdtype").val();
    var c = $("#editstore  .emdlinkman").val();
    var d = $("#editstore  .emdcontact").val();
    var e = $("#editstore  .emdsheng").val();
    var f = $("#editstore  .emdshi").val();
    var g = $("#editstore  .emdqu").val();
    var j = $("#editstore  .emdlon").val();
    var k = $("#editstore  .emdlat").val();
    var l = $("#editstore  .emdaddress").val();
    var i = sessionStorage.id;
    if (b == "直营") {
        b = 40
    } else if (b == "代理") {
        b = 70
    } else if (b == "集团") {
        b = 80
    }

    console.log("--------" + a)


    var form = new FormData();
    form.append("name", a);
    form.append("province", e);
    form.append("city", f);
    form.append("county", g);
    form.append("contact", d);
    form.append("linkman", c);

    form.append("address", l);
    form.append("lon", j);
    form.append("lat", k);
    form.append("id", i);

    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/update",
        method: "post",
        data: form,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },

        success: function (res) {
            eruval = $(".eru").val();
            console.log("成功" + res);
            alert("信息修改成功");
            $("#editstore").hide()
            $("input").val("");
            $table.bootstrapTable("refresh", {silent: true});
        },
        error: function (err) {
            if (err.status == 403) alert("您没有权限执行此操作");
            if (err.status == 500) alert("内部服务器错误");
            console.log(err)
        }
    });

});//编辑驿站
$("#btn-edit-affirm-after-sale").on("click", function (value, row, index) {
    let name = $("#alert-view-edit  .edit-name").val();
    let linkman = $("#alert-view-edit  .edit-linkman").val();
    let contact = $("#alert-view-edit  .edit-contact").val();
    let province = $("#alert-view-edit  .edit-province").val();
    let city = $("#alert-view-edit  .edit-city").val();
    let i = sessionStorage.id;


    var form = new FormData();
    form.append("name", name);
    form.append("province", province);
    form.append("city", city);
    form.append("contact", contact);
    form.append("linkman", linkman);
    form.append("id", i);

    $.ajax({
        url: "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores/update",
        method: "post",
        data: form,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token)
        },

        success: function (res) {
            eruval = $(".eru").val();
            console.log("成功" + res);
            alert("信息修改成功");
            $("#alert-view-edit").modal('hide')
            $("input").val("");
            $table.bootstrapTable("refresh", {silent: true});
        },
        error: function (err) {
            if (err.status == 403) alert("您没有权限执行此操作");
            if (err.status == 500) alert("内部服务器错误");
            console.log(err)
        }
    });

});//编辑售后

$(".searchDQ").on("click", function () {
    var url;
    var a = $(".selpr").val();
    console.log(a);
    var b = $(".selci").val();
    var c = $(".selco").val();

    var myselect = document.getElementById("sectionName-s");
    var index = myselect.selectedIndex;
    idstore1 = myselect.options[index].value;
    console.log(idstore1);
    url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=0&showFlag=0&sort=code,asc&limit=100&page=1";
    if (a == "") {
        if (idstore1 == "0") {
            url = url
        } else {
            url = url + "&id=" + idstore1
        }

    } else {
        if (b == "") {
            if (idstore1 == "0") {
                url = url + "&province=" + a
            } else {
                url = url + "&province=" + a + "&id=" + idstore1
            }
        } else {
            if (c == "") {
                if (idstore1 == "0") {
                    url = url = url + "&province=" + a + "&city=" + b
                } else {
                    url = url = url + "&province=" + a + "&city=" + b + "&id=" + idstore1
                }
            } else {
                if (idstore1 == "0") {
                    url = url = url + "&province=" + a + "&city=" + b + "&county=" + c
                } else {
                    url = url = url + "&province=" + a + "&city=" + b + "&county=" + c + "&id=" + idstore1
                }
            }
        }
    }
    console.log(url)

    $.ajax({
        url: url,
        method: "get",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        },
        success: function (data) {
            console.log("liebiao1");
            $("#table").bootstrapTable('refresh', {'url': url});

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("失败");
            console.log(jqXHR);
        }
    });

});//仓库
$(".searchDQ2").on("click", function () {
    var url;
    var a = $(".selpr2").val();
    console.log(a);
    var b = $(".selci2").val();
    var c = $(".selco2").val();

    var myselect = document.getElementById("sectionName-s2");
    var index = myselect.selectedIndex;
    idstore1 = myselect.options[index].value;
    console.log(idstore1);
    url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=1&showFlag=0&sort=code,asc&limit=100&page=1";
    if (a == "") {
        if (idstore1 == "0") {
            url = url
        } else {
            url = url + "&id=" + idstore1
        }

    } else {
        if (b == "") {
            if (idstore1 == "0") {
                url = url + "&province=" + a
            } else {
                url = url + "&province=" + a + "&id=" + idstore1
            }
        } else {
            if (c == "") {
                if (idstore1 == "0") {
                    url = url = url + "&province=" + a + "&city=" + b
                } else {
                    url = url = url + "&province=" + a + "&city=" + b + "&id=" + idstore1
                }
            } else {
                if (idstore1 == "0") {
                    url = url = url + "&province=" + a + "&city=" + b + "&county=" + c
                } else {
                    url = url = url + "&province=" + a + "&city=" + b + "&county=" + c + "&id=" + idstore1
                }
            }
        }
    }
    console.log(url)

    $.ajax({
        url: url,
        method: "get",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        },
        success: function (data) {
            console.log("liebiao2");
            $("#table").bootstrapTable('refresh', {'url': url});

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("失败");
            console.log(jqXHR);
        }
    });

});//分站
$(".searchDQ3").on("click", function () {
    var url;
    var a = $(".selpr3").val();
    console.log(a);
    var b = $(".selci3").val();
    var c = $(".selco3").val();

    var myselect = document.getElementById("sectionName-s3");
    var index = myselect.selectedIndex;
    idstore1 = myselect.options[index].value;
    console.log(idstore1);

    url = "http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=2&showFlag=0&sort=code,asc&limit=100&page=1";
    if (a == "") {
        if (idstore1 == "0") {
            url = url
        } else {
            url = url + "&parentId=" + idstore1
        }

    } else {
        if (b == "") {
            if (idstore1 == "0") {
                url = url + "&province=" + a
            } else {
                url = url + "&province=" + a + "&parentId=" + idstore1
            }
        } else {
            if (c == "") {
                if (idstore1 == "0") {
                    url = url = url + "&province=" + a + "&city=" + b
                } else {
                    url = url = url + "&province=" + a + "&city=" + b + "&parentId=" + idstore1
                }
            } else {
                if (idstore1 == "0") {
                    url = url = url + "&province=" + a + "&city=" + b + "&county=" + c
                } else {
                    url = url = url + "&province=" + a + "&city=" + b + "&county=" + c + "&parentId=" + idstore1
                }
            }
        }
    }
    console.log(url);
    $.ajax({
        url: url,
        method: "get",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        },
        success: function (data) {

            $("#table").bootstrapTable('refresh', {'url': url});

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("失败");
            console.log(jqXHR);
        }
    });

});//驿站
$(".btn-filter-search").on("click", function () {

    let url;
    let province = $(".select-province").val();
    let city = $(".select-city").val();
    let district = '';

    let myselect = document.getElementById("section-name-categories");
    let index = myselect.selectedIndex;
    let storeId = myselect.options[index].value;
    console.log( '省：' + province + '市：' + city + '站点：' + storeId);

    url = 'http://cjl3.rokyinfo.net:7200/api-user/v3.1/ebikestores?category=' + currentSelectedCategory + '&showFlag=0&sort=code,asc&limit=100&page=1';
    if (province == "") {
        if (storeId == "0") {
            url = url
        } else {
            url = url + "&id=" + storeId
        }

    } else {
        if (city == "") {
            if (storeId == "0") {
                url = url + "&province=" + province
            } else {
                url = url + "&province=" + province + "&id=" + storeId
            }
        } else {
            if (district == "") {
                if (storeId == "0") {
                    url = url = url + "&province=" + province + "&city=" + city
                } else {
                    url = url = url + "&province=" + province + "&city=" + city + "&id=" + storeId
                }
            } else {
                if (storeId == "0") {
                    url = url = url + "&province=" + province + "&city=" + city + "&county=" + district
                } else {
                    url = url = url + "&province=" + province + "&city=" + city + "&county=" + district + "&id=" + storeId
                }
            }
        }
    }
    console.log(url)

    $.ajax({
        url: url,
        method: "get",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("firm", sessionStorage.firmFlag);
            xhr.setRequestHeader("Authorization", sessionStorage.token);
        },
        success: function (data) {
            console.log("liebiao1");
            $("#table").bootstrapTable('refresh', {'url': url});

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("失败");
            console.log(jqXHR);
        }
    });

});//售后

$("#btn-del-product").on("click", function () {

    $('input:checkbox:checked').each(function (index, item) {
        console.log(item.id)
        var configIndex = item.id.substring('checkbox:'.length)
        if (configIndex.length > 0){
            var config = earningsconfigs[configIndex]
            if (config) {
                console.log(config)
                $.ajax({
                    url: 'http://cjl3.rokyinfo.net:7200/api-order/v3.1/earningsconfigs/' + config.id,
                    contentType: "application/json; charset=utf-8",
                    method: "delete",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                        xhr.setRequestHeader("Authorization", sessionStorage.token)
                    },
                    success: function (res) {
                        console.log("成功")
                        $("#edit-product").modal('hide')
                        refreshEarningsConfigs()
                    },
                    error: function (err) {
                    }
                });
            }
        }
    });
})//删除产品
$("#btn-add-product").on("click", function () {
    $("#edit-product").modal('show')
    $('#guigese').attr("disabled",false);
    $('#category').attr("disabled",false);
    $('#products').attr("disabled",false);
    $('#inputName').attr("disabled",false);
    $('#inputDescription').attr("disabled",false);

    $("#inputName").val('')
    $("#inputDescription").val('')

    $("#inputZQ").val('')
    $("#inputZJ").val('')
    $("#inputFZSY").val('')
    $("#inputYZSY").val('')
    $("#inputBDYJ").val('')
    $("#inputYDYJ").val('')

    getGuiGe('')
    getCategoryList('')
    getProducts('')

    $("#btn-edit-product").unbind('click').on("click", function () {

        var category = document.getElementById("category");
        var categoryIndex = category.selectedIndex;
        var productCategoryId = category.options[categoryIndex].value;
        if (productCategoryId == "0") {
            alert('请选择产品分类')
            return
        }

        if (selected4EarningsDealerId == 0) {
            alert('分站ID不存在')
            return
        }

        if ($("#inputName").val().length == 0) {
            alert('请输入产品名称')
            return
        }

        if ($("#inputDescription").val().length == 0) {
            alert('请输入产品描述')
            return
        }

        if ($("#inputZQ").val().length == 0) {
            alert('请输入产品租期')
            return
        }

        if ($("#inputZJ").val().length == 0) {
            alert('请输入产品租金')
            return
        }

        if ($("#inputFZSY").val().length == 0) {
            alert('请输入分站收益')
            return
        }

        if ($("#inputYZSY").val().length == 0) {
            alert('请输入驿站收益')
            return
        }

        if ($("#inputBDYJ").val().length == 0) {
            alert('请输入本地押金')
            return
        }

        if ($("#inputYDYJ").val().length == 0) {
            alert('请输入异地押金')
            return
        }

        var myselect2 = document.getElementById("guigese");
        var index2 = myselect2.selectedIndex;
        var idpro = myselect2.options[index2].value;

        if (idpro == "0") {
            idpro = null
        }

        var products = document.getElementById("products");
        var productsIndex = products.selectedIndex;
        var productCode = products.options[productsIndex].value;
        if (productCode == "0") {
            productCode = null
        }

        var peizhijson = {
            dealerId: selected4EarningsDealerId,
            specificationCode: idpro,
            productCategoryId: productCategoryId,
            productCode: productCode,
            productName: $("#inputName").val(),
            productDescription: $("#inputDescription").val(),
            days: $("#inputZQ").val(),
            price:  $("#inputZJ").val(),
            dealerRate: $("#inputFZSY").val(),
            storeRate: $("#inputYZSY").val(),
            localDeposit: $("#inputBDYJ").val(),
            nonlocalDeposit: $("#inputYDYJ").val()
        };
        $.ajax({
            url: " http://cjl3.rokyinfo.net:7200/api-order/v3.1/earningsconfigs/",
            contentType: "application/json; charset=utf-8",
            method: "post",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("firm", sessionStorage.firmFlag);
                xhr.setRequestHeader("Authorization", sessionStorage.token)
            },
            data: JSON.stringify(peizhijson),
            success: function (res) {
                console.log("成功")
                $("#edit-product").modal('hide')
                refreshEarningsConfigs()
            },
            error: function (err) {
            }
        });
    })
})//新增产品

initTable();

$(function () {

    resizeLayout()

    $table.bootstrapTable("hideColumn", "a");
    $table.bootstrapTable("hideColumn", "d");
    $table.bootstrapTable("hideColumn", "e");
    $table.bootstrapTable("hideColumn", "address");
    $table.bootstrapTable("hideColumn", "lon");
    $table.bootstrapTable("hideColumn", "lat");
    $table.bootstrapTable("hideColumn", "dealer");
    $table.bootstrapTable("hideColumn", "county");

    getMissiveType1();

    getStation()
    $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });
    $('#datetimepicker2').datetimepicker({
        format: 'YYYY-MM-DD HH:mm:ss'
    });
});

loadBody();

function resizeLayout() {

    var mainNavHeight = Number(sessionStorage.mainNavHeight)

    $(".ui-content").css('padding-top', (mainNavHeight + 16) + 'px');

}

$(window).resize(function () {
    resizeLayout()
    $table.bootstrapTable('resetView', {
        height: getHeight()
    });
})