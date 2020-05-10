// ==UserScript==
// @name         哔哩哔哩图片打包下载（支持相簿
// @version      1.1.3
// @description  下载B站UP主Bilibili动态相册相簿图片，以及视频封面和UP主头像以及主页壁纸，直播间封面和直播间壁纸，然后提交给aria2或打包成zip
// @author       Sonic853
// @namespace    https://blog.853lab.com
// @include      https://space.bilibili.com/*
// @require      https://cdn.jsdelivr.net/gh/Stuk/jszip@3.3.0/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/gh/eligrey/FileSaver.js/dist/FileSaver.min.js
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

    if(typeof GM_xmlhttpRequest === 'undefined' && typeof GM_registerMenuCommand === 'undefined' && typeof GM_setValue === 'undefined' && typeof GM_getValue === 'undefined' && typeof GM_addStyle === 'undefined'){
        Console_error("GM is no Ready.");
    }else{
        Console_log("GM is Ready.");
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
    };
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
    };

    !DEV_Log&&GM_addStyle(GM_getResourceText("BiliUI-style"));
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
        },()=>{
            callback && callback(false)
        });
    };
    let JSON_parse = function(data){
        let rdata;
        try {
            rdata = JSON.parse(data);
        } catch (error){
            Console_Devlog("JSON已解析，直接跳过");
            rdata = result;
        }
        return rdata;
    }
    let getType = function(file){
        let filename=file;
        let index1=filename.lastIndexOf(".");
        let index2=filename.length;
        let type=filename.substring(index1,index2);
        return type;
    };
    let getFileName = function(file) {
        let str = file;
        str = str.substring(str.lastIndexOf("/") + 1);
        return str;
    }
    let MBBtn = function(disabled){
        document.getElementById("Bili8-UI").getElementsByClassName("MBSendToAria")[0].disabled = !disabled;
        document.getElementById("Bili8-UI").getElementsByClassName("MBBlobDown")[0].disabled = !disabled;
    };
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
                    uFA.HaveDownFail = false;
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
                    uFA.HaveDownFail = false;
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
    };
    let CreactMenu = function(){
        let Creact_G = function(Mode){
            uFA.Mode = Mode;
            uFA.index = 0;
            uFA.all_count = 0;
            CreactUI();
            uFA.load_all_count();
            let t2 = setInterval(()=>{
                let index = uFA.index;
                if(index++>=uFA.all_count&&uFA.all_count!=0){
                    let obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
                    lists.Clear(obj);
                    uFA.imglist.forEach(element => {
                        lists.Add(element.url,obj);
                    });
                    MBBtn(true);
                    clearInterval(t2);
                }
            },100);
        }
        GM_registerMenuCommand("下载相册",()=>{Creact_G(0)});
        GM_registerMenuCommand("下载视频封面",()=>{Creact_G(1)});
        GM_registerMenuCommand("下载头像、头图、直播封面、直播壁纸",()=>{Creact_G(2)});
    };
    let BG_Default = [
        "1780c98271ead667b2807127ef807ceb4809c599.png",
        "e7f98439ab7d081c9ab067d248e1780bd8a72ffc.jpg",
        "f49642b3683a08e3190f29d5a095386451f8952c.jpg",
        "cd52d4ac1d336c940cc4958120170f7928d9e606.png",
        "70ce28bcbcb4b7d0b4f644b6f082d63a702653c1.png",
        "3ab888c1d149e864ab44802dea8c1443e940fa0d.png",
        "6e799ff2de2de55d27796707a283068d66cdf3f4.png",
        "24d0815514951bb108fbb360b04a969441079315.png",
        "0ad193946df21899c6cc69fc36484a7f96e22f75.png",
        "265ecddc52d74e624dc38cf0cff13317085aedf7.png",
        "6a1198e25f8764bd30d53411dac9fdf840bc3265.png",
        "9ccc0447aebf0656809b339b41aa5b3705f27c47.png",
        "8cd85a382756ab938df23a856017abccd187188e.png",
        "e22f5b8e06ea3ee4de9e4da702ce8ef9a2958f5a.png",
        "c919a9818172a8297f8b0597722f96504a1e1d88.png",
        "87277d30cd19edcec9db466a9a3e556aeb0bc0ed.png",
        "44873d3568bdcb3d850d234e02a19602972450f1.png",
        "cb1c3ef50e22b6096fde67febe863494caefebad.png"
    ];
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
                case "error":
                    color = "#F45A8D";
                    break;
                default:
                    color = "#FFFFFF";
                    break;
            }
            obj.style.backgroundColor = color;
        }
    };
    let UFA = class{
        constructor(uid,all_count){
            this.uid = uid;
            this.name = "";
            this.all_count = all_count;
            this.imglist = [];
            this.index = 0;
            this.indexA = 0;
            this.DownSend = false;
            this.HaveDownFail = false;
            this.Mode = 0;// 0：相册 1：视频
            if(uid === undefined){
                this.uid = this.load_uid()
            }
        };
        load_uid(){
            return window.location.pathname.split("/")[1];
        };
        load_all_count(uid,Mode){
            if(uid === undefined){
                uid = this.uid;
            }
            if(Mode === undefined){
                Mode = this.Mode;
            }
            if (Mode == 0) {
                HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/upload_count?uid="+uid,"GET","",(result)=>{
                    let rdata = JSON_parse(result);
                    if(rdata.code == 0){
                        if (rdata.data.all_count != 0) {
                            this.set_all_count(rdata.data.all_count,Mode);
                        }else{
                            Console_log("空的");
                            lists.Set("空的");
                        }
                    }else{
                        Console_error(result);
                    }
                });
            }else if(Mode == 1){
                HTTPsend("https://api.bilibili.com/x/space/navnum?mid="+uid,"GET","",(result)=>{
                    let rdata = JSON_parse(result);
                    if(rdata.code == 0){
                        if (rdata.data.video != 0) {
                            this.set_all_count(rdata.data.video,Mode);
                        }else{
                            Console_log("空的");
                            lists.Set("空的");
                        }
                    }else{
                        Console_error(result);
                    }
                });
            }else if(Mode == 2){
                this.index = 0;
                this.imglist = [];
                HTTPsend("https://api.bilibili.com/x/space/acc/info?mid="+this.uid,"GET","",(result)=>{
                    let rdata = JSON_parse(result);
                    if(rdata.code == 0){
                        this.name = rdata.data.name;
                        let face = rdata.data.face;
                        let bg = rdata.data.top_photo;
                        // let time = Math.round(new Date().getTime()/1000).toString();
                        HTTPsend("https://api.live.bilibili.com/room/v1/Room/getRoomInfoOld?mid="+this.uid,"GET","",(result2)=>{
                            let rdata2 = JSON_parse(result2);
                            if(rdata2.code == 0){
                                if (rdata2.data.roomid != 0) {
                                    HTTPsend("https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id="+rdata2.data.roomid,"GET","",(result3)=>{
                                        let rdata3 = JSON_parse(result3);
                                        if(rdata3.code == 0){
                                            let cover = rdata3.data.room_info.cover;
                                            let background = rdata3.data.room_info.background;
                                            this.all_count = 1;
                                            this.add_img_FBLB(face,"face_"+getFileName(face));
                                            if (BG_Default.indexOf(getFileName(bg)) == -1) {
                                                this.all_count++;
                                                this.add_img_FBLB(bg,"bg_"+getFileName(bg));
                                            }
                                            if (cover != "") {
                                                this.all_count++;
                                                this.add_img_FBLB(cover,"livecover_"+getFileName(cover));
                                            }
                                            if (background != ""&&!(background.startsWith("http://static.hdslb.com/live-static/images/bg/")||background.startsWith("https://static.hdslb.com/live-static/images/bg/"))) {
                                                this.all_count++;
                                                this.add_img_FBLB(background,"livebg_"+getFileName(background));
                                            }
                                            this.index = this.all_count;
                                        }else{
                                            Console_error(result3);
                                        }
                                    });
                                }else{
                                    this.all_count = 1;
                                    this.add_img_FBLB(face,"face_"+getFileName(face));
                                    if (BG_Default.indexOf(getFileName(bg)) == -1) {
                                        this.all_count++;
                                        this.add_img_FBLB(bg,"bg_"+getFileName(bg));
                                    }
                                    this.index = this.all_count;
                                }
                            }else{
                                Console_error(result2);
                            }
                        });
                    }else{
                        Console_error(result);
                    }
                });
            }
        };
        set_all_count(all_count,Mode){
            if(all_count != undefined){
                this.all_count = all_count
            }
            if(Mode === undefined){
                Mode = this.Mode;
            }
            this.load_img_list(this.uid,this.all_count,Mode);
        };
        load_img_list(uid,all_count,Mode){
            if(uid === undefined){
                uid = this.uid;
            }
            if(all_count === undefined){
                all_count = this.all_count;
            }
            if(Mode === undefined){
                Mode = this.Mode;
            }
            if (Mode == 0) {
                setTimeout(()=>{
                    HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/doc_list?uid="+uid+"&page_num=0&page_size="+all_count+"&biz=all","GET","",(result)=>{
                        let rdata = JSON_parse(result);
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
                        }else{
                            Console_error(result);
                        }
                    });
                });
            }else if(Mode == 1){
                setTimeout(()=>{
                    let z = 1;
                    if (all_count>30) {
                        z = Math.ceil(all_count/30);
                    }
                    this.imglist = [];
                    this.index = 0;
                    for (let i = 1; i <= z; i++) {
                        HTTPsend("https://api.bilibili.com/x/space/arc/search?mid="+uid+"&ps=30&tid=0&pn="+i+"&keyword=&order=pubdate","GET","",(result)=>{
                            let rdata = JSON_parse(result);
                            if(rdata.code == 0){
                                rdata.data.list.vlist.forEach(element => {
                                    if (element.pic.startsWith("//")) {
                                        this.add_img_video("https:"+element.pic,element.aid);
                                    }else if (element.pic.startsWith("http:")||element.pic.startsWith("https:")) {
                                        this.add_img_video(element.pic,element.aid);
                                    }else{
                                        this.add_img_video(element.pic,element.aid);
                                    }
                                    this.index++;
                                });
                            }else{
                                Console_error(result);
                            }
                            i==z&&setTimeout(()=>{Console_log("加载完成，有"+all_count+"个图片。");},1000);
                        });
                    }
                });
            }
        };
        load_img_detail(doc_id){
            HTTPsend("https://api.vc.bilibili.com/link_draw/v1/doc/detail?doc_id="+doc_id,"GET","",(result)=>{
                let rdata = JSON_parse(result);
                if(rdata.code == 0){
                    let cou = 0;
                    rdata.data.item.pictures.forEach(element => {
                        this.add_img(element.img_src,doc_id,cou);
                        cou++;
                    });
                    this.index++;
                }else{
                    Console_error(result);
                }
            });

        };
        add_img(url,doc_id,cou){
            this.imglist.push({url:url,doc_id:doc_id,cou:cou});
        };
        add_img_video(url,aid){
            this.imglist.push({url:url,aid:aid});
        }
        add_img_FBLB(url,name){
            this.imglist.push({url:url,name:name});
        }
        send_aria2(){
            this.DownSend = true;
            let indexA = this.indexA;
            indexA++;
            Console_Devlog(indexA+"，"+this.imglist.length);
            if(indexA<=this.imglist.length){
                Console_Devlog("正在发送第"+indexA+"张图片。");
                lists.Set("正在发送第"+indexA+"张图片。");
                if(this.Mode == 0){
                    let url = this.imglist[this.indexA].url;
                    let doc_id = this.imglist[this.indexA].doc_id.toString();
                    let cou = this.imglist[this.indexA].cou.toString()
                    setTimeout(()=>{
                        addToAria([url],doc_id+"_"+cou+getType(url),"https://h.bilibili.com/"+doc_id,true,[],()=>{
                            // bug: 此处没法执行callback
                        },()=>{
                            Console_error("发送到Aria2失败了，请检查相关设置吧。。。。");
                            lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。");
                        });
                        uFA.indexA++;
                        uFA.send_aria2();
                    },5);
                }else if(this.Mode == 1){
                    let url = this.imglist[this.indexA].url;
                    let aid = this.imglist[this.indexA].aid.toString();
                    setTimeout(()=>{
                        addToAria([url],"av"+aid+getType(url),"https://space.bilibili.com/"+this.uid+"/video",true,[],()=>{
                            // bug: 此处没法执行callback
                        },()=>{
                            Console_error("发送到Aria2失败了，请检查相关设置吧。。。。");
                            lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。");
                        });
                        uFA.indexA++;
                        uFA.send_aria2();
                    },5);
                }else if(this.Mode == 2){
                    let url = this.imglist[this.indexA].url;
                    let name = this.imglist[this.indexA].name;
                    setTimeout(()=>{
                        addToAria([url],name,"https://space.bilibili.com/"+this.uid+"/video",true,[],()=>{
                            // bug: 此处没法执行callback
                        },()=>{
                            Console_error("发送到Aria2失败了，请检查相关设置吧。。。。");
                            lists.Set("发送到Aria2失败了，请检查相关设置吧。。。。");
                        });
                        uFA.indexA++;
                        uFA.send_aria2();
                    },5);
                }
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
                if (this.Mode == 0) {
                    let url = this.imglist[this.indexA].url;
                    let doc_id = this.imglist[this.indexA].doc_id.toString();
                    let cou = this.imglist[this.indexA].cou.toString()
                    setTimeout(()=>{
                        loadToBlob(url,(blobFile)=>{
                            if (blobFile) {
                                zip.file(doc_id+"_"+cou+getType(url),blobFile,{binary:true});
                                this.indexA++;
                                uFA.send_blob();
                            }else{
                                this.HaveDownFail = true;
                                Console_error("相簿 https://h.bilibili.com/"+doc_id+" 下的第 "+cou+" 张图片下载失败了。。。");
                                this.indexA++;
                                uFA.send_blob();
                            }
                        });
                    },5);
                } else if(this.Mode == 1) {
                    let url = this.imglist[this.indexA].url;
                    let aid = this.imglist[this.indexA].aid.toString();
                    setTimeout(()=>{
                        loadToBlob(url,(blobFile)=>{
                            if (blobFile) {
                                zip.file("av"+aid+getType(url),blobFile,{binary:true});
                                this.indexA++;
                                uFA.send_blob();
                            }else{
                                this.HaveDownFail = true;
                                Console_error("视频 https://www.bilibili.com/video/av"+aid+" 的封面下载失败了。。。");
                                this.indexA++;
                                uFA.send_blob();
                            }
                        });
                    },5);
                } else if(this.Mode == 2){
                    let url = this.imglist[this.indexA].url;
                    let name = this.imglist[this.indexA].name;
                    setTimeout(()=>{
                        loadToBlob(url,(blobFile)=>{
                            if (blobFile) {
                                zip.file(name,blobFile,{binary:true});
                                this.indexA++;
                                uFA.send_blob();
                            }else{
                                this.HaveDownFail = true;
                                Console_error("视频 https://www.bilibili.com/video/av"+aid+" 的封面下载失败了。。。");
                                this.indexA++;
                                uFA.send_blob();
                            }
                        });
                    },5);
                }
            }else{
                HTTPsend("https://api.bilibili.com/x/space/acc/info?mid="+uFA.uid,"GET","",(result)=>{
                    let rdata = JSON_parse(result);
                    if(rdata.code == 0){
                        this.name = rdata.data.name;
                        let name = this.name;
                        zip.generateAsync({type:"blob"}).then((content)=>{
                            // see FileSaver.js
                            let zipname = name+"_"+this.uid;
                            if(this.Mode == 0){
                                zipname += "_相册";
                            }else if (this.Mode == 1) {
                                zipname += "_视频封面";
                            }else if (this.Mode == 2){
                                zipname += "_头图及壁纸";
                            }
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
                            if(!this.HaveDownFail){
                                lists.Set("打包 "+zipname+".zip 完成。");
                                lists.BG("success");
                            }else{
                                lists.Set("打包 "+zipname+".zip 完成，但有些文件下载失败了，详细请查看控制台orz");
                                lists.BG("error");
                            }
                        });
                    }else{
                        Console_error(result);
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
