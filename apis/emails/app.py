from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/send-signup-otp", methods = ['POST']) #make request to this endpoint to send otp mails for signup
def send_mail_signup_otp():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    if not email or name:
        return jsonify({'error':'Missing Data'}), 400
    import smtplib
    from email.mime.text import MIMEText

    


