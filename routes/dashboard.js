const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Token required" });

    jwt.verify(token, "your_secret_key", (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

// Proteksi route /dashboard
router.get("/dashboard", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the dashboard!" });
});