import express from 'express';
import users from './api/users';
import socialAuth from './api/socialAuth';
import auth from './api/auth';
import profile from './api/profile';
import article from './api/article';
import comment from './api/comment';
import search from './api/search';
import category from './api/category';

// @ initialize app

const app = express();

//@ router configuration

app.use('/api/users', [users, socialAuth]);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/article', article);
app.use('/api/comment', comment);
app.use('/api/search', search);
app.use('/api/category', category);

export default app;
