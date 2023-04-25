const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const app = express();

// 配置 body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 配置 MySQL 数据库连接
const connection = mysql.createConnection({
  host: 'your-db-host',
  user: 'your-db-user',
  password: 'your-db-password',
  database: 'your-db-name'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err.stack);
    return;
  }

  console.log('Connected to database with ID: ', connection.threadId);
});

// 配置 Nodemailer 邮件发送
const transporter = nodemailer.createTransport({
  host: 'your-smtp-host',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email',
    pass: 'your-email-password'
  }
});

// 定义 POST 路由来处理表单提交
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  // 将表单数据存储在 MySQL 数据库中
  const sql = 'INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)';
  connection.query(sql, [name, email, message], (error, results, fields) => {
    if (error) {
      console.error('Error inserting data into database: ', error.stack);
      res.status(500).send('Something went wrong!');
      return;
    }

    console.log('Data inserted into database with ID: ', results.insertId);

    // 发送电子邮件通知
    const mailOptions = {
      from: 'your-email',
      to: 'your-email',
      subject: 'New feedback submitted',
      text: `A new feedback has been submitted from ${name} (${email}). The message is:\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error.stack);
        res.status(500).send('Something went wrong!');
        return;
      }

      console.log('Email sent: ', info.response);
      res.send('Form submitted successfully!');
    });
  });
});

// 启动服务器并监听端口
const port = 3000;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
