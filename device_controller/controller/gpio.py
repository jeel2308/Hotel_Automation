try:
    import gpiozero
except ImportError:
    gpiozero = None


class DummyLED:
    def __init__(self):
        self._value = 0

    def toggle(self):
        if self._value:
            self._value = 0
        else:
            self._value = 1

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, value):
        self._value = value


def LED(pin):
    return gpiozero.LED(pin) if gpiozero else DummyLED()


def PWMLED(pin):
    return gpiozero.PWMLED(pin) if gpiozero else DummyLED()
