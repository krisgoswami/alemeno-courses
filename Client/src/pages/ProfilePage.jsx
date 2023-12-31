import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/helper';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProfilePage = () => {

    const navigate = useNavigate();
    const id = useParams().id;
    const token = localStorage.getItem('token');

    const [inputs, setInputs] = useState({});
    const [user, setUser] = useState({});

    const getUserDetails = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/user/profile/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            // console.log(data);
            if (data?.success) {
                setUser(data?.user);
                setInputs(prevInputs => ({
                    ...prevInputs,
                    name: data?.user.name,
                    email: data?.user.email,
                    password: data?.user.password,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getUserDetails();
    }, []);

    //handle input change
    const handleInputChange = (e) => {
        setInputs(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputs.name || !inputs.password) {
            toast.error("Fields cannot be empty");
            return;
        }

        try {
            if (token) {
                const formData = new FormData();

                formData.append('name', inputs.name);
                formData.append('password', inputs.password);

                const { data } = await axios.put(`${BASE_URL}/api/v1/user/profile/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (data.success) {
                    toast.success("User profile updated");
                    localStorage.setItem("username", data?.user.name);
                    navigate('/');
                } else {
                    toast.error("Error updating profile");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Check log.");
        }
    }

    return (
        <div className="h-screen p-8 bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
            <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-white mb-2">Username</label>
                    <input
                        type="text"
                        name="name"
                        value={inputs.name}
                        onChange={handleInputChange}
                        className="w-full sm:w-full border dark:bg-gray-600 dark:text-gray-50 dark:border-gray-600 border-gray-200 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-white mb-2">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={inputs.email}
                        disabled={true}
                        className="w-full sm:w-full border dark:bg-gray-600 dark:text-gray-50 dark:border-gray-600 border-gray-200 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-white mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={inputs.password}
                        onChange={handleInputChange}
                        className="w-full sm:w-full border dark:bg-gray-600 dark:text-gray-50 dark:border-gray-600 border-gray-200 rounded px-4 py-2"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white dark:bg-white hover:dark:bg-gray-200 dark:text-gray-700 font-medium py-2 rounded-lg px-4 w-full"
                >
                    Update
                </button>
            </form>
        </div>

    )
}

export default ProfilePage;