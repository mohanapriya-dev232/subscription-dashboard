// Simulated backend using localStorage

const KEY = "subdash_data_v1";

function nowISO() { return new Date().toISOString(); }
function addDaysISO(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
}
function randToken() { return Math.random().toString(36).slice(2); }

function seedIfNeeded() {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    const data = {
        users: [
            // demo user
            { id: "u_admin", name: "Admin", email: "admin@demo.com", password: "admin123", role: "admin" },
            { id: "u_user", name: "Priya", email: "user@demo.com", password: "user123", role: "user" },
        ],
        plans: [
            { id: "p1", name: "Basic", price: 5, features: ["1 project", "Email support"], duration: 30 },
            { id: "p2", name: "Pro", price: 15, features: ["10 projects", "Priority support"], duration: 30 },
            { id: "p3", name: "Enterprise", price: 49, features: ["Unlimited projects", "Dedicated support"], duration: 365 }
        ],
        subscriptions: [],
        refreshTokens: {}
    };
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
}

function getData() { return seedIfNeeded(); }
function setData(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

function simulateDelay(result, ms = 300) {
    return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

/* Auth logic: create accessToken with expiry (1min for demo), refresh token lasts longer */
export const api = {
    register: async ({ name, email, password }) => {
        const data = getData();
        if (data.users.find(u => u.email === email)) {
            return simulateDelay({ ok: false, error: "Email already registered" }, 300);
        }
        const id = "u_" + randToken();
        const user = { id, name, email, password, role: "user" };
        data.users.push(user);
        setData(data);
        return simulateDelay({ ok: true, user: { id, name, email, role: user.role } });
    },

    login: async ({ email, password }) => {
        const data = getData();
        const user = data.users.find(u => u.email === email && u.password === password);
        if (!user) return simulateDelay({ ok: false, error: "Invalid credentials" }, 300);
        const accessToken = "atk_" + randToken();
        const refreshToken = "rtk_" + randToken();
        const expiresAt = Date.now() + 1000 * 60 * 10; // 10 minutes for demo
        data.refreshTokens[refreshToken] = { userId: user.id, issuedAt: Date.now() + 0 };
        setData(data);
        return simulateDelay({
            ok: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            tokens: { accessToken, refreshToken, expiresAt }
        }, 300);
    },

    refreshAccessToken: async ({ refreshToken }) => {
        const data = getData();
        const meta = data.refreshTokens[refreshToken];
        if (!meta) return simulateDelay({ ok: false, error: "Invalid refresh token" }, 200);
        const newAt = "atk_" + randToken();
        const newExpires = Date.now() + 1000 * 60 * 10;
        return simulateDelay({ ok: true, accessToken: newAt, expiresAt: newExpires }, 200);
    },

    getPlans: async () => {
        const data = getData();
        return simulateDelay({ ok: true, plans: data.plans });
    },

    subscribe: async ({ userId, planId }) => {
        const data = getData();
        const plan = data.plans.find(p => p.id === planId);
        if (!plan) return simulateDelay({ ok: false, error: "Plan not found" }, 200);
        const start_date = new Date().toISOString();
        const end_date = addDaysISO(plan.duration);
        const subscription = {
            id: "s_" + randToken(),
            user_id: userId,
            plan_id: planId,
            start_date,
            end_date,
            status: "active"
        };
        data.subscriptions = data.subscriptions.map(s => s.user_id === userId ? { ...s, status: "expired" } : s);
        data.subscriptions.push(subscription);
        setData(data);
        return simulateDelay({ ok: true, subscription });
    },

    mySubscription: async ({ userId }) => {
        const data = getData();
        const sub = data.subscriptions.find(s => s.user_id === userId && s.status === "active");
        if (!sub) return simulateDelay({ ok: true, subscription: null });
        if (new Date(sub.end_date) < new Date()) {
            sub.status = "expired";
            setData(data);
            return simulateDelay({ ok: true, subscription: null });
        }
        const plan = data.plans.find(p => p.id === sub.plan_id);
        return simulateDelay({ ok: true, subscription: { ...sub, plan } });
    },

    adminListSubscriptions: async () => {
        const data = getData();
        const rows = data.subscriptions.map(s => {
            const user = data.users.find(u => u.id === s.user_id) || {};
            const plan = data.plans.find(p => p.id === s.plan_id) || {};
            return { ...s, user: { id: user.id, name: user.name, email: user.email }, plan };
        });
        return simulateDelay({ ok: true, subscriptions: rows });
    },

    getProfile: async ({ userId }) => {
        const data = getData();
        const user = data.users.find(u => u.id === userId);
        if (!user) return simulateDelay({ ok: false, error: "User not found" });
        return simulateDelay({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
};
