// Sign up, log in and "who am I" routes. Users are stored in users.json for now.
// Passwords are hashed with bcrypt and never stored or returned in plain text.
const fs = require("fs");
const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const FILE = path.join(__dirname, "users.json");

let SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  if (process.env.NODE_ENV === "production") throw new Error("Set JWT_SECRET before running in production.");
  SECRET = "dev-only-secret-change-me";
  console.warn("Warning: using a development JWT secret. Set JWT_SECRET in backend/.env.");
}

const load = () => { try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch (e) { return []; } };
const save = (users) => fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });
const makeToken = (u) => jwt.sign({ sub: u.id }, SECRET, { expiresIn: "7d" });

router.post("/signup", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (name.length < 2) return res.status(400).json({ error: "Please enter your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email address." });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

  const users = load();
  if (users.some((u) => u.email === email)) return res.status(409).json({ error: "An account with this email already exists. Try logging in." });

  const user = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, email, passwordHash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
  users.push(user);
  save(users);
  res.status(201).json({ token: makeToken(user), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = load().find((u) => u.email === email);
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: "Incorrect email or password." });
  res.json({ token: makeToken(user), user: publicUser(user) });
});

function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  try {
    const { sub } = jwt.verify(token, SECRET);
    const user = load().find((u) => u.id === sub);
    if (!user) throw new Error("no user");
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: "Please log in again." });
  }
}

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = { router, requireAuth };
