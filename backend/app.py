from flask import Flask
from config import Config
from routes import main

app = Flask(__name__)
app.config.from_object(Config)

# Blueprint 등록
app.register_blueprint(main)

if __name__ == '__main__':
    app.run(debug=True, port=5001) 