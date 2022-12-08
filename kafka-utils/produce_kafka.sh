KAFKA_DOCKER_NAME=`docker ps | grep "kafka" | awk '{ print $11 }'`
docker exec -it $KAFKA_DOCKER_NAME kafka-console-producer.sh --broker-list 127.0.0.1:9092 --topic test
