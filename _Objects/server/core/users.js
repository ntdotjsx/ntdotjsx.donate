const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer'); 
const path = require('path');
const router = express.Router();
const prisma = new PrismaClient();

// config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // config dir image
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // date + path -> name 💌
    }
});

const upload = multer({ storage: storage });


router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const userId = parseInt(id, 10);

        const user = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        if (!username || !email) {
            return res.status(400).json({ error: 'ไม่สามารถแก้ไขข้อมูลว่างเปล่าได้' });
        }

        const userId = parseInt(id, 10);
        const user = await prisma.users.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'ไม่เจอผู้ใช้' });
        }

        if (user.username === username && user.email === email) {
            return res.status(400).json({ error: 'ไม่พบการเปลี่ยนแปลง!' });
        }

        // ✅ Check if another user has the same username
        const existingUser = await prisma.users.findUnique({ where: { username } });

        if (existingUser && existingUser.id !== userId) {
            return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });
        }

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { username, email },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
});

router.put('/:id/3', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status input

    try {
        const userId = parseInt(id, 10);
        const user = await prisma.users.findUnique({
            where: { id: userId },
        });
        
        if (!user) {
            return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
        }

        if (user.status === status) {
            return res.status(400).json({ error: 'ไม่พบการเปลี่ยนแปลง!' });
        }

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { status },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const userId = parseInt(id, 10);

      const user = await prisma.users.findUnique({
        where: { id: userId },
      });
      
      if (!user) {
        return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
      }
      
      await prisma.donation.deleteMany({
        where: { userId },
      });
      
      // delete user
      const deletedUser = await prisma.users.delete({
        where: { id: userId },
      });
      
      res.json({ message: 'ลบผู้ใช้สำเร็จ', deletedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
router.put('/:id/2', async (req, res) => {
    const { id } = req.params;
    const { email, telephone, firstname, lastname } = req.body;

    try {
        if (!telephone || !email || !firstname || !lastname) {
            return res.status(400).json({ error: 'ไม่สามารถแก้ไขข้อมูลว่างเปล่าได้' });
        }

        const userId = parseInt(id, 10);
        const user = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'ไม่เจอผู้ใช้' });
        }

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { email, telephone, firstname, lastname},
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API upload image profile
router.put('/:id/profile-image', upload.single('image'), async (req, res) => {
    const { id } = req.params;

    try {
        const userId = parseInt(id, 10);
        const user = await prisma.users.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.file) {
            const updatedUser = await prisma.users.update({
                where: { id: userId },
                data: { image: req.file.path },
            });

            res.json(updatedUser);
        } else {
            return res.status(400).json({ error: 'No file uploaded' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                username: true,
                firstname: true,
                lastname: true,
                telephone: true,
                role: true,
                email: true,
                image: true,
                status: true,
                createdAt: true
            },
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
