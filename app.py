from fastapi import FastAPI
#import MySQLdb
import pymysql.cursors
import datetime

db_config = {
    'host': '192.168.100.21',
    'user': 'qqdb_web',
    'password': 'K7q1E6p8x',
    'database': 'alfaplus',
}

#conn = MySQLdb.connect(**db_config)
conn = pymysql.connect(host=db_config['host'], user=db_config['user'], password=db_config['password'], db=db_config['database'], cursorclass=pymysql.cursors.DictCursor)

app = FastAPI()

# Enable cors
@app.middleware("http")
async def add_cors_header(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

@app.get("/bauf/")
def read_root(aufnr: str, posnr: str):
    #with conn.cursor() as cursor:
        # cursor.execute(f"SELECT bauf.bauf_artnr AS Partnumber, bauf.bauf_artbez AS Partname FROM bauf WHERE bauf.bauf_aufnr = '{aufnr}' AND bauf.bauf_posnr = '{posnr}' LIMIT 1;")
        try:
            cursor = conn.cursor()
            conn.ping(reconnect=True)
            cursor.execute(f"SELECT bauf.bauf_artnr AS Partnumber, bauf.bauf_artbez AS Partname FROM bauf WHERE bauf.bauf_aufnr = '{aufnr}' AND bauf.bauf_posnr = '{posnr}' LIMIT 1;")
        except Exception as e:
            print(e)
            print("Error: Unable to fetch data from database")
            print("Datebase connection closed")
            print(datetime.datetime.now())
            return []

        result = cursor.fetchall()
        print(result)
        if result:
            return result[0]
        else:
            return []


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="localhost", port=4541)
