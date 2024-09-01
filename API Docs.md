# API Endpoints

Find the postman the published postman collection here: https://documenter.getpostman.com/view/32561031/2sAXjM3BXt

### 1. Upload API

- **Endpoint** : `/api/images/upload`
- **Method** : `POST`
- **Description** : Accepts a CSV file, validates the data, and starts image compression. Returns a `request_id` for tracking.
- **Request Body** : Multipart form-data with a file field (`file`) and webhook url
- **Response** :

```
{
  "request_id": "unique-request-id"
}
```

### 2. Status API

- **Endpoint** : `/api/images/status/:request_id`
- **Method** : `GET`
- **Description** : Checks the processing status of the given `request_id`.
- **Parameters** :
- `request_id` (path parameter) - The unique identifier for the processing request.
- **Response** :

```
{
    "request_id": 2,
    "status": "COMPLETED",
    "webhook_url": "https://webhook.site/4d9c5219-21f5-422c-a6c0-dd0379f17c4f"
}
```

### 3. Fetch Data API

- **Endpoint** : `/api/images/fetch/:request_id`
- **Method** : `GET`
- **Description** : Retrieves processed data associated with the `request_id`.
- **Parameters** :
- `request_id` (path parameter) - The unique identifier for the processing request.
- **Response** :

```
[
    {
        "product_id": 5,
        "product_sku": "SKU301111",
        "request_id": 3,
        "images": [
            {
                "id": 9,
                "product_id": 5,
                "request_id": 3,
                "image_url": "https://d1y82e0jn69ge0.cloudfront.net/tonale/tonale_ti/default/938X644/1WY-047.png",
                "output_url": "https://compress-image-bucket.s3-us-west-1.amazonaws.com/3/5/9-1WY-047.png"
            },
            {
                "id": 10,
                "product_id": 5,
                "request_id": 3,
                "image_url": "https://d1y82e0jn69ge0.cloudfront.net/tonale/tonale_ti/front/365X241/1WY-047.png",
                "output_url": "https://compress-image-bucket.s3.us-west-1.amazonaws.com/3/5/10-1WY-047.png"
            }
        ]
    },
    {
        "product_id": 6,
        "product_sku": "SKU302111",
        "request_id": 3,
        "images": [
            {
                "id": 11,
                "product_id": 6,
                "request_id": 3,
                "image_url": "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
                "output_url": "https://compress-image-bucket.s3.us-west-1.amazonaws.com/3/6/11-sample.jpg"
            },
            {
                "id": 12,
                "product_id": 6,
                "request_id": 3,
                "image_url": "https://d1y82e0jn69ge0.cloudfront.net/tonale/tonale_ti/side/365X241/1WY-047.png",
                "output_url": "https://compress-image-bucket.s3.us-west-1.amazonaws.com/3/6/12-1WY-047.png"
            }
        ]
    }
]
```
