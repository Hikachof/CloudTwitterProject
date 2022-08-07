import {getPythonData, drawErr} from "./base.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UserData関連
//
const takeurl = "/getuserdata";
const takedata = {"id": "@enako_cos"};
getPythonData(takeurl, takedata, drawSuc_userdata, drawErr);

function drawSuc_userdata(response){
    const ad = response["alldata"];

    const elem_base = document.getElementById("maxdatas");
    const make_elem_br = function () { return document.createElement("br"); }

    // アイコン
    let elem_icon = document.createElement("div");
    elem_icon.className = "data icon";
    let elem_icon_img = document.createElement("img");
    elem_icon_img.src = "static/datas/Users/" + ad.id + "/" + ad.icon_path;
    elem_icon.appendChild(elem_icon_img);
    elem_base.appendChild(elem_icon);
    // ツイート情報
    let elem_twnum = document.createElement("div");
    elem_twnum.className = "data twnum";
    elem_twnum.innerText = "収集期間：" + ad.startdatetime + " > > > " + ad.enddatetime;
    elem_twnum.innerText += "総ツイート情報\n"
    elem_twnum.innerText += "ツイート数：" + ad.tweetcount + "\n";
    elem_twnum.innerText += "いいね数：" + ad.likecount + "\n";
    elem_twnum.innerText += "リツイート数：" + ad.retweetcount + "\n";
    elem_twnum.innerText += "リプライ数：" + ad.replycount + "\n";
    elem_base.appendChild(elem_twnum);
    // 名前やID
    let elem_name = document.createElement("div");
    elem_name.className = "data name";
    elem_name.innerText = " 名前：" + ad.name;
    let elem_id = document.createElement("div");
    elem_id.className = "data id";
    elem_id.innerText = " ID：" + ad.id;
    elem_base.appendChild(elem_name);
    elem_base.appendChild(elem_id);
    // よく呟くワード
    let elem_nwords = document.createElement("div");
    elem_nwords.className = "data words nwords";
    let elem_nwords_title = document.createElement("div");
    elem_nwords_title.style.cssText = "font-size: 14px";
    elem_nwords_title.innerText = "☆よく呟くワード";
    elem_nwords.appendChild(elem_nwords_title);
    for (let i = 0; i < ad.wordstop20.length; i++) {
        const w = ad.wordstop20[i];
        let elem_w_button = document.createElement("button");
        elem_w_button.id = "w_btn" + String(i);
        elem_w_button.innerText = w[0] + "：" + String(w[1].length);
        elem_w_button.addEventListener("click", function() {
            const takeurl = "/gettweets";
            const nums = w[1];
            const takedata = {"id": ad.id, "nums" : nums, "targetid": "nwords_s"};
            getPythonData(takeurl, takedata, drawSuc_tweets, drawErr);
        });
        elem_nwords.appendChild(elem_w_button);
        elem_nwords.appendChild(make_elem_br());
    }
    elem_base.appendChild(elem_nwords);
    // よく呟くワード（詳細）
    let elem_nwords_s = document.createElement("div");
    elem_nwords_s.className = "section_n";
    elem_nwords_s.id = "nwords_s"
    elem_base.appendChild(elem_nwords_s);

    // 好きなワード
    let elem_lwords = document.createElement("div");
    elem_lwords.className = "data words lwords";
    let elem_lwords_title = document.createElement("div");
    elem_lwords_title.style.cssText = "font-size: 14px";
    elem_lwords_title.innerText = "☆好きなワード";
    elem_lwords.appendChild(elem_lwords_title);
    for (let i = 0; i < ad.wordsliketop20.length; i++) {
        const l = ad.wordsliketop20[i];
        let elem_l_button = document.createElement("button");
        elem_l_button.id = "l_btn" + String(i);
        elem_l_button.innerText = l[0] + "：" + String(l[1].length);
        elem_l_button.addEventListener("click", function() {
            const takeurl = "/gettweets";
            const nums = l[1];
            const takedata = {"id": ad.id, "nums" : nums, "targetid": "lwords_s"};
            getPythonData(takeurl, takedata, drawSuc_tweets, drawErr);
        });
        elem_lwords.appendChild(elem_l_button);
        elem_lwords.appendChild(make_elem_br());
    }
    elem_base.appendChild(elem_lwords);
    // よく呟くワード（詳細）
    let elem_lwords_s = document.createElement("div");
    elem_lwords_s.className = "section_l";
    elem_lwords_s.id = "lwords_s"
    elem_base.appendChild(elem_lwords_s);
    // スコアボード
    let elem_score = document.createElement("div");
    elem_score.className = "data words scores";
    let elem_score_title = document.createElement("div");
    elem_score_title.style.cssText = "font-size: 14px";
    elem_score_title.innerText = "☆ツイートスコア";
    elem_score.appendChild(elem_score_title);
    elem_score.innerText += "・HOBBY：" + ad.score.hobby + "\n";
    elem_score.innerText += "・SEX：" + ad.score.sex + "\n";
    elem_score.innerText += "・JOB：" + ad.score.job + "\n";
    elem_score.innerText += "・LONELI：" + ad.score.loneli + "\n";
    elem_score.innerText += "・HOME：" + ad.score.home + "\n";
    elem_score.innerText += "・MENTAL：" + ad.score.mental + "\n";
    elem_base.appendChild(elem_score);
    //
    function addTWImg(className, src){
        let elem_t1 = document.createElement("div");
        elem_t1.className = className;
        let elem_t1_img = document.createElement("img");
        elem_t1_img.src = src;
        elem_t1.appendChild(elem_t1_img);
        elem_base.appendChild(elem_t1);
    }
    addTWImg("data twimg t1", ad.tweetgraph_year_path);
    addTWImg("data twimg t2", ad.tweetgraph_month_path);
    addTWImg("data twimg t3", ad.tweetgraph_week_path);
    addTWImg("data twimg t4", ad.tweetgraph_hour_path);
    addTWImg("data twimg t5", ad.tweetgraph_week_month_path);
    addTWImg("data twimg t6", ad.tweetgraph_hour_month_path);
    addTWImg("data twimg t7", ad.tweetgraph_hour_week_path);


    // Ajaxの呼び出しが成功したときに呼び出される関数
    function drawSuc_tweets(response){
        const wname = response["targetid"];
        const elem_nwords_s = document.getElementById(wname);
        const make_elem_br = function () { return document.createElement("br"); }
        // 取得したAlldataによって要素を追加する
        const tweets = response["tweets"];
        //console.log(tweets)
        while( elem_nwords_s.firstChild ){
            elem_nwords_s.removeChild( elem_nwords_s.firstChild );
        }
        const tweetnum = tweets.length;
        let count = 0;
        tweets.forEach(function (tweet) {
            count += 1;
            let elem_tw = document.createElement("div");
            elem_tw.className = "data words_s ";
            
            elem_tw.innerText += tweet["date"] + "：" + String(count) + "/" + String(tweetnum);
            elem_tw.innerText += "\n";
            elem_tw.innerText += tweet["tw"];
            elem_nwords_s.appendChild(elem_tw);
        });
    }
}