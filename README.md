# **Neo Live Chat**
<div style="text-align: justify;">
 A Reactive live chat application that connects random users for real-time communication. This project demonstrates the use of the WebSocket protocol to enable bidirectional communication between clients and the server. Built using React.js on the front end and FastAPI on the back end, this example illustrates how WebSockets can be implemented to handle real-time chat functionality, ensuring seamless communication between users.
</div>

![Project preview](https://neo-portfolio-bucket.s3.eu-north-1.amazonaws.com/neo-livechat-min.jpg)


### Links

- [**Neo Live Chat**](#neo-live-chat)
    - [Links](#links)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
    - [Backend setup (Fast API)](#backend-setup-fast-api)
    - [Frontend setup (React.js)](#frontend-setup-reactjs)
- [Contributing](#contributing)
- [License](#license)

# Features
- Real-time chat: uses web socket protocol to enable live communication between random users.
- Scalable architecture: built with FastAPI and React.js, it ensures high-performance communication.
- React.jsive UI: front end built with React.js, making the UI smooth and interactive.


# Installation
Follow these steps to set up and run this project locally:

## Prerequisites
Ensure you have the following installed:
- **Node.js** (v14+)
- **Python** (v3.8+)

### Backend setup (Fast API)
1. Clone the repository:
   ```bash
    git clone https://github.com/Yulian302/neo-live-chat.git
    ```

2. Navigate to the root project directory:
    ```bash
    cd neo-live-chat
    ```

3. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source ./venv/bin/activate
   ```
4. Install project requirements:
   ```bash
   pip install -r requirements.txt
   ```
5. Run your local server using uvicorn:
   ```bash
   uvicorn main:app --port [PORT] --reload
   ```
   You can use any open port. The recommended choice is 8000 as you wouldn't need to change it in your React.js app.

### Frontend setup (React.js)
1. Go to the React.js root directory:
   ```bash
   cd neo-livechat/neo-livechat-React.js
   ```
2. Install required dependencies and run the project:
   ```bash
   npm i && npm start
   ```

# Contributing
Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
Steps to contribute:
1. Fork the project.
2. Create your feature branch (```git checkout -b feature/[FEATURE_NAME]```).
3. Commit your changes (```git commit -m 'Add some AmazingFeature'```).
4. Push to the branch (```git push origin feature/[FEATURE_NAME]```).
5. Open a pull request.

# License
<div style="text-align: justify;">Distributed under the MIT License. See LICENSE for more information.</div>