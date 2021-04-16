# Discord CodeBot

Scrapes the Gumballs and Dungeons Facebook page for Spy codes, sending them to a specified Discord channels.

## Installation

### Node.js

The application can be run locally with the following:

    cp .env{.example,}
    node .

### Docker

The application can be run in a docker container with the following:

    cp .env{.example,}
    docker build -t bradcornford/discord-codebot .
    docker run -d bradcornford/discord-codebot

### Docker-Compose

The application can be run using docker-compose container with the following:

    cp .env{.example,}
    docker-compose build
    docker-compose up -d

### Environment Variables

- DISCORD_TOKEN  - Discord API token
- DISCORD_CHANNELS - The channels code announcements should be posted to, comma-separated
- POLL_INTERVAL - The interval for checking Facebook for updates

### Example Docker Composer

    gumbot:
        image: bradcornford/discord-codebot:latest
        container_name: gumbot
        environment:
            - TZ=Europe/London
            - POLL_INTERVAL=15m
            - DISCORD_TOKEN=XXX
            - DISCORD_CHANNELS=general
        logging:
            driver: "json-file"
            options:
                max-size: "50m"
        restart: unless-stopped
