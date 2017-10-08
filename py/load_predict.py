import pickle
import datetime
import numpy
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/data', methods=['GET', 'POST'])
def add_message():
    content = request.get_json()
    x = predict(content)
    print 'inside add_message ', x
    return predict(content)

model = None
nighbourhoodcategorical = None
def load():
    global model
    nighbourhoodcategorical = None #pickle.load(open('neighbour.pkl', 'rb'))
    filename = 'finalized_model.sav'
    model = pickle.load(open(filename, 'rb'))
    return model


def neighbourhood2categorical(nieghbour):
    return nighbourhoodcategorical[nieghbour] if nighbourhoodcategorical.get(nieghbour, None) else -1

def date2day():
    return datetime.datetime.now().day

def date2time():
    return datetime.datetime.now().hour

def string2categorical(dic):
    lat = float(dic['lat'])
    lng = float(dic['lon'])
    d  = date2day()
    t = date2time()
    l = -1
    dst = -1
    n = -1
    lat = lat
    lng = lng
    a = [d, t, l, dst, n, lat,  lng, -1]
    print ' a ', a
    return [i * 1.0 for i in a]

def predict(dic):
    global model
    if model is None:
        load()
    x_test = string2categorical(dic)
    prd = model.predict_proba([x_test])
    sum = 0.0
    for i in prd:
        sum = sum + i
    return sum

if __name__ == "__main__":
    app.run()
