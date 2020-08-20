import argparse
import json
import textwrap
import sys

from .bottle import route, run, abort, response
from .gpio import LED, PWMLED

switches = {
    1: LED("GPIO5"),
    2: LED("GPIO6"),
    3: LED("GPIO13"),
    4: LED("GPIO19"),
    5: LED("GPIO26"),
}
fans = {1: PWMLED(17), 2: PWMLED(27)}


@route("/switch/<switch_id:int>")
def switch_controller(switch_id):
    """ Toggles stat of requested switch """
    if switch_id not in switches:
        abort(406)

    switches[switch_id].toggle()
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Content-Type"] = "application/json"
    return json.dumps({"switch": {switch_id: switches[switch_id].value}})


@route("/fan/<fan_id:int>/<value:float>")
def fan_controller(fan_id, value):
    """ Controls speed of fan in scale of 0 to 1 """
    if fan_id not in fans:
        abort(406)
    if 0 <= value <= 1:
        fans[fan_id].value = value
    else:
        abort(406)
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Content-Type"] = "application/json"
    return json.dumps({"fan": {fan_id: fans[fan_id].value}})


@route("/stats")
def device_stats():
    """ Returns JSON response of device stats """
    switch_stats = {switch_id: switch.value for switch_id, switch in switches.items()}
    fan_stats = {fan_id: fan.value for fan_id, fan in fans.items()}
    body = json.dumps({"switch": switch_stats, "fan": fan_stats})
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Content-Type"] = "application/json"
    return body


def start():
    """ Starts device controller API server """
    parser = argparse.ArgumentParser(
        prog="controller",
        description=textwrap.dedent(
            """
            This is a REST API server for Raspberry PI microcontroller 
            which provides simple interface to control devices 
            attached to the microcontroller.
            """
        ),
    )
    parser.add_argument(
        "-p",
        "--port",
        action="store",
        default=8080,
        type=int,
        help="Specify port no. for the server",
    )
    parser.add_argument(
        "-d", "--debug", action="store_true", help="Run server in debug mode."
    )
    args = parser.parse_args(sys.argv[1:])
    run(host="localhost", port=args.port, debug=args.debug)


if __name__ == "__main__":
    start()
