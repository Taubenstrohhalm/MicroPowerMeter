# MicroPowerMeter
 
 MicroPython scriptable, wifi enabled, dc-powermeter (36V x 15A ~ 500W). Build around espressif's ESP8266 soc and TI's INA260 current-sensor. Open Source Hard- & Software - for us to hack.   

#### status: bugy first prototyp ... build time: ~ 2h  ... cost: ~ 15 € 

*During the setup of a weathersation I was looking for a efficient way to monitor the power produced by a photovoltaic module. Had to be cheap, quick to build and fun to use. This is what I came up with. It is my first micropython project and I have never used java script before. So don't expect much and feel free to improve.* 

![header_image](/docs/images/header.png)
**Fig. 1: Header.** Download image as [[.png]]()[[.svg]]()

## 1. User Guide

The MicroPowerMeter (MPM) can be used, to measure voltages between 0-36 V, currents between 0+-15 A and both current, and voltage at the same time to measure the power consumed by a load or produced by a generator. **Figure 2** shows how to connect the device for each of the three cases. 

![header_image](/docs/images/measure.png)

**Fig. 2: Measuring: a) voltage, b) current c) power.** Download image as [[.png]]()[[.svg]]()

You can read the measured values on your phone or any wifi enabled device with a webbrowser. Alternativley you can send the values to another webserver and store them to be viewed from somewhere else. A third option is storing the data on the microcontoller to download them later (not jet implemented).

### 1.1 Turn on
You can turn on the MPM by connecting it to a 5V batterypack or a phonecharger. There is no on/off switch, it will turn on immediatly and run the boot.py script. 

### 1.2 Connect
During the boot section the MPM exceptcs a wifi device to connect to the wifi access point with the ssid: "MicroPowerMeter". The password can be found/changed in the boot.py file. *Would be nice if it tried to log in to the last/known wifi network first. Anyone keen to implement that?* 

Once your phone is connected you can open a browser and enter http://192.168.4.1/ in the url-field. 
A get-request for the file index.html will be sent from your phones browser to the microcontroller. The microcontroller resonds by sending back the requested file. In the header section of the index.html file a few other files (.css and .js) are requested and will be send to your browser. When all files are transfered an interval function triggers a get-request every 500ms asking the microcontroller for new sensor data. Once received the ui will update.  

![circuit](/docs/images/ui_preview.png)

# 2. Specifications & Accurency

### - ESP8266 - Microcontroller 
- Vcc = 5V  - so you can use your USB powerbank as supply  
- 4MB Memory - to store captured data (csv/txt)

### - INA260 - Integrated current sensor 
- U_sens = 0 - 36V  
- I_sens = 0 ± 15A + - 1.5mA  
- P_max = U_sens_max * I_sens_max = 540W 

# 3. Build your own - DIY

Building this powermeter will not only give you a handy tool for your electronic projects, it will also help you understand the concepts of current, voltage & electrical power, along with the basics of IoT-devices, sensors and microcontrollers. 

## 3.1 Get the hardware  

All the required parts are listed in the bill of materials (BOM) below. Additionaly you will need a 5V powerbank, a wifi enabled device with some kind of webbrowser and some fillament for the enclosure. 

|Quantity|Part|Image|Description|Price|Shop|
|---|---|---|---|---|---|
1| D1 mini|![d1mini](/docs/images/BOM/DEBO_D1MINI_8266_01.png)| ESP8266 microcontroller on a breakout-board with serial to usb interface|4,99€||
1| D1z proto|![d1zProto](/docs/images/BOM/D1Z_PROTO_01.png)|prototyping board for the D1 mini *|0,99€||
1| INA260|![d1zProto](/docs/images/BOM/INA260.jpg)|High-Side current sensor devboard. Designed by adafruit.|9,00€
3| J_1-3|![d1zProto](/docs/images/BOM/goldCon4mm.png)|4mm gold connector female||
1| J4 || 8 x Pinheader male|
1| J5 || wire|  
|||||moneys
Download BOM_v0.10 as [.xls][.odt]

     * there are different versions of this board available. Only the version shown in figure xx works for this project. You can also use standard prototyping board and cut it to size. 

### 3.1.2 Schematic  

Figure xx shows the schematics for the MicroPowerMeter. The rectangle on the left labeled Wemos D1 mini is the dev board for the esp8266. On this printed circuit board (PCB) sits the ESP8266, a wifi antenna, a reset button, a micro USB-port and the integrated circuit (IC) for a serial connection to your computer.
On the right you see the breakout board for the current sensor (INA260). In this tiny IC is where the magic happens. You can find a full schematic of this breakoutboard at: xxx.

![circuit](/hardware/mpm_schem.png)
Fig. X: Schematic. Download image as [[.png]]()[[.pdf]]()[[.fzz]]()

### 3.1.3 Soldering

Assembling the electonics requires some soldering. If you have never soldered before check out this [awesome soldering guide](https://learn.adafruit.com/adafruit-guide-excellent-soldering) by adafruit.

#### 2.2.1. Wemos D1 mini
Soldere the two female pin-headers to the wemos D1 mini as shown in figure xx.

#### 2.2.2. Sensor board
Unfortunatly the sensor can not directly be connected to the Wemos D1 mini. A adapter board is needed. The following pictures show the soldering process of the adapter board. *If you are familiar with KiCAD, or any other e-cad software please consider having a look at the to-do list.*
This might be the most difficult part, (you might want to get a drink before you start.) 

![circuit](/docs/images/assembly_step_by_step_v1.1.png)

##### 1. blabla
##### 2. blabla
##### 3. blabla
##### 4. blabla



#### 2.2.3 Putting the parts together

Now you can just stack the adapter board with the current sensor onto the wemos d1 mini.

#### 2.3 Enclosure

If you have a 3D-printer or the fab-lab is not to far you can print an enclosure for your device. You find the .stl files in the hardware directory of this repo. There is also a Blender file, in case you want to add custom text. You can find a description on how to do that [here](link/to/wiki).

![d1mini](/hardware/enclosure.png)
Download CAD-file as[[.stl]]() [[.blend]](/hardware/enclosure.blend)


## 3. Software  

Micropython Firmware  
RESTfull Webserver 
 - d3

# Setting up a integrated development environment (IDE) for MicroPython

In order to tell the microcontroller what we want it to do we need to write some code and store it on the microcontroller. We will be using MicroPython as the programming language and Pymakr to communicate with the microcontroller.  
Pymakr is a plugin, available for the code editors Atom and VisualStudio Code (VS-code). Both are free and Open Source and available for Windows, Linux and Mac. This guide will show you how to set up the IDE on a Microsoft Windows using visual studio code.  

## 1. Download & Install VS-code or atom

## 2. Install pymakr plugin
Open VS-code und navigate to the extensions panel. Search for pymakr and click install.

## 3. Flash ESP8266 with MicroPython Firmware 
If this is your first time using micropython please have a look at the more [general guide](https://docs.micropython.org/en/latest/esp8266/tutorial/intro.html).

### 3.1 Download MicroPython firmware.
Search for the latest stable firmware version for the ESP8266 on MicroPythons [Download page](http://micropython.org/download#esp8266) and download the .bin file.  

### 3.2 Download & install esptool
In a terminal type:  
```
$ pip install esptool
``` 

### 3.2 Flashing the firmware file to the MCU

Connect the MCU to your computer and search for the serial port it got connected to.

```
$ dmesg | grep tty  
[   36.460270] usb 3-1: cp210x converter now attached to ttyUSB0
```

What we are looking for is the "ttyUSB0" (on Windows this should be something like "COM0", you can look it up in the device manager)

Now we will first erase the flash of the MCU by typing:
```
esptool.py --port /dev/ttyUSB0 erase_flash
```
Flash the firmware-file to the MCU by typing:

```
esptool.py --port /dev/ttyUSB0 --baud 460800 write_flash --flash_size=detect 0 ~/Downloads/esp8266-20191220-v1.12.bin
```
make sure to replace the serial-port and filename if you downloaded a newer version.

### 3.3 Putting the code on the MCU

Clone or download this repository and open the folder in your editor (VS-code/atom). Open the pymakr.conf file and change the following two lines:

```
"address": "/dev/ttyUSB0",
"sync_folder": "software",
```
The first line tells pymakr on which serial-port to look for the MCU. The second line makes sure only the software files will be uploaded to the MCU.   
Press the "Pycom Console" button at the bottom of your editor to connect to the MCU. (check if the pymakr-plugin is enabled, if you can't find it).  
Then press the "upload" button. After the upload process is done, the MCU will reboot and you can access the webserver by connecting to the WIFI access point called "MicroPowerMeter". The password is "ohms_law". You can change the ssid and the pwd in the file "/Software/boot.py" if you like.

## use - study - share - improve 

Have a look at the **to do** and **wish list**'s. If you feel like one of the tasks is yours, you can clone this repo, commit your changes and post a pull request. So fare everything you can find in this repo has been created using free & open source software. If you contribute, it would be great if you follow this pattern, so everybody can learn and contribute from/to your improvements. 

If you have questions or ideas for the wish list please post an issue.

### To Do's:
+ Documentation
  + write/make graphics for assembly instructions -wip
  + write/make graphics for user guide + add to webserver
  + add missing parts (D1z proto, 4mm gold connector) to fritzing library & update layout.png
  + write guide on how to send, store and graph measured data on external webserver (for example via mqtt, influxDB, Grafana)
  + write guide on how to use boolean operators in blender to change the text 
+ MicroPython Firmware
  + use server-sent-events or websockets for sending sensor-data
  + add code for status led's (hearbeat on connect, blink while waiting for connection, etc.)
  + make webserver asynchron
  + allow client to cache static files - to reduce traffic/load time on second connection
  + add proper gzip-ing
  + move sensor reading away from the get-request -> setup a timer
  + write data to .csv file
  + add proper logging
  + function complete library for ina260
+ Frontend
  + integrate webREPL in UI
  + improve UI (please post inspiration in issue
  + add user guide
+ Hardware
  + design stackable enclosure 
  + design custom pcb for INA260 to replace D1z proto and adafruit INA260 (reduce cost, size and assembly time) 

### Wishes:
 + add timeseries of measurements in UI (something like this: https://bl.ocks.org/boeric/6a83de20f780b42fadb9 or https://observablehq.com/@bartok32/real-time-area-chart)


