import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHello(@Res() res: Response): void {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NestJS</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            margin: 0;
          }
          .container {
            text-align: center;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          h1 {
            color: #333;
          }
          a{
          text-decoration: none;
          color: lightblue;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to NestJS!</h1>
          <p><a href="http://localhost:3000/api-docs">点击此处空降</a></p>
        </div>
      </body>
      </html>
    `);
  }
}
