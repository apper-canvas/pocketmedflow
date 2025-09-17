import { useEffect } from 'react';

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showResetPassword('#authentication-reset-password');
    }, []);

    return (
        <>           
            <div className="flex-1 py-12 px-5 flex justify-center items-center">
                <div id="authentication-reset-password" className="bg-white/80 backdrop-blur-sm mx-auto w-[400px] max-w-full p-10 rounded-xl shadow-card border border-secondary-200"></div>
            </div>
        </>
    );
};

export default ResetPassword;