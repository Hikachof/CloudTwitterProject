#!/usr/bin/python3
#from crypt import methods
from email.quoprimime import body_check
from socket import IP_DROP_MEMBERSHIP
from flask import Flask, jsonify, make_response
from flask import render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

import subprocess
import time
import pytz
import cgi
import json
import sys
import os
import urllib.parse
import glob

folder_path = "/home/hikachof/ドキュメント/VSCode/Pythons/TwitterProject/Source/"
sys.path.insert(0, folder_path)
import General as g


debug = False

app = Flask(__name__)
# 文字化け禁止
app.config['JSON_AS_ASCII'] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///Twitter.db"
# よくわからん警告文の解除
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


# ツイート保留情報
class TwitterModel(db.Model):
    #__tablename__ = "post"
    # おそらく使用する変数の定義
    id = db.Column(db.Integer, primary_key=True)
    # 実際に行うツイート内容
    tw = db.Column(db.String(300), nullable=False)

# ツイートを行うための情報
class TwitterTimeModel(db.Model):
    #__tablename__ = "post"
    # おそらく使用する変数の定義
    id = db.Column(db.Integer, primary_key=True)
    tw = db.Column(db.String(300), nullable=False)
    # ツイートを行う時間
    tweettimetype = db.Column(db.Integer, nullable=False)

# テーブルの生成
db.create_all()


@app.route("/", methods=['GET'])
def home():
    if request.method == 'GET':
        return render_template("home.html")

@app.route("/tweetlist", methods=['GET'])
def tweetlist():
    if request.method == 'GET':
        # query内のデータすべてを得る
        posts = TwitterModel.query.all()
        # 取ってきた要素を利用してHTMLを表示する
        return render_template("tweetlist.html", posts=posts)


@app.route("/tweetlist/<int:id>", methods=['POST'])
def tweetlist_index(id):
    if request.method == 'POST':
        # 指定した時間でツイートするように登録する
        if request.form.get('dotweet'):
            targettweet = TwitterModel.query.get(id)
        
            # 時間タイプ
            timetype = request.form.get('timesel')
            # 
            posttweet = TwitterTimeModel(tw=targettweet.tw, tweettimetype=timetype)
            db.session.add(posttweet)
            db.session.delete(targettweet)
            db.session.commit()

        # 指定したツイートを削除する
        if request.form.get('dodelete'):
            targettweet = TwitterModel.query.get(id)
            db.session.delete(targettweet)
            db.session.commit()
            

        #posts = TwitterModel.query.all()
        return redirect("/tweetlist")

# ツイートの実行一覧
@app.route("/alltweet", methods=['GET'])
def alltweet():
    if request.method == 'GET':
        # query内のデータすべてを得る
        posts = TwitterTimeModel.query.all()
        # 取ってきた要素を利用してHTMLを表示する
        return render_template("alltweet.html", posts=posts)

@app.route("/alltweet/<int:id>", methods=['POST'])
def alltweet_index(id):
    if request.method == 'POST':
        # 指定したツイートを削除する
        if request.form.get('dodelete'):
            targettweet = TwitterTimeModel.query.get(id)
            db.session.delete(targettweet)
            db.session.commit()
            

    return redirect("/alltweet")

# create?tw=""
# というようにURLを指定すると引数として取得できる
@app.route("/addtweet", methods=['GET'])
def addtweet():
    if request.method == 'GET':
        #tw = "こんにちは"
        req = request.args
        tw = req.get("tw")
        #print(tw)
        # デコード
        tw = urllib.parse.unquote(tw)
        
        if tw:
            post = TwitterModel(tw=tw)

            # 追加して
            db.session.add(post)
            # 変更の適応
            db.session.commit()
        return redirect("/tweetlist")


# ユーザーリストを表示する
@app.route("/userlist", methods=['GET'])
def userlist():
    if request.method == 'GET':
        count = 0
        alldatas = []
        files = glob.glob("static/datas/Users/@*")
        for fi in files:
            id = fi.split("/")[-1]
            alldata = g.GetAllUserData(id)
            if alldata and alldata != "empty":
                alldatas.append(alldata)
                count += 1;
                if count > 29:
                    break;
        return render_template("userlist.html", alldatas=alldatas)

@app.route("/userdata", methods=['GET'])
def userdata():
    if request.method == 'GET':
        alldata = g.GetAllUserData("@enako_cos")
        return render_template("userdata.html", alldata=alldata)

#===================================================================================================================
#== テストサイト
#===================================================================================================================
@app.route("/selection", methods=['GET'])
def selection():
    if request.method == 'GET':
        return render_template("selection.html")
#===================================================================================================================
#== AjaxによるJSからの呼び出し関数（というかAPIというべきか）
#===================================================================================================================
# 初めから３０ずつ取れるし、指定した場所から開始することもできる
# endnumによって前回の終了地点を得ることによってそこからの続きを得ることができる
@app.route("/increment", methods=["POST"])
def GetAllData():
    # JSからの変数を取得している
    req = request.form
    startnum = int(req["startnum"])
    # 
    alldatas = []
    files = glob.glob("static/datas/Users/@*")
    count = 0
    endnum = 0
    #for i,fi in enumerate(files):
    maxnum = len(files)
    for i in range(startnum, maxnum):
        fi = files[i]
        endnum = i
        id = fi.split("/")[-1]
        alldata = g.GetAllUserData(id)
        if alldata and alldata != "empty":
            alldatas.append(alldata)
            count += 1;
            if count > 30:
                break;

    res = {"alldatas": alldatas, "endnum": endnum+1}
    return jsonify(res)

#===================================================================================================================
#== 使いやすい関数
#===================================================================================================================

# DB内のツイート予定のデータから現在ツイートすべきツイートを取得する
# 取得されたツイートはDB内から削除される
def GetDBTweets(maxgetnum):
    # 現在の時間から適切なTimeTypeを導く
    dt_now = datetime.now()
    nowtimetype = int(dt_now.hour/3)

    # 現在ツイートすべきツイートを取得
    tws = []
    count = 0
    posts = TwitterTimeModel.query.all()
    for post in posts:
        # 時間がマッチしているツイートの取得
        if post.tweettimetype == 8 or post.tweettimetype == nowtimetype:
            tws.append(post.tw)
            # ツイートの削除
            db.session.delete(post)
            count += 1
            # ツイート可能な個数を超えた場合にはそこで終了する
            if count >= maxgetnum:
                break
    db.session.commit()
    return tws



if __name__ == '__main__':
    if not debug:
        # 本番
        from waitress import serve
        serve(app, host='127.0.0.1', port=5000)
    else:
        # テストらしい
        app.run(host='127.0.0.1', port=5000)