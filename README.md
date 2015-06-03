PAPI.js (Pressly API)
==

Papi.js offers a Promise based abstraction for accessing the Pressly API.



## Install

You can install through npm and require in your project with commonJS require.

##### npm
```
npm install papi
```

```javascript
var Papi = require('papi');
```

##### Download Release

Releases can be downloaded here https://github.com/pressly/papi.js/releases you can then script include /dist/papi.js in your project

```html
<script type="text/javascript" src="papi.js"></script>
```

This will expose the `Papi` class globally.

## API Docs

1. Login to https://beta.pressly.com
2. View docs at: https://beta-api.pressly.com/docs

## Getting a JWT

1. Login to https://beta.pressly.com
2. Visit https://beta-api.pressly.com/auth/session and copy the `jwt` string

## Connection

##### Papi::constructor(`options`)
- **options*** (optional) | Object | see below

Most of the time you can simply create a new api instance from Papi without specifying any options:

```javascript
var api = new Papi();
```

You can also optionally specify options.

#### Options
- **host** | String | defaults to 'https://beta-api.pressly.com'
- **timeout** | Integer | Global timeout in ms for all requests

```javascript
var api = new Papi({ host: 'https://dev-api.pressly.com', timeout: 20000 });
```

## Authentication

All authentication is handled under the Papi.auth module.

##### auth.login(`email`, `password`)
- **email** (required) | String
- **password*** (required) | String

Returns Promise which resolves session response.

```javascript
api.auth.login(email, password).then(function(session) {
  // Returns logged in session
});
```

##### auth.logout()

Returns promise for successful logout.

```javascript
api.auth.logout(email, password).then(function() {
  // User is successfully logged out
});
```

##### auth.get()

Returns promise which resolves the current session.

This will attempt to pass an authentication cookie if one exists to retreive the logged in session.

```javascript
api.auth.get().then(function(session) {
  // Returns current session if already logged in
});
```

##### auth.set(`session`)
- **session** (required) | Object | a stored session object.

You may wish to store the `api.auth.session` object on the client and restore it at a later time.

```javascript
api.auth.set(session);
```

## Resources

Before we can fetch data we need to set up the appropriate resource we wish to query.

##### $resource(`key`, `*params`)
- **key** (required) | String | Key of the resource eg. 'hubs.assets'
- **params** (optional) | Object | eg. `{ hubId: 123 }`

Returns a prepared Resource.

##### Creating a resource
```javascript
var resource = api.$resource('hubs'); // returns a Hubs Resource
```

##### Creating a nested resource
When directly specifying nested resources we use the format `parent.child` starting from the root.

```javascript
var resource = api.$resource('hubs.assets'); // returns an Assets Resource
```

##### Preparing a resource with params
In cases where we are creating a nested resource we will need to specify the ids of the parents. This can be done at the time you request data from the resource via the `all` or `find` methods *or* you can prepare the resource with default params when you create it.

**Note** The param names for parent ids take the form `{singular parent name }Id` ie. hubs -> hubId

```javascript
var resource = api.$resource('hubs.assets', { hubId: 123 }); // returns an Assets Resource with set hub id
```

Now this resource will be setup to return assets from hub '123'.

Here is an example of preparing a resource that is nested 3 deep. The styles resource.

```javascript
var resource = api.$resource('hubs.apps.styles', { hubId: 123, appId: 456 }); // returns a Styles Resource with set hub and app id
```

#### Additional Modifiers

You can additionally set modifiers on the resource like limiting the number of results, or setting query params.

##### limit(`rpp`)
- **rpp** (required) | Integer | Requests per page, Number or results to return for `all` and custom actions

Returns the resource.

```javascript
resource.limit(15);
```

##### query(`params`)
- **params** (required) | Object | Query params that will be set on the request ie. `{ q: 1, b: 2 }` -> `?q=1&b=2`

Returns the resource.

```javascript
resource.query({ q: 1, b: 2 });
```

Because modifiers return the current resource you can chain them like so:

```javascript
resource.limit(15).query({ q: 1, b: 2 });
```

##### timeout(`ms`)

Specify a maximum timeout before an error is triggered for requests on this resource

```javascript
resource.timeout(20000);
```


## Requests

Requesting data is done by the `all` and `find` methods on a Resource.

##### all(`*params`)
- **params** (optional) | Object | ex. `{ hubId: 123 }`
params will override anything set in the resource.

Returns a `Promise` which resolves an Array of result models.

```javascript
resource.all().then(function(hubs) {
  ...
});
```

##### find(`id` or `params`)
- **id** (optional) | Integer | ex `123`
- **params** (optional) | Object | ex. `{ hubId: 123, id: 1 }`
params will override anything set in the resource.

returns a `Promise` which resolves a result model.

```javascript
resource.find(123).then(function(hub) {
  ...
});
```

##### Models can also `$resource` child resources to get associated data

Result models are extended with the resource that generated it so you can
access `$resource` to generate child resources.

```javascript
api.$resource('hubs').find(123).then(function(hub) {
  hub.$resource('apps').all().then(function(apps) {
    ..
  });
});
```

Notice that when you chain queries you specify the child name `hubs` rather than the full resource key `hubs.apps`.

This is equivalent to:

```javascript
api.$resource('hubs').find(123).then(function(hub) {
  api.$resource('hubs.apps', { hubId: hub.id }).all().then(function(apps) {
    ..
  });
});
```

## API Schema

Below outlines the schema of all the RESTful resources, their routes, associated model, and child resources.


###Account

**`accounts`**

#####REST Endpoints

- `GET` /accounts
- `POST` /accounts
- `GET` /accounts/:id
- `PUT` /accounts/:id
- `DELETE` /accounts/:id
#####Children

- [User](#user)
- [Hub](#hub)



###User

**`accounts.users`**

#####REST Endpoints

- `GET` /accounts
- `POST` /accounts
- `GET` /accounts/:accountId/users/:id
- `PUT` /accounts/:accountId/users/:id
- `DELETE` /accounts/:accountId/users/:id



###Hub

**`accounts.hubs`**

#####REST Endpoints

- `GET` /accounts
- `POST` /accounts
- `GET` /accounts/:accountId/hubs/:id
- `PUT` /accounts/:accountId/hubs/:id
- `DELETE` /accounts/:accountId/hubs/:id



###Hub

**`hubs`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:id
- `PUT` /hubs/:id
- `DELETE` /hubs/:id
*Additional Actions*

- `POST` /hubs/:id/upgrade

- `GET` /hubs/:id/search

#####Children

- [App](#app)
- [Feed](#feed)
- [Invite](#invite)
- [Recommendation](#recommendation)
- [User](#user)
- [Collection](#collection)
- [Tag](#tag)
- [Asset](#asset)
- [Draft](#draft)



###App

**`hubs.apps`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/apps/:id
- `PUT` /hubs/:hubId/apps/:id
- `DELETE` /hubs/:hubId/apps/:id
*Additional Actions*

- `GET` /hubs/:hubId/apps/:id/current

#####Children

- [Style](#style)



###Style

**`hubs.apps.styles`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/apps/:appId/styles/:id
- `PUT` /hubs/:hubId/apps/:appId/styles/:id
- `DELETE` /hubs/:hubId/apps/:appId/styles/:id



###Feed

**`hubs.feeds`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/feeds/:id
- `PUT` /hubs/:hubId/feeds/:id
- `DELETE` /hubs/:hubId/feeds/:id
#####Children

- [Asset](#asset)



###Asset

**`hubs.feeds.assets`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/feeds/:feedId/assets/:id
- `PUT` /hubs/:hubId/feeds/:feedId/assets/:id
- `DELETE` /hubs/:hubId/feeds/:feedId/assets/:id



###Invite

**`hubs.invites`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/invites/:id
- `PUT` /hubs/:hubId/invites/:id
- `DELETE` /hubs/:hubId/invites/:id



###Recommendation

**`hubs.recommendations`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/recommendations/:id
- `PUT` /hubs/:hubId/recommendations/:id
- `DELETE` /hubs/:hubId/recommendations/:id



###User

**`hubs.users`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/users/:id
- `PUT` /hubs/:hubId/users/:id
- `DELETE` /hubs/:hubId/users/:id



###Collection

**`hubs.collections`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/collections/:id
- `PUT` /hubs/:hubId/collections/:id
- `DELETE` /hubs/:hubId/collections/:id



###Tag

**`hubs.tags`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/tags/:id
- `PUT` /hubs/:hubId/tags/:id
- `DELETE` /hubs/:hubId/tags/:id



###Asset

**`hubs.assets`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/stream/:id
- `PUT` /hubs/:hubId/stream/:id
- `DELETE` /hubs/:hubId/stream/:id
*Additional Actions*

- `PUT` /hubs/:hubId/stream/:id/feature

- `PUT` /hubs/:hubId/stream/:id/unfeature

- `PUT` /hubs/:hubId/stream/:id/hide

- `PUT` /hubs/:hubId/stream/:id/unhide

- `PUT` /hubs/:hubId/stream/:id/lock

- `PUT` /hubs/:hubId/stream/:id/unlock

#####Children

- [Model](#model)
- [Comment](#comment)



###Model

**`hubs.assets.likes`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/stream/:assetId/likes/:id
- `PUT` /hubs/:hubId/stream/:assetId/likes/:id
- `DELETE` /hubs/:hubId/stream/:assetId/likes/:id



###Comment

**`hubs.assets.comments`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/stream/:assetId/comments/:id
- `PUT` /hubs/:hubId/stream/:assetId/comments/:id
- `DELETE` /hubs/:hubId/stream/:assetId/comments/:id



###Draft

**`hubs.drafts`**

#####REST Endpoints

- `GET` /hubs
- `POST` /hubs
- `GET` /hubs/:hubId/drafts/:id
- `PUT` /hubs/:hubId/drafts/:id
- `DELETE` /hubs/:hubId/drafts/:id



###CodeRevision

**`code_revisions`**

#####REST Endpoints

- `GET` /code_revisions
- `POST` /code_revisions
- `GET` /code_revisions/:id
- `PUT` /code_revisions/:id
- `DELETE` /code_revisions/:id
#####Children

- [Hub](#hub)



###Hub

**`code_revisions.hubs`**

#####REST Endpoints

- `GET` /code_revisions
- `POST` /code_revisions
- `GET` /code_revisions/:code_revisionId/hubs/:id
- `PUT` /code_revisions/:code_revisionId/hubs/:id
- `DELETE` /code_revisions/:code_revisionId/hubs/:id
