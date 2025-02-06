import React from 'react'
import { Facebook } from 'lucide-react'

const FacebookLoginButton = () => {
    const handleFacebookLogin = () => {
        window.location.href = "http://localhost:1337/api/connect/facebook"
    }

    return (
        <button
            type="button"
            onClick={handleFacebookLogin}
            className="w-full mt-3 bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-sm"
        >
            <Facebook className="mr-2" size={16} />
            Login with Facebook
        </button>
    )
}

export default FacebookLoginButton