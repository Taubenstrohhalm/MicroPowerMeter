from machine import Pin, I2C
#import Signal
gc.collect()
import uos as os
gc. collect()
#import uzlib
#gc.collect()
import usocket as socket
gc. collect()
import ujson
gc.collect()
import random
#from ina260 import INA260
from ina219_m import INA219
gc. collect()


# configure builtin LED pin as output-pin und turn it on (low-active)
led_pin = Pin(2,Pin.OUT)
led_pin.off()

#sensor_data = [2] # array to store sensor data
#read_sensor_interval = 200 # interval at which to update the sensor data

i2c = I2C(sda = Pin(4), scl = Pin(5))
#ina = INA260(i2c)
ina = INA219(0.1,i2c)
ina.configure()


webroot = 'www'
compressed = False

def return_file(file_path):
  try:
    with open(file_path, 'r') as file:
      content = file.read()
    #print('Returning {}'.format(file_path))
    return content
  except:
    print('Error reading file')

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)

while True:
  conn, addr = s.accept()
  print('Got a connection from %s' % str(addr))
  request = conn.recv(1024)
  request = request.decode('utf-8')
  headerFields = request.split('\r\n')

  requested_file = webroot + headerFields[0].split()[1]
  print('Requested resource: {}'.format(requested_file))

# check if the requested file exists 
  try:
    os.stat(requested_file)
    fexists = True
  except:
    #logging.debug('the requested file does not exist')
    fexists = False

# assign media type (mime_type) to requested file
  if fexists == True:
    file_type = requested_file.split('.')[-1]
    # check if a gziped version of the file was requested
    if file_type == 'gz':
      file_type = requested_file.split('.')[-2]
      compressed = True
    else:
      compressed = False
    if file_type == 'css':
      mime_type = 'text/css'
    elif file_type == 'svg':
      mime_type = 'image/svg+xml'
    elif file_type == 'js':
      mime_type = 'text/javascript'
  #print('Mime_type: {}'.format(mime_type))

# handle get request for / (index.html)
  if headerFields[0] == 'GET / HTTP/1.1':
    conn.send('HTTP/1.1 200 OK\n')
    conn.send('Content-Type: text/html\n')
    conn.send('Connection: close\n\n')
    conn.sendall(return_file('/' + webroot + '/index.html'))
    conn.close()

# handle get requests for all other file types (css / js / images)
  elif fexists == True:
    conn.send('HTTP/1.1 200 OK\n')
    conn.send('Content-Type:' + mime_type + '\n')
    if compressed == True:
      conn.send('Content-Encoding: gzip\n')
    conn.send('Connection: close\n\n')
    gc.collect()
    conn.sendall(return_file(requested_file))
    conn.close()
    gc.collect()

# handle get request for updating the sensor data
  elif headerFields[0] == 'GET /update HTTP/1.1':
    voltage = ina.voltage()*1000 # ina219 returns V while ina260 returns mV 
    current = ina.current()
    power = ina.power()
    # uncomment the following lines to test without sensor
    # voltage = random.getrandbits(15)
    # current = random.getrandbits(14)
    # power = voltage * current
    conn.send('HTTP/1.1 202 OK\n')
    conn.send('Content-Type: application/json\n')
    conn.send('Connection: close\n\n')
    conn.send(ujson.dumps({ "voltage":voltage,
                            "current":current,
                            "power":power
                            }))
    conn.close()

  else:
    conn.send('HTTP/1.1 404 ERROR\n')
    conn.close()