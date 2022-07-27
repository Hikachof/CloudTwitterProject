#!/usr/bin/python3
#from crypt import methods
from email.quoprimime import body_check
from flask import Flask
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

folder_path = "/home/hikachof/ドキュメント/VSCode/Pythons/TwitterProject/Source/"
sys.path.insert(0, folder_path)
import General as g


debug = False

app = Flask(__name__)
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
        id = "@enako_cos"
        alldata = g.LoadData(f"damp/{id}", f"AllData_{id}")

        return render_template("userlist.html", alldatas=[alldata])

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