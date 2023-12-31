import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ id, title, description, price, thumbnail }) => {

    const navigate = useNavigate();

    return (
        <div className="bg-cyan-200 w-80 max-h-[450px] h-[500px] p-4 shadow-md rounded-2xl">
            <img src={thumbnail} alt={''} className="w-full h-40 object-cover mb-4 rounded-md" />
            <h3 className="text-xl text-black font-medium mb-2 truncate max-h-24 overflow-hidden">{title}</h3>
            <p className="text-gray-700 mb-2 font-semibold ">{description}</p>
            <p className="text-gray-700 mb-2 font-bold">₹ <span className='font-normal'>{price}</span></p>
            <button
                onClick={() => {
                    navigate(`/course/${id}`);
                }}
                className="bg-cyan-500 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg">
                View
            </button>
        </div>
    );
};

export default CourseCard;
