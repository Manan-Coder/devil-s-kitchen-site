from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/send-signup-otp", methods = ['POST']) #make request to this endpoint to send otp mails for signup
def send_mail_signup_otp():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    if not email or not name:
        return jsonify({'error':'Missing Data'}), 400
    import smtplib
    from email.mime.text import MIMEText
    import random

    otp = random.randint(1000,9999)

    smtp_server = 'email'
    smtp_port = 587
    email_from = 'sharmamanan1908@gmail.com'
    email_to = email
    email_password = "app password"
    msg = MIMEText(f'''Hey {name}! Thanks for signing up for Devil's Kitchen.
Here's your OTP to verify your email - {otp}
enjoy :D''')
    msg['Subject'] = f"Hey {name}! {otp} is your OTP for Devil's Kitchen"
    msg['From'] = email_to
    msg['To'] = email_from
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(email_from, email_password)
        server.sendmail(email_from, [email_to], msg.as_string())
        return jsonify({'message': 'Email sent!'})
if __name__ == '__main__':
    app.run(debug=False)




