import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register, login } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const dispatch = useDispatch();
    const nav = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            await dispatch(register({ name, email, password })).unwrap();
            await dispatch(login({ email, password })).unwrap();
            nav("/dashboard");
        } catch (error) {
            setErr(error || "Registration failed");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            {err && <div className="mb-2 text-red-600">{err}</div>}
            <form onSubmit={submit} className="space-y-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full border p-2 rounded" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2 rounded" />
                <button className="w-full bg-green-600 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
}
