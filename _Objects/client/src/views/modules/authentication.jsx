import axios from 'axios';
import { showToast } from './utility/sentalert';

export async function LoginAPI(username, password, setSuccess, setError, login) {
    setError('');
    setSuccess(false);

    try {
        const response = await axios.post('http://localhost:3000/auth/login', {
            username,
            password,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('การเข้าสู่ระบบล้มเหลว');
        }

        const data = response.data;
        setSuccess(true);
        showToast("success", "เข้าสู่ระบบสำเร็จ")
        console.log(data);
        login({ username: data.username, role: data.role, id: data.id });
    } catch (err) {
        showToast("error", err.response?.data?.error)
        setError(err.response?.data?.error || err.message);
    }
}

export async function RegisterAPI(
    username,
    email,
    password,
    confirmPassword,
    firstname,  
    lastname,  
    telephone, 
    setSuccess,
    setError
) {
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
        setError('รหัสผ่านไม่ตรงกัน');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/auth/register', {
            username,
            email,
            password,
            firstname,  
            lastname,  
            telephone,
        });

        setSuccess('ลงทะเบียนสำเร็จ!');
        showToast("success", "ลงทะเบียนสำเร็จ!");
    } catch (err) {
        setError((err.response?.data?.error || err.message));
        showToast("error", err.response?.data?.error);
    }
}
