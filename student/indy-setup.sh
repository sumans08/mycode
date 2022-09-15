echo -e "Cleaning up Containers..."
sudo docker stop john paul george stuart pete ringo &> /dev/null
sudo docker rm john paul george stuart pete ringo &> /dev/null
sudo docker network rm ansible-net &> /dev/null
rm /tmp/labrunning &> /dev/null

sudo docker stop indy &> /dev/null
sudo docker rm indy &> /dev/null
sudo docker network rm ansible-net &> /dev/null
rm /tmp/labrunning &> /dev/null

sudo docker stop bender fry zoidberg farnsworth indy &> /dev/null
sudo docker rm bender fry zoidberg farnsworth indy &> /dev/null
sudo docker network rm ansible-net &> /dev/null
rm /tmp/labrunning &> /dev/null
echo -e "Containers Cleared!\n"

echo -e "Jock! Start the engine!\n"

### Create networks
sudo docker network create --opt com.docker.network.driver.mtu=1450 --subnet 10.10.2.0/24 ansible-net

sudo docker build -q --build-arg user=indy   --tag ssh-nopython $HOME/.config/dockerfiles/ansible/ssh-nopython

### Launch containers and connect networks
sudo docker run -d  --name indy      -h indy   --ip 10.10.2.2 --network ansible-net ssh-nopython

echo -e "\nSnakes... why'd it have to be snakes??\n"

echo -e "Inventory File Updated (/mycode/inv/dev/hosts)"
curl https://static.alta3.com/projects/ansible/deploy/hosts --create-dirs -o ~/mycode/inv/dev/hosts

sudo apt install sshpass -y