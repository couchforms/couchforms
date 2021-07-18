module.exports = {
  serverRuntimeConfig: {
    SECRET: process.env.SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/surveys/",
        permanent: true,
      },
    ];
  },
};
