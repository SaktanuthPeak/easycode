import { Context } from "koa";

export default (plugin: any) => {
  plugin.controllers.user.updateMe = async (ctx: Context) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Unauthorized" };
      return;
    }

    try {
      // Log the request body for debugging
      console.log("Update request body:", ctx.request.body);

      // Check if the user exists
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id
      );

      if (!user) {
        ctx.response.status = 404;
        ctx.response.body = { error: "User not found" };
        return;
      }

      // Update the user
      const updatedUser = await strapi.entityService.update(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        {
          data: ctx.request.body,
        }
      );

      // Return the updated user (without sensitive information)
      ctx.response.status = 200;
      ctx.response.body = {
        message: "User updated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          birthdate: updatedUser.birthdate,
          phone_number: updatedUser.phone_number,
          // Add other non-sensitive fields you want to return
        },
      };
    } catch (error) {
      console.error("Error updating user:", error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Internal server error" };
    }
  };

  // Register both route paths to be safe
  // This registers /user/me
  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/user/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  // This registers /users/me
  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/users/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};
