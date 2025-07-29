#!/usr/bin/python3
import sys
import os

# Add your project directory to the sys.path
sys.path.insert(0, "/home/YOUR_USERNAME/public_html/paschoalotto/")

from app import app

if __name__ == "__main__":
    app.run()

