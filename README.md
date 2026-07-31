GOLDEN BROWS THREADING & BEAUTY STUDIO
Full-Stack Salon Website and Booking Platform

# Golden Brows Booking and Business Management Platform

> **Project status:** Fully functional in local development and ready for deployment. Public hosting is currently inactive.

A full-stack salon booking and business-management platform developed for Golden Brows Threading & Beauty Studio in Paramount, California.



1. PROJECT OVERVIEW

Golden Brows is a mobile-friendly, full-stack website built for Golden Brows
Threading & Beauty Studio in Paramount, California.

The platform allows customers to explore salon services, view promotions,
select one or more services, choose a staff member or "Any Staff," and submit
an appointment request. It also provides administrative tools for managing
bookings, services, employees, promotions, blog content, comments, and reviews.

This project was designed and developed by Santosh Adhikari and configured for cloud deployment.


2. MAIN FEATURES

Customer Features:
- Responsive layout for desktop, tablet, and mobile devices
- Home page with business information and featured content
- Salon service listings
- Multi-service appointment selection
- Staff selection, including an "Any Staff" option
- Date and time selection
- Appointment request submission
- Promotions and special offers
- Blog posts and comments
- Customer reviews
- Contact information and social media links

Administrative Features:
- Manage salon services
- Manage appointment requests and cancellations
- Manage customers and employees
- Manage promotions
- Manage blog posts and comments
- Manage customer reviews
- Validate submitted information and handle API errors


3. TECHNOLOGY STACK

Frontend:
- React
- JavaScript and JSX
- CSS
- Create React App
- Firebase Hosting

Backend:
- Java 21
- Spring Boot
- Spring Web / REST APIs
- Spring Data JPA
- Spring Security and CORS configuration
- Maven
- Google Cloud Run

Database:
- MySQL
- Google Cloud SQL in production


4. PROJECT STRUCTURE

GoldenBrows-web/
|-- frontend/                 React customer and admin interface
|-- backend/                  Spring Boot REST API
|   |-- src/main/java/       Application source code
|   |-- src/main/resources/  Application configuration
|   `-- pom.xml              Maven dependencies and build configuration
`-- README.txt


5. PREREQUISITES

Install the following software before running the project:

- Java Development Kit (JDK) 21
- Maven 3.9 or newer
- Node.js 18 or newer
- npm
- MySQL 8 or newer


6. DATABASE SETUP

1. Start MySQL.

2. Create a database:

   CREATE DATABASE goldenbrows;

3. Configure the backend with your own database connection values.

Example local environment variables:

   DB_URL=jdbc:mysql://localhost:3306/goldenbrows
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   SPRING_PROFILES_ACTIVE=dev

Important:
- Never commit real passwords, API keys, or production credentials.
- Keep these files out of Git:

  backend/src/main/resources/application.properties
  backend/src/main/resources/application-*.properties

- If application.properties was already committed, remove it from Git tracking:

  git rm --cached backend/src/main/resources/application.properties


7. RUN THE BACKEND LOCALLY

Open a terminal from the project root:

   cd backend
   mvn clean install
   mvn spring-boot:run

The backend normally starts at:

   http://localhost:8080

API routes are available under:

   http://localhost:8080/api


8. RUN THE FRONTEND LOCALLY

Open another terminal from the project root:

   cd frontend
   npm install
   npm start

The React application normally opens at:

   http://localhost:3000

Make sure the frontend API configuration points to the local backend while
developing.


9. PRODUCTION BUILD

Build the frontend:

   cd frontend
   npm install
   npm run build

Create React App generates the production files in:

   frontend/build/

Build the backend:

   cd backend
   mvn clean package

Run the packaged backend:

   java -jar target/backend-0.0.1-SNAPSHOT.jar

The exact JAR filename may change when the project version changes.


10. Deployment Configuration

Public deployment is currently inactive. The project includes configuration for:

- Firebase Hosting for the React frontend
- Google Cloud Run for the Spring Boot backend
- Google Cloud SQL for the MySQL database

The application can be deployed again after valid cloud services, environment variables, and database credentials are configured.


11. SECURITY NOTES

- Store production secrets in environment variables or a managed secret store.
- Do not commit application.properties when it contains credentials.
- Restrict CORS to approved frontend domains in production.
- Validate all customer and administrative input on the backend.
- Protect administrative routes with authentication and authorization.
- Use HTTPS for all production traffic.
- Keep Java, Spring Boot, npm packages, and database dependencies updated.


12. BUSINESS INFORMATION

Golden Brows Threading & Beauty Studio
15733 Downey Avenue
Paramount, CA 90701

Website:
https://goldenbrowsthreading.com

Services include eyebrow threading, facials, waxing, lash lifts, brow
lamination, and tinting.


13. AUTHOR

Santosh Adhikari
Full-Stack Developer

Built as a real-world business platform using React, Java, Spring Boot, REST
APIs, MySQL, Firebase Hosting, and Google Cloud.


14. FUTURE IMPROVEMENTS

- Add automated unit and integration tests
- Add Docker support for consistent development and deployment
- Add automated CI/CD checks
- Add email or SMS appointment notifications
- Add improved reporting and business analytics
- Expand accessibility and performance testing

