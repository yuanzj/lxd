/**
 *
 * @file 主入口JS文件
 *
 */

/**
 * api 请求地址
 *
 * @const
 * @type {string}
 */
var API_BASE_URL = 'http://cjl3.rokyinfo.net:7200';

/**
 * 省、市、区插件自动选中
 */
$(function () {

    var $distpicker = $('#distpicker');

    $distpicker.distpicker({
        province: '福建省',
        city: '厦门市',
        district: '思明区'
    });

    $('#reset').click(function () {
        $distpicker.distpicker('reset');
    });

    $('#reset-deep').click(function () {
        $distpicker.distpicker('reset', true);
    });

    $('#destroy').click(function () {
        $distpicker.distpicker('destroy');
    });

    $('#distpicker1').distpicker();

    $('#distpicker2').distpicker({
        province: '---- 所在省 ----',
        city: '---- 所在市 ----',
        district: '---- 所在区 ----'
    });

    $('#distpicker4').distpicker(
    );

    $('#distpicker5').distpicker({
        autoSelect: false
    });

});
