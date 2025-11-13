import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { subscribePlan } from "../slices/plansSlice";
import { useNavigate } from "react-router-dom";

export default function Plans() {
    const plans = useSelector((s) => s.plans.list);
    const auth = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const nav = useNavigate();

    const doSubscribe = async (planId) => {
        if (!auth.user) {
            nav("/login");
            return;
        }
        try {
            await dispatch(subscribePlan({ userId: auth.user.id, planId })).unwrap();
            alert("Subscribed! Check your Dashboard.");
            nav("/dashboard");
        } catch (e) {
            alert("Subscription failed: " + e);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Choose Your Plan
            </h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:shadow-2xl hover:scale-[1.02] transition-transform"
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {p.name}
                        </h3>
                        <div className="text-3xl font-bold text-blue-600 mb-4">
                            ${p.price}
                            <span className="text-base text-gray-500">/mo</span>
                        </div>

                        <ul className="text-gray-600 text-sm mb-6 space-y-2">
                            {p.features.map((f, i) => (
                                <li key={i}>• {f}</li>
                            ))}
                        </ul>

                        <button
                            onClick={() => doSubscribe(p.id)}
                            className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full font-medium"
                        >
                            Subscribe
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
