kubectl create secret generic seller-token-secret --from-literal=SELLER_TOKEN_KEY=kaka-koko-kuku-keke-kiki

kubectl create secret generic admin-jwt-secret --from-literal=ADMIN_JWT_KEY=ugly-clear-loyal-free-clean-dirty-fun-happy

kubectl create secret generic encrypto-secret --from-literal=ENCRYPTO_KEY=password567567567




kubectl create secret docker-registry registry-secret \
    --docker-server=https://index.docker.io/v1/ \
    --docker-username='pairfy' \
    --docker-password='arriba larga vida 505' \
    --docker-email='pairfy.io@gmail.com' \
    --dry-run=client -o yaml | kubectl apply -f -
