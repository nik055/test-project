export namespace AdminEndpointResponses {
  export const response200 = {
    status: 200,
    description: "This is an admin only route",
    schema: {
      type: "string",
    },
    example: "This is an admin only route",
  };

  export const response401 = {
    status: 401,
    description: "Unauthorized",
    example: {
      statusCode: 401,
      timestamp: "2024-10-24T15:15:14.241Z",
      path: "/people/admin",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "UnauthorizedException",
        message: "Unauthorized",
      },
    },
  };

  export const response403 = {
    status: 403,
    description: "Forbidden",
    example: {
      statusCode: 403,
      timestamp: "2024-10-24T15:16:11.480Z",
      path: "/people/admin",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "ForbiddenException",
        message: "Forbidden resource",
      },
    },
  };

  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-24T15:16:12.480Z",
      path: "/people/admin",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}

export namespace CreatePersonResponses {
  export const response201 = {
    status: 201,
    description: "Person created successfully",
    example: {
      id: "cm2m6hlbe000111882xxz1yfk",
      login: "test123",
      email: "test123@gmail.com",
      password: "$2b$04$VvG2ocSRXSKGMmvTugciHOS8865RWSn2Vc6HL0naaS1KjFEdiC19e",
      age: 123,
      details: "test123",
      isDeleted: false,
      roles: ["USER"],
      createdAt: "2024-10-23T17:58:49.129Z",
      updatedAt: "2024-10-23T17:58:49.129Z",
      deletedAt: null,
    },
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        login: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        age: { type: "number" },
        details: { type: "string" },
        isDeleted: { type: "boolean" },
        roles: { type: "array", items: { type: "string" } },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        deletedAt: { type: "string" },
      },
    },
  };

  export const response400 = {
    status: 400,
    description: "Bad Request",
    example: {
      statusCode: 400,
      timestamp: "2024-10-23T18:00:39.547Z",
      path: "/people",
      method: "POST",
      params: {},
      query: {},
      exception: {
        name: "HttpException",
        message: "Duplicate field value: login",
      },
    },
  };

  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-23T15:16:12.480Z",
      path: "/people",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}

export namespace FindPeopleResponses {
  export const response200 = {
    status: 200,
    description: "People found successfully",
    isArray: true,
    example: [
      {
        email: "test123@gmail.com",
        age: 123,
        createdAt: "2024-10-23T17:58:49.129Z",
        roles: ["USER"],
      },
      {
        email: "admin@gmail.com",
        age: 20,
        createdAt: "2024-10-19T19:50:41.460Z",
        roles: ["ADMIN"],
      },
    ],
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          email: { type: "string" },
          age: { type: "number" },
          createdAt: { type: "string" },
          roles: { type: "array", items: { type: "string" } },
        },
      },
    },
  };

  export const response401 = {
    status: 401,
    description: "Unauthorized",
    example: {
      statusCode: 401,
      timestamp: "2024-10-24T15:30:13.161Z",
      path: "/people/",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "UnauthorizedException",
        message: "Unauthorized",
      },
    },
  };

  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-24T15:30:13.161Z",
      path: "/people",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}

export namespace AboutMeResponses {
  export const response200 = {
    status: 200,
    description: "Person found successfully",
    example: {
      id: "cm2m6hlbe000111882xxz1yfk",
      login: "test123",
      email: "test123@gmail.com",
      password: "$2b$04$VvG2ocSRXSKGMmvTugciHOS8865RWSn2Vc6HL0naaS1KjFEdiC19e",
      age: 123,
      details: "test123",
      isDeleted: false,
      roles: ["USER"],
      createdAt: "2024-10-23T17:58:49.129Z",
      updatedAt: "2024-10-23T17:58:49.129Z",
      deletedAt: null,
    },
  };

  export const response401 = {
    status: 401,
    description: "Unauthorized",
    example: {
      statusCode: 401,
      timestamp: "2024-10-24T16:43:00.570Z",
      path: "/people/me",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "UnauthorizedException",
        message: "Unauthorized",
      },
    },
  };
  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-24T16:43:00.570Z",
      path: "/people/me",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}

export namespace FindPersonResponses {
  export const response200 = {
    status: 200,
    description: "Person found successfully",
    example: {
      email: "test123@gmail.com",
      age: 123,
      details: "test123",
      createdAt: "2024-10-23T17:58:49.129Z",
      roles: ["USER"],
    },
  };

  export const response400 = {
    status: 400,
    description: "Bad Request",
    example: {
      statusCode: 400,
      timestamp: "2024-10-24T16:48:47.711Z",
      path: "/people/cm2m6hlbe000111882xxz1yfk1",
      method: "GET",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk1",
      },
      query: {},
      exception: {
        name: "HttpException",
        message: "Record not found: No Person found",
      },
    },
  };

  export const response401 = {
    status: 401,
    description: "Unauthorized",
    example: {
      statusCode: 401,
      timestamp: "2024-10-24T16:49:37.998Z",
      path: "/people/cm2m6hlbe000111882xxz1yfk",
      method: "GET",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk",
      },
      query: {},
      exception: {
        name: "UnauthorizedException",
        message: "Unauthorized",
      },
    },
  };

  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-23T15:16:12.480Z",
      path: "/people/cm2m6hlbe000111882xxz1yfk",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}

export namespace UpdatePersonResponses {
  export const response200 = {
    status: 200,
    description: "Person updated successfully",
    example: {
      id: "cm2m6hlbe000111882xxz1yfk",
      login: "login50",
      email: "email50@gmail.com",
      password: "$2b$04$Sc9UOfIeLy7DIsPw8phONueR3JSL656xF476U1UEd0Dmh.dMELayG",
      age: 50,
      details: "5050505050",
      isDeleted: false,
      roles: ["ADMIN"],
      createdAt: "2024-10-23T17:58:49.129Z",
      updatedAt: "2024-10-24T16:56:10.889Z",
      deletedAt: null,
    },
  };

  export const response400 = {
    status: 400,
    description: "Bad Request",
    example: {
      statusCode: 400,
      timestamp: "2024-10-24T16:55:08.102Z",
      path: "/people/cm2m6hlbe000111882xxz1yfk111",
      method: "PATCH",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk111",
      },
      query: {},
      exception: {
        name: "HttpException",
        message: "Record not found",
      },
    },
  };
  export const response401 = {
    status: 401,
    description: "Unauthorized",
    example: {
      statusCode: 401,
      timestamp: "2024-10-24T16:54:10.713Z",
      path: "/people/cm2m6hlbe000111882xxz1yfk",
      method: "PATCH",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk",
      },
      query: {},
      exception: {
        name: "UnauthorizedException",
        message: "Unauthorized",
      },
    },
  };

  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-23T15:16:12.480Z",
      path: "/people/cm2m6hlbe000111882xxz1yfk",
      method: "PATCH",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}

export namespace SoftDeletePersonResponses {
  export const response200 = {
    status: 200,
    description: "Person soft deleted successfully",
    example: {
      id: "cm2m6hlbe000111882xxz1yfk",
      login: "login50",
      email: "email50@gmail.com",
      password: "$2b$04$Sc9UOfIeLy7DIsPw8phONueR3JSL656xF476U1UEd0Dmh.dMELayG",
      age: 50,
      details: "5050505050",
      isDeleted: true,
      roles: ["ADMIN"],
      createdAt: "2024-10-23T17:58:49.129Z",
      updatedAt: "2024-10-24T17:02:15.545Z",
      deletedAt: "2024-10-24T17:02:15.542Z",
    },
  };

  export const response400 = {
    status: 400,
    description: "Bad Request",
    example: {
      statusCode: 400,
      timestamp: "2024-10-24T17:01:35.706Z",
      path: "/people/soft/cm2m6hlbe000111882xxz1yfk11",
      method: "DELETE",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk11",
      },
      query: {},
      exception: {
        name: "HttpException",
        message: "Record not found",
      },
    },
  };

  export const response401 = {
    status: 401,
    description: "Unauthorized",
    example: {
      statusCode: 401,
      timestamp: "2024-10-24T17:00:07.056Z",
      path: "/people/soft/cm2m6hlbe000111882xxz1yfk",
      method: "DELETE",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk",
      },
      query: {},
      exception: {
        name: "UnauthorizedException",
        message: "Unauthorized",
      },
    },
  };

  export const response403 = {
    status: 403,
    description: "Forbidden",
    example: {
      statusCode: 403,
      timestamp: "2024-10-24T17:00:48.000Z",
      path: "/people/soft/cm2m6hlbe000111882xxz1yfk1",
      method: "DELETE",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk1",
      },
      query: {},
      exception: {
        name: "ForbiddenException",
        message: "Forbidden resource",
      },
    },
  };
  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-23T15:16:12.480Z",
      path: "/people/soft/cm2m6hlbe000111882xxz1yfk",
      method: "DELETE",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}

export namespace DeletePersonResponses {
  export const response200 = {
    status: 200,
    description: "Person deleted successfully",
    example: {
      id: "cm2m6hlbe000111882xxz1yfk",
      login: "login50",
      email: "email50@gmail.com",
      password: "$2b$04$Sc9UOfIeLy7DIsPw8phONueR3JSL656xF476U1UEd0Dmh.dMELayG",
      age: 50,
      details: "5050505050",
      isDeleted: true,
      roles: ["ADMIN"],
      createdAt: "2024-10-23T17:58:49.129Z",
      updatedAt: "2024-10-24T17:02:15.545Z",
      deletedAt: "2024-10-24T17:02:15.542Z",
    },
  };

  export const response400 = {
    status: 400,
    description: "Bad Request",
    example: {
      statusCode: 400,
      timestamp: "2024-10-24T17:07:00.281Z",
      path: "/people/cm2m6hlbe000111882xxz1yfk1",
      method: "DELETE",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk1",
      },
      query: {},
      exception: {
        name: "HttpException",
        message: "Record not found",
      },
    },
  };

  export const response401 = {
    status: 401,
    description: "Unauthorized",
    example: {
      statusCode: 401,
      timestamp: "2024-10-24T17:07:28.470Z",
      path: "/people/cm2m6hlbe000111882xxz1yfk1",
      method: "DELETE",
      params: {
        id: "cm2m6hlbe000111882xxz1yfk1",
      },
      query: {},
      exception: {
        name: "UnauthorizedException",
        message: "Unauthorized",
      },
    },
  };

  export const response500 = {
    status: 500,
    description: "Internal Server Error",
    example: {
      statusCode: 500,
      timestamp: "2024-10-23T15:16:12.480Z",
      path: "/people",
      method: "GET",
      params: {},
      query: {},
      exception: {
        name: "InternalServerError",
        message: "Internal Server Error",
      },
    },
  };
}
