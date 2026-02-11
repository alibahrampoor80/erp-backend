const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'management project',
        version: '1.0.0',
        description: 'ali bahrampoor',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [{bearerAuth: []}],
    servers: [{url: 'http://localhost:5000'}],

    tags: [
        {name: 'default', description: ''},
        {name: 'auth', description: 'auth routes'},
        {name: 'profile', description: 'profile routes'},
        {name: 'admin', description: 'admin routes'},
    ],

    paths: {
        "/": {
            get: {
                tags: ['default'],
                summary: 'send test message',
                responses: {
                    200: {
                        description: 'index page',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {type: 'string'},
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        /* ------------------------------ AUTH ------------------------------ */

        "/api/auth/login": {
            post: {
                tags: ["auth"],
                summary: "login user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["username", "password"],
                                properties: {
                                    username: {type: "string", example: "ali"},
                                    password: {type: "string", example: "123456"}
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {description: "login successfully",},
                    401: {description: "error login",},
                }
            }
        },

        // "/api/auth/register": {
        //     post: {
        //         tags: ["auth"],
        //         summary: "register user",
        //         requestBody: {
        //             required: true,
        //             content: {
        //                 "application/json": {
        //                     schema: {
        //                         type: "object",
        //                         required: ["username", "email", "mobile", "password", "confirmPassword"],
        //                         properties: {
        //                             username: {type: "string", example: "ali.bahrampoor"},
        //                             email: {type: "string", example: "a@gmail.com"},
        //                             mobile: {type: "string", example: "09132222222"},
        //                             password: {type: "string", example: "123456"},
        //                             confirmPassword: {type: "string", example: "123456"},
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //         responses: {
        //             200: {description: "register successfully",},
        //             400: {description: "error register",},
        //         }
        //     }
        // },

        /* ------------------------------ PROFILE ------------------------------ */

        "/api/user/profile": {
            get: {
                tags: ["profile"],
                summary: "show profile",
                security: [{bearerAuth: []}],
                responses: {
                    200: {
                        description: "user information",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        username: {type: "string"},
                                        email: {type: "string"}
                                    }
                                }
                            }
                        }
                    },
                    401: {description: "invalid token",}
                }
            }
        },

        /* ------------------------------ ADMIN ROUTES ------------------------------ */

        "/api/admin/all-users": {
            get: {
                tags: ["admin"],
                summary: "get all users with pagination",
                security: [{bearerAuth: []}],

                parameters: [
                    {
                        name: "page",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            minimum: 1,
                            default: 1
                        },
                        example: 1,
                        description: "page number"
                    },
                    {
                        name: "limit",
                        in: "query",
                        required: false,
                        schema: {
                            type: "integer",
                            minimum: 1,
                            default: 10
                        },
                        example: 10,
                        description: "items per page"
                    }
                ],

                responses: {
                    200: {
                        description: "user list with pagination",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    id: {type: "string", example: "671a9d83d21f9c001f43e215"},
                                                    username: {type: "string", example: "ali123"},
                                                    email: {type: "string", example: "ali@gmail.com"},
                                                    roles: {
                                                        type: "array",
                                                        items: {type: "string"},
                                                        example: ["ADMIN"]
                                                    },
                                                    createdAt: {type: "string", example: "2024-01-01T10:00:00.000Z"}
                                                }
                                            }
                                        },
                                        pagination: {
                                            type: "object",
                                            properties: {
                                                page: {type: "integer", example: 1},
                                                limit: {type: "integer", example: 10},
                                                totalPages: {type: "integer", example: 1},
                                                total: {type: "integer", example: 1},
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    403: {description: "Forbidden"}
                }
            }
        },


        "/api/admin/one-user/{id}": {
            get: {
                tags: ["admin"],
                summary: "get one user",
                security: [{bearerAuth: []}],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {type: "string"},
                        example: "671a9d83d21f9c001f43e215"
                    }
                ],
                responses: {
                    200: {
                        description: "not found user",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        username: {type: "string"},
                                        email: {type: "string"},
                                        role: {type: "string"}
                                    }
                                }
                            }
                        }
                    },
                    404: {description: "not found user"}
                }
            }
        },

        "/api/admin/create-user": {
            post: {
                tags: ["admin"],
                summary: "create new user",
                security: [{bearerAuth: []}],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["username", "mobile", "email", "password"],
                                properties: {
                                    first_name: {type: "string", example: "Ali"},
                                    last_name: {type: "string", example: "Bahrampoor"},

                                    username: {type: "string", example: "ali.bahrampoor"},
                                    mobile: {type: "string", example: "09132222222"},
                                    email: {type: "string", example: "ali@gmail.com"},
                                    password: {type: "string", example: "123456"},

                                    // roles: {
                                    //     type: "array",
                                    //     items: { type: "string" },
                                    //     example: ["USER"]
                                    // },

                                    profile_image: {type: "string", example: "profile.png"},
                                    skills: {
                                        type: "array",
                                        items: {type: "string"},
                                        example: ["React", "Node.js"]
                                    },

                                    age: {type: "number", example: 28},
                                    national_code: {type: "string", example: "1234567890"},
                                    birth_date: {type: "string", format: "date", example: "1996-05-10"},

                                    education_degree: {type: "string", example: "Bachelor"},
                                    field_of_study: {type: "string", example: "Computer Engineering"},

                                    marital_status: {
                                        type: "string",
                                        enum: ["single", "married", "divorced"],
                                        example: "single"
                                    },

                                    number_of_children: {type: "number", example: 0},
                                    work_experience_years: {type: "number", example: 5},
                                    insurance_experience_years: {type: "number", example: 3}
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {description: "created new user successfully"},
                    400: {description: "invalid data"}
                }
            }
        },


        "/api/admin/update-user/{id}": {
            put: {
                tags: ["admin"],
                summary: "edit user by id",
                security: [{bearerAuth: []}],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {type: "string"}
                    }
                ],
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    first_name: {type: "string"},
                                    last_name: {type: "string"},

                                    username: {type: "string"},
                                    mobile: {type: "string"},
                                    email: {type: "string"},
                                    password: {type: "string"},

                                    profile_image: {type: "string"},
                                    skills: {
                                        type: "array",
                                        items: {type: "string"}
                                    },

                                    age: {type: "number"},
                                    national_code: {type: "string"},
                                    birth_date: {type: "string", format: "date"},

                                    education_degree: {type: "string"},
                                    field_of_study: {type: "string"},

                                    marital_status: {
                                        type: "string",
                                        enum: ["single", "married", "divorced"]
                                    },

                                    number_of_children: {type: "number"},
                                    work_experience_years: {type: "number"},
                                    insurance_experience_years: {type: "number"}
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: {description: "edit user successfully"},
                    404: {description: "not found user"}
                }
            }
        },


        "/api/admin/delete-user/{id}": {
            delete: {
                tags: ["admin"],
                summary: "delete one user",
                security: [{bearerAuth: []}],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {type: "string"}
                    }
                ],
                responses: {
                    200: {description: "deleted user successfully",},
                    404: {description: "not found user"}
                }
            }
        }
    }
};

export default swaggerDocument;
