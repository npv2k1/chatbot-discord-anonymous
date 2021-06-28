//* import discord.js
const Discord = require("discord.js");
require("dotenv").config();
//* Load database
const Users = require("./model/user");

//* load config
const discordConfig = require("./config");

const client = new Discord.Client();

//* Webhook
// const hook = new Discord.WebhookClient(
//   discordConfig.hook.id,
//   discordConfig.hook.token
// );

client.login(process.env.BOT_TOKEN);
client.on("ready", () => {
  // hook.send("I am now alive!");
  console.log("readdy");
});
const prefix = discordConfig.message.prefix;

function matchUser(userId, matchId) {
  Users.updateOne({ discordid: userId }, { matchid: matchId });
  Users.updateOne({ discordid: matchId }, { matchid: userId });
}
function botSendMessage(id, message) {
  client.users
    .fetch(id, false)
    .then((user) => {
      user.send(message);
    })
    .catch((err) => {
      console.error(err);
    });
}

client.on("message", (msg) => {
  // console.log('message :>> ', msg);
  //* No command
  Users.findOne({ discordid: msg.author.id }).then((user) => {
    if (!user) {
      Users.create({
        name: msg.author.username,
        discordid: msg.author.id,
      }).then((msg) => {
        console.log("New user: ", msg);
      });
    } else {
      if (user.matchid) {
        //* Send messgase from discord bot to user id
        client.users
          .fetch(user.matchid, false)
          .then((user) => {
            if (msg.content) user.send(msg.content);
            for (att of msg.attachments) {
              // console.log("att :>> ", att);
              const attachment = new Discord.MessageAttachment(att[1].url);
              user.send(attachment);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  });
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  try {
    //* Lấy agrument
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    //* Start chat
    if (args[0] == "chat") {
      Users.findOne({ discordid: msg.author.id }).then((user) => {
        console.log("Tìm người");
        if (user.matchid) {
          msg.channel.send(
            "Bạn đang trò chuyện với một người. bạn có muốn kết thúc nó. `!pp`"
          );
          return;
        }
        Users.updateOne({ discordid: msg.author.id }, { match: true }).then(
          (mg) => {
            msg.channel.send(
              "Đang tìm người nói chuyện với bạn vui lòng chờ ít phút."
            );
            //* tìm những người đang cần match và loại bỏ người đang chat
            Users.find({
              match: true,
              discordid: { $ne: user.discordid },
            }).then((useron) => {
              console.log(useron);
              if (useron.length === 0) {
                msg.channel.send("Không tìm thấy một ai");
              } else {
                let i = Math.floor(Math.random() * useron.length);

                msg.channel.send("Đã tìm thấy. Vui lòng chờ kết nối");
                matchUser(msg.author.id, useron[i].discordid);
                botSendMessage(useron[i].discordid, "Đã tìm thấy");
              }
            });
          }
        );
      });
    }
    if (args[0] == "pp") {
      msg.channel.send("Kết thúc trò chuyện");
      Users.findOne({ discordid: msg.author.id, match: true }).then((user) => {
        Users.updateOne(
          { discordid: user.discordid },
          { match: false, matchid: "" }
        ).then((msg) => {
          console.log(msg);
        });
        client.users
          .fetch(user.matchid, false)
          .then((user) => {
            user.send("Kết thúc trò chuyện");
          })
          .catch((err) => {
            console.log(err);
          });
        Users.updateOne(
          { discordid: user.matchid },
          { match: false, matchid: "" }
        ).then((msg) => {
          console.log(msg);
        });
      });
    }
  } catch {
    msg.channel.send("command not found");
  }
});
