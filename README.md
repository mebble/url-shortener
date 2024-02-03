# URL shortener

## Test it out

Post a new url:

```
curl --location 'localhost:8080/url' \
--header 'Content-Type: application/json' \
--data '{
    "url": "www.youtube.com"
}'
```

Get based on short URL:

```
curl localhost:8080/MJ76C -v
```

## DB

```
mongosh demo_api
```

## Start server

```
pnpm start
```

Watch for file changes:

```
pnpm watch
```

## Resources

- https://www.mongodb.com/docs/drivers/node/current/quick-start/
- https://www.mongodb.com/docs/drivers/node/current/quick-reference/
- https://www.mongodb.com/docs/manual/reference/operator/update/
- https://vitest.dev/api/expect.html
