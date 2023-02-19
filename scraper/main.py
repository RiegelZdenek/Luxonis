import requests
import psycopg2
from psycopg2 import sql

print("Connectiong to DB...", flush=True)
conn = psycopg2.connect(
    host="db",
    database="luxonis",
    user="postgres",
    password="postgres",
    port=5432
)
cursor = conn.cursor()
print("Connected to DB", flush=True)



#------------------------------------
#CREATE TABLES
#------------------------------------
print("Creating tables...", flush=True)
#creating apartments table
cursor.execute(
    sql.SQL("create table if not exists {} (id serial primary key, title varchar(255), price float)")
        .format(sql.Identifier('apartments'))
)

#creating images table
cursor.execute(
    sql.SQL("create table if not exists {} (id serial primary key, apartment_id int, url varchar(255))")
        .format(sql.Identifier('images'))
)

conn.commit()
print("Tables created", flush=True)



#------------------------------------
#TRUNCATE TABLES
#------------------------------------
print("Truncating tables", flush=True)
#truncating apartments table
cursor.execute(
    sql.SQL("truncate table {}")
        .format(sql.Identifier('apartments'))
)

#truncating images table
cursor.execute(
    sql.SQL("truncate table {}")
        .format(sql.Identifier('images'))
)

conn.commit()
print("Tables truncated", flush=True)



#------------------------------------
#FETCH DATA
#------------------------------------
print("Fetching data...", flush=True)
url = "https://www.sreality.cz/api/en/v2/estates?category_main_cb=1&category_type_cb=1&per_page=500"
r = requests.get(url)
data = r.json()

apartment_data = data.get("_embedded").get("estates")

#------------------------------------
#INSERT DATA
#------------------------------------
print("Inserting data...", flush=True)
for apartment in apartment_data:
    cursor.execute(
        sql.SQL("insert into {} (title, price) values (%s, %s) returning id")
            .format(sql.Identifier('apartments')),
        [apartment.get("name"), apartment.get("price_czk").get("value_raw")])
    id = cursor.fetchone()[0]
    
    for image in apartment.get("_links").get("images"):
        cursor.execute(
            sql.SQL("insert into {} (apartment_id, url) values (%s, %s)")
                .format(sql.Identifier('images')),
            [id, image.get("href")])

conn.commit()
print("scraping done", flush=True)
