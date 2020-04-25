const AWS = require('aws-sdk')
async function getItem (tableName, username2) {
    const params = {
      TableName : tableName,
      Key: {
          username: username2
      }
    };
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const getResult = await documentClient.get(params).promise();
    return getResult.Item ? getResult.Item : false
}
async function putItem (tableName, username, book, teacher) {
    const params = {
      TableName : tableName,
      Item: {
          username: username,
          book: book,
          teacher: teacher
      }
    };
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const putResult = await documentClient.put(params).promise();
    return putResult
}
exports.handler = async (event) => {
    const params = event.queryStringParameters
    if (!params) {
        const response = {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify('No params provided!'),
        };
        return response;
    }
    const username = params.username
    const book = params.book
    const teacher = params.teacher
    const action = params.action
    if (!username || !action) {
        const response = {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify('A required parameter was not provided!'),
        };
        return response;
    }
    if (action === 'putUser') {
        const putResult = await putItem('adelphi-practice', username, book, teacher)
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(`${username} was succesfully written to the database!`),
        };
        return response;
    }
    if (action === 'getUser') {
        const getResult = await getItem('adelphi-practice', username)
        if (!getResult) {
            const response = {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify('That user was not found!'),
            };
            return response;
        }
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(getResult),
        };
        return response;
    }
};
