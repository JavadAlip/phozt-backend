import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const adminLogin = (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Identifier and password required" });
  }

  if (
    (identifier === process.env.ADMIN_EMAIL || identifier === process.env.ADMIN_USERNAME) &&
    password === process.env.ADMIN_PASSWORD
  ) {
    // Generate JWT token
    const token = jwt.sign(
      { admin: true, identifier },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Admin login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
};
