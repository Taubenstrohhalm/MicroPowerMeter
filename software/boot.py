import gc
import micropython
gc.collect()
import network
gc.collect()
import webrepl
gc.collect()
import logging
gc.collect()


# set ssid and password
ssid = 'MicroPowerMeter' 
password = 'ohms_law!'

# setup wifi in access point mode
ap = network.WLAN(network.AP_IF)
ap.active(True)
ap.config(essid = ssid, authmode=network.AUTH_WPA_WPA2_PSK, password = password)

while ap.isconnected() == False:
    pass

print('Connection')
print(ap.ifconfig())
gc.collect()

try:
    webrepl.start()
    #logging.info('start webrepl')
except:
    pass
gc.collect()