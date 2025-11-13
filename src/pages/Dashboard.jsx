import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMySubscription } from "../slices/plansSlice";

export default function Dashboard() {
    const auth = useSelector(s => s.auth);
    const sub = useSelector(s => s.plans.mySubscription);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth.user) {
            setLoading(true);
            dispatch(fetchMySubscription({ userId: auth.user.id })).finally(() => setLoading(false));
        }
    }, [auth.user, dispatch]);

    if (!auth.user) return null;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">My Subscription</h2>
                {loading ? <div>Loading...</div> : (
                    sub ? (
                        <div>
                            <div className="font-semibold">{sub.plan.name} — ${sub.plan.price}</div>
                            <div className="text-sm text-gray-600">Status: <span className="font-medium">{sub.status}</span></div>
                            <div className="text-sm text-gray-600">Start: {new Date(sub.start_date).toLocaleString()}</div>
                            <div className="text-sm text-gray-600">End: {new Date(sub.end_date).toLocaleString()}</div>
                        </div>
                    ) : (
                        <div className="text-gray-600">You do not have an active subscription. Visit <strong>Plans</strong> to subscribe.</div>
                    )
                )}
            </div>
        </div>
    );
}
