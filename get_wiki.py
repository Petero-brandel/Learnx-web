import urllib.request
import re

url = "https://commons.wikimedia.org/wiki/Category:Students_using_laptops"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    # find images on wikimedia
    images = re.findall(r'src="(https://upload\.wikimedia\.org/wikipedia/commons/thumb/[^"]+\.jpg/\d+px-[^"]+\.jpg)"', html)
    if images:
        print(images[0])
    else:
        print("No image found.")
except Exception as e:
    print(e)
