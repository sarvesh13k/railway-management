# app.py
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB
import threading
import bcrypt

from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# MySQL Configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Sarveshsql97@'
app.config['MYSQL_DB'] = 'railway_management'
app.config['MYSQL_PORT'] = 3800

mysql = MySQL(app)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg'
jwt = JWTManager(app)

# Admin API Key to protect admin endpoints
ADMIN_API_KEY = 'G20jHafFDIEtE5cXz0IYFrkj6ixCxfBC'

from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.headers.get('API-Key') != ADMIN_API_KEY:
            return jsonify({"message": "Unauthorized"}), 403
        return f(*args, **kwargs)
    return decorated_function


@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/test')
def test():
    return 'This is a test route!'


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']
    role = data['role']  # 'admin' or 'user'

    # Hash the password before storing it
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password, role) VALUES (%s, %s, %s)", 
                (username, hashed_password, role))
    mysql.connection.commit()
    return jsonify({"message": "User registered successfully"}), 201



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE username=%s", [username])
    user = cur.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
        access_token = create_access_token(identity={'username': username, 'role': user[3]})
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401


@app.route('/trains', methods=['POST'])
@admin_required
def add_train():
    data = request.get_json()
    train_name = data['train_name']
    source = data['source']
    destination = data['destination']
    total_seats = data['total_seats']
    
    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO trains (train_name, source, destination, total_seats, available_seats) VALUES (%s, %s, %s, %s, %s)", 
                (train_name, source, destination, total_seats, total_seats))
    mysql.connection.commit()
    return jsonify({"message": "Train added successfully"}), 201

@app.route('/trains/availability', methods=['GET'])
def seat_availability():
    source = request.args.get('source')
    destination = request.args.get('destination')
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM trains WHERE source=%s AND destination=%s", (source, destination))
    trains = cur.fetchall()
    return jsonify(trains), 200

@app.route('/book', methods=['POST'])
@jwt_required()
def book_seat():
    data = request.get_json()
    train_id = data['train_id']
    
    cur = mysql.connection.cursor()
    lock = threading.Lock()

    with lock:
        cur.execute("SELECT available_seats FROM trains WHERE id=%s FOR UPDATE", [train_id])
        train = cur.fetchone()

        if train and train[0] > 0:
            user = get_jwt_identity()
            cur.execute("INSERT INTO bookings (user_id, train_id, seat_number) VALUES (%s, %s, %s)", 
                        (user['id'], train_id, train[0]))
            cur.execute("UPDATE trains SET available_seats = available_seats - 1 WHERE id=%s", [train_id])
            mysql.connection.commit()
            return jsonify({"message": "Seat booked successfully"}), 200
        else:
            return jsonify({"message": "No seats available"}), 400

import os

app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'Sarveshsql97@')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.he0ErCNloe4J7Id0Ry2SEDg09lKkZkfsRiGsdX_vgEg')
ADMIN_API_KEY = os.getenv('ADMIN_API_KEY', 'G20jHafFDIEtE5cXz0IYFrkj6ixCxfBC')



if __name__ == '__main__':
    app.run(debug=True)
