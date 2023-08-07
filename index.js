const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const productsRouter = require("./routes/Product");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const { User } = require("./models/User");
const { isAuth, sanitizeUser } = require("./services/common");
const crypto = require('crypto');

const SECRET_KET = 'SECRET_KEY';
// JWT Options
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KET ;

// middlewere
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-count"],
  })
);
server.use(express.json()); //to parse JSON body
server.use("/products",isAuth(), productsRouter.router);
server.use("/brands",isAuth(), brandsRouter.router);
server.use("/categories",isAuth(), categoriesRouter.router);
server.use("/users", usersRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart",isAuth(), cartRouter.router);
server.use("/orders",isAuth(), ordersRouter.router);

// Passport Strategies
passport.use('local',
  new LocalStrategy({usernameField:'email'},async function (email, password, done) {
    try {
      const user = await User.findOne(
        { email: email },
      ).exec();
      // TODO: this is just temporary, we will use strong password auth
      if (!user) {
        done(null, false, { message: 'no such user email' })
      } 
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
             done(null, false, { message: 'invalid credentials' })
          } else{
            const token = jwt.sign(sanitizeUser(user), SECRET_KET);
            done(null, token);
          }
        })
     
    } catch (err) {
      done(err);
    }
  })
);

passport.use('jwt', new JwtStrategy(opts, async function(jwt_payload, done) {
  try{
    const user = await User.findOne({id: jwt_payload.sub});
    if (user) {
          return done(null, sanitizeUser(user)); //this calls serializer
      } else {
          return done(null, false);
      }
  }catch(err){
    return done(err, false);
  }

}));

//this creates session variables req.user on being called from callables
passport.serializeUser(function (user, cb) {
  console.log('serialized', user);
  process.nextTick(function () {
    return cb(null, {id:user.id, role:user.role});
  });
});

passport.deserializeUser(function (user, cb) {
  console.log('de-serialized', user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

main().catch((err) => console.log(err));
async function main() {

  await mongoose.connect("mongodb+srv://ab16dev:Alex%401998@cluster0.zltp252.mongodb.net/ecommerce");
  //await mongoose.connect("mongodb://localhost:27017/ecommerce");
  console.log("databse-connected");
}


// Swagger
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0', // Specify the OpenAPI version
//     info: {
//       title: 'Your API Title', // Your API title
//       version: '1.0.0', // Your API version
//       description: 'Your API description', // Your API description
//     },
//     servers: [
//       {
//         url: `http://localhost:8080`, // Your server URL
//       },
//     ],

//   },
//   components: {
//     securitySchemes: {
//       BearerAuth: {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT', // You can specify the token format (JWT, etc.)
//       },
//     },
//   },
//   security: [{ BearerAuth: [] }], // Apply BearerAuth as a global security scheme for all endpoints
//   apis: ['./routes/*.js'], // Specify the path to your API routes
// };
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'E-Commerse', // Your API title
      version: '1.0.0', // Your API version
      description: "E-Commerse API's ", // Your API description
    },
    servers: [
      {
        url: `http://localhost:8080`, // Your server URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Use BearerAuth for all endpoints by default
      },
    ],
  },
  apis: ['./routes/*.js'], // Specify the path to your API routes
  // Custom CSS to style the Swagger UI
  customCss: '.swagger-ui .topbar { display: flex; align-items: center; }',
  // Add authorization information to the Swagger UI top bar
  customSiteTitle: 'Your API - Bearer Token Authorization (JWT)',
  // Add JWT token input box to the Swagger UI top bar
  swaggerOptions: {
    urls: [], // Add your server URLs here if you want to switch between different server environments
    requestInterceptor: (req) => {
      // Get the token from the input box
      const token = document.getElementById('token').value;
      // Apply the token to the "Authorize" header
      req.headers['Authorization'] = `Bearer ${token}`;
      return req;
    },
  },
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


server.get("/", (req, res) => {
  res.json({ status: "success" });
});


server.listen(8080, () => {
  console.log("server-started");
});
