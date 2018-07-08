# Webbkoll

This is the code that powers https://webbkoll.dataskydd.net – an
online tool that checks how a webpage is doing with regards to privacy.

It attempts to simulate what happens when a user visits a specified page
with a typical browser without clicking on anything, with the
browser having no particular extensions installed, and with Do Not Track
(DNT) disabled (as this is the default setting in most browsers).

In short: this tool, which runs the user-facing web service (built with
[Elixir](https://elixir-lang.org/) and [Phoenix](http://phoenixframework.org/)),
asks a simple Node.js backend to visit a page with Chromium. The Node.js backend
uses [Puppeteer](https://github.com/GoogleChrome/puppeteer) to control Chromium; it
visits and renders the page, collects various data (requests made, cookies,
response headers, etc.), and sends it back as JSON to this tool which
then analyzes the data and presents the results on a webpage along with
explanations and advice.

Webbkoll is multilingual and currently supports English and Swedish.

[Jumbo](https://github.com/mspanc/jumbo) is used for job processing, and
some basic rate limiting is done with [ex_rated](https://github.com/grempe/ex_rated).
Multiple backends can be configured. [ConCache](https://github.com/sasa1977/con_cache)
is used to store results in an in-memory [ETS](http://erlang.org/doc/man/ets.html) table
for a limited time. Other than the Node.js backend, there are no external dependencies,
and nothing is saved to disk.

**Please note** that this is still a work in progress. Expect bugs and
messy code in places. Only a few basic tests are in place.

**Also note** that this tool is mainly meant to be used as a _starting point_
for web developers. For more rigorous and systematic testing we
recommend that you check out [OpenWPM](https://github.com/citp/OpenWPM),
which we used to analyze the websites of Sweden's municipalities
([site](https://dataskydd.net/kommuner/), [code](https://github.com/andersju/municipality-privacy)).
You might also want to have a look at [PrivacyScore](https://privacyscore.org/),
which is a bit more comprehensive than Webbkoll (additionally checks e.g. email and TLS/SSL
configuration) and also lets you compare/rank lists of sites.

This is a project by [Dataskydd.net](https://dataskydd.net). We received initial funding from
[Internetfonden](https://www.internetfonden.se/) / [IIS](https://www.iis.se) (The Internet Foundation in Sweden).

## Backend

We've switched from PhearJS/PhantomJS to a tiny script that makes use of [Puppeteer](https://github.com/GoogleChrome/puppeteer). You'll find it in `misc/backend`. Node.js 8.x LTS required. Simply run `npm install`, which should install everything necessary, including a local copy of Chromium; and then `npm start` or (`nodejs index.js`) to start.

Make sure you have all necessary system dependencies; see [Puppeteer's troubleshooting page](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md) for e.g. a list of necessary Ubuntu/Debian packages.

The backend listens to port 8100 by default. Note that this script should be considered highly experimental. It has NO throttling whatsoever -- this needs to be handled elsewhere (for Webbkoll the frontend handles this).

Inspired by [Puppeteer as a Service](https://github.com/GoogleChromeLabs/pptraas.com).

## Frontend (this app!)

Install Erlang (>= 20) and Elixir (>= 1.5) -- see http://elixir-lang.org/install.html.

Clone this repository, cd into it.

Install dependencies:

```
mix deps.get
```

Make sure the backend is running on the host/port specified in `config/dev.exs`

Download the [GeoLite2 country database](https://dev.maxmind.com/geoip/geoip2/geolite2/) in MaxMind DB binary format, extract it, and make sure it's available as `priv/GeoLite2-Country.mmdb` (or as specified in `config/config.exs`). (All you need to keep it fresh is [geoipupdate](https://github.com/maxmind/geoipupdate); Webbkoll reloads the database at certain intervals, see `config/config.exs`.)

Compile CSS with sassc and copy static assets (this replaces brunch and 340 node dependencies):

```
mkdir -p priv/static/css priv/static/fonts priv/static/images priv/static/js
sassc --style compressed assets/scss/style.scss priv/static/css/app.css
rsync -av assets/static/*  priv/static
```

Start the Phoenix endpoint with `mix phx.server` (or to get an interactive shell: `iex -S mix phx.server`)

Now you can visit [`localhost:4000`](http://localhost:4000) in your browser.

### Production

To run in production, get and compile dependencies:

```
mix deps.get --only prod
MIX_ENV=prod mix compile
```

Do the compile CSS/rsync files step from above, and then digest and compress static files:

```
MIX_ENV=prod mix phx.digest
```

Start the server in the foreground (port must be specified):

```
MIX_ENV=prod PORT=4001 mix phx.server
```

Or detached:

```
MIX_ENV=prod PORT=4001 elixir --detached -S mix phx.server
```

Or in an interactive shell:

```
MIX_ENV=prod PORT=4001 iex -S mix phx.server
```

See also the official [Phoenix deployment guides](https://hexdocs.pm/phoenix/deployment.html).

To run it as a systemd service (automatic start/restart on boot/crash/..), put something like this in e.g. `/etc/systemd/system/webbkoll.service` (make sure to adjust User, Group, WorkingDirectory, etc.):

```
[Unit]
Description=Webbkoll

[Service]
Type=simple
ExecStart=/usr/local/bin/mix phx.server
WorkingDirectory=/home/foobar/webbkoll
Environment=MIX_ENV=prod
Environment=PORT=4001
User=foobar
Group=foobar
Restart=always

[Install]
WantedBy=multi-user.target
```

Run `systemctl daemon-reload` for good measure, and then try `systemctl start webbkoll`. (And `systemctl enable webbkoll` to have it started automatically.)

### Keeping the backend running

To make sure the backend keeps running, you can have systemd unit file like this (remove the `StandardOutput` and `StandardError` lines if you don't have systemd 236 or newer):

```
[Unit]
Description=Webbkoll-backend

[Service]
Type=simple
ExecStart=/usr/bin/npm start
WorkingDirectory=/home/foobar/webbkoll/misc/backend
User=foobar
Group=foobar
Restart=always
StandardOutput=file:/home/foobar/backend-out.log
StandardError=file:/home/foobar/backend-err.log

[Install]
WantedBy=multi-user.target
```

## TODO/ideas
  * Add more suggestions for privacy-friendly alternatives to popular services
  * Optionally visit a number of randomly selected internal pages and let the results be based on the collective data from all the pages
  * Availability over Tor (e.g. does the visitor have to solve a Cloudflare captcha?)
  * HTTPS Everywhere: check for requests that _could_ have been secure
  * Check localStorage (Web Storage)
  * SSL Labs integration (or testssl.sh?)
  * DNSSEC?
  * IPv6 support
  * Check whether site is in HSTS preload list?
  * More translations?
  * More? Let me know!

## Credits & things used
  Frontend:
  * [Phoenix Framework](http://www.phoenixframework.org/) (MIT license) by Chris McCord
  * [Bourbon](https://github.com/thoughtbot/bourbon), [Neat](https://github.com/thoughtbot/neat), [Bitters](https://github.com/thoughtbot/bitters), [Refills](https://github.com/thoughtbot/refills) (MIT license) by thoughtbot
  * [Sortable](https://github.com/HubSpot/sortable) (MIT license) by Adam Schwartz
  * [Font Awesome](https://fortawesome.github.io/Font-Awesome/) (SIL OFL 1.1) by Dave Gandy
  * [Disconnect's open source list of trackers](https://github.com/disconnectme/disconnect-tracking-protection) (GPLv3) by Disconnect, Inc.
  * GeoLite2 data created by MaxMind (CC BY-SA 4.0), available from [http://www.maxmind.com](http://www.maxmind.com)
  * JSON for ISO 3166-1 country code i18n from [node-i18n-iso-countries
](https://github.com/michaelwittig/node-i18n-iso-countries) (MIT license)

  Backend:
  * [Puppeteer](https://github.com/GoogleChrome/puppeteer) (Apache License 2.0) by the Chrome DevTools team
  * [Express](https://github.com/expressjs) (MIT license)

## License
    The MIT License (MIT)

    Copyright (c) 2016 Anders Jensen-Urstad

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
