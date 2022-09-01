killall create_ap

sudo service dnsmasq restart
#sudo service nginx restart

# sudo service systemd-resolved stop
# sudo ifconfig wlan0 down

sudo create_ap -n wlan0 FROG --no-virt --no-dnsmasq --redirect-to-localhost --daemon

sudo ifconfig wlan0 192.168.12.1

sudo pm2 start ../server/build/index.js
