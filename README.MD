# Magazine Management System

## Deployment Instructions

### Configuration & Port Information

All configuration settings and port information can be found in the `.env.dev` file located in the `deploy -> dev` directory.

### Deployment

1. Navigate to the `deploy -> dev` directory.
2. Open the `.env.dev` file and configure the settings as needed.
3. Run the deployment script using the following command:
   ```bash
   ./restart.sh
   ```

## Stop Deployment
To stop the deployment, use the following steps:

Navigate to the `deploy -> dev` directory.
Run the stop script using the following command:
```bash
./stop.sh
```

### View Logs
To view logs from the deployment, follow these steps:

Navigate to the `deploy -> dev` directory.
Run the log script using the following command:
```bash
./log.sh
```

### MONGO-EXPRESS
Mongo Express is utilized for database visualization.

#### Port Configuration
The port for Mongo Express can be configured in the `.env.dev` file located in the `deploy -> dev` directory.

#### About the Project
This project is a Magazine Management System designed for efficient management of magazines. It includes features for handling various aspects of magazine operations, such as content management, user subscriptions, and more.

Feel free to explore and customize the system based on your specific needs. If you encounter any issues or have questions, refer to the documentation or reach out to the project contributors.

