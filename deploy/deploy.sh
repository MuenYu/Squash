# install dep
cd ~/CAB432/api
npm i

# build the webpage
cd ~/CAB432/web
npm i
npm run build
mv -f ./dist ../api/public

# systemd
cd ~/CAB432/deploy
sudo cp ./squash.service /etc/systemd/system/squash.service
sudo systemctl daemon-reload
sudo systemctl enable squash
sudo systemctl start squash
sudo systemctl status squash