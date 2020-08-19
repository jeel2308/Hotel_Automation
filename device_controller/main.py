from bottle import route, run, abort, response
from gpio import LED, PWMLED
import json

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
    if switch_id not in switches:
        abort(406)

    switches[switch_id].toggle()
    return json.dumps({"switch": {switch_id: switches[switch_id].value}})


@route("/fan/<fan_id:int>/<value:float>")
def fan_controller(fan_id, value):
    if fan_id not in fans:
        abort(406)
    if 0 <= value <= 1:
        fans[fan_id].value = value
    else:
        abort(406)
    return json.dumps({"fan": {fan_id: fans[fan_id].value}})


@route("/stats")
def device_stats():
    switch_stats = {switch_id: switch.value for switch_id, switch in switches.items()}
    fan_stats = {fan_id: fan.value for fan_id, fan in fans.items()}
    body = json.dumps({"switch": switch_stats, "fan": fan_stats})
    response.headers["Cache-Control"] = "no-cache"
    response.headers["Content-Type"] = "application/json"
    return body


def start(debug=False):
    run(host="localhost", port=8080, debug=debug)


if __name__ == "__main__":
    start()
