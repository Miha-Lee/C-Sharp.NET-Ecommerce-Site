<pre>
Ecommerce site is developed using React.js and C#.NET, with Stripe integrated as the payment gateway. 
Below, you will find the setup guides for this project.

Frontend Setup:
1. Create the ".env" file in the root folder of the frontend. Then copy the values in the ".env.example".
2. Replace the value of the "VITE_API_URL" with the backend url, 
   which you can find in the "backend/Properties/launchSettings.json" file.
   Then replaced the value of the applicationUrl property under the "http" of "profiles" property.
3. Replace the value of the "VITE_STRIPE_PUBLISH_KEY" with the Publish Key of your Stripe account. 
4. If all of these steps are finished, we can go to the root folder of the frontend, then run "npm install",
   and "npm run dev". Then the frontend is started.

Backend Setup:
1. Redirect to the "appsettings.json" under the backend folder. Replace the "DefaultConnection" with the value of 
   "Server=localhost; Database=EcommerceSystem; Trusted_Connection=true; TrustServerCertificate=true;".
2. Replace "PasswordKey" and "TokenKey" with any random characters, but I suggest "PasswordKey" should at least
   has 15 long characters. And "TokenKey" should at least has 75 long characters. Otherwise, the server will report
   the error, due to the shortness of the characters.
3. Replace the "FrontendHost" with the url of the frontend.
4. Replace the "SecretKey" of the "Stripe" property with the Stripe Secret Key which appeared in your account.
5. For the Webhook part, since this project is running on our local machines. I was using the ngrok to enable the localhost C#.NET 
   app running with https. To do this, we have to create the account on the ngrok, and get the token from your created account, 
   later, we will run the "ngrok config add-authtoken <your-authtoken>", and then run "ngrok http <port>". Since the backend 
   is running on port of 5132, so we replace the port with the 5132.
6. After this, we can go to the Stripe Dashboard view, locate to the Developer section, in the webhook section, we can create 
   a new event, with the url which provided by ngrok and followed by the "/Order/WebHook" endpoint. such as, "<ngrokurl>/Order/WebHook".
7. In this project, we have to enable the Webhook section, otherwise, even if you could pay the items successfully, you can not 
   save those purchased items to the database.
8. Once you have finished upon steps, we could replace "SigningKey" of the "Webhook" property with the webhook Signing Secret from 
   the Stripe Dashboard.

Azure Data Studio
Because the project was created with the Azure Data Studio, to create a new server, go to the Azure Data Studio GUI, the Server name 
should be localhost. Authentication type should be Windows Authentication. After you finished this part, right click the server you 
just created, and select new query, copy and paste the sql syntax from the Database folder.

After finishing all of these backend setup steps, we could run "dotnet restore" and "dotnet watch run" or "dotnet run".
</pre>
