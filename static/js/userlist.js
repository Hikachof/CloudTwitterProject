import {getPythonData, drawErr} from "./base.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UserList関連
//

// AllDataをゲットした前回の場所
let endnum = 0;
// 新しくユーザーリストを追加して描画する
const elem_viewbutton = document.getElementById("viewbutton")
elem_viewbutton.addEventListener("click", function() {
    const takeurl = "/getalldata";
    const takedata = {"startnum" : endnum};
    getPythonData(takeurl, takedata, drawSuc_userlist, drawErr);
});
// 指定した順番で並び替える
const elem_btn_serach = document.getElementById("btn_nameserach");
elem_btn_serach.addEventListener("click", function() {
    let id = document.getElementById("nameserach").value;
    if (id[0] != "@")
    {
        id = "@" + id;
    }
    var takeurl = "/userdata?id=" + id;
    window.location.href = takeurl;
});
// 指定した順番で並び替える
const elem_btn_sort = document.getElementById("scoresort");
elem_btn_sort.addEventListener("click", function() {
    // スコアを得る
    const score_hobby = document.getElementById("score_hobby").value;
    const score_sex = document.getElementById("score_sex").value;
    const score_job = document.getElementById("score_job").value;
    const score_loneli = document.getElementById("score_loneli").value;
    const score_home = document.getElementById("score_home").value;
    const score_mental = document.getElementById("score_mental").value;

    var takeurl = "/userlist_sort";
    var takedata = {"hobby" : score_hobby, "sex" : score_sex, "job" : score_job, "loneli" : score_loneli, "home" : score_home, "mental" : score_mental};
    
    //console.log(takeurl);
    //window.open(takeurl);
    getPythonData(takeurl, takedata, drawSuc_userlist_sort, drawErr);
});
function drawSuc_userlist_sort(response){
    // 中身を削除してソートした中身に入れ替える
    const elem_userlist = document.getElementById("userlist");
    while( elem_userlist.firstChild ){
        elem_userlist.removeChild( elem_userlist.firstChild );
    }

    endnum = 0;
    const takeurl = "/getalldata";
    const takedata = {"startnum" : endnum};
    getPythonData(takeurl, takedata, drawSuc_userlist, drawErr);
}
// Ajaxの呼び出しが成功したときに呼び出される関数
function drawSuc_userlist(response){
    //console.log(response["alldatas"])
    const elem_userlist = document.getElementById("userlist");
    const make_elem_br = function () { return document.createElement("br"); }
    // 取得したAlldataによって要素を追加する
    endnum = response["endnum"];
    let alldatas = response["alldatas"];

    let count = 0;

    alldatas.forEach(function (alldata) {
        let e_name = alldata.name;
        let e_id = alldata.id;
        let e_wordstop20 = alldata.wordstop20;
        let e_wordsliketop20 = alldata.wordsliketop20;
        let e_score = alldata.score;
    
        let elem_base = document.createElement("a");
        elem_base.href = "/userdata?id=" + e_id;
        elem_base.role = "button";
        elem_base.className = "minidatas";
        if (count%2 == 0)
        {
            elem_base.style.cssText = "background: #31A9EE;";
        }
        else
        {
            elem_base.style.cssText = "background: #eee;";
        }
        count += 1;
        // Icon
        let elem_icon = document.createElement("div");
        elem_icon.className = "data icon";
        let elem_icon_img = document.createElement("img");
        elem_icon_img.src = "static/datas/Users/" + alldata.id + "/" + alldata.icon_path;
        elem_icon.appendChild(elem_icon_img);
        elem_base.appendChild(elem_icon);
        // 名前やID
        let elem_name = document.createElement("div");
        elem_name.className = "data name";
        elem_name.innerText = e_name;
        let elem_id = document.createElement("div");
        elem_id.className = "data id";
        elem_id.innerText = e_id;
        elem_base.appendChild(elem_name);
        elem_base.appendChild(elem_id);
        //
        let elem_sep = document.createElement("div");
        elem_sep.className = "data sep";
        elem_base.appendChild(elem_sep);
        
        //
        let elem_wordstop20 = document.createElement("div");
        elem_wordstop20.className = "data words normal";
        elem_wordstop20.appendChild(document.createTextNode("よく呟くワード"));
        elem_wordstop20.appendChild(make_elem_br());
        for (let i = 0; i < e_wordstop20.length; i++) {
            if (i >= 6)
            {
                break;
            }
            let words20 = e_wordstop20[i];
            elem_wordstop20.appendChild(document.createTextNode(words20[0] + " : " + words20[1].length));
            elem_wordstop20.appendChild(make_elem_br());
        }
        elem_base.appendChild(elem_wordstop20);
        
        //
        let elem_wordsliketop20 = document.createElement("div");
        elem_wordsliketop20.className = "data words like";
        elem_wordsliketop20.appendChild(document.createTextNode("好きなワード"));
        elem_wordsliketop20.appendChild(make_elem_br());
        for (let i = 0; i < e_wordsliketop20.length; i++) {
            if (i >= 6)
            {
                break;
            }
            let words20 = e_wordsliketop20[i];
            elem_wordsliketop20.appendChild(document.createTextNode(words20[0] + " : " + words20[1].length));
            elem_wordsliketop20.appendChild(make_elem_br());
        }
        elem_base.appendChild(elem_wordsliketop20);
        
        //
        let elem_score = document.createElement("div");
        elem_score.className = "data words score";
        elem_score.appendChild(document.createTextNode("ツイートスコア"));
        elem_score.appendChild(make_elem_br());
        let make_text_score = function(t) {
            elem_score.appendChild(document.createTextNode(t));
            elem_score.appendChild(make_elem_br());
        }
        make_text_score("HOBBY : " + e_score.hobby);
        make_text_score("SEX : " + e_score.sex);
        make_text_score("JOB : " + e_score.job);
        make_text_score("LONELI : " + e_score.loneli);
        make_text_score("HOME : " + e_score.home);
        make_text_score("MENTAL : " + e_score.mental);
        elem_base.appendChild(elem_score);
        //
        elem_userlist.appendChild(elem_base);
    });
}
getPythonData("/getalldata", {"startnum" : 0}, drawSuc_userlist, drawErr);