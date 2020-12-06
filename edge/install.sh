sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y install cmake libssl-dev

# python dependencies
sudo apt-get -y install python3 python3-pip virtualenv
virtualenv ~/cs147-synqify-proj/edge/venv
. ~/cs147-synqify-proj/edge/venv/bin/activate

# aws iot dependencies
pip3 install awsiotsdk
mkdir ~/certs
if [ ! -f "~/certs/Amazon-root-CA-1.pem" ]; then
	echo "Missing ~/certs/Amazon-root-CA-1.pem"
	exit 1;
fi
if [ ! -f "~/certs/device.pem.crt" ]; then
	echo "Missing ~/certs/device.pem.crt"
	exit 1;
fi
if [ ! -f "~/certs/private.pem.key" ]; then
	echo "Missing ~/certs/private.pem.key"
	exit 1;
fi


# pyspotify dependencies
sudo apt-get install libasound2-dev
pip install pyalsaaudio

wget -q -O - https://apt.mopidy.com/mopidy.gpg | sudo apt-key add -
sudo wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/buster.list
sudo apt-get install libspotify-dev
pip install pyspotify
if [ ! -f "~/cs147-synqify-proj/edge/spotify_appkey.key" ]; then
	echo "Missing ~/cs147-synqify-proj/edge/spotify_appkey.key"
	exit 1;
fi

cd ~/cs147-synqify-proj/edge