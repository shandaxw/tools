/**
 * 文件名：configTool.js
 * 描述：页面内容配置工具
 * 修改人：许文
 * 修改时间：2017-07-19 10:32
 * 修改内容：新建
 **/
$(function () {
    configTool.init();
});
var configTool = {
    configParam: {
        fileSign: "[#file]",
        htmlSign: "[#html]",
        fileReg: /\[#file_(\d*)\]/,
        htmlReg: /\[#html_(\d*)\]/,
        opType: 0,          //0新增，1更新
        isNumExistUrl: "/configTool/isNumExist",
        saveUrl: "/configTool/save",
        updateUrl: "/configTool/update",
        infoUrl: "/configTool/config/"
    },
    /*
     * 〈一句话功能简述〉初始化
     * 〈功能详细描述〉执行动态元素加载，事件绑定等
     */
    init: function () {
        $("#saveBtn").click(configTool.save);
        $("#cancelBtn").click(configTool.toListView);
        var $jsonStringa = $("#jsonString");
        $("input", $jsonStringa.next("span")).blur(configTool.jsonParse);
        $("input", $jsonStringa.next("span")).keydown(function (event) {
            if ((event.keyCode || event.which) == 13) {
                configTool.jsonParse();
            }
        });
        configTool.addOrUpdate();
    },
    /*
     * 〈一句话功能简述〉解析json
     * 〈功能详细描述〉
     */
    jsonParse: function () {
        if (!$("#stringDiv").form('validate')) {
            return;
        }
        var json = $("#jsonString").val().replace(/\s/g, "");
        var jsonHtml = configTool.jsonFormat(configTool.jsonCompile(json));
        var $jsonView = $("#jsonView");
        $jsonView.html(jsonHtml);
        $.parser.parse($jsonView);
    },
    /*
     * 〈一句话功能简述〉json格式化
     * 〈功能详细描述〉
     */
    jsonFormat: function (json) {
        var indent = "&nbsp;&nbsp;&nbsp;&nbsp;";
        var smallIndent = "&nbsp;";
        var jsonFormat = "";
        //k:缩进，j:""个数
        for (var i = 0, j = 0, k = 0, ii, ele; i < json.length; i++) {
            ele = json.charAt(i);
            if (j % 2 == 0 && (ele == "}" || ele == "]")) {
                k--;
                for (ii = 0; ii < k; ii++) ele = indent + ele;
                ele = "<br/>" + ele;
            } else if (j % 2 == 0 && (ele == "{" || ele == "[")) {
                ele += "<br/>";
                k++;
                for (ii = 0; ii < k; ii++) ele += indent;
            } else if (j % 2 == 0 && ele == ",") {
                ele += "<br/>";
                for (ii = 0; ii < k; ii++) ele += indent;
            } else if (j % 2 == 0 && ele == ":") {
                ele += smallIndent;
            } else if (ele == "\"") j++;
            jsonFormat += ele;
        }
        var index;
        while (jsonFormat.match(configTool.configParam.fileReg) != null) {
            index = jsonFormat.match(configTool.configParam.fileReg)[1];
            jsonFormat = jsonFormat.replace(configTool.configParam.fileReg, '<input name="file_' + index + '" class="easyui-filebox tbox" data-options="required:true">');
        }
        while (jsonFormat.match(configTool.configParam.htmlReg) != null) {
            index = jsonFormat.match(configTool.configParam.htmlReg)[1];
            jsonFormat = jsonFormat.replace(configTool.configParam.htmlReg, '<input name="html_' + index + '" class="easyui-textbox tbox" data-options="required:true">');
        }
        return jsonFormat;
    },
    /*
     * 〈一句话功能简述〉保存
     * 〈功能详细描述〉
     */
    save: function () {
        var $infoForm = $("#infoForm");
        if (!$infoForm.form('validate')) {
            $.messager.alert('提示', '数据未填完整,不能保存！');
            return;
        }
        var jsonString = $("#jsonString").val().replace(/\s/g, "");
        var jsonData = configTool.jsonCompile(jsonString);
        var url = "";
        if (configTool.configParam.opType == 0) {
            url = baseUrl + configTool.configParam.saveUrl;
        } else if (configTool.configParam.opType == 1) {
            url = baseUrl + configTool.configParam.updateUrl;
        }
        $.messager.progress({
            title: '提示',
            msg: '数据保存中，请稍候……',
            text: ''
        });
        $infoForm.form("submit", {
            url: url,
            onSubmit: function (param) {
                param.jsonData = jsonData;
            },
            success: function (data) {
                $.messager.progress('close');
                data = JSON.parse(data);
                if (data.code == 1000000) {
                    configTool.toListView();
                } else {
                    $.messager.alert('提示', data.message, 'error');
                }
            },
            error: function () {
                $.messager.progress('close');
            }
        });
    },
    /*
     * 〈一句话功能简述〉重新编译Json
     * 〈功能详细描述〉添加file和html的序号
     */
    jsonCompile: function (json) {
        var fileIndex = 0;
        var htmlIndex = 0;
        while (json.indexOf(configTool.configParam.fileSign) > -1) {
            json = json.replace(configTool.configParam.fileSign, "[#file_" + fileIndex + "]");
            fileIndex++;
        }
        while (json.indexOf(configTool.configParam.htmlSign) > -1) {
            json = json.replace(configTool.configParam.htmlSign, "[#html_" + htmlIndex + "]");
            htmlIndex++;
        }
        return json;
    },
    /*
     * 〈一句话功能简述〉跳到列表页面
     * 〈功能详细描述〉
     */
    toListView: function () {
        window.location = "../../pages/configTool/configList.html";
    },
    /*
     * 〈一句话功能简述〉判断是新增还是修改
     * 〈功能详细描述〉
     */
    addOrUpdate: function () {
        var apiNo = document.URL.split('?')[1].split("=")[1];
        if (apiNo != undefined) {
            configTool.configParam.opType = 1;
            var $apiNoValid=$("#apiNoValid");
            $apiNoValid.html('<input type="text" class="easyui-textbox tbox2" name="apiNo" id="apiNo" data-options="required:true">');
            $.parser.parse($apiNoValid);
            $("#apiNo").textbox('textbox').attr('readonly', true);
            configTool.loadData(apiNo);
        }
    },
    /*
     * 〈一句话功能简述〉加载数据
     * 〈功能详细描述〉
     */
    loadData: function (apiNo) {
        $.ajax({
            type: "POST",
            url: baseUrl + configTool.configParam.infoUrl + apiNo,
            dataType: "json",
            beforeSend: function () {
                $.messager.progress({
                    title: '提示',
                    msg: '数据加载中，请稍候……',
                    text: ''
                });
            },
            complete: function () {
                $.messager.progress('close');
            },
            success: function (data) {
                if (data.code == 1000000) {
                    $("#apiName").textbox("setValue", data.data.apiName);
                    $("#apiNo").textbox("setValue", data.data.apiNo);
                    $("#jsonString").textbox("setValue", data.data.jsonString);
                    configTool.jsonParse();
                } else {
                    $.messager.alert('提示', data.message, 'error');
                }
            }
        });
    }
};