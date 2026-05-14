import urllib.request
import re

url = "https://www.pexels.com/search/black%20student%20laptop/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    # Find image URLs in the page source
    images = re.findall(r'https://images\.pexels\.com/photos/\d+/pexels-photo-\d+\.jpeg\?auto=compress&cs=tinysrgb&w=1600', html)
    if images:
        print(images[0])
    else:
        print("No image found.")
except Exception as e:
    print(e)
