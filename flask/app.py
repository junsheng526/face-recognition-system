from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load YOLOv8 model (use "yolov8n.pt" for speed, or "yolov8s.pt" for better accuracy)
model = YOLO("yolov8m.pt")  # Medium
# model = YOLO("yolov8l.pt")  # Large
# model = YOLO("yolov8x.pt")  # X-Large

@app.route("/analyze", methods=["POST"])
def analyze_image():
    print("\n📥 New request received!")

    if "file" not in request.files:
        print("🚨 Error: No file found in request")
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # Run YOLO on the image
    results = model(image)

    # Count detected people
    people_count = 0
    for result in results:
        for box in result.boxes.data:
            class_id = int(box[5])  # YOLO class ID
            if class_id == 0:  # Class ID 0 = "person"
                people_count += 1

    print(f"👥 Detected {people_count} people")
    return jsonify({"peopleCount": people_count})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
