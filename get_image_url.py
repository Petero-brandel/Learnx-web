import urllib.request
import re
import urllib.parse

url = "https://html.duckduckgo.com/html/?q=site:unsplash.com+black+man+glasses+laptop"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    images = re.findall(r'//external-content\.duckduckgo\.com/iu/\?u=([^&]+)', html)
    for img in images:
        img = urllib.parse.unquote(img)
        if 'images.unsplash.com' in img:
            print(img)
            break
except Exception as e:
    print(e)
