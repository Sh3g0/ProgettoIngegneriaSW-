import { useState, useEffect } from 'react';

export function Profile(){
    return(
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">    
    <div className="mb-4">
        <label className="block text-gray-600 font-semibold mb-1">Username:</label>
        <p className="text-gray-800 border rounded-lg p-2 bg-gray-100">clientuse</p>
    </div>

    <div className="mb-4">
        <label className="block text-gray-600 font-semibold mb-1">Email:</label>
        <p className="text-gray-800 border rounded-lg p-2 bg-gray-100">abc@gmail.com</p>
    </div>

    <div className="mb-4">
        <label className="block text-gray-600 font-semibold mb-1">Password:</label>
        <p className="text-gray-800 border rounded-lg p-2 bg-gray-100">●●●●●●●●</p>
    </div>

    </div>

    )
}
