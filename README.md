# 🍎 FruitGuard – Smart Fruit Freshness Detection System

### 🤖 AI + IoT | Computer Vision | Gas Sensing | Mobile Application

FruitGuard is a smart **AI + IoT system** designed to detect fruit freshness by combining **deep-learning image classification** with **gas sensor analysis**.

The system integrates an AI model, IoT sensors, a backend API, and a mobile application to provide real-time freshness predictions and spoilage alerts.

🏆 **Top 3 Project in Jordan**

> FruitGuard was selected as **one of the Top 3 teams/projects among participants across Jordan**, recognizing the project as a strong combination of Artificial Intelligence, IoT, and practical real-world application.

---

## 📌 Overview

Fruit spoilage can often be detected through visible changes and the gases released during the decomposition process.

FruitGuard approaches this problem using **two complementary sources of information**:

1. 📸 **Computer Vision** — analyzes an image of the fruit.
2. 🌡️ **Gas Sensing** — analyzes gases associated with fruit spoilage.

The system combines both sources to produce a more informed freshness assessment.

```text
                 🍎 Fruit
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
   📸 Image Input       🌡️ Gas Sensors
          │                   │
          ▼                   ▼
    AI Classification    Gas Analysis
          │                   │
          └─────────┬─────────┘
                    ▼
          🧠 Decision System
                    │
                    ▼
        Freshness Prediction
                    │
             ┌──────┴──────┐
             │             │
             ▼             ▼
       📱 Mobile App   🔔 Alert
```

---

## ✨ Features

* 📸 **AI-based fruit freshness detection**
* 🧠 Deep Learning image classification
* 🌡️ Gas sensor analysis
* 🧪 Detection of gases associated with spoilage
* 🔀 AI + IoT decision fusion
* 📱 React Native mobile application
* ⚡ FastAPI backend
* 🔔 Real-time push notifications
* 📊 Data tracking and visualization
* ☁️ API-based communication between system components

---

## 🏗️ System Architecture

FruitGuard consists of four main layers:

### 📱 Mobile Application

Built using:

* **React Native**
* **Expo**

The mobile application provides users with an interface for:

* Capturing/uploading fruit images
* Viewing freshness predictions
* Monitoring sensor information
* Receiving spoilage alerts
* Viewing collected data

---

### ⚙️ Backend

The backend is developed using:

* **Python**
* **FastAPI**

It acts as the communication layer between the mobile application, AI model, and IoT components.

```text
Mobile App
     │
     │ REST API
     ▼
 FastAPI Backend
     │
 ┌───┴──────────────┐
 │                  │
 ▼                  ▼
AI Model        Sensor Data
 │                  │
 └────────┬─────────┘
          ▼
   Decision System
          │
          ▼
     Final Result
```

---

## 🧠 AI Model

FruitGuard uses a **deep learning image classification model based on ResNet**.

The model analyzes images of fruit and predicts whether the fruit is:

* 🟢 **Fresh**
* 🔴 **Spoiled**

The model also provides a **confidence score** associated with its prediction.

### AI Pipeline

```text
Fruit Image
     ↓
Image Preprocessing
     ↓
ResNet-Based Model
     ↓
Feature Extraction
     ↓
Classification
     ↓
Fresh / Spoiled
     ↓
Confidence Score
```

---

## 🌡️ Gas Detection

FruitGuard also uses an IoT gas sensor to detect gases associated with fruit spoilage.

The system monitors gases such as:

* **CO₂**
* **NH₃**
* **VOCs**

Sensor readings are processed to estimate gas concentrations and identify values associated with spoilage.

### Gas Analysis Pipeline

```text
Gas Sensor
    ↓
Raw Sensor Reading
    ↓
Data Processing
    ↓
Gas Concentration
    ↓
Threshold Analysis
    ↓
Spoilage Indicator
```

---

## 🧠 AI + IoT Decision System

One of the key ideas behind FruitGuard is combining **visual information** with **environmental sensor information**.

Instead of relying exclusively on an image or a sensor reading, the system considers both sources when producing the final freshness assessment.

```text
             AI Prediction
                  │
                  │
                  ▼
          ┌───────────────┐
          │               │
          │ Decision      │
          │    System     │
          │               │
          └───────────────┘
                  ▲
                  │
                  │
            Gas Analysis
                  │
                  ▼

          Final Assessment
```

This hybrid approach allows the system to consider both **visible characteristics** and **gas-related indicators** of spoilage.

---

## 📱 Mobile Application

The mobile application was developed using **React Native with Expo**.

The application communicates with the backend through REST APIs and provides users with real-time information.

### Main capabilities

* 📸 Fruit image submission
* 🧠 AI prediction display
* 🌡️ Sensor data monitoring
* 📊 Freshness information
* 🔔 Spoilage notifications
* 📱 Mobile-friendly interface

---

## 🔔 Notifications

FruitGuard uses **Expo Push Notifications** to notify users when the system detects potential spoilage.

```text
Sensor / AI Data
       ↓
Decision System
       ↓
Potential Spoilage
       ↓
Backend
       ↓
Push Notification
       ↓
📱 User
```

This allows users to receive alerts without continuously monitoring the application.

---

## 🛠️ Technologies Used

### Artificial Intelligence

* **Python**
* **PyTorch**
* **ResNet**
* Deep Learning
* Image Classification

### Backend

* **FastAPI**
* REST APIs
* Python

### IoT

* **ESP32**
* Gas Sensor
* CO₂ / NH₃ / VOC monitoring

### Mobile

* **React Native**
* **Expo**
* Expo Push Notifications

### Data & Visualization

* Sensor data processing
* Data tracking
* Visualization

---

## 🔄 Complete System Workflow

```text
                 🍎 Fruit
                    │
             ┌──────┴──────┐
             │             │
             ▼             ▼
       📸 Fruit Image   🌡️ Gas Sensor
             │             │
             ▼             ▼
        ResNet Model   Gas Processing
             │             │
             ▼             ▼
      Fresh/Spoiled    Gas Indicator
             │             │
             └──────┬──────┘
                    ▼
             🧠 Decision System
                    │
                    ▼
            Final Assessment
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
      📱 Mobile App       🔔 Alert
```

---

## 🚀 How to Run

### 🔹 Backend

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn server:app --reload
```

The API can then be accessed through the local server.

---

### 🔹 Mobile Application

Navigate to the mobile application directory and install the dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

The application can then be opened using the Expo development environment.

---

## 🎥 Demo Video

A full demonstration of FruitGuard, including the **mobile application, AI prediction, and gas detection system**:

[🎥 Watch the FruitGuard Demo](https://drive.google.com/file/d/1a6qOmBb6X_ouHk7vRtj1h52c9h6ZiQ1L/view?usp=sharing&utm_source=chatgpt.com)

---

## 🏆 Achievement

### 🥉 Top 3 in Jordan

FruitGuard was selected as **one of the Top 3 teams/projects among participants across Jordan**.

The project combined multiple technologies into one practical solution:

* 🤖 Artificial Intelligence
* 👁️ Computer Vision
* 🌡️ IoT Sensors
* 📱 Mobile Development
* ⚙️ Backend Engineering
* 🔔 Real-Time Notifications

This experience provided an opportunity to develop an end-to-end AI + IoT solution and present it in a competitive environment.

---

## 🎓 What I Learned

Through FruitGuard, I gained practical experience in:

* Deep Learning
* Computer Vision
* Image Classification
* ResNet-based architectures
* PyTorch
* IoT sensor integration
* ESP32 development
* Gas sensor data processing
* AI + sensor data fusion
* FastAPI
* REST API development
* React Native
* Expo
* Push notifications
* Connecting AI models with real-world hardware
* Building an end-to-end AI product

One of the most valuable parts of the project was learning how to connect **AI software with physical-world sensor data** and expose the results through a mobile application.

---

## 🔮 Future Improvements

Potential future improvements include:

* Supporting additional types of fruit
* Training the model on a larger and more diverse dataset
* Improving model accuracy
* Adding real-time camera analysis
* Adding additional gas sensors
* Implementing more advanced sensor fusion
* Adding historical freshness tracking
* Cloud-based monitoring
* Improving the notification system
* Deploying the complete system for real-world use

---

## 👩‍💻 Author

### Ghena Ali

**Computer Engineering Graduate**

GitHub: [@ghena03](https://github.com/ghena03)

---

## ⭐ Project Highlights

| Category            | Technology              |
| ------------------- | ----------------------- |
| 🤖 AI               | PyTorch / ResNet        |
| 👁️ Computer Vision | Image Classification    |
| 🌡️ IoT             | ESP32 + Gas Sensor      |
| ⚙️ Backend          | FastAPI                 |
| 📱 Mobile           | React Native / Expo     |
| 🔔 Notifications    | Expo Push Notifications |
| 🔗 Communication    | REST APIs               |
| 🏆 Achievement      | **Top 3 in Jordan**     |

---

## 📄 License

This project was developed for educational, competition, and portfolio purposes.
