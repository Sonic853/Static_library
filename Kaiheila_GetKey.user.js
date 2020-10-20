// ==UserScript==
// @name         开黑啦Key获取
// @namespace    https://853lab.com/
// @version      0.1
// @description  获取key用于开发用途。
// @author       Sonic853
// @match        https://kaiheila.cn/app/*
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    GM_registerMenuCommand("获取key",()=>{
        let auth = JSON.parse(localStorage.getItem("auth"));
        if(auth!=null){
            let j = {
                auth:auth.authorization,
                token:auth.rong_token
            }
            prompt("复制以下的信息到开黑啦BOT里，请勿将这些内容暴露在公共场合下",JSON.stringify(j));
        }
    });
})();
