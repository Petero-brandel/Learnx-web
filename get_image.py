import urllib.request
import json
import re

url = "https://unsplash.com/napi/search/photos?query=black+student+laptop&per_page=5"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())
    first_image = data['results'][0]['urls']['regular']
    print(first_image)
except Exception as e:
    print(e)
