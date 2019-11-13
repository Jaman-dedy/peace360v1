## peace360

## Mission

Promote transformative peace narratives through peacebuilding information and education.

---

## Vision

Inspire, connect, and amplify global peacebuilding efforts with local stories.

---

## API Spec

The preferred JSON object to be returned by the API should be structured as follows:

### Users (for authentication)

```source-json
{
  "user": {
    "name":"activist",
    "email": "activist@peace360.peace",
    "pwd": "your secret pwd",
    "avatar": "your awesome avatar",
    "country": "your country",
    "organisation": "peaceMaker",
    "category": "peaceMaker",
    "isAdmin": false,
    "date": "date",
  }
}
```

### Profile

```source-json
{
  "profile": {
    "user": "userId",
    "company": "yourCompany",
    "website": "peace360.com",
    "location": "yourLocation",
    "skills": "yourSkills",
    "bio": "I can not close my eyes, even when I sleep",
    "experience": [
        {
      title: "experienceTitle",
      company: "the company",
      location: "company location",
      from: "starting date",
      to: "ending date",
      current: true,
      description: "creating the feature"
        }
    ],
    "education": [
        {
      school: "yourSchool",
      degree: "master",
      fieldofstudy: "your fieldofstudy",
      from: "starting date",
      to: "ending date",
      current: false,
      description: "we learned how to train the dragon"
    }
    ],
    social:"your social network media"
  }
}
```

### Single Article

````source-json
{
  "article": {
    "text": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "user": {
      "name": "activist",
      "avatar": "https://i.stack.imgur.com/xHWG8.jpg",
    },
    "likes":
      "user": {
      "name": "activist",
      "avatar": "https://i.stack.imgur.com/xHWG8.jpg",
    },
    "ratings": {
       "user": {
      "name": "activist",
      "avatar": "https://i.stack.imgur.com/xHWG8.jpg",
    },
    "rate": "4"
    },
    "comments":[
        {
          "user": {
          "name": "activist",
          "avatar": "https://i.stack.imgur.com/xHWG8.jpg",
                 },
          "text":"how you can comment",
          "date":"this date"
        }
    ]
  }
}

### Errors and Status Codes

If a request fails any validations, expect errors in the following format:

```source-json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
````

### Other status codes:

401 for Unauthorized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request

## Endpoints:

### Authentication:

`POST /api/users/login`

Example request body:

```source-json
{
  "user":{
    "email": "activist@peace.com",
    "password": "myPwd"
  }
}
```

### Registration:

`POST /api/users`

Example request body:

```source-json
{
  "user":{
    "username": "activist",
    "email": "activist@peace360.com",
    "password": "yourPwd"
  }
}
```

### Get Current User

`GET /api/user/me`

Authentication required, returns a User that's the current user

### Update Profile

`PUT /api/profile`

Example request body:

```source-json
{
  "user":{
    "email": "activist@peace360.com",
    "bio": "I like to skateboard",
    "avatar": "https://i.stack.imgur.com/xHWG8.jpg",
    ...
  }
}
```

Authentication required, returns the User

Accepted fields: `email`, `username`, `password`, `avatar`

### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a Profile

### Follow user

`POST /api/users/:articleId`

Authentication required, returns a Profile

No additional parameters required

### Unfollow user

`DELETE /api/profiles/:articleId`

Authentication required, returns a Profile

No additional parameters required

### List Articles

`GET /api/articles`

Returns approved articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=Gaetan`

### Get Article

`GET /api/articles/:articleId`

No authentication required, will return single article

### Create Article

`POST /api/articles`

Example request body:

```source-json
{
  "article": {
    "title": "How to train your dragon",
    "text": "You have to believe",
    "tags": ["peaceMaker", "peaceBuilder"]
  }
}
```

Authentication required, will return an Article

Required fields: `description`, `text`

Optional fields: `tags` as an array of Strings

### Update Article

`PUT /api/articles/:articleId`

Example request body:

```source-json
{
  "article": {
    "title": "Did you train your dragon?"
  }
}
```

Authentication required, returns the updated Article

Optional fields: `title`, `text`

### Delete Article

`DELETE /api/articles/:articleId`

Authentication required

### Add Comments to an Article

`POST /api/articles/:articleId/comments`

Example request body:

```source-json
{
  "comment": {
    "text": "They will always be trying"
  }
}
```

Authentication required, returns the created Comment
Required field: `text`

### Delete Comment

`DELETE /api/articles/:articleId/:commentId`

Authentication required

### Like Article && dislike

`POST /api/articles/like/:articleId`

Authentication required, returns the Article
No additional parameters required
