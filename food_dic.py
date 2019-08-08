import requests
import json
import socketserver
from ast import literal_eval
from http.server import BaseHTTPRequestHandler
from pulp import *


foods = {}
rmr = 1000
weight = 33


def get_nutritions(prod_name):
    HEADERS = {'x-app-id': "5be5df7c", 'x-app-key': "4ee10acd9358169750cdefee2412ece8",
               'Content-Type': "application/json"}
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    payload = json.dumps({"query":prod_name})
    response = requests.post(url, data=payload, headers=HEADERS)
    data = json.loads(response.content.decode('utf-8'))
    #print(json.dumps(data, indent=4, sort_keys=True))
    if len(data) == 0:
        return {}
    data = data["foods"][0]
    grams = float(data["serving_weight_grams"]) / float(100)
    result = {
        "calories": int(float(data["nf_calories"]) / float(grams)),
        "protein": int(float(data["nf_protein"]) / float(grams)),
        "fat": int(float(data["nf_total_fat"]) / float(grams)),
        "carbs": int(float(data["nf_total_carbohydrate"]) / float(grams))
    }
    print("result: " + json.dumps(result, indent=4, sort_keys=True))
    return result


def linear_programming():
    prob = LpProblem("Simple Diet Problem", LpMinimize)
    food_vars = LpVariable.dicts("", foods, lowBound=0, cat='Continuous')
    # Objective
    prob += lpSum([foods[i]["carbs"] * food_vars[i] for i in foods])
    # Protein constraint
    prob += lpSum([foods[i]["protein"] * food_vars[i] for i in foods]) >= 1.5 * weight, "ProteinMinimum"
    prob += lpSum([foods[i]["protein"] * food_vars[i] for i in foods]) <= 1.8 * weight, "ProteinMaximum"
    # Fats constraint
    prob += lpSum([foods[i]["fat"] * food_vars[i] for i in foods]) >= 0.6 * weight, "FatsMinimum"
    prob += lpSum([foods[i]["fat"] * food_vars[i] for i in foods]) <= 0.8 * weight, "FatsMaximum"
    # Fitness constraint
    prob += lpSum([foods[i]["calories"] * food_vars[i] for i in foods]) >= rmr - 250, "FitnessMinimum"
    prob += lpSum([foods[i]["calories"] * food_vars[i] for i in foods]) <= rmr - 100, "FitnessMaximum"
    prob.solve()
    print("Status: ", LpStatus[prob.status])
    result = {
        "status": LpStatus[prob.status],
        "calories": 0,
        "consumable": []
    }
    for v in prob.variables():
        if v.varValue > 0:
            print(v.name, "=", v.varValue * 100, "grams")
            result["consumable"].append({"name": v.name[1:], "value": v.varValue * 100})
            result["calories"] += foods[v.name[1:]]["calories"] * v.varValue
    print("The total calories of this balanced diet is: ", str(result["calories"]))
    return result


class MyHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers.get('Content-Length'))
        post_body = self.rfile.read(content_len).decode('utf-8')
        print("Received POST body:")
        print(post_body)
        post_body = literal_eval(post_body)
        if self.path == '/food':
            if post_body["capacity"] == 0:
                foods.pop(post_body["name"], None)
            else:
                foods[post_body["name"]] = get_nutritions(post_body["name"])
            self.send_response(200)
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
            self.end_headers()
        elif self.path == '/rmr':
            global rmr, weight
            rmr = float(post_body["rmr"]) * 0.5
            weight = float(post_body["weight"]) * 0.5
            self.send_response(200)
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
            self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == '/optimal':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
            self.end_headers()
            self.wfile.write(json.dumps(linear_programming()).encode('utf-8'))
        elif self.path == '/menu':
            self.send_response(200)
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
            self.end_headers()
            result = []
            for i in foods:
                result.append({"name": i, "data": foods[i]})
            self.wfile.write(json.dumps(result).encode('utf-8'))


# Shim consumable
foods["chicken"] = get_nutritions("chicken")
foods["rice"] = get_nutritions("rice")
foods["pizza"] = get_nutritions("pizza")
foods["beans"] = get_nutritions("beans")
foods["potatoes_salad"] = get_nutritions("potatoes_salad")
foods["potatoes"] = get_nutritions("potatoes")
foods["fish"] = get_nutritions("fish")
foods["bread"] = get_nutritions("bread")
foods["mashed_potatoe"] = get_nutritions("mashed_potatoe")

httpd = socketserver.TCPServer(("", 8080), MyHandler)
httpd.serve_forever()
