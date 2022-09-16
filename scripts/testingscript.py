#!/usr/bin/python3

import os

# Directory
directory = "testing"

# Parent Directory path
parent_dir = "/tmp/Pycharm projects/"

# Path
path = os.path.join(parent_dir, directory)

# Create the directory
# 'GeeksForGeeks' in
# '/home / User / Documents'
os.makedirs(path)
print("Directory '% s' created" % directory)

# Directory
directory = "supertesting"

# Parent Directory path
parent_dir = "/tmp/Pycharm projects"

# mode
mode = 0o666

# Path
path = os.path.join(parent_dir, directory)

# Create the directory
# 'GeeksForGeeks' in
# '/home / User / Documents'
# with mode 0o666
os.makedirs(path, mode)
print("Directory '% s' created" % directory)
