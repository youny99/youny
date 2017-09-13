/**
 * 提示分享操作
 *
 */
(function(){
    $.sharePopup = function(toClass,imgUrl){

        var $mask = $('#mask')[0] || $('<div id="mask"></div>').appendTo('body');
        var htr ="";
        htr +='<div class="shareBox" id="share_box">';
        htr +='<div class="shareInfo '+ toClass+ '"><img src="'+ imgUrl+'"></div>';
        htr +='</div>';

        var $confirm = $('#share_box')[0] || (function () {
                var con = $(htr).appendTo('body');
                con.on('click', function () {
                    closes();
                });
                return con;
            }());
        var closes =  function () {
            $($confirm).remove(); $($mask).remove();
        };

        $($mask).fadeIn(300); $($confirm).fadeIn(300);
    };

})();

/**
 * Created by Jeffery Wang.
 * Create Time: 2015-06-16 19:52
 * Author Link: http://blog.wangjunfeng.com
 */
var nativeShare = function (elementNode, config) {
    if (!document.getElementById(elementNode)) {
        return false;
    }

    var qApiSrc = {
        lower: "http://3gimg.qq.com/html5/js/qb.js",
        higher: "http://jsapi.qq.com/get?api=app.share"
    };
    var bLevel = {
        qq: {forbid: 0, lower: 1, higher: 2},
        uc: {forbid: 0, allow: 1}
    };
    var UA = navigator.appVersion;
    var isqqBrowser = (UA.split("MQQBrowser/").length > 1) ? bLevel.qq.higher : bLevel.qq.forbid;
    var isucBrowser = (UA.split("UCBrowser/").length > 1) ? bLevel.uc.allow : bLevel.uc.forbid;
    var version = {
        uc: "",
        qq: ""
    };
    var isWeixin = false;

    config = config || {};
    this.elementNode = elementNode;
    this.url = config.url || document.location.href || '';
    this.title = config.title || document.title || '';
    this.desc = config.desc || document.title || '';
    this.img = config.img || document.getElementsByTagName('img').length > 0 && document.getElementsByTagName('img')[0].src || '';
    this.img_title = config.img_title || document.title || '';
    this.from = config.from || window.location.host || '';
    this.ucAppList = {
        sinaWeibo: ['kSinaWeibo', 'SinaWeibo', 11, '新浪微博'],
        weixin: ['kWeixin', 'WechatFriends', 1, '微信好友'],
        weixinFriend: ['kWeixinFriend', 'WechatTimeline', '8', '微信朋友圈'],
        QQ: ['kQQ', 'QQ', '4', 'QQ好友'],
        QZone: ['kQZone', 'QZone', '3', 'QQ空间']
    };

    this.share = function (to_app) {
        var title = this.title, url = this.url, desc = this.desc, img = this.img, img_title = this.img_title, from = this.from;
        if (isucBrowser) {
            to_app = to_app == '' ? '' : (platform_os == 'iPhone' ? this.ucAppList[to_app][0] : this.ucAppList[to_app][1]);
            if (to_app == 'QZone') {
                B = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url="+img+"&title="+title+"&description="+desc+"&url="+url+"&app_name="+from;
                k = document.createElement("div"), k.style.visibility = "hidden", k.innerHTML = '<iframe src="' + B + '" scrolling="no" width="1" height="1"></iframe>', document.body.appendChild(k), setTimeout(function () {
                    k && k.parentNode && k.parentNode.removeChild(k)
                }, 5E3);
            }
            if (typeof(ucweb) != "undefined") {
                ucweb.startRequest("shell.page_share", [title, title, url, to_app, "", "@" + from, ""])
            } else {
                if (typeof(ucbrowser) != "undefined") {
                    ucbrowser.web_share(title, title, url, to_app, "", "@" + from, '')
                } else {
                }
            }
        } else {
            if (isqqBrowser && !isWeixin) {
                to_app = to_app == '' ? '' : this.ucAppList[to_app][2];
                var ah = {
                    url: url,
                    title: title,
                    description: desc,
                    img_url: img,
                    img_title: img_title,
                    to_app: to_app,//微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
                    cus_txt: "请输入此时此刻想要分享的内容"
                };
                ah = to_app == '' ? '' : ah;
                if (typeof(browser) != "undefined") {
                    if (typeof(browser.app) != "undefined" && isqqBrowser == bLevel.qq.higher) {
                        browser.app.share(ah)
                    }
                } else {
                    if (typeof(window.qb) != "undefined" && isqqBrowser == bLevel.qq.lower) {
                        window.qb.share(ah)
                    } else {
                    }
                }
            } else {
            }
        }
    };

    this.html = function() {
        var position = document.getElementById(this.elementNode);
        var html = '<div class="am-share">'+
            '<div class="am-share-sns list clearfix">'+
            '<span data-app="weixin" class="nativeShare weixin"><i></i>微信好友</span>'+
            '<span data-app="weixinFriend" class="nativeShare weixin_timeline"><i></i>微信朋友圈</span>'+
            '<span data-app="sinaWeibo" class="nativeShare weibo"><i></i>新浪微博</span>'+
            '<span data-app="QQ" class="nativeShare qq"><i></i>QQ好友</span>'+
            '<span data-app="QZone" class="nativeShare qzone"><i></i>QQ空间</span>'+
            //'<span data-app="" class="nativeShare more"><i></i>更多</span>'+
            '<div class="am-share-footer"><button class="share_btn">取消</button></div>'+
            '</div>'+
            '</div>';
        position.innerHTML = html;
    };

    this.isloadqqApi = function () {
        if (isqqBrowser) {
            var b = (version.qq < 5.4) ? qApiSrc.lower : qApiSrc.higher;
            var d = document.createElement("script");
            var a = document.getElementsByTagName("body")[0];
            d.setAttribute("src", b);
            a.appendChild(d);
        }
    };

    this.getPlantform = function () {
        ua = navigator.userAgent;
        if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1)) {
            return "iPhone";
        }
        return "Android";
    };

    this.is_weixin = function () {
        var a = UA.toLowerCase();
        if (a.match(/MicroMessenger/i) == "micromessenger") {
            return true
        } else {
            return false
        }
    };

    this.getVersion = function (c) {
        var a = c.split("."), b = parseFloat(a[0] + "." + a[1]);
        return b
    };

    this.init = function () {
        platform_os = this.getPlantform();
        version.qq = isqqBrowser ? this.getVersion(UA.split("MQQBrowser/")[1]) : 0;
        version.uc = isucBrowser ? this.getVersion(UA.split("UCBrowser/")[1]) : 0;
        isWeixin = this.is_weixin();
        if ((isqqBrowser && version.qq < 5.4 && platform_os == "iPhone") || (isqqBrowser && version.qq < 5.3 && platform_os == "Android")) {
            isqqBrowser = bLevel.qq.forbid
        } else {
            if (isqqBrowser && version.qq < 5.4 && platform_os == "Android") {
                isqqBrowser = bLevel.qq.lower
            } else {
                if (isucBrowser && ((version.uc < 10.2 && platform_os == "iPhone") || (version.uc < 9.7 && platform_os == "Android"))) {
                    isucBrowser = bLevel.uc.forbid
                }
            }
        }
        this.isloadqqApi();

        if (isqqBrowser) {
            this.html();

            var share = this;
            var items = document.getElementsByClassName('nativeShare');
            for (var i=0;i<items.length;i++) {
                items[i].onclick = function(){
                    share.share(this.getAttribute('data-app'));
                }
            }
        }else if(isucBrowser){
            this.share('');
        }
        else {
            document.write('目前该分享插件仅支持手机UC浏览器和QQ浏览器');
        }
    };

    this.init();

    return this;
};

//判断浏览器并分享
(function(){
    //alert(navigator.userAgent);
    /**
     * 判断是否pc设备，若是pc，需要更改touch事件为鼠标事件，否则默认触摸事件
     */

    if (isPC()) {
        return;
    }
    function isPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    var browserIs ={
        init:function(config){
            var UA = navigator.appVersion,a = UA.toLowerCase();

            //内置微信浏览器
            if (a.match(/MicroMessenger/i) == "micromessenger") {
                //alert("内置微信浏览器");
                this.browserOne();
            }
            //QQ浏览器
            else if (UA.indexOf("QQ") >= 0) {
                if (a.match(/MQQBrowser/i) == "mqqbrowser") {
                    if (a.match(/Mobile MQQBrowser/i) == "mobile mqqbrowser") {
                        // 安卓  alert("安卓 内置QQ浏览器");
                        this.browserOne();
                    }else{
                        // alert("QQ浏览器");
                        this.browserUcQq(config);
                        this.evenMonitor();
                    }

                }  else  if (a.match(/Mobile/i) == "mobile" && UA.indexOf("MQQBrowser") <=0) {
                    //  苹果   alert("苹果 内置QQ浏览器");
                    this.browserOne();
                }
            }
            //UC浏览器
            else if (a.match(/UCBrowser/i) == "ucbrowser") {
                // alert("UC浏览器");
                this.browserUcQq(config);
            }
            else{
                this.browserOther();
            }
        },
        browserUcQq:function(config){
            if(document.getElementById("nativeShare")) {}else{
                $('body').append('<div id="nativeShare" ></div>');
            }
            var share_obj = new nativeShare('nativeShare', config);

        },
        browserOther:function(){
            $.sharePopup("bwbottom","images/share_footer.png");
        },
        browserOne:function(){
            $.sharePopup("bwtop","images/share_top.png");
        },
        evenMonitor:function(){
            $(".am-share").addClass("am-modal-active");
            if ($(".sharebg").length > 0) {
                $(".sharebg").addClass("sharebg-active");
            } else {
                $("body").append('<div class="sharebg"></div>');
                $(".sharebg").addClass("sharebg-active");
            }
            $(".sharebg-active,.share_btn").click(function() {
                $(".am-share").removeClass("am-modal-active");
                setTimeout(function() {
                    $(".sharebg-active").removeClass("sharebg-active");
                    $(".sharebg").remove();
                }, 300);
            })
        }
    };
    $("#toshare").on('click',function(){
        var config = {
            url: '', //分享url
            title: '', //内容标题
            desc: '', //描述
            img: '', //分享的图片
            img_title: '', //图片名称
            from: '' //来源
        };
        browserIs.init(config);
    });

})();