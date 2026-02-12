# Lab Booking System for SCSS

## About the app

A NextJS website that integrates a lab booking system and calendar with google sheets. Administrators can use google sheets to assign labs, approve bookings and update lab tech statuses.


## Deployment Steps

<b>Step 1.</b> Clone this [repository](https://github.com/Xavier3372/labtime)

<b>Step 2.</b> Go to [Google Cloud Console](https://console.cloud.google.com/) and create a project by navigating to "Select a project" -> "New"


<b>Step 3.</b> Select the project and open the side bar to navigate to "Api and Services" -> "Enabled Api and Services" and enable the google sheets api


<b>Step 4.</b> Go to the Credentials page and click on "Manage service Account" and "Create service account"

<b>Step 5.</b> Give the service account a name and create it

<b>Step 6.</b> Still under the Manage Service Account Page, click on keys and generate a new JSON key

<b>Step 7.</b> Create a Google Sheet following [this](https://docs.google.com/spreadsheets/d/1RRft-mU8D1KhQnZm6x2MxUNY82KwpY8drye_R06ZJ38/edit?usp=sharing) template and share it with your service account, giving it editing rights

<b>Step 7.</b> Add the key, google sheet id and service account email into a .env.local file under the names: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY and GOOGLE_SHEET_ID

## Using the program

The program can now be deployed onto any NextJs hosting service like [vercel](https://vercel.com/).

Bookings from the booking form are passed into the google sheet, where a lab can be assigned and the booking can be approved. Approved bookings show up on the home page. Teachers can also check their bookings by entering in their phone number in the "My Bookings" page. Lab techs can be added and their status and location can be updated by using the status page of the google sheet.

##Todo

<b>1. </b>Add cancellation system
<b>2. </b>Add admin panel
<b>3. </b>Check for booking conflicts

###### Developed with ❤️ by [Xavier Koh](https://github.com/Xavier3372)