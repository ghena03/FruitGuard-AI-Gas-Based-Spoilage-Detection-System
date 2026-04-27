# 🍎 FruitGuard – Smart Fruit Freshness Detection System (AI + IoT)

##  Overview
FruitGuard is a smart system that detects fruit freshness using a combination of **AI image classification and gas sensor data**.

It integrates a **mobile application, backend API, and machine learning model** to provide real-time predictions and spoilage alerts.

---

##  Features
- 📸 Image-based freshness detection using deep learning  
- 🌡️ Gas sensor analysis (CO₂, NH₃, VOCs)  
- 🧠 Smart decision system combining AI + sensor data  
- 📱 Mobile app built with React Native (Expo)  
- 🔔 Real-time push notifications for spoilage alerts  
- 📊 Data tracking and visualization  

---

## System Architecture
- **Frontend:** React Native (Expo)  
- **Backend:** FastAPI (Python)  
- **AI Model:** PyTorch (ResNet-based)  
- **Communication:** REST APIs  
- **Notifications:** Expo Push Notifications  

---

## AI Model
- Deep learning model for image classification  
- Classifies fruit as **Fresh or Spoiled**  
- Uses confidence-based prediction  

---

## Gas Detection Logic
- Calculates gas concentration from sensor readings  
- Detects spoilage using threshold values  
- Combines sensor data with AI predictions for final decision  

---

## How to Run

### 🔹 Backend
```bash
pip install -r requirements.txt
uvicorn server:app --reload

## Demo Video

A full demonstration of the system (mobile app + AI prediction + gas detection):

👉 https://drive.google.com/file/d/1a6qOmBb6X_ouHk7vRtj1h52c9h6ZiQ1L/view?usp=sharing
