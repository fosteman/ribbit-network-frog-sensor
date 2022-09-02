sudo apt update 
sudo apt upgrade -y
sudo apt install nginx hostapd dnsmasq net-tools git -y

# need latest node >v14
sudo apt-get install npm -y
sudo npm install -g n
sudo n stable
npm install pm2 -g

# Also need to install network-manager for nmcli and node-wifi to work.
# https://raspberrypi.stackexchange.com/questions/29783/how-to-setup-network-manager-on-raspbian/73816#73816

hash -r

echo "Prepping dnsmasq.conf"
sudo cp ./dnsmasq.conf /etc/dnsmasq.conf

#echo "Prepping nginx config"
#cp ./nginx.conf /etc/nginx/sites-enabled/default

echo "Prepping hostapd"
sudo rfkill unblock all
git clone https://github.com/oblique/create_ap
cd create_ap
sudo make install

#echo "Preparing frontend"
cd ../server
npm i
#cp -R ../server/dashboard/build/* /var/www/html/

