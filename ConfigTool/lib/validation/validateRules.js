/**
 * 文件名：validateRules.js
 * 描述：参数验证
 * 修改人：许文
 * 修改时间：2017-07-19 10:32
 * 修改内容：新建
 **/
$(function () {
    listenKey();
    /*自定义验证规则*/
    $.extend($.fn.validatebox.defaults.rules, {
        isJson: {
            validator: function (value) {
                try {
                    var jsonObj = JSON.parse(value);
                    if (value.indexOf('{') <= -1) {
                        return false;
                    }
                } catch (e) {
                    return false;
                }
                return true;
            },
            message: 'json格式错误，请检查！'
        },
        isNumExist: {
            validator: function (value) {
                var a = true;
                var b = true;
                if (value.length > 0) {
                    a = /^[^\\.|\n]{0,50}$/.test(value);
                    $.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: baseUrl + "/configTool/isNumExist/"+value,
                        async: false,
                        success: function (data) {
                            if (data.data > 0) {
                                b = false;
                            }
                        }
                    });
                    if (a && b) {
                        return true;
                    }
                }
            },
            message: '该接口编号已存在,请重新输入！'
        }
    });

    /*动态增减验证*/
    $.extend($.fn.validatebox.methods, {
        remove: function (jq, newposition) {

            return jq.each(function () {
                $(this).removeClass("validatebox-text validatebox-invalid").unbind('focus').unbind('blur');
            });
        },
        reduce: function (jq, newposition) {
            return jq.each(function () {
                var opt = $(this).data().validatebox.options;
                $(this).addClass("validatebox-text").validatebox(opt);
            });
        }
    });
});


//刷新本页面
function listenKey() {
    document.onkeydown = function (e) {
        if (e == null) { // ie
            _key = event.keyCode;
        } else { // firefox //获取你按下键的keyCode
            _key = e.which; // 每个键的keyCode是不一样的

        }

        if (e.which == 116) {
            window.location.reload(true);
            e.preventDefault();
            //var iframe = $("#document").parent();
        }
    }
}


//窗口改变尺寸时自动重新加载
function changeSize() {
    $(window).resize(function () {
        $.parser.parse($(arguments[0]).parent());
    });
}
