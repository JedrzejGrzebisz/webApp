#!/usr/bin/python3
from sense_emu import SenseHat
import json

sense = SenseHat()
text_color_list = []

data_file = open("textLedColor.json", "r")
data_led = data_file.readline()
data_file.close()
data_led_json = json.loads(data_led)
if data_led_json["color"] == "red":
    text_color_list = [255, 0, 0]
elif data_led_json["color"] == "green":
    text_color_list = [0, 255, 0]
elif data_led_json["color"] == "blue":
    text_color_list = [0, 0, 255]
elif data_led_json["color"] == "orange":
    text_color_list = [255, 165, 0]
elif data_led_json["color"] == "white":
    text_color_list = [255, 255, 255]
else:
    text_color_list = [0, 0, 0]

sense.show_message(str(data_led_json["text"]), text_colour=text_color_list)
