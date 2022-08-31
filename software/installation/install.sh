sudo apt update 
sudo apt upgrade -y
sudo apt install nginx hostapd dnsmasq net-tools python3-acme python3-certbot python3-mock python3-openssl python3-pkg-resources python3-pyparsing python3-zope.interface python3-certbot-nginx git -y

# need latest node >v14
sudo apt-get install npm
sudo npm install -g n
sudo n stable

echo "Prepping dnsmasq.conf"
cp ./dnsmasq.conf /etc/dnsmasq.conf

echo "Prepping nginx config"
cp ./nginx.conf /etc/nginx/sites-enabled/default

git clone https://github.com/oblique/create_ap
cd create_ap
sudo make install

