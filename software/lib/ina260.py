"""MicroPython library for the INA260 sensor.
This library supports the INA260 sensor from Texas Instruments with
MicroPython using the I2C bus.
"""
from micropython import const

_REG_CURRENT = const(0x01) 
_REG_BUSVOLTAGE = const(0x02)
_REG_POWER = const(0x03)

__ADDRESS = const(0x40)

class INA260:
    def __init__(self, i2c, address=__ADDRESS):
        self._i2c = i2c
        self._address = address

    def current(self):
        register_bytes = self._i2c.readfrom_mem(self._address, _REG_CURRENT, 2)
        register_value = int.from_bytes(register_bytes, 'big')
        if register_value > 32767:
            register_value -= 65536
        return register_value * 1.25

    def voltage(self):
        register_bytes = self._i2c.readfrom_mem(self._address, _REG_BUSVOLTAGE, 2)
        register_value = int.from_bytes(register_bytes, 'big')
        if register_value > 32767:
            register_value -= 65536
        return register_value * 1.25

    def power(self):
        register_bytes = self._i2c.readfrom_mem(self._address, _REG_POWER, 2)
        register_value = int.from_bytes(register_bytes, 'big')
        if register_value > 32767:
            register_value -= 65536
        return register_value * 10
