function checkAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(403).json({ error: "No authorization header" })

  const token = authHeader.split(" ")[1]

  const admins = process.env.ADMIN_API_KEYS.split(",")

  if (!admins.includes(token)) {
    return res.status(403).json({ error: "Forbidden" })
  }

  next()
}
module.exports = checkAdmin
