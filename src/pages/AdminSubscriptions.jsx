import React, { useEffect, useState } from "react";
import { api } from "../api/fakeApi";

export default function AdminSubscriptions() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await api.adminListSubscriptions();
            if (res.ok) setRows(res.subscriptions);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">All Subscriptions (Admin)</h2>
            {loading ? <div>Loading...</div> : (
                <div className="bg-white p-4 rounded shadow">
                    <table className="w-full text-left">
                        <thead className="text-sm text-gray-600">
                            <tr>
                                <th>User</th><th>Email</th><th>Plan</th><th>Start</th><th>End</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.id} className="border-t">
                                    <td className="py-2">{r.user.name}</td>
                                    <td>{r.user.email}</td>
                                    <td>{r.plan.name}</td>
                                    <td>{new Date(r.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(r.end_date).toLocaleDateString()}</td>
                                    <td>{r.status}</td>
                                </tr>
                            ))}
                            {rows.length === 0 && <tr><td colSpan="6" className="py-4 text-center text-gray-500">No subscriptions yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
