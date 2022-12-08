# paw-reaktiver-arbeidssoker

Reaktiverer arbeidssøkere som har blitt inaktivert, men som svarer at de fortsatt ønsker å være registrert på meldekortet.

# Utvikling

Bruk Node.js 18.

Du kan bruke [NVM](https://github.com/nvm-sh/nvm) for å sette versjon.
F.eks. `nvm install 18.12.1 && nvm use 18.12.1`

-   klon repo
-   installer avhengigheter `npm i`
-   start kafka: `docker-compose up -d`
-   start utviklingsserver `npm start`

## Stoppe kafka

`docker-compose stop && docker-compose rm -f`

## Deploye kun til dev

Ved å prefikse branch-navn med `dev/`, så vil branchen kun deployes i dev.

```
git checkout -b dev/<navn på branch>
```

evt. rename branch

```
git checkout <opprinnlig-branch>
git branch -m dev/<opprinnlig-branch>
```

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles via issues her på github.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-paw-dev](https://nav-it.slack.com/archives/CLTFAEW75)

# Lisens

[MIT](LICENSE)