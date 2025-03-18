const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const axios = require('axios');
const prisma = new PrismaClient();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

router.use((req, res, next) => {
    req.io = req.app.get('io');
    next();
});
    
router.get('/', (req, res) => {
    const io = req.io;
    io.on('connection', (socket) => {
        console.log('connected');
        socket.emit('newDonation', latestDonation);
        socket.on('disconnect', () => {
            console.log('disconnected');
        });
    });
    res.send('Donation route');
});

router.get("/ranking", async (req, res) => {
    try {
        const rankings = await prisma.donation.groupBy({
            by: ["userId"],
            _sum: {
                amount: true,
            },
            _count: {
                userId: true,
            },
            orderBy: {
                _sum: {
                    amount: "desc",
                },
            },
        });

        // Get data -> userId
        const rankingWithUsers = await Promise.all(
            rankings.map(async (rank) => {
                const user = await prisma.users.findUnique({
                    where: { id: rank.userId },
                    select: {
                        id: true,
                        username: true,
                        firstname: true,
                        lastname: true,
                        image: true,
                    },
                });

                return {
                    userId: rank.userId,
                    totalAmount: rank._sum.amount || 0,
                    donationCount: rank._count.userId, // จำนวนครั้งที่ได้รับบริจาค
                    user,
                };
            })
        );

        res.json(rankingWithUsers);
    } catch (error) {
        console.error("Error fetching ranking:", error);
        res.status(500).json({ error: error.message });
    }
});



router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const userId = parseInt(id, 10);
        const donation = await prisma.donation.findMany({
            where: { userId: userId },
        });
        res.json(donation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/page/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const user = await prisma.users.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                image: true,
            },
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

router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'THB',
            payment_method_types: ['card', 'promptpay']
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/donations', async (req, res) => {
    try {
        const { userID, donorName, amount, message } = req.body;

        if (!message || !userID || !donorName || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const response = await axios.post(
            'https://api.play.ht/api/v2/tts/stream',
            {
                text: message,
                voice: "s3://voice-cloning-zero-shot/3a831d1f-2183-49de-b6d8-33f16b2e9867/dylansaad/manifest.json", // Sound Thai
                output_format: 'mp3',
                voice_engine: 'Play3.0-mini',
                language: 'thai',
                speed: 0.9
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: API_SECRET,
                    'X-User-ID': API_KEY,
                },
                responseType: 'arraybuffer',
            }
        );

        const donation = await prisma.donation.create({
            data: {
                userId: userID,
                guest_name: donorName,
                amount: parseInt(amount, 10),
                message: message,
            },
        });
        const io = req.app.get('io');
        io.emit('newDonation', {
            userID,
            donorName,
            amount,
            message,
            audio: `data:audio/mpeg;base64,${Buffer.from(response.data).toString('base64')}`,
        });
        res.status(201).json({
            message: 'Donation updated successfully',
            donation,
            audio: `data:audio/mpeg;base64,${Buffer.from(response.data).toString('base64')}`
        });
    } catch (error) {
        console.error('Error creating TTS:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error creating TTS audio' });
    }
});

router.post('/test', async (req, res) => {
    try {
        const { userID, donorName, amount, message } = req.body;

        if (!message || !userID || !donorName || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const response = await axios.post(
            'https://api.play.ht/api/v2/tts/stream',
            {
                text: message,
                voice: "s3://voice-cloning-zero-shot/3a831d1f-2183-49de-b6d8-33f16b2e9867/dylansaad/manifest.json",
                output_format: 'mp3',
                voice_engine: 'Play3.0-mini',
                language: 'thai',
                speed: 0.9
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: API_SECRET,
                    'X-User-ID': API_KEY,
                },
                responseType: 'arraybuffer',
            }
        );
        const io = req.app.get('io');
        io.emit('newDonation', {
            userID,
            donorName,
            amount,
            message,
            audio: `data:audio/mpeg;base64,${Buffer.from(response.data).toString('base64')}`,
        });
        res.status(201).json({
            message: 'Donation updated successfully',
            audio: `data:audio/mpeg;base64,${Buffer.from(response.data).toString('base64')}`
        });
    } catch (error) {
        console.error('Error creating TTS:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error creating TTS audio' });
    }
});

module.exports = router;
