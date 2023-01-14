# BlogsAPI-with-OAuth
This is a RESTful API which allows you to access your database of blogs but only once you have authenticated yourself. 

Before using this API, you must register an application with Google. If you have not already done so, a new project can be created in the Google Developers Console. Your application will be issued a client ID and client secret, which need to be provided to the strategy. You will also need to configure a redirect URI which matches the route in your application.

In order to use this API, first redirect your users to the "/auth/google" route which will guide them to Google's own authentication page where teh user shall be prompted to give permission to all the scopes you want access to. After that you can provide for redirecting your users to the routes of your choice.

Routes this API serves to:
1. "/articles": The general route to which if requests are sent they affect all the articles.
2. "/articles/articleTitle": To access an article by title, requests sent to these routes affect only the specified articles.

The environment variables used in the API are:
CLIENT_ID: Google Client ID as issued for your app.
CLIENT_SECRET: Google Client secret as issued for your app.
CALLBACK_URL: Callback URI as specified by you in the Google Developer Console.
CALLBACK_ROUTE: The redirect URI route as specified by you for your app in the Google Developer Console.

This RESTful API serves GET, POST and DELETE HTTP requests for the general route ("/articles" here) and GET, PUT, PATCH and DELETE HTTP requests for specific articles chosen by article titles. This API has been made to mirror the basic CRUD operations of any database.

C - CREATE - POST request.
R - READ - GET request.
U - UPDATE - PUT & PATCH requests.
D - DELETE - DELETE request.

The database used in this API is the MongoDB database implemented using mongoose.
