# FFXIV Raid Manager
#### Web-based Final Fantasy XIV Raid Manager

# This project is not completed! (90% completed)

# Overview
- Final Fantasy XIV Raid Manager
- Web Based (Django)

![example-img]

# Install (Linux Ubuntu)
- Python 2, 3 supported
- use lo

1. download
```bash
git clone https://github.com/koyouhun/ffxiv_raid_manager.git
```

2. set python environment
```bash
# check python exist
python --version

# update python
pip install -U pip
pip insatll -U setuptools

# set virtualenv
pip install virtualenv
virtualenv virtualenv
source virtualenv/bin/activate

# install python package
pip install -r requirements.txt
```

2. set database
- https://docs.djangoproject.com/en/2.1/ref/settings/#databases
```bash
vi team_maker/settings.py
```

[example-img]: https://github.com/koyouhun/ffxiv_raid_manager/blob/master/index.png?raw=true