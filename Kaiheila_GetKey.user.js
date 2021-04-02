// ==UserScript==
// @name         开黑啦Key获取
// @namespace    https://853lab.com/
// @version      0.3
// @description  获取key用于开发用途。
// @author       Sonic853
// @match        https://kaiheila.cn/app/*
// @match        https://www.kaiheila.cn/app/*
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    GM_registerMenuCommand("开黑啦BOT",()=>{
        const auth = JSON.parse(localStorage.getItem("auth"));
        if(auth!=null){
            const j = {
                auth:auth.authorization,
                token:auth.rong_token
            }
            prompt("复制以下的信息到开黑啦BOT里，请勿将这些内容暴露在公共场合下",JSON.stringify(j));
        }
    });
    GM_registerMenuCommand("KaiheilaWS",()=>{
        const auth = JSON.parse(localStorage.getItem("auth"));
        if(auth!=null){
            prompt("复制以下的信息到KaiheilaWS里，请勿将这些内容暴露在公共场合下",auth.authorization);
        }
    });
})();
