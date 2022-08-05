#!/usr/bin/python3
import subprocess
import time
from datetime import datetime
import cgi
import json
import sys
import os
import pyperclip
import urllib.parse
import concurrent.futures
import random

import app
from LineSystem import LineSystem
folder_path = "/home/hikachof/ドキュメント/VSCode/Pythons/TwitterProject/Source/"
sys.path.insert(0, folder_path)
from AutoTweetGetter import ScrayTwitter


def copy(s):
    if sys.platform == 'win32' or sys.platform == 'cygwin':
        subprocess.Popen(['clip'], stdin=subprocess.PIPE, encoding='utf8').communicate(s)
    else:
        raise Exception('Platform not supported')


def DoPowerShell(command):
    #os.system("powershell -Command " + command)
    #subprocess.call(command)
    subprocess.run(f"/bin/bash -c '{command}'", shell=True)

# サーバーを立ち上げて、そのURLを返す
def OpenServer():
    DoPowerShell("export FLASK_APP=app")
    DoPowerShell("gnome-terminal -- flask run")
    #
    time.sleep(1)
    DoPowerShell("gnome-terminal -- ngrok http 5000")    
    time.sleep(1)
    DoPowerShell("sh clipserverurl.sh")
    time.sleep(1)


    ms = pyperclip.paste()
    return ms.replace("\n", "")

# LINEにメッセージを送る
def DoLineMessage(mes):
    linesys = LineSystem()
    linesys.DoMessage(mes)

# 現在アクティブなトレンドのツイートを作成する
def CreateTrendTweet(acount):
    GT = ScrayTwitter(acount)
    tws = GT.MakeActiveTweet(True, 10)
    GT.Quit()
    return tws

# ツイートの配列をデータサーバーに記録する
def AddDBTweets(tws, serverurl):
    #subprocess.run("@echo off")
    print("ADDDBTweets")
    for tw in tws:
        print(tw)
        # エンコードをして適切に送られるようにする
        tw = urllib.parse.quote(tw)
        addr = f"{serverurl}/addtweet?tw={tw}"
        #DoPowerShell(["curl", addr], shell=True, encoding='utf8')
        DoPowerShell(f"curl {addr}")
    #subprocess.run("@echo on")

# 指定したアカウントで指定したツイートを行う
def DoTweets(acount, tws):
    #print("DoTweet:")
    #print(tws)
    GT = ScrayTwitter(acount)
    for tw in tws:
        #print(tw)
        GT.DoTweet(tw)
    GT.Quit()


# 情報収集用アカウント
DAcount = "Dummy___Plug"
# ツイート可能なアカウント
MajorAcounts = ["Aun114514", "lepumoshion", "hikarutanden"]

# ツイートの作成とDBへの追加
def Routine01(serverurl):
    while True:
        print("Routine01")
        tws = CreateTrendTweet(DAcount)
        AddDBTweets(tws, serverurl)
        time.sleep(60*60*3)

# ツイートの取得とツイートの実行
def Routine02():
    while True:
        print("Routine02")
        # ツイートの取得とツイート
        for ac in MajorAcounts:
            #print("AC:" + ac)
            tws = app.GetDBTweets(1)
            #print("TWS")
            #print(tws)
            if len(tws) > 0:
                DoTweets(ac, tws)
        time.sleep(60*30 + int(random.uniform(0, 120)))
        

if __name__ == '__main__':
    if True:
        serverurl = OpenServer()
        print("SERVERURL : " + serverurl)
        DoLineMessage(serverurl)

        # サブルーチンによる並行処理
        #executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)
        #executor.submit(Routine01, serverurl)
        #executor.submit(Routine02)