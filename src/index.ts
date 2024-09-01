import mqtt from 'mqtt';
import TelegramBot from 'node-telegram-bot-api';

const client = mqtt.connect('mqtt://200.143.224.99:1883');
const BROKER_TOPIC = 'broker_antonio';
const BOT_TOKEN = '7324767066:AAETbzsfhQOq_xirYmv1ow8KUUUqqodB6rU';
const CHAT_ID = '5453042144';

try {
  const bot = new TelegramBot(BOT_TOKEN, { polling: true, request: {
    agentOptions: {
      keepAlive: true,
      family: 4
    },
    uri: ''
  }});

  client.on('connect', () => {
    console.log('Connected');
    client.subscribe(BROKER_TOPIC, (err) => {
      if (!err) {
        console.log('Subscribed');
        client.publish(BROKER_TOPIC, Buffer.from('CLIE').toString('base64'));
      }
    });
  }
  );
  
  client.on('message', (topic, message) => {
    if (topic !== BROKER_TOPIC) return;
    // message is Buffer
    const msg = Buffer.from(message.toString(), 'base64').toString('utf-8');
    if (msg == 'QUEI') {
      bot.sendMessage(CHAT_ID, `================================

ALERTA [${new Date().toLocaleString()}] - Foi detectado que a lâmpada deveria estar acesa, mas está APAGADA.

================================`);
    } else if (msg == 'ACES') {
      bot.sendMessage(CHAT_ID, `================================

ALERTA [${new Date().toLocaleString()}] - Foi detectado que a lâmpada deveria estar apagada, mas está ACESA.

================================`);
    } else if (msg == 'CONN') {
      bot.sendMessage(CHAT_ID, `INFO [${new Date().toLocaleString()}] - O dispositivo se conectou ao broker.`);
    } else if (msg == 'CLIE') {
      bot.sendMessage(
        CHAT_ID, 
        `INFO [${new Date().toLocaleString()}] - O servidor se conectou ao broker e está ouvindo.`
      );
    } else if (msg == 'NORM') {
      bot.sendMessage(CHAT_ID, `[${new Date().toLocaleString()}] - A lampada retornou ao comportamento normal.`);
    } else {
      bot.sendMessage(CHAT_ID, `================================

ALERTA [${new Date().toLocaleString()}] - Foi detectada uma mensagem desconhecida no broker: ${message.toString()}.

================================`);
    }
  });
} catch (error) {
  console.error('Erro ao estabelecer conexão entre bot e broker');
}



