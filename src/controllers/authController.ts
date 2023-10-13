import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const DB_PATH = './src/db/database.db';

export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', username, hashedPassword);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error while creating user' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  try {
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Authentication successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Error while authenticating user' });
  }
};