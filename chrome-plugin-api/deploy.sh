VERSION=0.0.13
echo Deploying $VERSION

docker build -t tattletech/ogbv-plugin:$VERSION .
docker push tattletech/ogbv-plugin:$VERSION
sed -i "s/VERSION_TAG/$VERSION/g" ../../infrastructure-k8/new/ogbv-plugin/deployment.yml
kubectl apply -f ../../infrastructure-k8/new/ogbv-plugin
sed -i "s/$VERSION/VERSION_TAG/g" ../../infrastructure-k8/new/ogbv-plugin/deployment.yml