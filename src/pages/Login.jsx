import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const dispatch = useDispatch();
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const res = await dispatch(login({ email, password })).unwrap();
            nav("/dashboard");
        } catch (error) {
            setErr(error || "Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            {err && <div className="mb-2 text-red-600">{err}</div>}
            <form onSubmit={submit} className="space-y-3">
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
                <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
            </form>
            <div className="text-sm text-gray-500 mt-3">
                Demo accounts: admin@demo.com/admin123 , user@demo.com/user123
            </div>
        </div>
    );
}
