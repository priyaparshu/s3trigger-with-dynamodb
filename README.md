# s3trigger-with-dynamodb

S3 is Amazon's object storage service. 

In this example we will upload a JSON file to S3. This will cause S3 to trigger an event. This event will be picked up by Lambda. Lambda will then read the users from the file and add it to Dynamodb. We will do all these using serverless framework including giving permissions to S3 and dynamodb.
