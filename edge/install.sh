# check for keys and certs
if [ ! -f /home/pi/certs/Amazon-root-CA-1.pem ]; then
	echo 'Missing /home/pi/certs/Amazon-root-CA-1.pem'
	exit 1;
fi
if [ ! -f /home/pi/certs/device.pem.crt ]; then
	echo 'Missing /home/pi/certs/device.pem.crt'
	exit 1;
fi
if [ ! -f /home/pi/certs/private.pem.key ]; then
	echo 'Missing /home/pi/certs/private.pem.key'
	exit 1;
fi
if [ ! -f /home/pi/cs147-synqify-proj/edge/spotify_appkey.key ]; then
	echo 'Missing /home/pi/cs147-synqify-proj/edge/spotify_appkey.key'
	exit 1;
fi

apt-get -y update
apt-get -y upgrade
apt-get -y install cmake libssl-dev

# python dependencies
apt-get -y install python3 python3-pip virtualenv
virtualenv /home/pi/cs147-synqify-proj/edge/venv
source /home/pi/cs147-synqify-proj/edge/venv/bin/activate

# aws iot dependencies
pip3 install awsiotsdk

# pyspotify dependencies
apt-get install libasound2-dev
pip3 install pyalsaaudio

wget -q -O - https://apt.mopidy.com/mopidy.gpg | sudo apt-key add -
wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/buster.list
apt-get install libspotify-dev
pip3 install pyspotify
