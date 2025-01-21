# Party Hub 🎉

Welcome to **Party Hub** – a simple and fun way to manage party RSVPs online! This website allows users to create, manage, and RSVP to events effortlessly.

- Author: Colby Roberts

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

- Go to website at: https://www.galactic-conquerors.com

## Software Dependencies
 - `body-parser`: A library for parsing request bodies, version 1.20.3 or later.
 - `compression`: Middleware to compress HTTP responses, version 1.7.4 or later.
 - `cookie-parser`: A middleware for parsing cookies, version 1.4.7 or later.
 - `cookie-session`: Middleware for session management using cookies, version 2.1.0 or later.
 - `crypto`: A library for cryptographic functions, version 1.0.1 or later.
 - `ejs`: A templating engine for JavaScript, version 3.1.10 or later.
 - `errorhandler`: A library to handle errors in development, version 1.5.1 or later.
 - `express`: A web framework for Node.js, version 4.21.1 or later.
 - `express-ejs-layouts`: Layout support for EJS with Express, version 2.5.1 or later.
 - `express-layouts`: Another library for layouts with Express, version 1.0.0 or later.
 - `fs`: File system utilities, version 0.0.1 (security patch).
 - `http`: Node.js HTTP module, version 0.0.1 (security patch).
 - `https`: Node.js HTTPS module, version 1.0.0 or later.
 - `method-override`: Middleware for using HTTP verbs like PUT or DELETE, version 3.0.0 or later.
 - `moment`: A library for date and time manipulation, version 2.30.1 or later.
 - `mysql`: A library for MySQL database interaction, version 2.18.1 or later.
 - `path`: A library for handling file paths, version 0.12.7 or later.
 - `pluralize`: A library for pluralizing words, version 8.0.0 or later.
 - `scrypt-async`: A library for password hashing using scrypt, version 2.0.1 or later.

## Detailed Description of Architecture
PartyHub is designed to analyze party hosts’ names and addresses to predict vibes and recommend parties. The architecture is modular, organized by feature, and designed to facilitate maintainability, scalability, and clarity.

The project follows a feature-based modular architecture where functionality is grouped under individual modules. Each module contains its respective controllers, views, public assets, routes, and services. This approach ensures easy navigation, maintainability, and scaling of the application.

### Directory Structure
### `apps`
The apps folder contains the main application modules. Each module is structured as follows:

#### Module Structure
* `controllers/`: Contains logic for handling application requests.
  * `api/`: Controllers for API endpoints.
  * `views/`: Controllers for rendering views.
* `lib/`: Utility libraries specific to the module.
* `public/`: Public-facing assets such as JavaScript, CSS, EJS templates, and images.
* `routes/`: Defines the routing logic.
  * `api/`: API route definitions.
  * `views/`: Route definitions for view rendering.
* `scripts/`: Scripts related to the module.
* `services/`: Business logic and helper functions.

#### Modules in apps:
* `host/`: Handles host-specific functionality, including public asset management and APIs.
* `login/`: Manages authentication, including login, logout, and signup.
* `main/`: Core functionality for the main application page.
* `party/`: Features related to user parties, including feeds, friends, RSVP, and more.
* `settings/`: User profile management, password settings, and privacy controls.

### `config`
The config folder contains configuration files for various environments:

* `development.json`: Configuration for development.
* `production.json`: Configuration for production.

### `middleware`
The middleware folder contains middleware logic used to process API and view requests:

* `api/`: Middleware for API requests.
* `views/`: Middleware for rendering views.

### `utils`
The utils folder includes utility scripts shared across the project:

* `capitalizer.js`: A helper function for capitalizing text.
* `database.js`: Handles database interactions.

### Notable Files

#### Root-Level Files
* `package.json`: Contains metadata about the project, dependencies, and scripts.
* `package-lock.json`: Auto-generated file that locks dependency versions.

#### Public Assets (Example Locations)
* `apps/main/public/img/`: Images used in the main module.
* `apps/main/public/svg/`: Scalable vector graphics for icons.
* `apps/party/public/`: Assets related to party module views.

### How the Application Works
1. Routing: Each module in apps has its own routes, divided into api and views. These routes map URLs to the appropriate controllers.
2. Controllers: Controllers handle the logic for requests, interacting with services and models as necessary.
3. Public Assets: Organized within each module under the public/ directory. These include templates (EJS), stylesheets (CSS), and JavaScript files.
4. Services: Encapsulate business logic and act as intermediaries between controllers and data sources.

### Key Features
* Modular Design: Clear separation of concerns by module and functionality.
* Scalability: New modules can be added with minimal impact on existing code.
* Ease of Maintenance: Consistent structure allows developers to quickly locate and modify code.
