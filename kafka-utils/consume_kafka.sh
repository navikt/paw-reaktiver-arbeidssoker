KAFKA_DOCKER_NAME=`docker ps | grep "kafka" | awk '{ print $11 }'`
docker exec -it $KAFKA_DOCKER_NAME kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
