const rolePermissions = {
  0: ["create_record","view_record","update_record","delete_record","manage_users","view_users","view_dashboard"],
  1: ["view_record","view_dashboard","view_category_totals","view_trends","view_recent"],
  2: ["view_dashboard"]
};

module.exports = (action) => {
  return (req, res, next) => {
    if (!rolePermissions[req.user.role]?.includes(action)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};