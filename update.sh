docker build -t rjferguson21/nightwatcher-server .
docker push rjferguson21/nightwatcher-server
kubectl scale --replicas=0 deployment/nightwatcher-server && kubectl scale --replicas=1 deployment/nightwatcher-server
