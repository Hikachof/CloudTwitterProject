import {getPythonData, drawErr, drawSuc} from "./base.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UserData関連
//
// クエリパラメータから取得する
let id = location.href.split("?id=")[1];
const takeurl = "/getuserdata";
const takedata = {"id": id};
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
    elem_twnum.innerText = "収集期間：" + ad.startdatetime + " > > > " + ad.enddatetime + "\n";
    elem_twnum.innerText += "総ツイート情報：" + "Fw:" + ad.followercount + "：" + "Fwr:" + ad.followcount + "\n";
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
    // Links
    const e_links = ad.links;
    let elem_links = document.createElement("div");
    elem_links.className = "data link"
    elem_links.innerText = "リンク\n"
    // Twitter Link
    let elem_link = document.createElement("a");
    elem_link.href = "https://twitter.com/" + ad.id;
    elem_link.role = "button";
    elem_link.innerText = "Twitterへ";
    elem_links.appendChild(elem_link);
    elem_links.appendChild(make_elem_br())
    if (e_links != null)
    {
        for (let i = 0; i < e_links.length; i++) {
            let link = ad.links[i];
            let elem_link = document.createElement("a");
            // 最初に存在しない場合はそれを追加する
            if (link.indexOf("http") == -1)
            {
                link = "https://" + link;
            }
            elem_link.href = link;
            elem_link.role = "button";
            elem_link.innerText = link;
            elem_links.appendChild(elem_link);
            elem_links.appendChild(make_elem_br())
        }
    }
    elem_base.appendChild(elem_links);
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
        const word = w[0];
        elem_w_button.id = "w_btn" + String(i);
        elem_w_button.innerText = w[0] + "：" + String(w[1].length);
        elem_w_button.addEventListener("click", function() {
            const takeurl = "/gettweets";
            const nums = w[1];
            const takedata = {"id": ad.id, "nums" : nums, "targetid": "nwords_s", "word": word};
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
        const word = l[0];
        elem_l_button.id = "l_btn" + String(i);
        elem_l_button.innerText = l[0] + "：" + String(l[1].length);
        elem_l_button.addEventListener("click", function() {
            const takeurl = "/gettweets";
            const nums = l[1];
            const takedata = {"id": ad.id, "nums" : nums, "targetid": "lwords_s", "word": word};
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
    elem_score_title.innerText = "☆ツイートスコア\n";
    elem_score.appendChild(elem_score_title);
    let elem_scorewords = document.createElement("div");
    elem_scorewords.className = "data words scorewords";
    let elem_scorewords_title = document.createElement("div");
    elem_scorewords_title.style.cssText = "font-size: 14px";
    elem_scorewords_title.innerText = "☆ツイートワード\n";
    elem_scorewords.appendChild(elem_scorewords_title);
    //
    let elem_scorewords_s = document.createElement("div");
    elem_scorewords_s.className = "section_score";
    elem_scorewords_s.id = "scorewords_s"
    elem_base.appendChild(elem_scorewords_s);
    //
    let scorecount = 0;
    for (let key in ad.score) 
    {
        if (key != "data")
        {
            let elem_score_button = document.createElement("button");
            elem_score_button.id = "score_btn" + String(scorecount);
            scorecount += 1;
            elem_score_button.innerText = key + "：" + ad.score[key];
            elem_score_button.addEventListener("click", function() {
                while( elem_scorewords.firstChild ){
                    elem_scorewords.removeChild( elem_scorewords.firstChild );
                }
                let scorewordcount = 0;
                let elem_scorewords_title = document.createElement("div");
                elem_scorewords_title.style.cssText = "font-size: 14px";
                elem_scorewords_title.innerText = "☆ツイートワード\n";
                elem_scorewords.appendChild(elem_scorewords_title);
                // データの中のワードを設定する
                for (let sw in ad.score["data"])
                {
                    // keyが含まれているものを描画する
                    if (sw.indexOf(key) != -1)
                    {
                        let elem_scoreword_button = document.createElement("button");
                        elem_scoreword_button.id = "scoreword_btn" + String(scorewordcount);
                        elem_scoreword_button.innerText = sw + "：" + ad.score["data"][sw]["score"] + "\n";
                        elem_scorewords.appendChild(elem_scoreword_button);
                        elem_scorewords.appendChild(make_elem_br());
                        scorewordcount += 1;
                        elem_scoreword_button.addEventListener("click", function() {
                            const takeurl = "/gettweets";
                            const nums = ad.score["data"][sw]["num"];
                            const takedata = {"id": ad.id, "nums" : nums, "targetid": "scorewords_s", "word": sw};
                            getPythonData(takeurl, takedata, drawSuc_tweets, drawErr);
                        });
                    }
                }
            });
            elem_score.appendChild(elem_score_button);
            elem_score.appendChild(make_elem_br());
        }
    }
    elem_base.appendChild(elem_score);
    elem_base.appendChild(elem_scorewords);
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
            
            elem_tw.innerText += tweet["date"] + "：" + String(count) + "/" + String(tweetnum) + "：" + response["word"];
            elem_tw.innerText += "\n";
            elem_tw.innerText += tweet["tw"];
            elem_nwords_s.appendChild(elem_tw);
        });
    }
}