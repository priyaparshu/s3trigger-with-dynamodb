'use strict';
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
let dynamodb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TableName;
console.log(TableName)

module.exports.dynamoStreamTrigger = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2))
  event.Records[0].forEach((record) => {
    console.log(record.eventID)
    console.log(record.eventName)
  })
  context.succeed('successfuly processed' + event.Records.length + "records");
}


module.exports.s3hello = async (event, context) => {
  let statusCode = 0;
  let responseBody = '';
  const { name } = event.Records[0].s3.bucket;
  const { key } = event.Records[0].s3.object;
  const BucketPName = process.env.BucketName;
  console.log(BucketPName)


  console.log(`A new file ${key} was created in the bucket ${name}`);

  const s3params = {
    Bucket: name,
    Key: key
  };
  try {
    const s3Data = await s3.getObject(s3params).promise()
    const userstr = s3Data.Body.toString();
    console.log(userstr);
    const userJson = JSON.parse(userstr);
    // console.log(userJson[0]);

    await Promise.all(userJson.map(async (user) => {
      const { id, firstname, lastname } = user;
      const putParams = {
        TableName: TableName,
        Item: {
          id: id,
          firstname: firstname,
          lastname: lastname
        }
      };
      await dynamodb.put(putParams).promise();
    }))
    statusCode = 201
    responseBody = "success"

  } catch (error) {
    console.log(error);

    statusCode = 401
    responseBody = "Error adding user"
  }
  const response = {
    statusCode: statusCode,
    body: responseBody
  }
  return response
};