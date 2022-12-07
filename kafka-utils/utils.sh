BOOTSTRAP_SERVER_PARAM="--bootstrap-server localhost:9092"
TOPIC_PARAM="--topic test"
docker exec -it paw-reaktiver-arbeidssoker_kafka_1 kafka-topics.sh $BOOTSTRAP_SERVER_PARAM --list
docker exec -it paw-reaktiver-arbeidssoker_kafka_1 kafka-consumer-groups.sh $BOOTSTRAP_SERVER_PARAM --all-groups --describe
# docker exec -it aia-backend_kafka_1 kafka-topics.sh $BOOTSTRAP_SERVER_PARAM --describe $TOPIC_PARAM
# docker exec -it aia-backend_kafka_1 kafka-topics.sh $BOOTSTRAP_SERVER_PARAM --delete $TOPIC_PARAM
