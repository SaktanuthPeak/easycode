export default {
  async register(ctx) {
    try {
      const { username, email, password } = ctx.request.body;

      if (!username || !email || !password) {
        return ctx.badRequest("Missing required fields.");
      }

      // Check if user exists
      const existingUser = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });

      if (existingUser) {
        return ctx.badRequest("Email already registered.");
      }

      // Create user
      const newUser = await strapi.entityService.create(
        "plugin::users-permissions.user",
        {
          data: {
            username,
            email,
            password,
            confirmed: true,
          },
        }
      );

      // Generate JWT
      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: newUser.id,
      });

      return ctx.send({ user: newUser, jwt });
    } catch (error) {
      console.error("Registration error:", error);
      return ctx.internalServerError("Failed to register.");
    }
  },
};
