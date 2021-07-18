<p align="center">
  <h3 align="center">couchsurvey</h3>

  <p align="center">
    An Open-Sourve alternative to Typeform and Microsoft Forms
    <br />
    <a href="https://opensource.couchsurvey.com/"><strong>Learn more</strong></a>
  </p>
</p>

## About Couchsurvey

Are you looking for a modern open source survey & forms platform that keeps your participants' data private and secure? We are building a new & open user experience with a focus on privacy, usability and API-first integrability.

### Features

- Easy creation of surveys and forms
- Simple evaluation of the results and export of the answers as CSV
- Rest API for integration into existing systems and processes
- Form/Survey customization

### Built With

- [Typescript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Prisma](https://prisma.io/)

## Deployment

The easiest way to deploy couchsurvey yourself on your own machine is using Docker. This requires Docker and docker-compose on your system to work.

Clone the repository:

```
git clone https://github.com/couchsurvey/couchsurvey.git && cd couchsurvey
```

Create a `.env` file based on `.env.examples` and change it according to your setup. You must set the email variables to valid SMTP-credentials for the login to work:

```
cp .env.example .env && nano .env
```

Start the docker-compose process to build and spin up the couchsurvey container as well as the postgres database.

```
docker-compose up -d
```

You can now access the app on [https://localhost:3000](https://localhost:3000)

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a pull request

## License

Distributed under the MIT License. See `LICENSE` for more information.
