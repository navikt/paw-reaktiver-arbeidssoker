KAFKA_DOCKER_NAME=`docker ps | grep "kafka" | awk '{ print $11 }'`
BOOTSTRAP_SERVER_PARAM="--bootstrap-server localhost:9092"
TOPIC_PARAM="--topic test"
docker exec -it $KAFKA_DOCKER_NAME kafka-topics.sh $BOOTSTRAP_SERVER_PARAM --list
docker exec -it $KAFKA_DOCKER_NAME kafka-consumer-groups.sh $BOOTSTRAP_SERVER_PARAM --all-groups --describe
# docker exec -it aia-backend_kafka_1 kafka-topics.sh $BOOTSTRAP_SERVER_PARAM --describe $TOPIC_PARAM
# docker exec -it aia-backend_kafka_1 kafka-topics.sh $BOOTSTRAP_SERVER_PARAM --delete $TOPIC_PARAM
