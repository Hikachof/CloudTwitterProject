
from linebot import LineBotApi
from linebot.models import TextSendMessage

YOUR_CHANNEL_ACCESS_TOKEN = '/2YFeJPd3GXgiUG1k7YUL1qPOUt25293NxbfrVBjFkNITLvBaWwpwwq2wbctGIc3qGLCDlRJGIWqoVL9nWqqk08xsdZrn3ZsNRwHHYUUoKnstEQB62eMJHdOJUFFVLHhcm7EnQ0TW/e6bezptzd4dwdB04t89/1O/w1cDnyilFU='
line_bot_api = LineBotApi(YOUR_CHANNEL_ACCESS_TOKEN)

class LineSystem:
    def DoMessage(self, message):
        user_id = "U0755909b2e06e6857b1923f025b93647"
        messages = TextSendMessage(text=message)
        line_bot_api.push_message(user_id, messages=messages)