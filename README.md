<h1 align="center">  🛒 &nbsp; Shopping App 🛒 </h1>

> Built with MERN stack (MongoDB, Express, React and Node).

> Shopping App, it started for The Odin Project practice
> Started from here [curriculum](https://www.theodinproject.com/courses/nodejs/lessons/inventory-application)
> The Code can be found [here](https://github.com/hamohuh/inventory-application)

### <h2 align="center"> ⚡️⚡️⚡️ &nbsp; [Live Demo](https://afternoon-atoll-93127.herokuapp.com/) ⚡️⚡️⚡️ </h2>

## 📜 &nbsp; Table of contents

- [Main Features](#main-features)
- [Technologies](#technologies)
- [Key Concepts](#key-concepts)
- [UML Diagram](#UML-diagram)
- [Setup](#setup)

## 🚩 &nbsp; Main Features

> This App was made to track the order state since the customer place it
> once it's shipped the seller mark it as shipped, and then the shipper mark it as delivered.

- Controlling the life cycle of the product
  - A seller add a product
  - A customer order some products
  - A shipper pick the product and deliver it
  - The customer may want to turn it back (to be done)
- Control categories that contain products
  - Add Delete Update (only admins)
- Controll products
  - Add, Update (for sellers) & Delete (Only admins)
- Register and signin system
  - Everyone is registered as only a customer
  - Customers can apply to be a seller
  - Shipper is only approved by the Admin
  - Admin can create any other admins

## 💹 &nbsp; Technologies

#### Project is created with:

#### Backend

- Express
- Mongoose
- Json Web Token (For authentication)
- bcryptjs (for data encryption)

#### Frontend

- React JS
- Redux
- Axios (For http requests)
- React Bootstrap
- React-router
- React-toastify
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

![alt text](https://i.imgur.com/vGa9f8e.jpg)

## 💻 &nbsp;Setup

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

# Author

👤 &nbsp; **Mohamed Elashmawy**

- Twitter: [@hamohuh](https://twitter.com/hamohuh)
- Github: [@hamohuh](https://github.com/hamohuh)
- Linkedin: [@mo-elashmawy](https://www.linkedin.com/in/mo-elashmawy/)
- Email: [hamodroid@gmail.com](mailto:hamodroid@gmail.com)

## 📝 &nbsp; License

- This project is [MIT](./LICENSE) licensed.
