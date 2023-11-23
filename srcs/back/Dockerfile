FROM		node:lts AS development

WORKDIR		/app

RUN			apt-get update -y && \
			npm install -g @nestjs/cli

COPY		. .

RUN			npm install

EXPOSE		3000

# RUN			npm run start

CMD			[ "npm", "run", "start" ]

