/**
 * fis.baidu.com
 * @jinz
 */


'use strict';

var path = require("path");

var httpsTransMap = {
    "http:\/\/hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/7LsWdDW5_xN3otqbppnN2DJv",
    "http:\/\/iknow01.bosstatic.bdimg.com":"https:\/\/gss0.baidu.com\/7051cy89RMgCncy6lo7D0j9wexYrbOWh7c50",
    "http:\/\/a.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/94o3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/b.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/9vo3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/c.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/9fo3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/d.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/-Po3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/e.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/-4o3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/f.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/-vo3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/g.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/-fo3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/h.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/7Po3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/priv.hiphotos.baidu.com":"https:\/\/gss0.baidu.com\/7Po3dSag_xI4khGko9WTAnF6hhy",
    "http:\/\/himg.bdimg.com":"https:\/\/gss0.bdstatic.com\/7Ls0a8Sm1A5BphGlnYG",
    "http:\/\/imgsrc.baidu.com":"https:\/\/gss0.baidu.com\/70cFfyinKgQFm2e88IuM_a",
    "http:\/\/iknowwap.bdimg.com":"https:\/\/gss0.bdstatic.com\/7051cy7z2RZ3otebn9fN2DJv",
    "http:\/\/iknow02.bosstatic.bdimg.com":"https:\/\/gss0.bdstatic.com\/7051cy89RcgCncy6lo7D0j9wexYrbOWh7c50",
    "http:\/\/iknow03.bosstatic.bdimg.com":"https:\/\/gss0.bdstatic.com\/7051cy89RsgCncy6lo7D0j9wexYrbOWh7c50",
    "http:\/\/iknow04.bosstatic.bdimg.com":"https:\/\/gss0.bdstatic.com\/7051cy89Q1gCncy6lo7D0j9wexYrbOWh7c50",
    "http:\/\/iknow05.bosstatic.bdimg.com":"https:\/\/gss0.bdstatic.com\/7051cy89QMgCncy6lo7D0j9wexYrbOWh7c50",
    "http:\/\/iknow-base.bj.bcebos.com":"https:\/\/gss0.bdstatic.com\/7051cy89QMgCncy6lo7D0j9wexYrbOWh7c50",
    "http:\/\/img.baidu.com":"https:\/\/gss0.bdstatic.com\/70cFsjip0QIZ8tyhnq",
    "http:\/\/img.iknow.bdimg.com":"https:\/\/gss0.bdstatic.com\/70cFsj3f_gcX8t7mm9GUKT-xh_",
    "http:\/\/mt1.baidu.com":"https:\/\/gss0.baidu.com\/8_BXsjip0QIZ8tyhnq",
    "http:\/\/mt2.baidu.com":"https:\/\/gss0.bdstatic.com\/8_BYsjip0QIZ8tyhnq",
    "http:\/\/mt3.baidu.com":"https:\/\/gss0.bdstatic.com\/8_BZsjip0QIZ8tyhnq",
    "http:\/\/mt4.baidu.com":"https:\/\/gss0.bdstatic.com\/8_BSsjip0QIZ8tyhnq",
    "http:\/\/msg.baidu.com":"https:\/\/gsp0.baidu.com\/8_UFsjip0QIZ8tyhnq",
    "http:\/\/nssug.baidu.com":"https:\/\/gsp0.baidu.com\/8qUZeT8a2gU2pMbgoY3K",
    "http:\/\/cp01-testing-iknow-real04.cp01.baidu.com:8099":"https:\/\/zdtest.baidu.com"
};

// 对tpl的处理
function httpsTplReplace(content) {
    // 替换可能包含在smarty变量中的url
    return content.replace(/(?:src|img)="\{%(\$.*?)%\}"/gi, function(word, key){
        var ret = word.replace(key, key + '|https_trans');
        if( ret !== word) {
            console.log('🙆 ==> replacement 1::' + '[' + word + ']' + ' => [' + ret + ']');
        }
        return ret;
    })

    // 替换smarty和字符的combination
    .replace(/(src|img)="(http:\/\/[\.\w\/\-]+)\{%(\$.*?)%\}([\.\w\/\-]+)"/gi, function(word, s1, s2, s3, s4){
        var ret = s1 + '=\"{%\'' + s2  + '\'|cat:' + s3 + '|cat:\'' + s4 + '\'|https_trans%}\"';
        console.log('🙋 ==> replacement 2::' + '[' + word + ']' + ' => [' + ret + ']');
        return ret;
    })

    // 替换直接的图片地址
    .replace(/src="([^'"{}<>]+)"/gi, function(word, s){
        var key = s.split('.com')[0] + '.com';
        if(httpsTransMap[key]){
            var ret = '{%"' + s + '"|https_trans%}';
            console.log('👭 ==> replacement 3::' + '[' + word + ']' + ' => [' + ret + ']');
            return word.replace(s, ret);
        }
        return word;
    })

    // 替换纯baiduTemplate
    .replace(/(src|img)="<#=(.*?)#>"/gi, function(word, s1, s2){
        var ret = s1 + '="<#-__2ssl__(' + s2 + ')#>"';
        console.log('👑 ==> replacement 4::' + '[' + word + ']' + ' => [' + ret + ']');
        return ret;
    })

    // 替换baiduTemplate和字符串的组合
    .replace(/(src|img)="([^'"]+)<#:?=(.*?)#>([^'"]+)"/gi, function(word, s1, s2, s3, s4){
        var ret = s1 + '="<#-__2ssl__(\'' + s2.replace(/\//g, '\\/') + '\' + ' + s3 + ' + \'' + s4.replace(/\//g, '\\/') + '\')#>"';
        console.log('💏 ==> replacement 5::' + '[' + word + ']' + ' => [' + ret + ']');
        return ret;
    })

    // 替换baiduTemplate模板中包含在background中的变量
    .replace(/background(?:\-image)?:\s*(?:#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\s+)?url\(['"]?<#:?=(.*?)#>['"]?\)/gi, function(word, key){
        var ret = word.replace(key, '__2ssl__(' + key + ')');
        if( ret !== word) {
            console.log('👀 ==> replacement 12::' + '[' + word + ']' + ' => [' + ret + ']');
        }
        return ret;
    })

    // 替换juicer模板
    .replace(/(src|img)="\${([^%]+?)}"/gi, function(word, s1, s2){
        var ret = s1 + '="${__2ssl__(' + s2 + ')}"';
        console.log('👪 ==> replacement 6::' + '[' + word + ']' + ' => [' + ret + ']');
        return ret;
    })

    // 替换juicer模板和字符串的组合
    .replace(/(src|img)="([^'"]+)\${([^%]+?)}([^'"]+)"/gi, function(word, s1, s2, s3, s4){
        var ret = s1 + '="${__2ssl__(\'' + s2 + '\' + ' + s3 + ' + \'' + s4 + '\')}"';
        console.log('👯 ==> replacement 7::' + '[' + word + ']' + ' => [' + ret + ']');
        return ret;
    })

     // 替换juicer模板中包含在background中的变量
    .replace(/background(?:\-image)?:\s*(?:#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\s+)?url\(['"]?\$\{(.*?)\}['"]?\)/gi, function(word, key){
        var ret = word.replace(key, '__2ssl__(' + key + ')');
        if( ret !== word) {
            console.log('🙇 ==> replacement 11::' + '[' + word + ']' + ' => [' + ret + ']');
        }
        return ret;
    })

    // 替换json_encode的字符串
    .replace(/\{%.*?(\$(.+?)\|json_encode).*?%\}/gi, function(word, key){
        var ret = word.replace(key, key + '|https_trans');
        if( ret !== word) {
            console.log('💃 ==> replacement 8::' + '[' + word + ']' + ' => [' + ret + ']');
        }
        return ret;
    })

    // 替换模板中包含在background中的smarty的变量
    .replace(/background(?:\-image)?:\s*(?:#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\s+)?url\(['"]?\{%(\$.*?)%\}['"]?\)/gi, function(word, key){
        var ret = word.replace(key, key + '|https_trans');
        if( ret !== word) {
            console.log('🏃 ==> replacement 9::' + '[' + word + ']' + ' => [' + ret + ']');
        }
        return ret;
    });
};


function httpsCssReplace(content) {
    return content.replace(/background(?:\-image)?:\s*(?:#(?:[A-Za-z0-9]{3}|[A-Za-z0-9]{6})\s+)?url\((http:\/\/[\w\.\-]+).*?\)/gi, function(word, key){
        var ret = httpsTransMap[key] ? word.replace(key, httpsTransMap[key]) : word;
        if( ret !== word) {
            console.log('💖 ==> replacement 10::' + '[' + word + ']' + ' => [' + ret + ']');
        }
        return ret;
    });
}

function httpsJSReplace(content) {
    var reg = /\'\s*(http:[\w\d\.\-#\?&=\/]+?)\s*?\'|\"\s*(http:[\w\d\.\-#\?&=\/]+?)\s*?\"/gi;
    return content.replace(reg, function(word, match1, match2){
        var match = match1 || match2;
        var origin = word;
        var ret = match.replace(/^(http:\/\/[\w\d\.\-]+).*/, function(url, host){
            return httpsTransMap[host] ? url.replace(host, httpsTransMap[host]) : url;
        });
        if(ret !== match){
            word = word.replace(match, ret);
            console.log('💋 ==> replacement 11::' + '[' + origin + ']' + ' => [' + word + ']');
        }
        return word;
    });
}


var exports = module.exports = function(ret, conf, settings, opt) {
    
    var ld = settings.left_delimiter || fis.config.get('settings.smarty.left_delimiter') || '{%';
    var rd = settings.right_delimiter || fis.config.get('settings.smarty.right_delimiter') || '%}';
    
    var ids = ret.ids || {};

    fis.util.map(ids, function (src, file) {
        if ( /^\.tpl|\.js|\.css$/.test(file.rExt)) {
            var origin = file.getContent();
            var content = origin;
            switch (file.rExt) {
                case '.tpl':
                content = httpsTplReplace(content);
                break;

                case '.js': 
                content = httpsJSReplace(content);
                break;

                case '.css':
                content = httpsCssReplace(content);
                break;
            }
            if(content !== origin) {
                console.log('✨✨✨[LOG] Replacements completed in [ ' + file.id + ' ]✨✨✨');
            }
            file.setContent(content);
        }
    });
};


