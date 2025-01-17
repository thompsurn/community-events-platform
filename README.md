# Community Events Platform

A platform designed to bring community members together by providing a centralised hub for discovering, creating, and managing events.


## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Additional Features](#additional-features)
5. [Publicly Hosted Application](#publicly-hosted-application)
6. [Test Login Details](#test-login-details)
7. [Requirements and Usage](#requirements-and-usage)
8. [Extensions Under Development](#extensions-under-development)
9. [How to Run the Project](#how-to-run-the-project)
10. [Contributing](#contributing)



## Project Overview

This project aims to build a web application where users can browse and sign up for events. Staff members can create and manage events, offering an intuitive interface for event management and user interaction. The **mobile app** for this platform is currently under development, so this submission focuses on the **frontend** and **backend** of the web application.

---

## Features (MVP)

The platform fulfils the following functionality:
1. Displays a list of events for users to browse.
2. Allows users to sign up for events.
3. Enables users to add events to their Google Calendar after signing up.
4. Allows staff members to sign in to create and manage events.

### Tech Stack

- **Frontend**: Built using React with TypeScript for scalability and maintainability.
- **Backend**: Node.js with Express, secured using JWT for authentication.
- **Database**: PostgreSQL for reliable data storage and management.
- **Hosting**: 
  - **Frontend**: Deployed using Vercel for seamless and fast delivery.
  - **Backend**: Hosted on Railway for scalable server-side operations.

### Additional Features

- **Google Calendar API Integration**: Allows users to add events directly to their Google Calendar.
- **CORS Policy**: Configured to allow secure cross-origin requests between the frontend and backend.
- **Responsive Design**: The UI is designed to work across a variety of screen sizes.
- **Accessibility Features**: Supports screen readers and keyboard navigation.
- **Error Handling**: Communicates errors clearly to users, including failed requests and validation issues.

---

## Publicly Hosted Application

The application is hosted on Vercel and is publicly accessible. However, **users will need to follow Vercel's signup/sign-in process the first time they use it to ensure they can access the application**.

- **Normal User Login**: [https://community-events-platform-53wit29r7-elliot-thompsons-projects.vercel.app/login](https://community-events-platform-53wit29r7-elliot-thompsons-projects.vercel.app/login)
- **Staff Login**: [https://community-events-platform-53wit29r7-elliot-thompsons-projects.vercel.app/staff-login](https://community-events-platform-53wit29r7-elliot-thompsons-projects.vercel.app/staff-login)

### Test Login Details

You can use the following credentials to explore the platform:

- **Staff Account**:
  - Username: `newstaffuser`
  - Password: `NewStaffPassword123!`

- **Normal User Account**:
  - Username: `testuser`
  - Password: `StrongP@ssw0rd`

---

## Requirements and Usage

To ensure ease of use, the platform includes the following:
- Responsive design for various devices.
- Accessibility considerations for users with disabilities (e.g., screen readers).
- Clear communication of errors (e.g., validation, network issues).
- Loading indicators during content fetching.

---

## Extensions Under Development

Future plans for the platform include:
1. **Mobile App**: Using React Native and Expo, a cross-platform mobile app will complement the web application.
2. **Optional Features**:
   - Payment platform integration (e.g., Stripe, Google Pay).
   - Confirmation emails for event sign-ups.
   - Social media sharing for events.
   - Cross-platform compatibility between the website and mobile app.
   - Google/Social login for user accounts.

---

## How to Run the Project

### Prerequisites
- **Node.js**: Ensure you have Node.js installed.
- **PostgreSQL**: Set up the database with the required schema.
- **Google API Key**: Configure the Google Calendar API for event integration.

### Backend Setup
1. Clone the repository and navigate to the `backend` folder.
2. Install dependencies using `npm install`.
3. Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `GOOGLE_API_KEY`, etc.) in a `.env` file.
4. Start the server: `npm start`.

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies using `npm install`.
3. Configure the environment variable for the API URL in the `.env` file.
4. Start the development server: `npm start`.

### Live Application
- **Frontend**: [Vercel Deployment](https://community-events-platform-53wit29r7-elliot-thompsons-projects.vercel.app/)
- **Backend**: Hosted on Railway.

---

## Contributing

Contributions are welcome! If you'd like to contribute to the development of the mobile app or add new features to the web application, feel free to submit a pull request.

