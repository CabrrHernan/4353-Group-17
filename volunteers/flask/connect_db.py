import psycopg2

# Connection details
server_name = 'volunteers.postgres.database.azure.com'
database_name = 'postgres'
username = 'Zapingo'
password = 'Volunteers!'
port = 5432

try:
    # Connect to PostgreSQL
    connection = psycopg2.connect(
        dbname=database_name,
        user=username,
        password=password,
        host=server_name,
        port=port
    )
    print("Connection successful!")
    
    # Use connection...
    
except Exception as e:
    print("Error connecting to the database:", e)
finally:
    if 'connection' in locals():
        connection.close()
