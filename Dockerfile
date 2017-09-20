FROM hypriot/rpi-node:6.10.0 as build
#-alpine

WORKDIR /code

ADD package.json package.json
RUN npm install --production
ADD bin bin
ADD lib lib

CMD [ "node", "/code/bin/app.js" ]

FROM hypriot/rpi-node:6.10.0-alpine

WORKDIR /code
COPY --from=build /code/node_modules /code/node_modules
COPY --from=build /code/package.json /code/package.json
COPY --from=build /code/lib /code/lib
COPY --from=build /code/bin /code/bin
CMD ["node", "bin/app.js"]
