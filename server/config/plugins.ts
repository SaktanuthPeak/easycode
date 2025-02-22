const config = ({ env }: { env: (key: string) => string }) => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: [
          "firstname",
          "lastname",
          "email",
          "password",
          "birthdate",
          "user_group",
          "phone_number",
        ],
      },
    },
  },
});

export default config;
