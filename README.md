<h1 align="center">  🛒 &nbsp; Shopping App 🛒 </h1>

> Built with MERN stack (MongoDB, Express, React and Node).

> Shopping App, it started for The Odin Project practice
> Started from here [curriculum](https://www.theodinproject.com/courses/nodejs/lessons/inventory-application)
> The Code can be found [here](https://github.com/hamohuh/inventory-application)

### <h2 align="center"> ⚡️⚡️⚡️ &nbsp; [Live Demo](https://afternoon-atoll-93127.herokuapp.com/) ⚡️⚡️⚡️ </h2>

## 📜 &nbsp; Table of contents

- [Main Features](#--main-features)
- [Technologies](#--technologies)
- [Key Concepts](#--key-concepts)
- [UML Diagram](#--uml-diagram)
- [Setup](#--setup)
- [ENV](#-ENV)

## 🚩 &nbsp; Main Features

> This App was made to track the order state since the customer place it
> once it's shipped the seller mark it as shipped, and then the shipper mark it as delivered.

#### Project methodology

- **Register and signin system**
  - Everyone is registered as a customer.
  - Customers can apply to be sellers. [Picture](https://imgur.com/a0Jcmtf)
  - Shipper only created by the Admin.
  - Admins can create any other admins.
- **Product life cycle**
  - A seller add a product.
  - A customer order some products, number in stock decreases.
  - The customer tracks the order's state since it's placed. [Picture](https://imgur.com/9DqrnjF)
  - Depends on the address the customer provided, the area shipper get notification. [Picture](https://imgur.com/Q2zWau2)
  - The product's seller get a notification about the order. [Picture](https://imgur.com/2ZnjDLA)
  - The shipper pick the product, the seller mark it as shipped.
  - The shipper deliver the order, and mark it as delivered.
  - The customer may want to turn it back (to be done).
- **Other facilities**
  - Users can edit their account info. [Picture](https://imgur.com/gAaF4rm)
  - Users can track their order's state. [Picture](https://imgur.com/9DqrnjF)
  - Users can add, delete or edit addresses. [Picture](https://imgur.com/YUWHMko)
  - Users can have a wishlist with any amount of products. [Picture](https://imgur.com/XVBMsAB)

#### Users roles - [Dashboard Picture](https://imgur.com/hn5QKlp)

- **Customer**
  - Sign up & login.
  - Switch the account to seller. [Picture](https://imgur.com/a0Jcmtf)
  - Purchase order of any amount of products.
  - Tracking order state. [Picture](https://imgur.com/9DqrnjF)
  - Return order (To do).
- **Seller** -> all above plus.
  - Add and edit his own products.
  - Receive notifications of the new orders the customer make (only his products).
  - Mark the orders the customers make as shipped when the Shipper takes it.
- **Shipper** -> all above plus
  - Receive notifications of orders (According to the customer address provided).
  - Ship orders to the customer's address and mark the order as Delivered.
- **Admin** -> all above plus
  - Add, Edit and Delete categories.
  - Add, Edit and Delete any products.
  - Create other Admins.
  - Create Shippers and add Shipper area he will be responsible for.
  - Restrict any user from all the permissions.

## 💹 &nbsp; Technologies

> Project is created with:

#### Backend

- Express
- Mongoose
- Json Web Token (For authentication)
- bcryptjs (for data encryption)

#### Frontend

- React JS
- Redux (Manage app state)
- React-router (To handle routing)
- Axios (For http requests)
- React Bootstrap
- React-toastify (To handle success and error messages)
- Formik (To handle forms state and validation)
- Yup (To handle client side form validation)
- Sass

## 💡 &nbsp; Key Concepts

- MVC (Model-View-Controller)
- CRUD operations
- Authentication system
- Encrypting passwords
- Images handling using multer
- OOP (Object Oriented Programming)

## 📈 &nbsp; UML Diagram

> It's my first time to design a UML so maybe it sucks :D

![UML Diagram](https://i.imgur.com/vGa9f8e.jpg)

## 💻 &nbsp; Setup

To run this project, install it locally using npm:

```
$ cd inventory-application
$ npm install (install backend dependencies)
$ cd views
$ npm install (install frontend dependencies)
$ cd ..
$ npm run server (for Node server side development)
$ npm run client (for React client side development)
$ npm run dev (for both client and server side)
```
## &nbsp; ENV
- PORT=
- DB_URI=
- JWT_SECRET=
- CLOUDINARY_CLOUD_NAME=
- CLOUDINARY_API_KEY=
- CLOUDINARY_API_ESCRET=


# Author

👤 &nbsp; **Mohamed Elashmawy**

- Twitter: [@hamohuh](https://twitter.com/hamohuh)
- Github: [@moelashmawy](https://github.com/moelashmawy)
- Linkedin: [@mo-elashmawy](https://www.linkedin.com/in/mo-elashmawy/)
- Email: [mohamed.elashmawy894@gmail.com](mailto:mohamed.elashmawy894@gmail.com)

## 📝 &nbsp; License

- This project is [MIT](./LICENSE) licensed.
