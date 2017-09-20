# ledprinter

The ledprinter is a blinking lightweight printer simulator used in our [tiny-cloud](https://github.com/sealsystems/tiny-cloud).

## Quick start

To run the printer simulator from the command line, call:

```bash
$ node bin/app.js
```

Optionally, you may specify the port, the protocol, and the maximum number of concurrent connections using environment variables:

```bash
$ PORT=9100 PROTOCOL=Socket MAX_CONNECTIONS=1 node bin/app.js
```

Currently, the following protocols are supported:

- Socket

### Building a Docker image

To build a Docker image call:

```bash
$ docker build -t sealsystems/ledprinter .
```

To run this image call:

```bash
$ docker run -p 9100:9100 \
             --rm \
             --name ledprinter \
             sealsystems/ledprinter
```

To run this image in a Docker swarm on every node:

```bash
$ docker service create \
    --mode global \
    --publish mode=host,target=9100,published=9100 \
    --mount type=bind,src=/sys,dst=/sys \
    --name ledprinter \
    sealsystems/ledprinter
```
