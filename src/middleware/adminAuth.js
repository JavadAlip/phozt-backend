// import jwt from "jsonwebtoken";

// export const adminAuth = (req, res, next) => {
//   let token = req.headers["authorization"];

//   if (!token) return res.status(401).json({ message: "No token provided" });

//   if (token.startsWith("Bearer ")) {
//     token = token.slice(7, token.length).trim();
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.admin = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };



// for only testing
import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  //  Skip token verification when in test mode
  if (process.env.NODE_ENV === "test") {
    console.log("Auth skipped in testing mode");
    return next();
  }

  //  Normal token verification logic
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
