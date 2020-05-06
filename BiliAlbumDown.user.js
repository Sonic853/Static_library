// ==UserScript==
// @name         哔哩哔哩Bilibili动态相册相簿图片下载
// @version      1.0.1
// @description  下载B站UP主相册，然后提交给aria2或打包成zip
// @author       Sonic853
// @namespace    https://blog.853lab.com
// @include      https://space.bilibili.com/*
// @require      https://cdn.bootcss.com/jszip/3.2.2/jszip.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js
// @require      https://greasyfork.org/scripts/402652-aria2-rpc-edit-use-gm-xmlhttprequest/code/Aria2%20RPC%20Edit%20(use%20GM_xmlhttpRequest).js?version=801673
// @resource     BiliUI-style  https://cdn.jsdelivr.net/gh/Sonic853/Static_library/BiliUI-style.min.css?t=20200506001
// @run-at       document-end
// @license      MIT License
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// ==/UserScript==
// https://api.vc.bilibili.com/link_draw/v1/doc/detail?doc_id=70335534
// https://api.vc.bilibili.com/link_draw/v1/doc/doc_list?uid=339679&page_num=0&page_size=541&biz=all
// https://api.vc.bilibili.com/link_draw/v1/doc/upload_count?uid=339679
(function() {
    'use strict';

    const DEV_Log = Boolean(localStorage.getItem("Dev-853"));
    const localItem = "Lab8A";
    const NAME = "相册下载";
    const Console_log = function(text){
        let d = new Date().toLocaleTimeString();
        console.log("["+NAME+"]["+d+"]: "+text);
    };
    const Console_Devlog = function(text){
        let d = new Date().toLocaleTimeString();
        DEV_Log&&(console.log("["+NAME+"]["+d+"]: "+text));
    };
    const Console_error = function(text){
        let d = new Date().toLocaleTimeString();
        console.error("["+NAME+"]["+d+"]: "+text);
    };

    let BLab8A = class{
        constructor(){
            this.data = this.load();
        }
        load(){
            Console_log("正在加载数据");
            if (typeof GM_getValue !== 'undefined') {
                let gdata = JSON.parse(GM_getValue(localItem,"{\"IP\":\"127.0.0.1\",\"Port\":6800,\"dir\":\"E:\\\\Aria2Down\\\\BiliAlbum\"}"));
                return gdata;
            }else{
                let ldata = JSON.parse(localStorage.getItem(localItem) === null ? "{\"IP\":\"127.0.0.1\",\"Port\":6800,\"dir\":\"E:\\\\Aria2Down\\\\BiliAlbum\"}" : localStorage.getItem(localItem));
                return ldata;
            }
        };
        save(d){
            Console_log("正在保存数据");
            d===undefined?(d = this.data):(this.data = d);
            typeof GM_getValue != 'undefined'?GM_setValue(localItem,JSON.stringify(d)):localStorage.setItem(localItem,JSON.stringify(d));
            return this;
        };
        set_aria2Client(d){
            d===undefined?(d = this.data):(this.data = d);
            aria2Client = new Aria2({ host:d.IP,port:d.Port });
        }
    }
    let bLab8A = new BLab8A();
    let aria2Client = new Aria2({ host:bLab8A.data.IP,port:bLab8A.data.Port });
    let addToAria = function(url, filename, referer, cookie, headers, callback, errorcallback){
        // Console_Devlog(bLab8A.data.dir+(!bLab8A.data.dir.endsWith("\\")?"\\":"")+uFA.uid);
        let ariaParam = {
			dir: bLab8A.data.dir+(!bLab8A.data.dir.endsWith("\\")?"\\":"")+uFA.uid,
			out: filename,
			referer: referer || location.href,
			'user-agent': navigator.userAgent,
			header: headers || []
		};

		if(cookie === true)cookie = document.cookie;
        cookie&&ariaParam.header.push ('Cookie: ' + cookie);

        aria2Client.addUri(url,ariaParam,()=>{
            Console_Devlog("发送到Aria2成功。");
            callback;
        },()=>{
            Console_error("发送到Aria2失败。");
            lists.Set("发送到Aria2失败。");
            errorcallback;
        });
    }

    if(typeof GM_xmlhttpRequest === 'undefined' && typeof GM_registerMenuCommand === 'undefined' && typeof GM_setValue === 'undefined' && typeof GM_getValue === 'undefined' && typeof GM_addStyle === 'undefined'){
        Console_error("GM is no Ready.");
    }else{
        Console_log("GM is Ready.");
    };
    let HTTPsend = function(url, method, Type, successHandler, errorHandler) {
        if (typeof GM_xmlhttpRequest != 'undefined') {
            GM_xmlhttpRequest({
                method:method,
                url:url,
                responseType:Type,
                onerror:function(response){
                    Console_Devlog(response.status);
                    errorHandler && errorHandler(response.status);
                },
                onload:function(response){
                    let status;
                    if(response.readyState == 4){ // `DONE`
                        status = response.status;
                        if (status == 200) {
                            Console_Devlog(response.response);
                            successHandler && successHandler(response.response);
                        } else {
                            Console_Devlog(status);
                            errorHandler && errorHandler(status);
                        }
                    }
                },
            });
        }else{
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;
            xhr.responseType = Type;
            xhr.onreadystatechange = function() {
                let status;
                if (xhr.readyState == 4) { // `DONE`
                    status = xhr.status;
                    if (status == 200) {
                        Console_log(xhr.response);
                        successHandler && successHandler(xhr.response);
                    } else {
                        Console_log(status);
                        errorHandler && errorHandler(status);
                    }
                }
            };
            xhr.send();
        }
    };
    let loadToBlob = function(url, callback) {
        HTTPsend(url,"GET","blob",(result)=>{
            callback && callback(result);
        });
    }
    let getType = function(file){
        var filename=file;
        var index1=filename.lastIndexOf(".");
        var index2=filename.length;
        var type=filename.substring(index1,index2);
        return type;
    }
    !DEV_Log&&GM_addStyle(GM_getResourceText("BiliUI-style"));
    let CreactUI = function(){
        if(document.getElementById("Bili8-UI")){
            lists.Set("加载中。。。");
            lists.BG("normal");
            document.getElementById("Bili8-UI").style.display = "block";
        }else{
            let Panel_ui = document.createElement("div");
            Panel_ui.classList.add("Bili8-UI","Panel");
            Panel_ui.id = "Bili8-UI";

            let PanelClose_ui = document.createElement("button");
            PanelClose_ui.classList.add("Close");
            PanelClose_ui.innerText = "关闭";
    
            let MainList_ui = document.createElement("div");
            MainList_ui.classList.add("MainList");
    
            let List_ui = document.createElement("textarea");
            List_ui.classList.add("List");
            List_ui.readOnly = true;
            List_ui.innerText = "加载中。。。";
    
            let MainBottom_ui = document.createElement("div");
            MainBottom_ui.classList.add("MainBottom");

            let IPInput_ui = document.createElement("input");
            IPInput_ui.title = "[Aria2]设置ip或域名（不带http和https）";
            IPInput_ui.placeholder = "设置ip或域名（不带http和https）";
            IPInput_ui.type = "text";
            IPInput_ui.value = bLab8A.data.IP;
            IPInput_ui.classList.add("MBtn","MBIP");

            let PortInput_ui = document.createElement("input");
            PortInput_ui.title = "[Aria2]设置端口";
            PortInput_ui.placeholder = "设置端口";
            PortInput_ui.type = "number";
            PortInput_ui.min = "1";
            PortInput_ui.max = "65536";
            PortInput_ui.value = bLab8A.data.Port;
            PortInput_ui.classList.add("MBtn","MBPort");

            let DirInput_ui = document.createElement("input");
            DirInput_ui.title = "[Aria2]设置路径";
            DirInput_ui.placeholder = "设置路径";
            DirInput_ui.type = "text";
            DirInput_ui.value = bLab8A.data.dir;
            DirInput_ui.classList.add("MBtn","MBDir");

            let SendToAria_ui = document.createElement("button");
            SendToAria_ui.classList.add("MBtn","MBSendToAria");
            SendToAria_ui.innerText = "发送到Aria2";
            SendToAria_ui.disabled = true;

            let BlobDown_ui = document.createElement("button");
            BlobDown_ui.classList.add("MBtn","MBBlobDown");
            BlobDown_ui.innerText = "浏览器打包下载";
            BlobDown_ui.title = "将会消耗大量的内存！";
            BlobDown_ui.disabled = true;
    
            Panel_ui.appendChild(PanelClose_ui);
            MainList_ui.appendChild(List_ui);
            Panel_ui.appendChild(MainList_ui);
            MainBottom_ui.appendChild(IPInput_ui);
            MainBottom_ui.appendChild(PortInput_ui);
            MainBottom_ui.appendChild(DirInput_ui);
            MainBottom_ui.appendChild(SendToAria_ui);
            MainBottom_ui.appendChild(BlobDown_ui);
            Panel_ui.appendChild(MainBottom_ui);
            document.body.appendChild(Panel_ui);

            SendToAria_ui.addEventListener("click",()=>{
                if(!uFA.DownSend){
                    bLab8A.data.IP = IPInput_ui.value;
                    bLab8A.data.Port = Number(PortInput_ui.value);
                    bLab8A.data.dir = DirInput_ui.value;
                    bLab8A.save().set_aria2Client();
                    uFA.indexA = 0;
                    MBBtn(false);
                    lists.BG("running");
                    uFA.send_aria2();
                }else{
                    lists.Set("请求已经发送过去了，请勿重复点击！");
                }
            });
            BlobDown_ui.addEventListener("click",()=>{
                if(!uFA.DownSend){
                    zip = new JSZip();
                    uFA.indexA = 0;
                    MBBtn(false);
                    lists.BG("running");
                    uFA.send_blob();
                }else{
                    lists.Set("请求已经发送过去了，请勿重复点击！");
                }
            });
            PanelClose_ui.addEventListener("click",()=>{
                document.getElementById("Bili8-UI").style.display = "none";
            });
        }
    }
    let MBBtn = function(disabled){
        document.getElementById("Bili8-UI").getElementsByClassName("MBSendToAria")[0].disabled = !disabled;
        document.getElementById("Bili8-UI").getElementsByClassName("MBBlobDown")[0].disabled = !disabled;
    }
    let CreactMenu = function(){
        GM_registerMenuCommand("下载相册",()=>{
            uFA.index = 0;
            CreactUI();
            uFA.load_all_count();
            let t2 = setInterval(()=>{
                let index = uFA.index;
                if(index++>=uFA.all_count){
                    let obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
                    lists.Clear(obj);
                    uFA.imglist.forEach(element => {
                        lists.Add(element.url,obj);
                    });
                    MBBtn(true);
                    clearInterval(t2);
                }
            },100);
        });
    }
    let List = class{
        Get(obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            obj.innerHTML;
        };
        Set(text,obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            obj.innerHTML = text;
        };
        Add(text,obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            if(obj.innerHTML == ""){
                obj.innerHTML = text;
            }else{
                obj.innerHTML += "\n" + text;
            }
        };
        Clear(obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            obj.innerHTML = "";
        };
        BG(status,obj){
            if(obj === undefined){
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            let color = "#FFFFFF";
            switch (status) {
                case "normal":
                    color = "#FFFFFF";
                    break;
                case "running":
                    color = "#FFCC80";
                    break;
                case "success":
                    color = "#91FFC2";
                    break;
                default:
                    color = "#FFFFFF";
                    break;
            }
            obj.style.backgroundColor = color;
        }
    }
    let UFA = class{
        constructor(uid,all_count){
            this.uid = uid;
            this.name = "";
            this.all_count = all_count;
            this.imglist = [];
            this.index = 0;
            this.indexA = 0;
            this.DownSend = false;
            if(uid === undefined){
                this.uid = this.load_uid()
            }
        };
        load_uid(){
            return window.location.pathname.split("/")[1];
        };
        load_all_count(uid){
            if(uid === undefined){
                uid = this.uid;
            }
            HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/upload_count?uid="+uid,"GET","",(result)=>{
                let rdata;
                try {
                    rdata = JSON.parse(result);
                } catch (error){
                    Console_Devlog("JSON已解析，直接跳过");
                    rdata = result;
                }
                if(rdata.code == 0){
                    if (rdata.data.all_count != 0) {
                        this.set_all_count(rdata.data.all_count);
                    }else{
                        Console_log("空的");
                        lists.Set("空的");
                    }
                }
            });
        };
        set_all_count(all_count){
            if(all_count != undefined){
                this.all_count = all_count
            }
            this.load_img_list(this.uid,this.all_count);
        };
        load_img_list(uid,all_count){
            if(uid === undefined){
                uid = this.uid;
            }
            if(all_count === undefined){
                all_count = this.all_count;
            }
            setTimeout(()=>{
                HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/doc_list?uid="+uid+"&page_num=0&page_size="+all_count+"&biz=all","GET","",(result)=>{
                    let rdata;
                    try {
                        rdata = JSON.parse(result);
                    } catch (error){
                        Console_Devlog("JSON已解析，直接跳过");
                        rdata = result;
                    }
                    if(rdata.code == 0){
                        this.imglist = [];
                        this.index = 0;
                        rdata.data.items.forEach(element => {
                            if(element.count == 1){
                                this.add_img(element.pictures[0].img_src,element.doc_id,0);
                                this.index++;
                            }else if(element.count == element.pictures.length){
                                let cou = 0;
                                element.pictures.forEach(element2 => {
                                    this.add_img(element2.img_src,element.doc_id,cou);
                                    cou++;
                                });
                                this.index++;
                            }else{
                                this.load_img_detail(element.doc_id);
                            }
                        });
                        setTimeout(()=>{Console_log("加载完成，有"+this.imglist.length+"个图片。");},1000);
                    }
                });
            });
        };
        load_img_detail(doc_id){
            HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/detail?doc_id="+doc_id,"GET","",(result)=>{
                let rdata;
                try {
                    rdata = JSON.parse(result);
                } catch (error){
                    Console_Devlog("JSON已解析，直接跳过");
                    rdata = result;
                }
                if(rdata.code == 0){
                    let cou = 0;
                    rdata.data.item.pictures.forEach(element => {
                        this.add_img(element.img_src,doc_id,cou);
                        cou++;
                    });
                    this.index++;
                }
            });

        };
        add_img(url,doc_id,cou){
            this.imglist.push({url:url,doc_id:doc_id,cou:cou});
        };
        send_aria2(){
            this.DownSend = true;
            let indexA = this.indexA;
            indexA++;
            Console_Devlog(indexA+"，"+this.imglist.length);
            if(indexA<=this.imglist.length){
                Console_Devlog("正在发送第"+indexA+"张图片。");
                lists.Set("正在发送第"+indexA+"张图片。");
                let url = this.imglist[this.indexA].url;
                let doc_id = this.imglist[this.indexA].doc_id.toString();
                let cou = this.imglist[this.indexA].cou.toString()
                setTimeout(()=>{
                    addToAria([url],doc_id+"_"+cou+getType(url),"https://h.bilibili.com/"+doc_id,true,[],()=>{
                    },()=>{
                        Console_error("发送到Aria2失败了，请检查相关设置吧。。。。");
                        lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。");
                    });
                    uFA.indexA++;
                    uFA.send_aria2();
                },5);
            }else{
                this.DownSend = false;
                MBBtn(true);
                Console_log("发送完成。");
                lists.Set("发送完成。");
                lists.BG("success");
            }
        };
        send_blob(){
            this.DownSend = true;
            let indexA = this.indexA;
            indexA++;
            if(indexA<=this.imglist.length){
                Console_Devlog("正在获取第"+indexA+"张图片。");
                lists.Set("正在获取第"+indexA+"张图片。");
                let url = this.imglist[this.indexA].url;
                let doc_id = this.imglist[this.indexA].doc_id.toString();
                let cou = this.imglist[this.indexA].cou.toString()
                setTimeout(()=>{
                    loadToBlob(url,(blobFile)=>{
                        zip.file(doc_id+"_"+cou+getType(url),blobFile,{binary:true});
                        this.indexA++;
                        uFA.send_blob();
                    });
                },5);
            }else{
                HTTPsend("https://api.bilibili.com/x/space/acc/info?mid="+uFA.uid,"GET","",(result)=>{
                    let rdata;
                    try {
                        rdata = JSON.parse(result);
                    } catch (error){
                        Console_Devlog("JSON已解析，直接跳过");
                        rdata = result;
                    }
                    if(rdata.code == 0){
                        this.name = rdata.data.name;
                        let name = this.name;
                        zip.generateAsync({type:"blob"}).then((content)=>{
                            // see FileSaver.js
                            let zipname = name+"_"+this.uid;
                            Console_log("正在打包成 "+zipname+".zip 中");
                            lists.Set("正在打包成 "+zipname+".zip 中");
                            let a = document.createElement('a');
                            a.innerHTML = zipname;
                            a.download = zipname;
                            a.href = URL.createObjectURL(content);
                            a.addEventListener("click",function(){document.body.removeChild(a)});
                            document.body.appendChild(a);
                            a.click();
                            this.DownSend = false;
                            MBBtn(true);
                            lists.Set("打包 "+zipname+".zip 完成。");
                            lists.BG("success");
                        });
                    }
                });
            }
        }
    }
    let zip = new JSZip();
    let uFA = new UFA();
    CreactMenu();
    CreactUI();
    document.getElementById("Bili8-UI").style.display = "none";
    let lists = new List();
})();
