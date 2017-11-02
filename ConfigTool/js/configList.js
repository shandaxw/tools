/**
 * 文件名：configTool.js
 * 描述：页面内容配置工具
 * 修改人：许文
 * 修改时间：2017-07-19 10:32
 * 修改内容：新建
 **/
$(function () {
    configList.init();
});
var configList = {
    configParam: {
        REGX_HTML_ENCODE: /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
        configListUrl: "/configTool/configList",
        deleteUrl: "/configTool/delete/"
    },
    /*
     * 〈一句话功能简述〉初始化
     * 〈功能详细描述〉执行动态元素加载，事件绑定等
     */
    init: function () {
        $("#saveBtn").click(configList.toSaveView);
        $("#updateBtn").click(configList.toUpdateView);
        $("#searchBtn").click(configList.filterData);
        $("#deleteBtn").click(configList.delete);
        configList.initTable();
    },
    /*
     * 〈一句话功能简述〉初始化表格内容
     * 〈功能详细描述〉
     */
    initTable: function () {
        $("#configTable").datagrid({
            url: baseUrl + configList.configParam.configListUrl,
            method: 'GET',
            rownumbers: true,
            singleSelect: true,
            fit: true,
            fitColumns: true,
            pagination: true,
            pageSize: 10,
            columns: [[
                {field: 'ck', checkbox: true},
                {field: 'id', title: 'ID', align: "center", hidden: true},
                {field: 'apiName', title: '接口名称', align: "center", width: "300px"},
                {field: 'apiNo', title: '接口编号', align: "center", width: "300px"},
                {field: 'jsonData', title: 'json数据', formatter: configList.encodeHtml}
            ]]
        });
    },
    /*
     * 〈一句话功能简述〉条件查询
     * 〈功能详细描述〉
     */
    filterData: function () {
        var params = {
            apiName: $("#apiName").val(),
            apiNo: $("#apiNo").val()
        };
        $('#configTable').datagrid('load', params);
    },
    /*
     * 〈一句话功能简述〉跳到新增页面
     * 〈功能详细描述〉
     */
    toSaveView: function () {
        window.location = "../html/configTool.html";
    },
    /*
     * 〈一句话功能简述〉跳到修改页面
     * 〈功能详细描述〉
     */
    toUpdateView: function () {
        var $configTable = $("#configTable");
        var row = $configTable.datagrid('getSelected');
        if (row) {
            window.location = "../html/configTool.html?apiNo="+row.apiNo;
        } else {
            $.messager.alert('警告', '你没有选中要删除的数据', 'warning');
        }
    },
    /*
     * 〈一句话功能简述〉是html标签原样显示
     * 〈功能详细描述〉
     */
    encodeHtml: function (value) {
        return (typeof value != "string") ? value :
            value.replace(configList.configParam.REGX_HTML_ENCODE,
                function ($0) {
                    var c = $0.charCodeAt(0), r = ["&#"];
                    c = (c == 0x20) ? 0xA0 : c;
                    r.push(c);
                    r.push(";");
                    return r.join("");
                });
    },
    /*
     * 〈一句话功能简述〉删除选中配置
     * 〈功能详细描述〉
     */
    delete: function () {
        var $configTable = $("#configTable");
        var row = $configTable.datagrid('getSelected');
        if (row) {
            $.messager.confirm('删除', '确定删除？', function (r) {
                if (r) {
                    $.ajax({
                        type: "DELETE",
                        url: baseUrl + configList.configParam.deleteUrl+row.id,
                        dataType: "json",
                        success: function (data) {
                            if (data.code == 0) {
                                $.messager.alert('提示', '删除成功');
                                $configTable.datagrid('reload');
                            } else {
                                $.messager.alert('提示', data.message, 'error');
                            }
                        }
                    });
                }
            });
        } else {
            $.messager.alert('警告', '你没有选中要删除的数据', 'warning');
        }
    }
};