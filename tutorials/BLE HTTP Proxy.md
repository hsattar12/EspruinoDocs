<!--- Copyright (c) 2016 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission. -->
Bluetooth LE HTTP Proxies
=========================

<span style="color:red">:warning: **Please view the correctly rendered version of this page at https://www.espruino.com/BLE+HTTP+Proxy. Links, lists, videos, search, and other features will not work correctly when viewed on GitHub** :warning:</span>

* KEYWORDS: Module,Modules,BLE,Bluetooth,HTTP,HTTPS,Proxy,Proxies
* USES: Puck.js,BLE,Only BLE

The BLE standard provides an [HTTP Proxy](https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.http_proxy.xml)
service. If a device implements this service, it allows other BLE devices to connect to it and request Web Pages through it.

Currently the [Espruino Hub software](https://github.com/espruino/EspruinoHub) provides this service, and will run on a Raspberry Pi.

To use it:

* Install the [hub software](https://github.com/espruino/EspruinoHub) following the instructions
* Edit `config.json` and:
  * set `http_proxy` to `true`
  * add the addresses of your Puck devices to the `http_whitelist` section - this helps to stop unverified devices from accessing your internet connection (**although it is still possible for devices to spoof your MAC address**)
* Use the following code on your Puck:

```
NRF.requestDevice({ filters: [{ services: ['1823'] }] }).then(function(device) {
  require("ble_http").httpRequest(device, "pur3.co.uk/hello.txt", function(d) {
    print("GET:",JSON.stringify(d));
  });
});
```  

**Note:**

* This will connect to any device advertising itself as an HTTP proxy - you can use `NRF.connect` to connect to a device by its address.
* Currently the payload size is only **20 bytes**, which limits what you can send and receive!
