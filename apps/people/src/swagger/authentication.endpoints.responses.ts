export namespace AuthenticationEndpointResponses {
  export const response201 = {
    status: 201,
    description: "Login successful",
    example: {
      access_token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMmdrcTF4MDAwMDBkcm9vbzRzc2UyeWYiLCJyb2xlcyI6WyJBRE1JTiJdLCJpYXQiOjE3Mjk3ODk5NDksImV4cCI6MTcyOTg3NjM0OX0.tTkuZrj3iZGY6cERRSPvWGRAYxn5j8aPepCorfPWUHQ",
    },
  };

  export const response400 = {
    status: 400,
    description: "Bad request",
    example: {
      statusCode: 400,
      timestamp: "2024-10-24T17:18:03.263Z",
      path: "/auth/login",
      method: "POST",
      params: {},
      query: {},
      exception: {
        name: "BadRequestException",
        message: "Invalid password",
      },
    },
  };

  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-24T17:18:03.263Z",
      path: "/auth/login",
      method: "POST",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}
