"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const DB_PATH = './src/db/database.db';
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const db = yield (0, sqlite_1.open)({
        filename: DB_PATH,
        driver: sqlite3_1.default.Database
    });
    const saltRounds = 10;
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    try {
        yield db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, hashedPassword);
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Error while creating user' });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const db = yield (0, sqlite_1.open)({
        filename: DB_PATH,
        driver: sqlite3_1.default.Database
    });
    try {
        const user = yield db.get('SELECT * FROM users WHERE username = ?', username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const result = yield bcrypt_1.default.compare(password, user.password);
        if (!result) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Authentication successful', token });
    }
    catch (err) {
        res.status(500).json({ error: 'Error while authenticating user' });
    }
});
exports.signIn = signIn;
