<p align="center">
<a href="https://github.com/couchsurvey/couchsurvey">
    <img src="https://opensource.couchsurvey.com/couchsurvey-icon-light.svg" alt="Logo" width="160">
  </a>
  <h3 align="center">couchsurvey</h3>

  <p align="center">
    An Open-Source alternative to Typeform and Microsoft Forms
    <br />
    <a href="https://opensource.couchsurvey.com/">Website</a>  |  <a href="https://join.slack.com/t/couchsurvey-community/shared_invite/zt-thcbja0g-srPj6QUYosTyOr8NcAGa9g">Join slack community</a>
  </p>
</p>

## About Couchsurvey

<img width="937" alt="screenshot-couchsurvey" src="https://user-images.githubusercontent.com/675065/126078214-83cb0077-5149-4ac7-ae66-502ff31e9705.png">

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

## Getting started

To get the project running locally on your machine you need to have the following development tools installed:

- Node.JS
- Yarn
- PostgreSQL

1. Clone the project:

```
git clone https://github.com/couchsurvey/couchsurvey.git && cd couchsurvey
```

2. Install Node.JS packages:

```
yarn install
```

3. Create a `.env` file based on `.env.examples` and change it according to your setup. Make sure the `DATABASE_URL` variable is set correctly according to your local database. You must also set the email variables to valid SMTP-credentials for the login to work.

```
cp .env.example .env && nano .env
```

4. Let prisma set up the database for you:

```
npx prisma db push
```

5. Start the development server:

```
yarn dev
```

You can now access the app on [https://localhost:3000](https://localhost:3000)

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
