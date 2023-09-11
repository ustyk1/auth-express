const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const { db_url, hash } = require('./config');

mongoose.connect(db_url);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Помилка підключення до бази даних:'));

db.once('open', async () => {
    try {
        const hashPassword = bcrypt.hashSync('Qwerty-1', hash)

        const user = new User({
            firstName: 'ADMIN',
            lastName: 'ADMIN',
            email: 'ADMIN@ADMIN.COM',
            password: hashPassword,
            sex: 'ADMIN',
            phone: 999999999999,
            roles: ['ADMINISTRATOR','USER'],
            isActivated: true
        })

        await user.save()
        console.log('Користувач створений успішно.');
    } catch (error) {
        console.log('Помилка створення користувача', error);
    } finally {
        db.close()
    }
});
