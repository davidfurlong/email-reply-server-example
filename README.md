# Email reply service

## Look at logs

ssh root@<YOUR-REMOTE-IP>
docker ps
docker logs <CONTAINER_ID> --tail 100

## DEPLOYING

Do a build
\$ npm run build

Push build to docker cloud
\$ npm run deploy

On remote (ssh)

$ docker pull <YOUR-DOCKER-ID>
$ docker ps
$ docker kill <CONTAINER_ID>
$ docker run -p 25:2525 <YOUR-DOCKER-ID>
