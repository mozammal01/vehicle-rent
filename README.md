# 🌐 Project Name: Vehicle Rent

# 🌐 Live URL: [https://vehicle-rent-seven.vercel.app/](https://vehicle-rent-seven.vercel.app/)

**GitHub Repository:** [https://github.com/mozammal01/vehicle-rent](https://github.com/mozammal01/vehicle-rent)

---

# ✨ Features

## Authentication & Authorization

## User Management
- **User Registration** - Sign up with role-based 
- **User Login** - Using JWT authentication with 7-day token expiry
- **Role-Based Access Control** - Secure endpoints based on user roles (Admin/Customer)
- **Password Security** - Using Bcrypt hashing for Password Hashing


- **View All Users** - Only Admin can view all users
- **Update User Profile** - Admin can update any user, Customers can update their own profile
- **Delete User** - Admin can delete any user (with active booking protection)

## Vehicle Management

- **Add Vehicles** - Only Admin can add vehicles (car, bike, van, suv)
- **View All Vehicles** - Anyone can view all vehicles
- **View Single Vehicle** - Anyone can view a single vehicle
- **Update Vehicle** - Only Admin can update a vehicle
- **Delete Vehicle** - Only Admin can delete a vehicle

## Booking Management

- **Create Booking** - Anyone can create a booking (auto-calculates total price)
- **View Bookings** - Admin can view all bookings, Customers can view their own bookings
- **Update Booking Status** - Admin can update the status of a booking (active, cancelled, returned)

---

# 🛠️ Technology Stack  
 ----------------- 
 **Node.js**        
 **Express.js v5**           
 **TypeScript**                
 **PostgreSQL**     
 **JWT**            
 **Bcrypt.js**            
 **Dotenv**         

---

# 📦 Installation & Setup

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm

## 1. Clone the Repository

```bash
git clone https://github.com/mozammal01/vehicle-rent.git
cd vehicle-rent
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Environment Configuration

Create a `.env` file in the root directory:

```env
CONNECTION_STR=your_postgresql_connection_string
PORT=your_port
JWT_SECRET=your_jwt_secret_key
```

## 4. Run the Application

**Development Mode:**

```bash
npm run dev
```

The server will start at `http://localhost:${PORT}`

# GitHub Repo : [https://github.com/mozammal01/vehicle-rent](https://github.com/mozammal01/vehicle-rent)

# Live URL : [https://vehicle-rent-seven.vercel.app/](https://vehicle-rent-seven.vercel.app/)

---

# 👤 Author

**Mozammal**

---

## 📄 License

This project is licensed under the ISC License.
