# API Document
a set of RESTful APIs include public part for blog app and private part for administator.

## Article API

### Article List API
get article list

* request
> /api/article/list?tag=&author=&keyword=

  * *tag*?: String

  * *author*?: String

  * *keyword*?: String

* public response:
```
{
  articles: [
    {
      _id: string, //article id
      thumb: string, //thumb image url
      description: string,
      title: string,
      tags: [
        string
      ],
      createTime: timestamp,
      author: {
        id: string, //uniqued user id, eg. 'xykbear'
        name: string //nickname, eg. 'XYKbear'
      }
    }
  ],
  pagenation: {
    current: number,
    max: number
  }
}
```

### Article API
get single article

* request
> /api/article/:articleId

  * *articleId*: String

* public response:
```
{
  _id: string, //article id
  content: string,
  title: string,
  tags: [
    string
  ],
  createTime: timestamp,
  author: {
    id: string, //uniqued user id, eg. 'xykbear'
    name: string //nickname, eg. 'XYKbear'
  }
}
```

## Author API
get author infomation.

**TODO**: this api can be merge into user api

* request
> /api/author/:userId

  * *userId*: String

* public response:
```
{
  id: string, //uniqued user id, eg. 'xykbear'
  name: string, //nickname, eg. 'XYKbear'
  avatar: Stirng, //avatar image url
  description: String, //user description
}
```