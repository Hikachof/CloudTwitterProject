// Pythonの関数をURLで呼び出してその結果を取得する
function getPythonData(takeurl, takedata, sucfunction, errfunction){
    var post = $.ajax({
        type: "POST",
        url: takeurl,
        data: takedata, // post a json data.
        async: false,
        dataType: "json",
        success: sucfunction, 
        error: errfunction
    })
}
// Ajaxの呼び出しが失敗したときに呼び出される関数
function drawErr(error){
    console.log(error);
}
function drawSuc(response){
    console.log(response);
}

export {getPythonData, drawErr, drawSuc};