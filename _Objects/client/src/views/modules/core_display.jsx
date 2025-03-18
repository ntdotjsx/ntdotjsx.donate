import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NotFound from '../404';
import axios from 'axios';
import io from 'socket.io-client';
import gsap from 'gsap';

const themes = {
    Jennie: {
        textColor: "text-transparent bg-clip-text bg-gradient-to-r from-[#0000ff] to-[#3B82F6]",
        emoji: "💖🎤💃",
        effectIn: { scale: 1.1, opacity: 1, duration: 0.5, ease: "power2.out" },
        effectOut: { scale: 0.5, opacity: 0, duration: 0.5, ease: "power2.in" }
    },
}; // ไม่เสร็จอะส่งก่อน

const DonateDisplay = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [donationQueue, setDonationQueue] = useState([]);
    const [currentDonation, setCurrentDonation] = useState(null);
    const [userTheme, setUserTheme] = useState("Jennie");

    const notificationRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        document.body.classList.add('display_page');

        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get('user_id');

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${userId}`);
                setUser(response.data);
                setUserTheme(response.data.theme || "Jennie");
            } catch (error) {
                console.error("Error fetching Display:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }

        return () => {
            document.body.classList.remove('display_page');
        };
    }, [location.search]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userId = queryParams.get('user_id');

        socketRef.current = io('http://localhost:3000', {
            transports: ['websocket'],
        });

        socketRef.current.on('newDonation', (data) => {
            if (userId === String(data.userID)) {
                setDonationQueue((prevQueue) => [...prevQueue, data]);
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [location.search]);

    useEffect(() => {
        if (!currentDonation && donationQueue.length > 0) {
            const nextDonation = donationQueue[0];
            setCurrentDonation(nextDonation);
            setDonationQueue((prevQueue) => prevQueue.slice(1));

            if (notificationRef.current) {
                const theme = themes[userTheme] || themes.Jennie;
                gsap.fromTo(notificationRef.current, { opacity: 0, scale: 0.5 }, theme.effectIn);
            }

            setTimeout(() => playAudio(nextDonation.audio), 1000);
            setTimeout(() => {
                if (notificationRef.current) {
                    const theme = themes[userTheme] || themes.Jennie;
                    gsap.to(notificationRef.current, {
                        ...theme.effectOut,
                        onComplete: () => setCurrentDonation(null),
                    });
                } else {
                    setCurrentDonation(null);
                }
            }, 10000);
        }
    }, [donationQueue, currentDonation]);

    const playAudio = (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.muted = true;
        audio.play()
            .then(() => {
                audio.muted = false;
            })
            .catch((err) => {
                console.error("Failed to autoplay audio:", err);
            });
    };

    const theme = themes[userTheme] || themes.Jennie;

    if (loading) return <p>Loading...</p>;
    if (!user) return <NotFound />;

    return (
        <div
            ref={notificationRef}
            className="flex items-center justify-center h-screen transition-all"
            style={{ opacity: 0 }}
        >
            <div className="box p-6">
                {currentDonation && (
                    <>
                        <h1 className={`title border-black ${theme.textColor} text-3xl font-bold`}>
                            <span>{currentDonation.donorName}</span>
                            <span className="ml-2 text-white">ได้โดเนท</span>
                            <span className="ml-2">{currentDonation.amount}฿</span>
                        </h1>
                        <h1 id="message" className={`message text-center border-black ${theme.textColor} text-lg`}>
                            {currentDonation.message}
                        </h1>
                    </>
                )}
            </div>
        </div>
    );
};

export default DonateDisplay;
