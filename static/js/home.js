import {getPythonData, drawErr, drawSuc} from "./base.js";

// ワードによる検索
const elem_word = document.getElementById("btn_usersearch_word")
elem_word.addEventListener("click", function() {
    const takeurl = "/searchtargetuser_word";
    const takedata = {"word" : document.getElementById("usersearch_word").value};
    getPythonData(takeurl, takedata, drawSuc, drawErr);
});

// フォロワーによる検索
const elem_follower = document.getElementById("btn_usersearch_follower")
elem_follower.addEventListener("click", function() {
    const takeurl = "/searchtargetuser_follower";
    const takedata = {"word" : document.getElementById("usersearch_follower").value};
    getPythonData(takeurl, takedata, drawSuc, drawErr);
});