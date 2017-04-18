#! /bin/bash
apt-get -qq update
apt-get -y upgrade
apt install -y tmux vim ruby
export EDITOR='vim'
export SHELL='/bin/bash'
gem install tmuxinator
cp -r docker/scripts/development/resources/.tmuxinator $HOME/