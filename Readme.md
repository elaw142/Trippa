<div align="center">
    <img src="datadons-app/assets/logo.png" alt="Toshka Lakes Project">
</div>

# Datadons-Carpooling

This repository contains the source code for the Datadons frontend and backend carpooling system.
- [x] Name of the project.
- [x] A link to your Project Management tool.
- [x] A short description of what the project is about. (You may put a link to your final report here, after it has been completed).
- [x] Technologies that are used to build the project (include the languages used, the libraries and their versions).
- [x] Instructions on how to install and setup the project (specify all dependencies).
- [ ] Usage Examples (if available).
- [ ] URL of the website where the project has been deployed (if applicable).
- [ ] Future Plan (Ideas for future releases)
- [ ] Acknowledgements (if any) - You can list tutorials used, projects referred to, people consulted etc.

## Getting Started

To set up and run the Datadons app and backend on your local machine, follow these steps:

1. Clone this repository.
2. Navigate to the `datadons-app` folder and execute `npm install` to install all necessary app dependencies.
3. Run `npm start` to launch the app.

### Backend
backend is currently hosted on azure however at [azure link](https://datadons2.azurewebsites.net/swagger/index.html) if local host is requred follow these steps

5. In a separate terminal, navigate to the `datadons-backend` folder.
6. Execute `dotnet run` to initiate the backend.
7. change the endpoint const within ```ApiHandler.js``` in `datadons-app/src/services`

## Features

The Datadons application facilitates the following:

- **User Management**: Authenticate and authorise users.
- **Data Handling**: Manage and store user and trip data efficiently.
- **API Integration**: Robust endpoints for fetching, updating, and manipulating data.
- **Trip Management**: Users can view a list of available trips, and if registered as a driver, can add new trips.
- **Communication**: A live messaging system enabling seamless communication between users.
- **Search**: Integrated searching functionality, allowing users to find the most suitable trip based on the location criteria.

## Technologies Used

- **Frontend**: React Native-EXPO
- **Backend**: .NET Core [0.7]
- **Deployment**: Azure App Service

## Project Mangament
[Github Project page](https://github.com/orgs/uoa-compsci399-s2-2023/projects/1)


## Folder Structure

### Frontend
Within the `src` directory "datadons-app", the organisation is as follows:

- ```AccountScreen.js```: React Native component for the account screen.
- ```AddTripScreen.js```: React Native component for adding a trip.
- ```App.js```: Main entry point for our React Native application.
- ```HomeScreen.js```: React Native component for the home screen.
- ```MessageScreen.js```: React Native component for the message screen.
- ```NavigationService.js```: Service for managing navigation within the app.
- ```app.json```: Configuration file for our React Native app.
- ```assets``` Folder containing various static assets used in our application, such as images, icons, and videos.
- ```auth.js```: File handling authentication logic for our app.
- ```babel.config.js```: Babel configuration file for our project.
- ```components```: Folder containing reusable React Native components used across different screens of our app.
  - ```NextButton.js```: A component for the 'Next' button.
  - ```Onboarding.js```: Component for the onboarding screen.
  - ```OnboardingItem.js```: Component for each item in the onboarding screen.
  - ```Paginator.js```: Component for the paginator.
  - ```slides.js```: Component for managing slides within our app.
- ```package-lock.json```: Automatically generated file based on the exact versions of our installed npm packages.
- ```package.json```: File containing metadata about our project and the list of dependencies.
- ```services```: Folder containing files related to various services used in our app.
  - ```ApiHandler.js```: File for handling API requests and responses.

### backend
Within the `src` directory "datadons-backend", the organisation is as follows:

- `controllers`: Handles API calls and HTTP request management.
- `models`: Structures for database interaction.
- `data`: Utility functions (idk what to write here tbh ).
- `dtos`: Functions assisting in data manipulation and shaping, as needed.

## Future Plans

#TODO

## Acknowledgements

#TODO

## License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.
