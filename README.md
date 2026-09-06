# FreelanceHub - Modern Freelancer Marketplace

A premium, role-based platform designed to connect top-tier freelance talent with clients seamlessly. Built with modern web standards, this platform mimics the core architecture of industry giants like Upwork and Fiverr.

## 🚀 Key Features

*   **Role-Based Dashboards:** Distinct and personalized dashboards for Clients (to post jobs and view applicants) and Freelancers (to find and apply to jobs).
*   **Smart Category Filtering:** Dynamic routing and keyword matching algorithm that accurately filters freelancers based on their specific skills and selected categories.
*   **Protected Routes & Security:** Robust client-side security ensuring only authenticated users can access internal dashboards and application features.
*   **Premium SaaS UI/UX:** Styled entirely with Tailwind CSS using a modern Indigo/Violet/Slate color palette, featuring glassmorphism elements, soft shadows, and rounded interfaces.
*   **Micro-Interactions & Animations:** Integrated GSAP ScrollTrigger for staggered, smooth page reveals and React-Hot-Toast for non-intrusive, elegant user notifications.
*   **Real-time Database:** Powered by Firebase Firestore for instantaneous job postings and user data fetching.

## 🛠 Tech Stack

*   **Frontend:** React.js (React 19)
*   **Routing:** React Router v6
*   **Styling:** Tailwind CSS
*   **Backend / BaaS:** Firebase (Authentication, Firestore)
*   **Animations:** GSAP (GreenSock), Framer Motion
*   **Notifications:** React Hot Toast
*   **Icons & UI:** Heroicons

## 🚦 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MaryamKhan15/FreelancerHub.git
   ```
2. Navigate to the project directory:
   ```bash
   cd FreelancerHub
   ```
3. Install dependencies (use legacy-peer-deps for React 19 compatibility):
   ```bash
   npm install --legacy-peer-deps
   ```
4. Set up Firebase:
   - Create a project on Firebase Console.
   - Enable Authentication (Email/Password) and Firestore Database.
   - Replace the configuration in `src/firebase.js` with your own Firebase keys.

5. Start the development server:
   ```bash
   npm run dev
   ```

## 👩‍💻 Usage
*   **Register as a Client** to explore the Client Dashboard, post new jobs, and allocate budgets.
*   **Register as a Freelancer** to set up your skills/expertise, browse the available job board, and submit proposals/bids.

---
*Developed for a university project presentation.*
