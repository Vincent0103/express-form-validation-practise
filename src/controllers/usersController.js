import { title } from 'process';
import usersStorage from '../storages/usersStorage';
import { body, query, validationResult } from "express-validator";

const alphaErr = "must only contain letters.";
const lengthErr = (min, max) => `must be between ${min} and ${max} characters.`;
const mailErr = "must be formatted properly like so: johndoe@company.com";
const ageErr = "must be in the range 18 and 120";
const descLengthErr = "must be below 200 characters.";

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr(1, 10)}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr(1, 10)}`),
  body("mail").trim()
    .isEmail().withMessage(`Email ${mailErr}`),
  body("age").optional({ values: "falsy" }).trim()
    .isInt({ min: 18, max: 120 }).withMessage(`Age ${ageErr}`),
  body("bio").optional({ values: "falsy" }).trim()
    .isLength({ max: 200 }).withMessage(`Bio ${descLengthErr}`)
];


const validateSearchUser = [
  query("name")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isAlpha().withMessage(`Name ${alphaErr}`)
    .isLength({ min: 1, max: 20 }).withMessage(`Name ${lengthErr(1, 20)}`),
  query("email")
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .isEmail().withMessage(`Email ${mailErr}`)
];

const usersController = (() => {
  const usersListGet = (req, res) => {
    res.render("index", {
      title: "User list",
      users: usersStorage.getUsers(),
    });
  };

  const usersCreateGet = (req, res) => {
    res.render("createUser", {
      title: "Create users",
    });
  };

  const usersCreatePost = [
    validateUser,
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("createUser", {
          title: "Create user",
          errors: errors.array(),
        });
      }
      const { firstName, lastName, mail, age, bio } = req.body;
      usersStorage.addUser({ firstName, lastName, mail, age, bio });
      res.redirect("/");
    }
  ];

  const usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };

  const usersUpdatePost = [
    validateUser,
    (req, res) => {
      const user = usersStorage.getUser(req.params.id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update user",
          user: user,
          errors: errors.array(),
        });
      }
      const { firstName, lastName, mail, age, bio } = req.body;
      usersStorage.updateUser(
        req.params.id,
        { firstName, lastName, mail, age, bio }
      );
      res.redirect("/");
    }
  ];

  const usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
  }

  const usersSearchGet = [
    validateSearchUser,
    (req, res) => {
      if (Object.keys(req.query).length === 0) {
        return res.render("searchUser", {
          title: "Search user"
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("searchUser", {
          title: "Search user",
          errors: errors.array(),
        });
      }

      const { name, mail } = req.query;
      if (!name && !mail) {
        return res.render("searchUser", {
          title: "Search user",
          errors: [{ msg: "Must provide a name or email to search." }],
        });
      }

      const users = usersStorage.getUsers(name, mail);
      res.render("search", {
        title: "Search results",
        users: users
      });
    }
  ];

  return {
    usersListGet, usersCreateGet, usersCreatePost,
    usersUpdateGet, usersUpdatePost, usersDeletePost,
    usersSearchGet
  };

})();

export default usersController;
