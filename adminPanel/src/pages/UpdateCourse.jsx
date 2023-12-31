import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/helper';
import Switch from 'react-switch';
import toast from 'react-hot-toast';


const UpdateCourse = () => {

    const navigate = useNavigate();
    const id = useParams().id;
    const token = localStorage.getItem('token');

    const [inputs, setInputs] = useState({});
    const [course, setCourse] = useState({});

    const [syllabus, setSyllabus] = useState([{ week: "", topic: "", content: "" }]);

    //creating a copy of syllabus by using the spread operator
    const handleSyllabusChange = (index, key, value) => {
        const updatedSyllabus = syllabus.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    [key]: value
                };
            }
            return item;
        });
        setSyllabus(updatedSyllabus);
    };

    // add a new syllabus item
    const addSyllabusItem = () => {
        setSyllabus([...syllabus, { week: "", topic: "", content: "" }]);
    };

    // function to remove a syllabus item
    const removeSyllabusItem = (index) => {
        const updatedSyllabus = syllabus.filter((item, i) => i !== index);
        setSyllabus(updatedSyllabus);
    };

    //handle input change
    const handleInputChange = (e) => {
        setInputs(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }

    //handle publish switch change
    const handleSwitchChange = () => {
        setInputs(prevState => ({
            ...prevState,
            published: !prevState.published
        }))
    }

    const getCourseDetails = async () => {
        try {
            const { data } = await axios.get(`${BASE_URL}/api/v1/admin/getCourse/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            // console.log(data);
            if (data?.success) {
                const fetchedCourse = data?.course;
                setCourse(fetchedCourse);
                setInputs(prevInputs => ({
                    ...prevInputs,
                    title: fetchedCourse.title,
                    instructor: fetchedCourse.instructor,
                    description: fetchedCourse.description,
                    price: fetchedCourse.price,
                    enrollment_status: fetchedCourse.enrollment_status,
                    thumbnail: fetchedCourse.thumbnail,
                    duration: fetchedCourse.duration,
                    schedule: fetchedCourse.schedule,
                    location: fetchedCourse.location,
                    prerequisites: fetchedCourse.prerequisites,
                    syllabus: fetchedCourse.syllabus,
                    published: fetchedCourse.published,
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCourseDetails();
    }, [])

    useEffect(() => {
        if (course && course.syllabus) {
            setSyllabus(course.syllabus);
        }
    }, [course]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputs.title || !inputs.instructor || !inputs.price || !inputs.thumbnail) {
            toast.error("Fields cannot be empty");
            return;
        }

        try {
            if (token) {
                const formData = new FormData();

                const syllabusJSON = JSON.stringify(syllabus);
                // console.log(syllabus);
                formData.append('title', inputs.title);
                formData.append('instructor', inputs.instructor);
                formData.append('description', inputs.description);
                formData.append('price', inputs.price);
                formData.append('enrollment_status', inputs.enrollment_status);
                formData.append('thumbnail', inputs.thumbnail);
                formData.append('duration', inputs.duration);
                formData.append('schedule', inputs.schedule);
                formData.append('location', inputs.location);
                formData.append('published', inputs.published);
                formData.append('syllabus', syllabusJSON);

                // Convert comma-separated pre-requisites to an array of strings
                const prereqs = inputs.prerequisites.split(',').map(pre => pre.trim(''));

                // Append the pre-requisites to the FormData
                prereqs.forEach((pre, index) => {
                    formData.append(`prerequisites[${index}]`, pre);
                });

                const { data } = await axios.put(`${BASE_URL}/api/v1/admin/update/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (data.success) {
                    toast.success("Course updated");
                    navigate('/home');
                } else {
                    toast.error("Error updating course");
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Check log.");
        }
    }

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`${BASE_URL}/api/v1/admin/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (data?.success) {
                toast.success("Course deleted");
                navigate('/home');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="p-8 mt-20">
            <h2 className="text-2xl font-bold mb-4">Update course</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Course Title</label>
                    <input
                        type="text"
                        name="title"
                        value={inputs.title}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Instructor</label>
                    <input
                        type="text"
                        name="instructor"
                        value={inputs.instructor}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={inputs.description}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2 h-32"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Price</label>
                    <input
                        type="text"
                        name="price"
                        value={inputs.price}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Enrollment Status</label>
                    <input
                        type="text"
                        name="enrollment_status"
                        placeholder='open/closed/ongoing'
                        value={inputs.enrollment_status}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Thumbnail Link</label>
                    <input
                        type="text"
                        name="thumbnail"
                        value={inputs.thumbnail}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Duration</label>
                    <input
                        type="text"
                        name="duration"
                        value={inputs.duration}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Schedule</label>
                    <input
                        type="text"
                        name="schedule"
                        value={inputs.schedule}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={inputs.location}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Pre-Requisites</label>
                    <textarea
                        name="prerequisites"
                        value={inputs.prerequisites}
                        onChange={handleInputChange}
                        className="w-1/2 border border-gray-300 rounded px-4 py-2 h-32"
                    />
                </div>
                {syllabus.map((item, index) => (
                    <div key={index}>
                        <label className="block text-gray-700 mb-2">Syllabus</label>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Week</label>
                            <input
                                type="number"
                                value={item.week}
                                onChange={(e) => handleSyllabusChange(index, 'week', e.target.value)}
                                className="w-1/2 border border-gray-300 rounded px-4 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Topic</label>
                            <input
                                type="text"
                                value={item.topic}
                                onChange={(e) => handleSyllabusChange(index, 'topic', e.target.value)}
                                className="w-1/2 border border-gray-300 rounded px-4 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Content</label>
                            <input
                                type="text"
                                value={item.content}
                                onChange={(e) => handleSyllabusChange(index, 'content', e.target.value)}
                                className="w-1/2 border border-gray-300 rounded px-4 py-2"
                            />
                        </div>
                        {index > 0 && (
                            <button
                                type="button"
                                onClick={() => removeSyllabusItem(index)}
                                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                            >
                                Remove Syllabus Item
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addSyllabusItem}
                    className="mb-2 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                >
                    Add Syllabus Item
                </button>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Published</label>
                    <Switch
                        onChange={handleSwitchChange}
                        checked={inputs.published}
                        onColor="#06b5d4"
                        onHandleColor="#0e7490"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                        className="react-switch"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-700 text-white py-2 rounded-lg px-4"
                >
                    Update Course
                </button>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white py-2 rounded-lg px-4"
                    onClick={handleDelete}
                >
                    Delete Course
                </button>
            </form>
        </div>
    )
}

export default UpdateCourse;