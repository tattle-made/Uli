# UliCommunity

This project is a Phoenix template designed to streamline the setting up of a Phoenix application with built-in authentication and authorization. It supports authentication for both LiveView and non-LiveView components. Additionally, it includes an API server for generating authentication tokens and performing actions securely using a valid token.

**Note:** The name of this Phoenix project (the name that was used in the generator while creating the project) is "uli_community"

## Table of Content

- [Start Development](#start-development)
- [Authentication in Web App itself](#authentication-in-web-app-itself)
   * [Differences between the Authentication with and without the liveview](#differences-between-the-authentication-with-and-without-the-liveview)
   * [Adjustments to make both kinds of Authentications work](#adjustments-to-make-both-kinds-of-authentications-work)
      + [Changing the Scope of non-liveview routes](#changing-the-scope-of-non-liveview-routes)
- [Authentication with Token](#authentication-with-token)
- [Authorization](#authorization)
- [Access Token](#access-token)

## Start Development

To start your Phoenix server:

  * Run `docker compose up`
  * Run `mix setup` to install and setup dependencies
  * Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check the deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Authentication in Web App itself

To generate template code for authentication, phoenix provides a command `mix phx.gen.auth`. This command provides an option to generate code with either live-view or without live-view.

In this project, we wanted to keep both kinds of authentication options as a proof of concept. So we first generated the template code with the normal (with no live-view) option and then generated it with the live-view option.

### Differences between the Authentication with and without the liveview

- The code for non-liveview generated all the relevant routes and their respective controllers.
- The code for liveview generated routes for the liveview templates with their respective controllers inside `/live` folder.
- The generator did not overwrite the routes, it just added the new routes below the old ones with different macros (live instead of REST macros). However, the route addresses were the same for both the generated routes. Ex- both had `/users/log_in` addresses for their login routes.
- For login, they both use the `UserSessionController` controller; because of this, the generator for liveview overwrote the code inside this controller. 
- Using the generator generated the same migration file to create the Accounts table twice. (In case of overwriting a file, the generator always asks for every file).

### Adjustments to make both kinds of Authentications work

- The following points are only for authentication routes.

#### Changing the Scope of non-liveview routes
- As the route addresses were the same in both cases, the `scope` for the non-liveview routes was changed from `"/"` to `"/nolive"`. 
- By default, on clicking the registration and login buttons on the homepage, everything will render the liveview templates. To access the similar route for the no-liveview templates prepend `/nolive` to the route. 
  - **NOTE:** While accessing the no-liveview routes, please make sure that the actions the non-liveview templates are calling are also the ones with `/nolive` routes.
  - For example- the `/nolive/users/log_in` route renders the `/controllers/user_session_html/new.html.heex` template, which is a template that renders the login form. So in order to log through the no-liveview way, in the form-action the route has to be changed from `/users/log_in` to `/nolive/users/log_in` to make everything work with no errors (as the routes not starting with "nolive" are liveview routes.)
  - This has already been implemented for the "login" route, but for other similar routes, please check this before testing.

  #### Changes in UserSessionController
  - To address the problem of the same `UserSessionController` for both the login routes (liveview and non-liveview), a new `UserSessionLiveController` is created for the liveview login.
  - The `UserSessionController` is now only getting used for the no-liveview routes. 

  #### For Migration files
  - As two migration files were the same, one of them was deleted. 

## Authentication with Token

This post was referred to while implementing the token functionality: https://dev.to/onpointvn/implement-jwt-authentication-with-phoenix-token-n58

The Token-based authentication is implemented to use the project as a service. 

- A separate `/UliCommunity/api` context is created. Inside it, there is the `Token` module. 
- The Token module uses `Phoenix.Token` to havea  sign and verify token function. 
- `Phoenix.Token` is a JSON Web Token.
- For this functionality, separate routes with the scope `/api` are created. 
- A new `AuthenticateApi` plug was also created to authenticate the JWT token. 
- Currently, there are only two routes for this functionality. One is `/api/auth/login` and another is `/api/auth/hi`. 
- The login route has nothing to do with login. It is an API endpoint through which users can receive their token in response if they send a request to this route with the right credentials. The controller for that is `SessionControllerApi`. 
- The `"/hi"` route is just a route to test if the authentication is working properly or not. Users can send a Get request to this route with "Bearer AUTH_TOKEN" in the Authentication header, to receive a simple message. 
- We can use the API context to create more functions and routes to provide different API services to the users. 

## Authorization

- This article was referred to implement the authorization: https://hashrocket.com/blog/posts/authorization-in-phoenix-liveview
- Authorization functionality is implemented with currently two roles "user" and "admin", for a proof of concept. 
- The default role of the user is "admin". Currently, in order to change the role of a user, we have to update it in the database itself.
- Currently, we are only implementing the route-based authorization, so if a user with the role "user" tries to access an admin route, that would not be allowed. 
- A new context for Authorization is created in `/uli_comminity/authorization`.
- Here we can add more routes that need to implement the authorization.
- Other changes include changes in the router to include `on_mount` functions and changes in the `user_auth` module to create a new `on_mount` function.

## Access Token 

This access token functionality is different from the above mentioned auth token. The above mentioned auth tokens are generated from the API call by passing login creds in the request itself and then can be used to make the further API calls. The generated token is a JWT token which just stores the user id (from the User schema) that created the token.

This Access Token is also a JWT token, but it is generated by a registered user inside the application. The token itself is not getting stored anywhere for secrecy but all the information related to that access token is getting stored inside a "Access_Token" table. Each entry has properties of `token_id`, `token_name`, `access_level`, `expiry`, `created_by_user`. The token hashes the `token_id` property, which gets checked and used to retrieve the relevent token entry, while any API call would be made.  

- A new `UliCommunity.Api.AccessToken` Schema was created inside the api context. 
- Access Tokens can be generated in the `/gentoken` route. 
- In this page, the users would be able to see the token generated by them.
- The users would be able to set the access level based on their own access levels. If a user is "Admin", the generated token can have both "Admin" and "User" access levels. But if the user is "User", the generated token can only have the "User" access level. 
- To implement this, a new plug has been created, `authenticate_access_token`. 
- A new scope is also created, `/api/accesstoken`. This scope will be responsible for accessing the routes though the generated access_token. The name of the scope can be changed if needed in the future.
- To test the access token, a dummy route `/api/accesstoken/hi` is created. We can test the generated access token by sending a `get` request to this route with the `Authorization` header set to "Bearer 'Access Token' ".
- If the token is valid, a json response with a hi message would be received.
- Other minor changes include: 
  - Created a new modal component to show the generated token (the one in the core-components was not used because that modal gets closed whenever we click anywhere on the screen. We don't want that while showing one-time generated token that can never be seen again).
  - Minor addition in the `assets/js/app.js` to implement copy to clipboard functionality.         