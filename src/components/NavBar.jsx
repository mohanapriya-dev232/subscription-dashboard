import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";

export default function NavBar() {
    const auth = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const nav = useNavigate();

    const doLogout = () => {
        dispatch(logout());
        nav("/login");
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/plans" className="text-2xl font-bold text-blue-700">
                    Dashboard
                </Link>

                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link
                        to="/plans"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Plans
                    </Link>
                    {auth.user?.role === "admin" && (
                        <Link
                            to="/admin/subscriptions"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            Admin
                        </Link>
                    )}

                    {auth.user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Hi, {auth.user.name}
                            </Link>
                            <button
                                onClick={doLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-3 py-1 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
