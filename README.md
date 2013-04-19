ninja-zwave
===========

Ninja Blocks driver to interface with Z-Wave devices.
Requires [libNBComms](https://github.com/ninjablocks/libNBComms) to be installed.

Steps to Install Z-Wave driver (Linux)
======================================

Install udev library and headers
--------------------------------
This library is compiled with Open Z-Wave to access the udev database and query sysfs.
82kB download, 475kB installed. (ubuntu)

    sudo apt-get install libudev-dev

Compile Z-Wave library
----------------------
(&lt;client> is /opt/ninja for the Ninja Block)

    cd <client>/drivers/ninja-zwave/lib/open-zwave/cpp/build/linux/
    make

Compile executable that uses Z-Wave library (ninjaZW)
-----------------------------------------------------
    cd <client>/drivers/ninja-zwave/lib/open-zwave/cpp/examples/linux/NinjaZW
    make

Enable ninja-zwave driver
-------------------------
    vim <client>/driver/ninja-zwave/index.js

Set enabled to true (using “i”)  “`const enabled = true;`”
Save “:w”
Quit “:q”

Restart ninjablock process
--------------------------
    sudo restart ninjablock

The client runs ninja-zwave driver javascript files which in turn spawns the ninjaZW executable.
ninjaZW uses the Z-Wave library to subscribe to power readings and relay them to ninja-zwave driver.
