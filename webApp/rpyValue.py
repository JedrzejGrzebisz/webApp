#!/usr/bin/python3
from sense_emu import SenseHat
import json
import time

sense = SenseHat()
data_dict = {"Roll": 0, "Pitch": 0, "Yaw": 0}

try:
    while True:
        radians = sense.get_orientation_radians()
        data_dict['Roll'] = radians['roll']
        data_dict['Pitch'] = radians['pitch']
        data_dict['Yaw'] = radians['yaw']
        data_json = json.dumps(data_dict)

        try:
            data_file = open("rpyValue.json", "w")
            data_file.write(data_json)
        except:
            print("Write Error")
        finally:
            data_file.close()

        print(data_json)
        time.sleep(0.05)
except KeyboardInterrupt:
    pass
