# Device Controller

This is a REST API server for Raspberry PI microcontroller which provides simple interface to control devices attached to the microcontroller.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need `python 3.x` installed

### Installing

After cloning/downloading this repository you can install device-controller python package using following commands.

```console
python setup.py install
```

### Running

If you have path variables setup correctly, you can run this API server by `controller` command. If you want to run it as daemon then use `controller &` command.

## Deployment

These instructions will help you deploy this API server to actual Raspberry Pi. You need to install `gpiozero` package which provides utility to control GPIO pins of the board.

First, update your repositories list:
```console
pi@raspberrypi:~$ sudo apt update
```
Then install the package for Python 3:
```console
pi@raspberrypi:~$ sudo apt install python3-gpiozero
```

Now, you can install device-controller as stated above. You can also run this program at startup automatically using `crontab` utility.

