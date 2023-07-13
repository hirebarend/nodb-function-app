# nodb-function-app

## API Reference

### GET /api/v1/{database}/{collection}

Get a list of documents.

**Query Parameters**

- `limit` - Specify the number of documents to be returned. Example: `?limit=10`
- `{key}` - Specify the filter(s) to be applied. Example: `?country=South%20Africa`

**Response**

```json
[{}, {}, {}]
```

### POST /api/v1/{database}/{collection}

Insert a document.

**Request**

```json
{}
```

**Response**

```json
{}
```

### PUT /api/v1/{database}/{collection}/{id}

Update a document.

**Request**

```json
{}
```

**Response**

```json
{}
```
