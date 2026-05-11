const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
const port = 3004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));

app.use(express.static("public"));

const mapRoutes = require("./routes/map");
const authRoutes = require("./routes/auth");
const nhaMayRoutes = require("./routes/nhamay");

app.use("/nhamay", nhaMayRoutes);
app.use("/api", mapRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.render("trangchu", {
    user: req.session.user || null,
  });
});
app.get("/dangnhap", (req, res) => {
  res.render("dangnhap");
});
app.get("/dangky_admin", (req, res) => {
  res.render("dangky_admin");
});
app.get("/dangky", (req, res) => {
  res.render("dangky");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Lỗi server!");
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
