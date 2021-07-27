import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid: user_id } = event.pathParameters;

  try {
    const response = await document.scan({
      TableName: "todos",
      FilterExpression : "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
    }).promise();
    
    const todos = response.Items;

    if(todos.length <= 0) {
      throw new Error("No todos for this user")
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Showing ${user_id} todos:`,
        todos, 
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
