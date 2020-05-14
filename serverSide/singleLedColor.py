#!/usr/bin/python3
from sense_emu import SenseHat
import json

sense = SenseHat()
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
orange = (255, 165, 0)
white = (255, 255, 255)
colorPicked = ()


data_file = open("singleLedColor.json", "r")
data_led = data_file.readline()
data_file.close()
data_led_json = json.loads(data_led)

if data_led_json["color"] == "red":
    colorPicked = red
elif data_led_json["color"] == "green":
    colorPicked = green
elif data_led_json["color"] == "blue":
    colorPicked = blue
elif data_led_json["color"] == "orange":
    colorPicked = orange
elif data_led_json["color"] == "white":
    colorPicked = white
else:
    colorPicked = (0, 0, 0)

sense.set_pixel(data_led_json["column"], data_led_json["row"], colorPicked)
