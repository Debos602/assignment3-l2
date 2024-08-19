 * Overview:
The Car Management System is a platform that allows users to rent cars and admins to manage the car inventory and bookings. It features user authentication, role-based access control, and real-time booking updates.

Live-Url: https://assignment-3-blond.vercel.app/

* User Authentication: Secure JWT-based authentication for users and admins.
* Car Management: Admins can add, update, soft delete cars, and manage availability.
* Booking System: Users can book available cars, and admins can update booking details such as return time and total cost.
* Responsive Design: Optimized for all screen sizes.
* Admin Control: Admin-only access to manage cars and bookings.

* Node.js
* Express.js
* TypeScript
* MongoDB with Mongoose
* JWT for authentication
* Vercel for deployment

  .
├── src
│   ├── app   # Handles application logic
│     ├── config       
│     ├── errors        
│     ├── Middlewar      
│     ├── Modules   
│     └── utils       
├── .env              
├── package.json      
└── README.md         
