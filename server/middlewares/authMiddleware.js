import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer"))
    return res.status(401).json({ message: "Not authorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
