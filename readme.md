discogs-notifier
=====================

self hosted check for immediate listing emails on a **public** list of your choosing.

add/edit/delete from your list to manage what you are emailed about. 

## Prerequisites
* [Docker](https://docs.docker.com/get-docker/) (if using the prebuilt image, which is recommended) or [Node](https://nodejs.org/en/download/) (if running from source).
* A Gmail account to send / recieve emails
* A public [Discogs list](https://support.discogs.com/hc/en-us/articles/360001567973-How-To-Make-A-List#:~:text=You%20can%20switch%20a%20list,other%20areas%20on%20the%20site.) 

See 'Deploying' below for setup instructions.
## Limitations
* Gmail only.
* currently does not support entire wantlists.
* purely checks if there are new listings, or if the price for a listing has changed (no filters are supported yet).
* will ignore releases that have over 250 items listed (we are going after rare ones here, anyway :-) ).
* everything is in memory, so any downtime will fail to capture new items listed during the downtime.

## Parameters
- (Required)  `DISCOGS_LIST` = the list of releases to be notified on.
- (Required)  `GMAIL_EMAIL` = the email address where notifications will go.
- (Required)  `GMAIL_PASSWORD` = the password of the email account.
    - If 2FA is enabled on your Gmail account, you must create an [app password](https://support.google.com/accounts/answer/185833?hl=en) to supply instead. **On May 30, 2022, this will be a [requirement](https://support.google.com/accounts/answer/6010255).** 
    - If issues arise when connecting to the mail server, attempt to allow the app via this [unlock captcha](https://accounts.google.com/b/0/displayunlockcaptcha).
- (Optional) `COUNTRY_FILTER` = recieve listing notifications only from the specified country. **Must show up exactly as it does in Discogs (I recommend just copy and pasting from there)**
- (Optional) `UPDATE_INTERVAL` = the number of seconds in between rerunning the check.
    - Discogs has a maximum of 25 rpm. setting this value to be greater than 3 is not recommended and might cause unintended 429 responses from the discogs API.
- (Optional) `NOTIFIER_LOG_LEVEL` = if having issues, set the log level to `debug` for more granular logs.

## Deploying
### From Source
Copy the .env file and fill out the appropriate values.
```bash
cp .env .env.local
```
Install dependencies
```bash
npm i
```
Start the process.
```bash
npm run-script dev
```
### From Docker
(fill in your own env vars of course):
```bash
docker run -d --restart always -e GMAIL_EMAIL="" -e GMAIL_PASSWORD="" -e DISCOGS_LIST=976316 evanshriner/discogs-notifier:latest
```

any questions: evan.shriner@gmail.com