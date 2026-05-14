import urllib.request
import json
import urllib.parse

# Search Wikimedia Commons for images
query = urllib.parse.quote("African man laptop glasses")
url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={query}&utf8=&format=json&srnamespace=6"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    data = json.loads(response.read())
    for item in data['query']['search']:
        title = item['title']
        print(f"Found: {title}")
        # Get image URL
        title_quoted = urllib.parse.quote(title)
        img_url_api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={title_quoted}&prop=imageinfo&iiprop=url&format=json"
        img_req = urllib.request.Request(img_url_api, headers={'User-Agent': 'Mozilla/5.0'})
        img_res = urllib.request.urlopen(img_req)
        img_data = json.loads(img_res.read())
        pages = img_data['query']['pages']
        for page_id in pages:
            if 'imageinfo' in pages[page_id]:
                print(pages[page_id]['imageinfo'][0]['url'])
                exit(0)
except Exception as e:
    print(e)
