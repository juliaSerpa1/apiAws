const express = require("express");
const AWS = require("aws-sdk");
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

require('dotenv').config();

const app = express();

app.use(express.json());

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const sqs = new AWS.SQS();

app.post("/transacao", async (req,res) =>{
  const { idempotencyId, amount, type } = req.body;

  const params = {
    MessageBody: JSON.stringify({ idempotencyId, amount, type }),
    QueueUrl:"https://sqs.us-east-1.amazonaws.com/381492298615/convem-teste"
  };

 try{
    await sqs.sendMessage(params).promise();

    return res.status(201).send("Transação enviada com sucesso para a fila SQS.");
  }catch(error){
    console.log("Erro ao enviar mensagem para a fila SQS:", error);

    res.status(500).send("Erro interno no servidor.");
  }

});

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000')
  })