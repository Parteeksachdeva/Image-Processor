## Image Processing System

## Overview

This project is an image processing system that accepts image data from CSV files, validates and compresses images asynchronously, and stores the results in a database. The system provides APIs to upload image data, check processing status, and retrieve results.

## Features

* **Upload API** : Accepts CSV files containing product information and image URLs, validates the data, and initiates asynchronous image compression.
* **Status API** : Allows users to check the processing status of their image requests.
* **Data Retrieval** : Fetches and serves processed data from the database.
* **Image Compression** : Compresses images by 50% using worker threads.

## Tech Stack

* **Backend** : Node.js
* **Database** : Prisma ORM with PostgreSQL (or another SQL database)
* **Queue** : Bull for job queue management
* **Redis** : Redis for caching and queuing
* **Image Processing** : Worker threads for asynchronous processing

## [#API Endpoints](API Docs.md)

## Setup and Installation

1. **Clone the Repository** :

```
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

1. **Install Dependencies** :

```
npm install
npm install sharp --include=optional
```

1. **Environment Variables** :
   Create a `.env` file in the root directory and add the following variables:

```
PORT=3000
DATABASE_URL=<Postgres url>
REDIS_URL=<redis connection url>

AWS_ACCESS=<AWS ACCESS ID>
AWS_SECRET=<AWS SECRET>
AWS_BUCKET_NAME=<AWS BUCKET NAME>
```

1. **Run Migrations** :

```
npx prisma migrate dev
```

1. **Start the Application** :

```
npm start
```

## Usage

* **Upload a CSV file** : Use the Upload API to submit a CSV file for processing.
* **Check processing status** : Use the Status API to check the current status of your request.
* **Fetch processed data** : Use the Fetch Data API to retrieve processed results.

## [#Detailed Architecture Document](Architecture Docs.md)
