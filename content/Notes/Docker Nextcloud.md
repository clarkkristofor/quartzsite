## command line start fresh
docker run ^
--sig-proxy=false ^
--name nextcloud-aio-mastercontainer ^
--restart always ^
--publish 80:80 ^
--publish 8080:8080 ^
--publish 8443:8443 ^
--volume nextcloud_aio_mastercontainer:/mnt/docker-aio-config ^
--volume //var/run/docker.sock:/var/run/docker.sock:ro ^
--env NEXTCLOUD_DATADIR="/run/desktop/mnt/host/n/nextcloud-data" ^
nextcloud/all-in-one:latest

[[Docker]] [[Nextcloud]]

## move files direct then scan
sudo -u www-data php occ files:scan --all
[support chat](https://help.nextcloud.com/t/can-i-move-files-direct-to-nextcloud/33594)
[nextcloud docs](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/occ_command.html#file-operations-label)
## set up
[github nextcloud](https://github.com/nextcloud/all-in-one#how-to-properly-reset-the-instance)

## back up
backup location
/run/desktop/mnt/host/b/backup