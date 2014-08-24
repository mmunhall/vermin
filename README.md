TODO: Install gpio-admin
TODO: Update this doc with reference to setup gist.

vermin
======

A simple project for the Raspberry Pi to notify when a vermin has been captured by a mousetrap.


Notes:
install os (raspbian)

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
    wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    sudo dpkg -i node_latest_armhf.deb

install npm
    installed with node - nothing to do

install vermin dependencies
    cd [vermin root]
    npm install


TODO:
    * Test, test, test. It's always tests.
    * Add option to send SMS
