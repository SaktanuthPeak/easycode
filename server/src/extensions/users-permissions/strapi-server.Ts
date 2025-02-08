import { Strapi } from "@strapi/strapi";
import { Context } from "koa";

export default (plugin: any) => {
  plugin.controllers.user.updateMe = async (ctx: Context) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      ctx.response.status = 401;
      return;
    }

    try {
      await strapi.entityService.update(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        {
          data: ctx.request.body,
        }
      );

      ctx.response.status = 200;
      ctx.response.body = { message: "User updated successfully" };
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to update user" };
    }
  };

  plugin.routes["content-api"].routes.push({
    method: "PUT",
    path: "/user/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: [],
    },
  });

  return plugin;
};
