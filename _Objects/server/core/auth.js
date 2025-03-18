const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/register', async (req, res) => {
    const { username, email, password, firstname, lastname, telephone } = req.body;

    if (!username || !email || !password || !firstname || !lastname || !telephone) {
        return res.status(400).json({ error: 'จำเป็นต้องมีชื่อผู้ใช้, อีเมล, รหัสผ่าน, ชื่อ, นามสกุล และหมายเลขโทรศัพท์' });
    }

    try {
        const existingUserByEmail = await prisma.users.findUnique({ where: { email } });
        const existingUserByTelephone = await prisma.users.findUnique({ where: { telephone } });

        if (existingUserByEmail) {
            return res.status(400).json({ error: 'มีผู้ใช้อีเมลนี้อยู่แล้ว' });
        }
        if (existingUserByTelephone) {
            return res.status(400).json({ error: 'มีผู้ใช้หมายเลขโทรศัพท์นี้อยู่แล้ว' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
                firstname,  
                lastname,    
                telephone,    
            },
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            telephone: user.telephone,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ข้อผิดพลาดเซิร์ฟเวอร์ภายใน' });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'ชื่อผู้ใช้และรหัสผ่านเป็นสิ่งจำเป็น' });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { username }
        });

        // ✅ check user pass
        if (user && user.role && await bcrypt.compare(password, user.password)) {
            // ✅ check access
            if (user.status === 'NO') {
                return res.status(403).json({ error: 'บัญชีนี้ถูกระงับการใช้งาน' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.json({
                token,
                username: user.username,
                role: user.role,
                id: user.id
            });
        } else {
            res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง !' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ข้อผิดพลาดเซิร์ฟเวอร์ภายใน' });
    }
});

// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({ error: 'Username and password are required' });
//     }
//     try {
//         const user = await prisma.users.findUnique({ where: { username } });
//         if (user && await bcrypt.compare(password, user.password)) {
//             const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
//             res.json({ token, username });
//         } else {
//             res.status(401).json({ error: 'Invalid username or password' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

module.exports = router;
