import os, json

BASE = 'LayoverX'

# Ensure directories
for d in ['css', 'js', 'assets/images', 'assets/icons', 'components']:
    os.makedirs(os.path.join(BASE, d), exist_ok=True)

print("Directories ready")
