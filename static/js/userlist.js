import {getPythonData, drawErr} from "./base.js";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UserList関連
//
// AllDataをゲットした前回の場所
let endnum = 0;
// 新しくユーザーリストを追加して描画する
const elem_viewbutton = document.getElementById("viewbutton")
elem_viewbutton.addEventListener("click", function() {
    const takeurl = "/increment";
    const takedata = {"startnum" : endnum};
    getPythonData(takeurl, takedata, drawSuc_userlist, drawErr);
});
// Ajaxの呼び出しが成功したときに呼び出される関数
function drawSuc_userlist(response){
    //console.log(response["alldatas"])
    const elem_userlist = document.getElementById("userlist");
    const make_elem_br = function () { return document.createElement("br"); }
    // 取得したAlldataによって要素を追加する
    endnum = response["endnum"];
    let alldatas = response["alldatas"];
    //console.log(alldatas);
    alldatas.forEach(function (alldata) {
        let e_name = alldata.name;
        let e_id = alldata.id;
        let e_links = alldata.links;
        let e_wordstop20 = alldata.wordstop20;
        let e_wordsliketop20 = alldata.wordsliketop20;
        let e_score = alldata.score;
    
        if (e_wordstop20 == null || e_wordsliketop20 == null || e_score == null)
        {
            return;
        }
    
        let elem_base = document.createElement("article");
        elem_base.className = "css-inlineblock";
        elem_base.style.cssText = "background-color: #777777";
        //
        let elem_name = document.createElement("div");
        elem_name.className = "basic";
        elem_name.innerText = alldata.name;
        elem_base.appendChild(elem_name);
        //
        let elem_id = document.createElement("div");
        elem_id.className = "basic";
        elem_id.innerText = alldata.id;
        elem_base.appendChild(elem_id);
        elem_base.appendChild(make_elem_br());
        //
        if (e_links != null)
        {
            for (let i = 0; i < e_links.length; i++) {
                let link = alldata.links[i];
                let elem_link = document.createElement("div");
                elem_link.className = "basic";
                elem_link.innerText = link;
                elem_base.appendChild(elem_link);
            }
            elem_base.appendChild(make_elem_br());
        }
        //
        let elem_wordstop20 = document.createElement("div");
        elem_wordstop20.className = "basic";
        elem_wordstop20.appendChild(document.createTextNode("よく呟くワードトップ６"));
        elem_wordstop20.appendChild(make_elem_br());
        for (let i = 0; i < e_wordstop20.length; i++) {
            if (i >= 6)
            {
                break;
            }
            let words20 = e_wordstop20[i];
            //elem_wordstop20.innerText += words20;
            elem_wordstop20.appendChild(document.createTextNode(words20[0] + " : " + words20[1]));
            elem_wordstop20.appendChild(make_elem_br());
        }
        elem_base.appendChild(elem_wordstop20);
        
        //
        let elem_wordsliketop20 = document.createElement("div");
        elem_wordsliketop20.className = "basic";
        elem_wordsliketop20.appendChild(document.createTextNode("好きなワードトップ６"));
        elem_wordsliketop20.appendChild(make_elem_br());
        for (let i = 0; i < e_wordsliketop20.length; i++) {
            if (i >= 6)
            {
                break;
            }
            let words20 = e_wordsliketop20[i];
            //elem_wordsliketop20.innerText += words20;
            elem_wordsliketop20.appendChild(document.createTextNode(words20[0] + " : " + words20[1]));
            elem_wordsliketop20.appendChild(make_elem_br());
        }
        elem_base.appendChild(elem_wordsliketop20);
        //
        let elem_score = document.createElement("div");
        elem_score.className = "basic";
        elem_score.appendChild(document.createTextNode("つぶやきからの各スコア"));
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
