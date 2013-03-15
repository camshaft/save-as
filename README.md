save-as
======

Implementation of the W3C `saveAs()` interface.

Installation
------

    $ component install CamShaft/save-as

API
---
    var saveAs = require("save-as")
      , Blob = require("blob");

    var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});

    saveAs(blob, "hello world.txt");

Engines
-------

* [save-as-link](https://github.com/CamShaft/save-as-link)
* [save-as-fs](https://github.com/CamShaft/save-as-fs)
* [save-as-ms](https://github.com/CamShaft/save-as-ms)
* [save-as-swf](https://github.com/CamShaft/save-as-swf)

License
-------

MIT
