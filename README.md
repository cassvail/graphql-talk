# graphql - talk

## Query

```gql
query ($filter: BooksFilterInput, $sort: BooksSortInput){
  books (filter: $filter, sort: $sort) {
    id,
    title,
    pubdate,
  }
  authors: {
    id,
    name
  }
  publishers {
    id,
    name
  }
}

```

## params
```
{
  "filter": {
    "title": "B"
  },
  "sort": {
    "title": "desc"
  }
}
```

# Mutation
```gql
mutation ($id: ID!, $data: AuthorInput) {
  updateBook (id: $id, data: $data) {
    name
  }
}
```

## params
```
{
  "id": 1,
  "data": {
    "title": "Abraham Merritt"
  }
}
```