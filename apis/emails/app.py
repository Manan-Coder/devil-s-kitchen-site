import string
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sqlite3
import random

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

session_codes = {}  # Store {email: session_code}

def generate_session_code():
    return ''.join(random.choices(string.digits, k=10))

cursor.execute(
    '''CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
    )'''
)
conn.commit()
load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route("/send-signup-otp", methods = ['POST', 'GET']) #make request to this endpoint to send otp mails for signup
def send_mail_signup_otp():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    if not email or not name:
        return jsonify({'error':'Missing Data'}), 400
        
    import smtplib
    from email.mime.text import MIMEText
    import random

    otp = random.randint(1000,9999) #random otp gen
    session_code = generate_session_code()
    
    # Store the session code with the email as the key
    session_codes[email] = session_code
    
    # Debug print to verify storage
    print(f"Storing session code for {email}: {session_code}")
    print(f"Current session_codes dictionary: {session_codes}")
    
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    email_from = os.getenv('EMAIL-ADDRESS')
    email_to = email
    email_password = os.getenv('EMAIL-PASS')
    msg = MIMEText(f'''Hey {name}! Thanks for signing up for Devil's Kitchen. 
Here's your OTP to verify your email - {otp}
enjoy :D''') #message to send as email
    msg['Subject'] = f"Hey {name}! {otp} is your OTP for Devil's Kitchen"
    msg['From'] = email_from
    msg['To'] = email_to
    with smtplib.SMTP(smtp_server, smtp_port) as server: #logging in server
        server.starttls()
        server.login(email_from, email_password)
        server.sendmail(email_from, [email_to], msg.as_string())
        return jsonify({'message': 'Email sent!','otp':otp,'sessionCode':session_code})


@app.route("/register-user", methods=['POST'])
def register_user():
    data = request.get_json()
    print(data)
    name = data.get('name')
    email = data.get('email')
    passw = data.get('password')
    session_code_got = data.get('sessionCode')  

    # Get the stored session code for this email
    session_code = session_codes.get(email)

    print(f"Received session code: {session_code_got}, Expected: {session_code}")

    if session_code and session_code == session_code_got:
        print("Valid session code")
        return jsonify({'message':'yay you a goodie, imma make a account real quick'})
    else:
        print("Invalid session code")
        return jsonify({'error': 'dont try to cheat mf ;( i check session codes :) )'}), 400

if __name__ == '__main__':
    app.run(debug=True)  # Changed to debug=True for development