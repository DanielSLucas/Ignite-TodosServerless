import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";
import { v4 as uuidV4 } from "uuid";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body);

  const todo = {
    id: uuidV4(),
    user_id,
    title,
    deadline: new Date(deadline).toISOString(),
    done: false,
  }

  try {
    await document.put({
      TableName: "todos",
      Item: todo,
    }).promise();
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Created!",
        todo, 
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: err.message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }  
};
