import requests
import json

'''
HEADERS = {'x-app-id': "32c231c0", 'x-app-key': "a84622c8d4c9610583dfac507945ca8d",
           'Content-Type': "application/json"}
url = "https://trackapi.nutritionix.com/v2/search/instant?query=potatoes-salad"
#url = "https://trackapi.nutritionix.com/v2/search/item?nix_item_id=5c062912bf7bc6d54e026772"

# query = {"query": "chicken-breast"}
response = requests.get(url, headers=HEADERS)
data = json.loads(response.content.decode('utf-8'))

print(json.dumps(data, indent=4, sort_keys=True))
# print(data)
'''

HEADERS = {'x-app-id': "32c231c0", 'x-app-key': "a84622c8d4c9610583dfac507945ca8d",
           'Content-Type': "application/json"}
url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
response = requests.post(url, data=json.dumps({"query":"potatoes salad"}), headers=HEADERS)
data = json.loads(response.content.decode('utf-8'))
print(json.dumps(data, indent=4, sort_keys=True))