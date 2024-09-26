# install dep
cd /home/ubuntu/CAB432/api
npm i

# build the webpage
cd /home/ubuntu/CAB432/web
npm i
npm run build
rm -r /home/ubuntu/CAB432/api/public
mv /home/ubuntu/CAB432/web/dist ~/CAB432/api/public

# systemd
sudo cp /home/ubuntu/CAB432/deploy/squash.service /etc/systemd/system/squash.service
cd /home/ubuntu/CAB432/api
sudo systemctl daemon-reload
sudo systemctl enable squash
sudo systemctl start squash
sudo systemctl status squash