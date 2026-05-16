import urllib.request
import json
from bs4 import BeautifulSoup
import re

url = "https://www.atlanticse.com/a/search/astra-walk-in-cooler-no-floor?filter_brand=Amerikooler"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read()
    soup = BeautifulSoup(html, 'html.parser')
    
    products = []
    # Try different selectors depending on theme
    for item in soup.select('.grid-product__content, .product-card, .grid__item, .card-wrapper'):
        title_el = item.select_one('.grid-product__title, .product-card__title, .card__heading, h3')
        price_el = item.select_one('.grid-product__price, .price, .price__regular')
        img_el = item.select_one('img')
        
        if title_el and title_el.text.strip():
            title = title_el.text.strip()
            price = price_el.text.strip() if price_el else ''
            price = re.sub(r'[^\d.]', '', price)
            img = img_el.get('src') if img_el else ''
            if not img and img_el:
                img = img_el.get('data-src') or img_el.get('srcset', '').split(' ')[0]
            if img and img.startswith('//'):
                img = 'https:' + img
                
            # Filter out some generic stuff
            if 'Amerikooler' in title:
                products.append({
                    'title': title,
                    'price': price,
                    'image': img
                })
            
    print(json.dumps(products, indent=2))
except Exception as e:
    print(e)