var express = require("express");
var router = express.Router();

let Comment = [
  { id: "1", title: "a title", views: 100 },
  { id: "2", title: "another title", views: 200 },
];
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(Comment);
});

module.exports = router;
