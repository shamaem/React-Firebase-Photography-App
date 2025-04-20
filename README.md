# 📸 PhotoVerse

A photography community platform where photographers can showcase their work, discover others' creations, and build their portfolios.



## 🚀 Features

- **User Authentication** (Signup/Login with Firebase)
- **Media Uploads** (Images with automatic compression)
- **Personal Dashboard** (View all your uploads)
- **Public Gallery** (Discover community creations)


## 🛠 Tech Stack

- **Frontend**: React.js, Firebase Firestore
- **Styling**: CSS-in-JS (inline styles)
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore


## 🔥 Getting Started

### Prerequisites
- Node.js (v16+)
- Firebase account
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/photoverse.git
   cd photoverse

### Project Structure
photoverse/
├── public/               # Static files
├── src/
│   ├── components/       # React components
│   │   ├── Dashboard.jsx # User's private gallery
│   │   ├── Explore.jsx   # Public community gallery
│   │   ├── Upload.jsx    # Media upload form
│   │   └── ...           # Other components
│   ├── firebase.js       # Firebase configuration
│   └── App.jsx           # Main application router
├── .gitignore
├── package.json
└── README.md
