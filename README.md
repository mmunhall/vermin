vermin
======

A simple project for the Raspberry Pi to notify when a vermin has been captured by a mousetrap.


Notes:
install os (raspian)
setup network config (etc/network/interfaces)
    auto lo

    iface lo inet loopback
    iface eth0 inet dhcp

    auto wlan0
    allow-hotplug wlan0
    iface wlan0 inet dhcp
    	wpa-ssid "ssid"
    	wpa-psk "password"

install node
install npm

