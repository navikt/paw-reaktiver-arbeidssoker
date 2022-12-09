echo 'Eksempel melding: {"fnr": "08857798121","kontrollMeldekortRef": 2599531,"arbeidssokerNestePeriode": true,"periodeFra": "2022-10-24","periodeTil": "2022-11-06","kortType": "MANUELL_ARENA","opprettet": "2022-11-09T12:30:52.107"}'
KAFKA_DOCKER_NAME=`docker ps | grep "kafka" | awk '{ print $11 }'`
echo KAFKA_DOCKER_NAME
docker exec -it $KAFKA_DOCKER_NAME kafka-console-producer.sh --broker-list 127.0.0.1:9092 --topic test
