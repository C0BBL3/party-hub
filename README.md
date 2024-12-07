# Party Hub 🎉

Welcome to **Party Hub** – a simple and fun way to manage party RSVPs online! This website allows users to create, manage, and RSVP to events effortlessly.

- Authors: Makani Buckley, Jack Davy, Colby Roberts

- Course: CS 422
- Assignment: Group Project
---

## 🌟 Features
- **Event Creation:** Hosts can create events with customizable details like date, time, location, and description.
- **RSVP Management:** Guests can RSVP to events, view their status, and update their responses.
- **Dashboard:** Hosts have access to a dashboard to track RSVPs and manage attendee lists.
- **User-Friendly Interface:** Designed for simplicity and ease of use on both desktop and mobile devices.

---

## 🛠️ Technologies Used
- **Frontend:**
  - HTML, CSS, JavaScript
- **Backend:**
  - Node.js and Express.js (or your chosen backend framework)
- **Database:**
  - SQL

---

## 🚀 Getting Started

- **Go to website at: http://3.234.148.129/ **

## Software Dependencies
- body-parser: A library for parsing request bodies, version 1.20.3 or later.
- compression: Middleware to compress HTTP responses, version 1.7.4 or later.
- cookie-parser: A middleware for parsing cookies, version 1.4.7 or later.
- cookie-session: Middleware for session management using cookies, version 2.1.0 or later.
- crypto: A library for cryptographic functions, version 1.0.1 or later.
- ejs: A templating engine for JavaScript, version 3.1.10 or later.
- errorhandler: A library to handle errors in development, version 1.5.1 or later.
- express: A web framework for Node.js, version 4.21.1 or later.
- express-ejs-layouts: Layout support for EJS with Express, version 2.5.1 or later.
- express-layouts: Another library for layouts with Express, version 1.0.0 or later.
- fs: File system utilities, version 0.0.1 (security patch).
- http: Node.js HTTP module, version 0.0.1 (security patch).
- https: Node.js HTTPS module, version 1.0.0 or later.
- method-override: Middleware for using HTTP verbs like PUT or DELETE, version 3.0.0 or later.
- moment: A library for date and time manipulation, version 2.30.1 or later.
- mysql: A library for MySQL database interaction, version 2.18.1 or later.
- path: A library for handling file paths, version 0.12.7 or later.
- pluralize: A library for pluralizing words, version 8.0.0 or later.
- scrypt-async: A library for password hashing using scrypt, version 2.0.1 or later.

---

## Detailed Description of Architecture

PartyHub is designed to analyze party hosts’ names and addresses to predict vibes and recommend parties. The architecture comprises the following components:
	1.	Party Analysis Component: Extracts patron and host data using AI and Party Intelligence reports to assess compatibility.
	2.	Party Intelligence Component: Queries a proprietary API with host names and party addresses for additional insights.
	3.	Party Report Generation Component: Creates summary reports of party analysis results.
	4.	UI Component: Offers an intuitive interface for RSVPs, party hosting, and editing, with input fields, result displays, and admin tools for API management and settings.

Component Interaction:
	•	The UI communicates with the server for data exchange and report uploads.
	•	The server securely interacts with the database for data storage, retrieval, and deletion using authentication and hashing.

Design Rationale:
PartyHub integrates analysis tools for accurate party recommendations, leveraging diverse data sources like host and address histories. It ensures user-friendliness, security, and legal compliance, providing a reliable solution for enhancing social experiences while addressing dynamic networking challenges.
