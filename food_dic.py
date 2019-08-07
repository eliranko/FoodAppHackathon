import requests
import json
import socketserver
from http.server import BaseHTTPRequestHandler


def get_nutritions(prod_name):
    HEADERS = {'x-app-id': "32c231c0", 'x-app-key': "a84622c8d4c9610583dfac507945ca8d",
               'Content-Type': "application/json"}
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    payload = json.dumps({"query":prod_name})
    response = requests.post(url, data=payload, headers=HEADERS)
    data = json.loads(response.content.decode('utf-8'))
    print(json.dumps(data, indent=4, sort_keys=True))
    data = data["foods"][0]
    grams = float(data["serving_weight_grams"]) / float(100)
    result = {
        "calories": int(float(data["nf_calories"]) / float(grams)),
        "protein": int(float(data["nf_protein"]) / float(grams)),
        "fat": int(float(data["nf_total_fat"]) / float(grams)),
        "carbs": int(float(data["nf_total_carbohydrate"]) / float(grams))
    }
    return result


class MyHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers.get('Content-Length'))
        post_body = self.rfile.read(content_len).decode('utf-8')
        print(post_body)
        print("Received POST body:")
        print(json.dumps(post_body, indent=4, sort_keys=True))
        self.wfile.write(get_nutritions(post_body["name"]))
        #self.send_response(200)
        #self.end_headers()


httpd = socketserver.TCPServer(("", 8080), MyHandler)
httpd.serve_forever()
